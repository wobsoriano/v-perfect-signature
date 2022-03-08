
import { vi } from 'vitest'
// @ts-expect-error: type
global.jest = vi
// eslint-disable-next-line import/first
import getCanvasWindow from 'jest-canvas-mock/lib/window'

const apis = [
  'Path2D',
  'CanvasGradient',
  'CanvasPattern',
  'CanvasRenderingContext2D',
  'DOMMatrix',
  'ImageData',
  'TextMetrics',
  'ImageBitmap',
  'createImageBitmap',
] as const

const canvasWindow = getCanvasWindow({ document: window.document })

apis.forEach((api) => {
  // @ts-expect-error: type
  global[api] = canvasWindow[api]
  // @ts-expect-error: type
  global.window[api] = canvasWindow[api]
})
