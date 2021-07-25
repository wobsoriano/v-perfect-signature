import getStroke, { StrokeOptions } from 'perfect-freehand'

import { defineComponent, PropType } from "vue-demi";
import getSvgPathFromStroke from '../utils/get-svg-path-from-stroke'
import { DEFAULT_OPTIONS } from '../utils/constants'

type Point = [number, number, number]

const initialPointsData = {
    allPoints: [] as Point[][],
    currentPoints: null as Point[] | null
}

export default defineComponent ({
    data: () => ({
        ...initialPointsData,
        isDrawing: false,
    }),
    emits: ['onBegin', 'onEnd'],
    props: {
        width: {
            type: [String, Number],
            required: true
        },
        height: {
            type: [String, Number],
            required: true
        },
        dotSize: {
            type: Number,
            required: false,
            default: DEFAULT_OPTIONS.dotSize
        },
        penColor: {
            type: String,
            required: false,
            default: DEFAULT_OPTIONS.penColor
        },
        backgroundColor: {
            type: String,
            required: false,
            default: DEFAULT_OPTIONS.backgroundColor
        }
    },
    methods: {
        handlePointerDown(e: PointerEvent) {
            e.preventDefault()
            this.isDrawing = true
            this.$emit('onBegin', e)
        },
        handlePointerMove(e: PointerEvent) {
            if (!this.isDrawing) return

            if (e.buttons === 1) {
                e.preventDefault()
                this.currentPoints = [...this.currentPoints ?? [], [e.pageX, e.pageY, e.pressure]]
            }
        },
        handlePointerUp(e: PointerEvent) {
            e.preventDefault()
            this.isDrawing = false

            if (!this.currentPoints) return

            this.allPoints = [...this.allPoints, this.currentPoints]
            this.currentPoints = null
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
        isEmpty() {
            return this.allPoints.length === 0 && !this.currentPoints
        },
    },
    computed: {
        strokeOptions(): StrokeOptions {
            return {
                size: this.dotSize
            }
        },
        paths(): string[] {
            return this.allPoints.map((point: Point[]) => {
                return getSvgPathFromStroke(getStroke(point, this.strokeOptions))
            })
        },
        currentPath(): null | string {
            if (!this.currentPoints) return null
            return getSvgPathFromStroke(getStroke(this.currentPoints, this.strokeOptions))
        },
    },
})