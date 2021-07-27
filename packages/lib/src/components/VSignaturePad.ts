import { defineComponent, PropType } from 'vue-demi'
import getStroke, { StrokeOptions } from 'perfect-freehand'

import h from '../utils/h-demi'
import getSvgPathFromStroke from '../utils/get-svg-path-from-stroke'
import convertToNonReactive from '../utils/convert-to-non-reactive'
import {
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_PEN_COLOR,
    IMAGE_TYPES,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH
} from '../utils/constants'

type InputPoints = number[]

interface PointsData {
    allInputPoints: InputPoints[][]
    currentInputPoints: InputPoints[] | null
}
const initialPointsData: PointsData = {
    allInputPoints: [],
    currentInputPoints: null
}

export default defineComponent({
    data: () => ({
        history: convertToNonReactive<PointsData[]>([initialPointsData]),
        historyStep: 0,
        points: convertToNonReactive<PointsData>([initialPointsData][0]),
        isDrawing: false,
    }),
    emits: ['onBegin', 'onEnd'],
    props: {
        width: {
            type: String,
            required: false,
            default: DEFAULT_WIDTH
        },
        height: {
            type: String,
            required: false,
            default: DEFAULT_HEIGHT
        },
        backgroundColor: {
            type: String,
            required: false,
            default: DEFAULT_BACKGROUND_COLOR
        },
        penColor: {
            type: String,
            required: false,
            default: DEFAULT_PEN_COLOR
        },
        strokeOptions: {
            type: Object as PropType<StrokeOptions>,
            required: false,
            default: {}
        },
        customStyle: {
            type: Object,
            required: false,
            default: {}
        }
    },
    methods: {
        handlePointerDown(e: PointerEvent) {
            e.preventDefault()
            this.points.currentInputPoints = [[e.pageX, e.pageY, e.pressure]]
            this.isDrawing = true
            this.$emit('onBegin', e)
        },
        handlePointerMove(e: PointerEvent) {
            if (!this.isDrawing) return

            if (e.buttons === 1) {
                e.preventDefault()
                this.points.currentInputPoints = [...this.points.currentInputPoints ?? [], [e.pageX, e.pageY, e.pressure]]
            }
        },
        handlePointerUp(e: PointerEvent) {
            e.preventDefault()
            this.isDrawing = false

            if (!this.points.currentInputPoints) return

            const newHistoryRecord = {
                allInputPoints: [...this.points.allInputPoints, this.points.currentInputPoints],
                currentInputPoints: null
            }

            this.points = { ...newHistoryRecord }
            this.history = [...this.history, { ...newHistoryRecord }]
            this.historyStep += 1
            this.$emit('onEnd', e)
        },
        handlePointerEnter(e: PointerEvent) {
            if (e.buttons === 1) {
                this.handlePointerDown(e)
            }
        },
        handlePointerLeave(e: PointerEvent) {
            if (!this.isDrawing) return
            this.handlePointerUp(e)
        },
        canUndo() {
            return this.historyStep > 0
        },
        canRedo() {
            return this.historyStep !== this.history.length - 1
        },
        undo() {
            if (!this.canUndo()) {
                return
            }
            this.historyStep -= 1
            this.points = convertToNonReactive<PointsData>(this.history[this.historyStep])
        },
        redo() {
            if (!this.canRedo()) {
                return
            }
            this.historyStep += 1
            this.points = convertToNonReactive<PointsData>(this.history[this.historyStep])
        },
        isEmpty() {
            return this.history[this.historyStep].allInputPoints.length === 0
        },
        clear() {
            this.history = convertToNonReactive([initialPointsData])
            this.historyStep = 0
            this.points = convertToNonReactive([initialPointsData][0])
        },
        fromData(data: InputPoints[][]) {
            const newHistoryRecord: PointsData = {
                allInputPoints: [...this.points.allInputPoints, ...data],
                currentInputPoints: null
            }

            this.points = { ...newHistoryRecord }
            this.history = [...this.history, { ...newHistoryRecord }]
            this.historyStep += 1
        },
        toData() {
            return this.history[this.historyStep].allInputPoints
        },
        toDataURL(type: string = 'image/png') {
            if (!IMAGE_TYPES.includes(type)) {
                throw new Error('Incorrect image type!')
            }

            if (this.isEmpty()) {
                return
            }

            const canvas = this.getCanvasElement()
            return canvas.toDataURL(type)
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
        resizeCanvas() {
            const canvas = this.getCanvasElement()
            const rect = canvas.getBoundingClientRect()
            const dpr =  window.devicePixelRatio || 1

            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            const ctx = canvas.getContext('2d')
            ctx?.scale(dpr, dpr)

            canvas.style.width = rect.width + 'px'
            canvas.style.height = rect.height + 'px'

            this.clear()
            this.setBackgroundAndPenColor()
        }
    },
    mounted() {
        window.addEventListener('resize', this.resizeCanvas, false);
        this.resizeCanvas()
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.resizeCanvas, false)
    },
    watch: {
        backgroundColor() {
            this.setBackgroundAndPenColor()
        },
        penColor(color: string) {
            const canvas = this.getCanvasElement()
            const ctx = canvas.getContext('2d')
            ctx!.fillStyle = color
        },
        points: {
            deep: true,
            handler({ allInputPoints, currentInputPoints }: PointsData) {
                const canvas = this.getCanvasElement()
                const ctx = canvas.getContext('2d')
                // Clear to have smooth lines
                ctx?.clearRect(0,0,canvas.width,canvas.height)
                // Set background 
                this.setBackgroundAndPenColor()

                allInputPoints.forEach((point: InputPoints[]) => {
                    const pathData = getSvgPathFromStroke(getStroke(point, this.strokeOptions))
                    const myPath = new Path2D(pathData)
                    ctx?.fill(myPath)
                })

                if (!currentInputPoints) return
                const pathData = getSvgPathFromStroke(getStroke(currentInputPoints, this.strokeOptions))
                const myPath = new Path2D(pathData)
                ctx?.fill(myPath)
            }
        }
    },
    render() {
        const {
            width,
            height,
            customStyle
        } = this

        return h('canvas', {
            ref: 'signaturePad',
            style: {
                height,
                width,
                touchAction: 'none',
                cursor: 'crosshair',
                ...customStyle
            },
            on: {
                pointerdown: this.handlePointerDown,
                pointerup: this.handlePointerUp,
                pointermove: this.handlePointerMove,
                pointerenter: this.handlePointerEnter,
                pointerleave: this.handlePointerLeave
            }
        })
    }
})