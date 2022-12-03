import type { PropType } from 'vue-demi'
import { defineComponent } from 'vue-demi'
import type { StrokeOptions } from 'perfect-freehand'
import { getStroke } from 'perfect-freehand'

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
    cachedImages: [] as HTMLImageElement[],
  }),
  watch: {
    backgroundColor() {
      this.setBackgroundAndPenColor()
    },
    penColor(color: string) {
      const canvas = this.getCanvasElement()
      const ctx = canvas.getContext('2d')
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
    handlePointerDown(e: PointerEvent) {
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
      e.preventDefault()
      this.isDrawing = false

      if (!this.currentInputPoints) return

      this.allInputPoints = [...this.allInputPoints, this.currentInputPoints]
      this.currentInputPoints = null

      this.$emit('onEnd', e)
    },
    handlePointerEnter(e: PointerEvent) {
      if (e.buttons === 1)
        this.handlePointerDown(e)
    },
    handlePointerLeave(e: PointerEvent) {
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
    toData() {
      return this.allInputPoints
    },
    fromDataURL(data: string) {
      return new Promise((resolve, reject) => {
        const image = new Image()

        image.onload = () => {
          const canvas = this.getCanvasElement()
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(image, 0, 0, canvas.width, canvas.height)
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
      const ctx = canvas.getContext('2d')
      ctx?.scale(dpr, dpr)

      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      if (clearCanvas)
        this.clear()

      this.setBackgroundAndPenColor()
    },
    inputPointsHandler() {
      const canvas = this.getCanvasElement()
      const ctx = canvas.getContext('2d')

      // Makes smooth lines
      ctx?.clearRect(0, 0, canvas.width, canvas.height)

      this.cachedImages.forEach(image =>
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height),
      )
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
