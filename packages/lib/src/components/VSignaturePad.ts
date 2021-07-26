import { defineComponent, PropType } from 'vue-demi'
import getStroke, { StrokeOptions } from 'perfect-freehand'

import h from '../utils/h-demi'
import getSvgPathFromStroke from '../utils/get-svg-path-from-stroke'
import svgToCanvas from '../utils/svg-to-canvas'
import convertToNonReactive from '../utils/convert-to-non-reactive'
import {
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_PEN_COLOR,
    IMAGE_TYPES,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH
} from '../utils/constants'

type Point = [number, number, number]

interface PointsData {
    allPoints: Point[][]
    currentPoints: Point[] | null
}
const initialPointsData: PointsData = {
    allPoints: [],
    currentPoints: null
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
            this.points.currentPoints = [[e.pageX, e.pageY, e.pressure]]
            this.isDrawing = true
            this.$emit('onBegin', e)
        },
        handlePointerMove(e: PointerEvent) {
            if (!this.isDrawing) return

            if (e.buttons === 1) {
                e.preventDefault()
                this.points.currentPoints = [...this.points.currentPoints ?? [], [e.pageX, e.pageY, e.pressure]]
            }
        },
        handlePointerUp(e: PointerEvent) {
            e.preventDefault()
            this.isDrawing = false

            if (!this.points.currentPoints) return

            const newHistoryRecord = {
                allPoints: [...this.points.allPoints, this.points.currentPoints],
                currentPoints: null
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
            if (this.canUndo()) {
                this.historyStep -= 1
                const previous = convertToNonReactive<PointsData>(this.history[this.historyStep])
                this.points = previous
            }
        },
        redo() {
            if (this.canRedo()) {
                this.historyStep += 1
                const next = convertToNonReactive<PointsData>(this.history[this.historyStep])
                this.points = next
            }
        },
        isEmpty() {
            return this.history[this.historyStep].allPoints.length === 0
        },
        clear() {
            this.history = convertToNonReactive([initialPointsData])
            this.historyStep = 0
            this.points = convertToNonReactive([initialPointsData][0])
        },
        fromData(data: Point[][]) {
            const newHistoryRecord: PointsData = {
                allPoints: [...this.points.allPoints, ...data],
                currentPoints: null
            }

            this.points = { ...newHistoryRecord }
            this.history = [...this.history, { ...newHistoryRecord }]
            this.historyStep += 1
        },
        toData() {
            return this.history[this.historyStep].allPoints
        },
        async toDataURL(type?: string) {
            if (type && !IMAGE_TYPES.includes(type)) {
                throw new Error('Incorrect image type!')
            }

            if (this.isEmpty()) {
                return
            }

            const svgElement = this.$refs.signaturePad as SVGElement
            const canvas = await svgToCanvas(svgElement)
            return canvas.toDataURL(type ?? 'image/png')
        },
        getCanvasElement() {
            return this.$refs.signaturePad as HTMLCanvasElement
        },
        getCanvasContext() {
            const canvas = this.getCanvasElement()
            return canvas.getContext('2d')
        },
        setBackgroundColor() {
            const canvas = this.getCanvasElement()
            const ctx = canvas.getContext('2d')
            ctx!.fillStyle = this.backgroundColor
            ctx?.fillRect(0, 0, canvas.width, canvas.height)
            ctx!.fillStyle = this.penColor
        },
        resizeCanvas() {
            const canvas = this.getCanvasElement()
            const rect = canvas.getBoundingClientRect()
            const ratio =  window.devicePixelRatio || 1
            canvas.width = rect.width * ratio;
            canvas.height = rect.height * ratio;
            canvas?.getContext('2d')?.scale(ratio, ratio)
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            this.clear()
            this.setBackgroundColor()
        }
    },
    mounted() {
        window.addEventListener("resize", this.resizeCanvas, false);
        this.resizeCanvas()
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.resizeCanvas, false)
    },
    watch: {
        backgroundColor() {
            this.setBackgroundColor()
        },
        penColor(color: string) {
            const ctx = this.getCanvasContext()
            ctx!.fillStyle = color
        },
        'points.allPoints': {
            deep: true,
            handler(allPoints: PointsData['allPoints']) {
                allPoints.forEach((point: Point[]) => {
                    const pathData = getSvgPathFromStroke(getStroke(point, this.strokeOptions))
                    const myPath = new Path2D(pathData)
                    const ctx = this.getCanvasContext()
                    ctx?.fill(myPath)
                })
            }
        },
        'points.currentPoints': {
            deep: true,
            handler(currentPoints: PointsData['currentPoints']) {
                if (!currentPoints) return
                const pathData = getSvgPathFromStroke(getStroke(currentPoints, this.strokeOptions))
                const myPath = new Path2D(pathData)
                const ctx = this.getCanvasContext()
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