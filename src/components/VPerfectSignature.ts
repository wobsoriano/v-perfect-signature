import type { PropType } from 'vue-demi'
import { defineComponent } from 'vue-demi'
import type { StrokeOptions } from 'perfect-freehand'
import * as PerfectFreehand from 'perfect-freehand'

const { getStroke } = PerfectFreehand

import h from '../utils/h-demi'
import getSvgPathFromStroke from '../utils/get-svg-path-from-stroke'
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_HEIGHT,
  DEFAULT_PEN_COLOR,
  DEFAULT_WIDTH,
  IMAGE_TYPES,
} from '../utils/constants'

type InputPoints = number[]

export default defineComponent({
  props: {
    width: {
      type: String,
      required: false,
      default: DEFAULT_WIDTH,
    },
    height: {
      type: String,
      required: false,
      default: DEFAULT_HEIGHT,
    },
    backgroundColor: {
      type: String,
      required: false,
      default: DEFAULT_BACKGROUND_COLOR,
    },
    penColor: {
      type: String,
      required: false,
      default: DEFAULT_PEN_COLOR,
    },
    strokeOptions: {
      type: Object as PropType<StrokeOptions>,
      required: false,
      default: () => ({}),
    },
  },
  emits: ['onBegin', 'onEnd'],
  data: () => ({
    allInputPoints: [] as InputPoints[][],
    currentInputPoints: null as InputPoints[] | null,
    isDrawing: false,
    isLocked: false,
    cachedImages: [] as HTMLImageElement[],
    ctx: null as null | CanvasRenderingContext2D
  }),
  watch: {
    backgroundColor() {
      this.setBackgroundAndPenColor()
    },
    penColor(color: string) {
      const ctx = this.getCanvasContext();
      if (ctx)
        ctx.fillStyle = color
    },
    allInputPoints: {
      deep: true,
      handler() {
        this.inputPointsHandler()
      },
    },
    currentInputPoints: {
      deep: true,
      handler() {
        this.inputPointsHandler()
      },
    },
  },
  mounted() {
    this.resizeCanvas()
  },
  methods: {
    _drawImage(image: HTMLImageElement) {
      const canvas = this.getCanvasElement()
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1

      ctx?.scale(1/dpr, 1/dpr) // To allow proper scaling of the image on HiDPI, we need to reset the scaling before calling `drawImage`
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height)
      ctx?.scale(dpr, dpr) // Set scaling back to original value
    },
    handlePointerDown(e: PointerEvent) {
      if (this.isLocked) return

      e.preventDefault()

      const canvas = e.composedPath()[0] as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      this.currentInputPoints = [[x, y, e.pressure]]
      this.isDrawing = true
      this.$emit('onBegin', e)
    },
    handlePointerMove(e: PointerEvent) {
      if (this.isLocked) return
      if (!this.isDrawing) return

      if (e.buttons === 1) {
        e.preventDefault()

        const canvas = e.composedPath()[0] as HTMLCanvasElement
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        this.currentInputPoints = [
          ...(this.currentInputPoints ?? []),
          [x, y, e.pressure],
        ]
      }
    },
    handlePointerUp(e: PointerEvent) {
      if (this.isLocked) return

      e.preventDefault()
      this.isDrawing = false

      if (!this.currentInputPoints) return

      this.allInputPoints = [...this.allInputPoints, this.currentInputPoints]
      this.currentInputPoints = null

      this.$emit('onEnd', e)
    },
    handlePointerEnter(e: PointerEvent) {
      if (this.isLocked) return

      if (e.buttons === 1)
        this.handlePointerDown(e)
    },
    handlePointerLeave(e: PointerEvent) {
      if (this.isLocked) return
      if (!this.isDrawing) return
      this.handlePointerUp(e)
    },
    isEmpty() {
      return !this.allInputPoints.length && !this.cachedImages.length
    },
    clear() {
      this.cachedImages = []
      this.allInputPoints = []
      this.currentInputPoints = null
    },
    fromData(data: InputPoints[][]) {
      this.allInputPoints = [...this.allInputPoints, ...data]
    },
    lock() {
      this.isLocked = true
    },
    unlock() {
      this.isLocked = false
    },
    toData() {
      return this.allInputPoints
    },
    fromDataURL(data: string) {
      return new Promise((resolve, reject) => {
        const image = new Image()

        image.onload = () => {
          this._drawImage(image)
          this.cachedImages.push(image)
          resolve(true)
        }

        image.onerror = () => {
          reject(new Error('Incorrect data uri provided'))
        }

        image.crossOrigin = 'anonymous'
        image.src = data
      })
    },
    toDataURL(type?: string) {
      if (type && !IMAGE_TYPES.includes(type)) {
        throw new Error(
          `Incorrect image type. Must be one of ${IMAGE_TYPES.join(', ')}.`,
        )
      }

      if (this.isEmpty()) return

      const canvas = this.getCanvasElement()
      return canvas.toDataURL(type ?? 'image/png')
    },
    getCanvasElement() {
      return this.$refs.signaturePad as HTMLCanvasElement
    },
    getCanvasContext() {
      if (!this.ctx) {
        const canvas = this.getCanvasElement();
        this.ctx = canvas.getContext('2d');
      }
      return this.ctx;
    },
    setBackgroundAndPenColor() {
      const canvas = this.getCanvasElement()
      const ctx = canvas.getContext('2d')
      ctx!.fillStyle = this.backgroundColor
      ctx?.fillRect(0, 0, canvas.width, canvas.height)
      ctx!.fillStyle = this.penColor
    },
    resizeCanvas(clearCanvas = true) {
      const canvas = this.getCanvasElement()
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = this.getCanvasContext();
      ctx?.scale(dpr, dpr)

      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      if (clearCanvas) {
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        this.clear()
      }

      this.setBackgroundAndPenColor()
    },
    inputPointsHandler() {
      const canvas = this.getCanvasElement()
      const ctx = this.getCanvasContext();

      // Makes smooth lines
      ctx?.clearRect(0, 0, canvas.width, canvas.height)

      this.cachedImages.forEach(image => this._drawImage(image))
      this.setBackgroundAndPenColor()

      this.allInputPoints.forEach((point: InputPoints[]) => {
        const pathData = getSvgPathFromStroke(
          getStroke(point, this.strokeOptions),
        )
        const myPath = new Path2D(pathData)
        ctx?.fill(myPath)
      })

      if (!this.currentInputPoints) return
      const pathData = getSvgPathFromStroke(
        getStroke(this.currentInputPoints!, this.strokeOptions),
      )
      const myPath = new Path2D(pathData)
      ctx?.fill(myPath)
    },
  },
  render() {
    const { width, height } = this

    const handlers = {
      pointerdown: this.handlePointerDown,
      pointerup: this.handlePointerUp,
      pointermove: this.handlePointerMove,
      pointerenter: this.handlePointerEnter,
      pointerleave: this.handlePointerLeave,
    }

    return h('canvas', {
      ref: 'signaturePad',
      style: {
        height,
        width,
        touchAction: 'none',
      },
      on: handlers,
    })
  },
})
