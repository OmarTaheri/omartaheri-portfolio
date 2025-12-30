'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '@/providers/Theme'
import type { Theme } from '@/providers/Theme/types'
import Image from 'next/image'

interface DitherCanvasProps {
  imageSrc: string
  maxWidth?: number
  className?: string
}

// Theme-adaptive palettes (4 colors from dark to light)
const palettes: Record<Theme, number[][]> = {
  blue: [
    [3, 12, 37],
    [30, 45, 80],
    [95, 100, 126],
    [187, 189, 202],
  ],
  red: [
    [37, 3, 5],
    [80, 30, 35],
    [126, 95, 102],
    [202, 187, 192],
  ],
  green: [
    [15, 56, 15],
    [48, 98, 48],
    [139, 172, 15],
    [155, 188, 15],
  ],
}

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// Static dithering shader - no time-based animation for smooth display
const fragmentShaderSource = `
precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_image;
uniform float u_pixelSize;
uniform float u_exposure;
uniform float u_dither;
uniform vec3 u_c0;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;

float bayer4x4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int index = x + y * 4;

  float matrix[16];
  matrix[0] = 0.0/16.0;  matrix[1] = 8.0/16.0;  matrix[2] = 2.0/16.0;  matrix[3] = 10.0/16.0;
  matrix[4] = 12.0/16.0; matrix[5] = 4.0/16.0;  matrix[6] = 14.0/16.0; matrix[7] = 6.0/16.0;
  matrix[8] = 3.0/16.0;  matrix[9] = 11.0/16.0; matrix[10] = 1.0/16.0; matrix[11] = 9.0/16.0;
  matrix[12] = 15.0/16.0; matrix[13] = 7.0/16.0; matrix[14] = 13.0/16.0; matrix[15] = 5.0/16.0;

  for (int i = 0; i < 16; i++) {
    if (i == index) return matrix[i];
  }
  return 0.0;
}

float luminance(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 pixelCoord = floor(gl_FragCoord.xy / u_pixelSize) * u_pixelSize;
  vec2 uv = pixelCoord / u_resolution;
  uv.y = 1.0 - uv.y;

  vec3 color = texture2D(u_image, uv).rgb;
  float lum = luminance(color);
  lum = pow(lum, 1.0 / u_exposure);

  // Static dither pattern - no animation
  float dither = bayer4x4(pixelCoord / u_pixelSize);
  float threshold = lum + (dither - 0.5) * u_dither * 0.5;

  vec3 finalColor;
  if (threshold < 0.25) {
    finalColor = u_c0;
  } else if (threshold < 0.5) {
    finalColor = u_c1;
  } else if (threshold < 0.75) {
    finalColor = u_c2;
  } else {
    finalColor = u_c3;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`

export const DitherCanvas = ({
  imageSrc,
  maxWidth = 400,
  className = '',
}: DitherCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({})

  const { theme } = useTheme()
  const [showControls, setShowControls] = useState(false)
  const [pixelSize, setPixelSize] = useState(1) // Default to 1 for smooth look
  const [exposure, setExposure] = useState(1.2)
  const [ditherAmount, setDitherAmount] = useState(1.0)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [dimensions, setDimensions] = useState({ width: maxWidth, height: maxWidth })

  const palette = palettes[theme || 'blue']

  // Compile shader helper
  const compileShader = useCallback(
    (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    },
    [],
  )

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      alpha: false,
    })

    if (!gl) {
      console.error('WebGL not supported')
      return false
    }

    glRef.current = gl

    // Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) {
      return false
    }

    // Create program
    const program = gl.createProgram()
    if (!program) return false

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return false
    }

    gl.useProgram(program)
    programRef.current = program

    // Setup geometry (fullscreen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    // Cache uniform locations
    uniformsRef.current = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_pixelSize: gl.getUniformLocation(program, 'u_pixelSize'),
      u_exposure: gl.getUniformLocation(program, 'u_exposure'),
      u_dither: gl.getUniformLocation(program, 'u_dither'),
      u_c0: gl.getUniformLocation(program, 'u_c0'),
      u_c1: gl.getUniformLocation(program, 'u_c1'),
      u_c2: gl.getUniformLocation(program, 'u_c2'),
      u_c3: gl.getUniformLocation(program, 'u_c3'),
      u_image: gl.getUniformLocation(program, 'u_image'),
    }

    return true
  }, [compileShader])

  // Render once (static, no animation loop)
  const render = useCallback(() => {
    const gl = glRef.current
    const program = programRef.current
    const canvas = canvasRef.current
    const uniforms = uniformsRef.current

    if (!gl || !program || !canvas || !textureRef.current) {
      return
    }

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Set uniforms
    gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height)
    gl.uniform1f(uniforms.u_pixelSize, pixelSize)
    gl.uniform1f(uniforms.u_exposure, exposure)
    gl.uniform1f(uniforms.u_dither, ditherAmount)

    // Set palette colors
    gl.uniform3f(uniforms.u_c0, palette[0][0] / 255, palette[0][1] / 255, palette[0][2] / 255)
    gl.uniform3f(uniforms.u_c1, palette[1][0] / 255, palette[1][1] / 255, palette[1][2] / 255)
    gl.uniform3f(uniforms.u_c2, palette[2][0] / 255, palette[2][1] / 255, palette[2][2] / 255)
    gl.uniform3f(uniforms.u_c3, palette[3][0] / 255, palette[3][1] / 255, palette[3][2] / 255)

    // Bind texture
    gl.uniform1i(uniforms.u_image, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current)

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }, [pixelSize, exposure, ditherAmount, palette])

  // Load image and set up texture
  useEffect(() => {
    const image = new window.Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      // Calculate dimensions preserving aspect ratio
      const aspectRatio = image.naturalHeight / image.naturalWidth
      const width = Math.min(maxWidth, image.naturalWidth)
      const height = Math.round(width * aspectRatio)

      setDimensions({ width, height })

      // Initialize WebGL after we know dimensions
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = width
        canvas.height = height

        const success = initWebGL()
        if (!success) {
          setHasError(true)
          return
        }

        const gl = glRef.current
        if (!gl) return

        // Create and upload texture
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

        textureRef.current = texture
        setIsReady(true)
      }
    }

    image.onerror = () => {
      console.error('Failed to load image:', imageSrc)
      setHasError(true)
    }

    // Handle src
    if (imageSrc.startsWith('/')) {
      if (typeof window !== 'undefined') {
        image.src = `${window.location.origin}${imageSrc}`
      } else {
        image.src = imageSrc
      }
    } else {
      image.src = imageSrc
    }
  }, [imageSrc, maxWidth, initWebGL])

  // Re-render when settings or palette change
  useEffect(() => {
    if (isReady) {
      render()
    }
  }, [isReady, render])

  // Fallback to regular image if WebGL fails
  if (hasError) {
    return (
      <div className={className}>
        <Image
          src={imageSrc}
          alt="Profile"
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {!isReady && (
        <div
          className="bg-[var(--card)] animate-pulse flex items-center justify-center"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <span className="text-[var(--link)] text-sm">Loading...</span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`w-full h-auto transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ display: isReady ? 'block' : 'none' }}
      />

      {/* Settings button - always visible when ready */}
      {!showControls && isReady && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--link)] hover:text-[var(--link-hover)] hover:border-[var(--link-hover)] transition-all opacity-70 hover:opacity-100"
          aria-label="Open dither settings"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </button>
      )}

      {/* Controls popup */}
      {showControls && (
        <div className="absolute bottom-4 right-4 w-64 bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--title)] font-bold text-sm">Dither Settings</span>
            <button
              onClick={() => setShowControls(false)}
              className="text-[var(--link)] hover:text-[var(--link-hover)] transition-colors"
              aria-label="Close settings"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text)]">Pixel Size</label>
                <span className="text-[var(--link)]">{pixelSize}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={pixelSize}
                onChange={(e) => setPixelSize(Number(e.target.value))}
                className="w-full accent-[var(--link)] h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text)]">Exposure</label>
                <span className="text-[var(--link)]">{exposure.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={exposure}
                onChange={(e) => setExposure(Number(e.target.value))}
                className="w-full accent-[var(--link)] h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text)]">Dither</label>
                <span className="text-[var(--link)]">{ditherAmount.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={ditherAmount}
                onChange={(e) => setDitherAmount(Number(e.target.value))}
                className="w-full accent-[var(--link)] h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
