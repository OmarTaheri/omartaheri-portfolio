'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '@/providers/Theme'
import type { Theme } from '@/providers/Theme/types'
import Image from 'next/image'

interface DitherCanvasProps {
  imageSrc: string
  width?: number
  height?: number
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

const fragmentShader = `
precision mediump float;

uniform float u_time;
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

  float timeOffset = sin(u_time * 2.0) * 0.5 + 0.5;
  float dither = bayer4x4(pixelCoord / u_pixelSize + timeOffset * u_dither);
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
  width = 400,
  height = 500,
  className = '',
}: DitherCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animationRef = useRef<number>(0)
  const textureRef = useRef<WebGLTexture | null>(null)
  const imageLoadedRef = useRef(false)

  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [pixelSize, setPixelSize] = useState(3)
  const [exposure, setExposure] = useState(1.2)
  const [ditherAmount, setDitherAmount] = useState(1.0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const palette = palettes[theme || 'blue']

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    if (!gl) {
      console.error('WebGL not supported')
      setHasError(true)
      return
    }
    glRef.current = gl

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragShader, fragmentShader)
    gl.compileShader(fragShader)

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fragShader))
      setHasError(true)
      return
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)
    gl.useProgram(program)
    programRef.current = program

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    // Load image
    const image = new window.Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      if (!gl) return
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      textureRef.current = texture
      imageLoadedRef.current = true
      setIsLoading(false)
    }

    image.onerror = () => {
      console.error('Failed to load image:', imageSrc)
      setHasError(true)
      setIsLoading(false)
    }

    // Handle both absolute URLs and relative paths
    if (imageSrc.startsWith('http') || imageSrc.startsWith('//')) {
      image.src = imageSrc
    } else {
      // For local images, use the full URL
      image.src = imageSrc
    }
  }, [imageSrc])

  const render = useCallback(() => {
    const gl = glRef.current
    const program = programRef.current
    const canvas = canvasRef.current

    if (!gl || !program || !canvas || !textureRef.current) {
      animationRef.current = requestAnimationFrame(render)
      return
    }

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), performance.now() / 1000)
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height)
    gl.uniform1f(gl.getUniformLocation(program, 'u_pixelSize'), pixelSize)
    gl.uniform1f(gl.getUniformLocation(program, 'u_exposure'), exposure)
    gl.uniform1f(gl.getUniformLocation(program, 'u_dither'), ditherAmount)

    gl.uniform3f(gl.getUniformLocation(program, 'u_c0'), palette[0][0] / 255, palette[0][1] / 255, palette[0][2] / 255)
    gl.uniform3f(gl.getUniformLocation(program, 'u_c1'), palette[1][0] / 255, palette[1][1] / 255, palette[1][2] / 255)
    gl.uniform3f(gl.getUniformLocation(program, 'u_c2'), palette[2][0] / 255, palette[2][1] / 255, palette[2][2] / 255)
    gl.uniform3f(gl.getUniformLocation(program, 'u_c3'), palette[3][0] / 255, palette[3][1] / 255, palette[3][2] / 255)

    gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    animationRef.current = requestAnimationFrame(render)
  }, [pixelSize, exposure, ditherAmount, palette])

  useEffect(() => {
    initWebGL()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initWebGL])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(render)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [render])

  // Show fallback image if WebGL fails
  if (hasError) {
    return (
      <div className={className}>
        <Image
          src={imageSrc}
          alt="Profile"
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    )
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowControls(false)
      }}
    >
      {/* Loading state */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-[var(--background)] animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <span className="text-[var(--link)]">Loading...</span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`w-full h-auto ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />

      {/* Settings button - appears on hover */}
      {isHovered && !showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--link)] hover:text-[var(--link-hover)] hover:border-[var(--link-hover)] transition-all hover-scale"
          aria-label="Open dither settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
