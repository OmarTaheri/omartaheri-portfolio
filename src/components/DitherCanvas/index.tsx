'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '@/providers/Theme'
import type { Theme } from '@/providers/Theme/types'

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

// Bayer 4x4 dithering matrix
float bayer4x4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int index = x + y * 4;

  // Bayer matrix values (0-15 normalized to 0-1)
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
  // Pixelation
  vec2 pixelCoord = floor(gl_FragCoord.xy / u_pixelSize) * u_pixelSize;
  vec2 uv = pixelCoord / u_resolution;
  uv.y = 1.0 - uv.y; // Flip Y for correct orientation

  vec3 color = texture2D(u_image, uv).rgb;

  // Apply exposure
  float lum = luminance(color);
  lum = pow(lum, 1.0 / u_exposure);

  // Animated dither offset
  float timeOffset = sin(u_time * 2.0) * 0.5 + 0.5;
  float dither = bayer4x4(pixelCoord / u_pixelSize + timeOffset * u_dither);

  // Quantize to 4 levels with dithering
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

  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [pixelSize, setPixelSize] = useState(3)
  const [exposure, setExposure] = useState(1.2)
  const [ditherAmount, setDitherAmount] = useState(1.0)

  const palette = palettes[theme || 'blue']

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    if (!gl) {
      console.error('WebGL not supported')
      return
    }
    glRef.current = gl

    // Create shaders
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
      return
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)
    gl.useProgram(program)
    programRef.current = program

    // Create fullscreen quad
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    // Load image texture
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      textureRef.current = texture
    }
    image.src = imageSrc
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

    // Set uniforms
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    gl.uniform1f(timeLoc, performance.now() / 1000)

    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    gl.uniform2f(resLoc, canvas.width, canvas.height)

    const pixelLoc = gl.getUniformLocation(program, 'u_pixelSize')
    gl.uniform1f(pixelLoc, pixelSize)

    const exposureLoc = gl.getUniformLocation(program, 'u_exposure')
    gl.uniform1f(exposureLoc, exposure)

    const ditherLoc = gl.getUniformLocation(program, 'u_dither')
    gl.uniform1f(ditherLoc, ditherAmount)

    // Set palette colors
    gl.uniform3f(gl.getUniformLocation(program, 'u_c0'), palette[0][0] / 255, palette[0][1] / 255, palette[0][2] / 255)
    gl.uniform3f(gl.getUniformLocation(program, 'u_c1'), palette[1][0] / 255, palette[1][1] / 255, palette[1][2] / 255)
    gl.uniform3f(gl.getUniformLocation(program, 'u_c2'), palette[2][0] / 255, palette[2][1] / 255, palette[2][2] / 255)
    gl.uniform3f(gl.getUniformLocation(program, 'u_c3'), palette[3][0] / 255, palette[3][1] / 255, palette[3][2] / 255)

    const imageLoc = gl.getUniformLocation(program, 'u_image')
    gl.uniform1i(imageLoc, 0)
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

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto"
      />

      {/* Controls overlay - appears on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-[var(--background)] bg-opacity-90 p-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <label className="w-20 text-[var(--text)]">Pixel Size</label>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              className="flex-1 accent-[var(--link)]"
            />
            <span className="w-8 text-[var(--link)]">{pixelSize}</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-20 text-[var(--text)]">Exposure</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
              className="flex-1 accent-[var(--link)]"
            />
            <span className="w-8 text-[var(--link)]">{exposure.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-20 text-[var(--text)]">Dither</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={ditherAmount}
              onChange={(e) => setDitherAmount(Number(e.target.value))}
              className="flex-1 accent-[var(--link)]"
            />
            <span className="w-8 text-[var(--link)]">{ditherAmount.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
