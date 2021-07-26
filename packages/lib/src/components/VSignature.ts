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
        undo() {
            if (this.historyStep === 0) return
            this.historyStep -= 1
            const previous = convertToNonReactive<PointsData>(this.history[this.historyStep])
            this.points = previous
        },
        redo() {
            if (this.historyStep === this.history.length - 1) return
            this.historyStep += 1
            const next = convertToNonReactive<PointsData>(this.history[this.historyStep])
            this.points = next
        },
        isEmpty() {
            return !this.points.allPoints.length && !this.points.currentPoints
        },
        clear() {
            this.history = convertToNonReactive([initialPointsData])
            this.historyStep = 0
            this.points = convertToNonReactive([initialPointsData][0])
        },
        toCanvas() {
            const svgElement = this.$refs.signaturePad as SVGElement
            return svgToCanvas(svgElement)
        },
        async toDataURL(type?: string) {
            if (type && !IMAGE_TYPES.includes(type)) {
                throw new Error('Incorrect image type!')
            }

            if (this.isEmpty()) return

            const svgElement = this.$refs.signaturePad as SVGElement
            const canvas = await svgToCanvas(svgElement)
            return canvas.toDataURL(type ?? 'image/png')
        }
    },
    computed: {
        paths(): string[] {
            return this.points.allPoints.map((point: Point[]) => {
                return getSvgPathFromStroke(getStroke(point, this.strokeOptions))
            })
        },
        currentPath(): null | string {
            if (!this.points.currentPoints) return null
            return getSvgPathFromStroke(getStroke(this.points.currentPoints, this.strokeOptions))
        },
    },
    render() {
        const {
            width,
            height,
            backgroundColor,
            customStyle
        } = this

        return h('svg', {
            ref: 'signaturePad',
            xmlns: 'http://www.w3.org/2000/svg',
            style: {
                height,
                width,
                backgroundColor,
                ...customStyle
            },
            on: {
                pointerdown: this.handlePointerDown,
                pointerup: this.handlePointerUp,
                pointermove: this.handlePointerMove,
                pointerenter: this.handlePointerEnter,
                pointerleave: this.handlePointerLeave
            }
        }, [
            h('g', {
                stroke: this.penColor,
                fill: this.penColor
            }, [
                ...this.paths.map((path) => h('path', { d: path })),
                this.currentPath ? h('path', { d: this.currentPath }) : []
            ])
        ])
    }
})