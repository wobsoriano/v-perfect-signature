import { defineComponent, PropType } from 'vue-demi'
import h from './utils/h-demi'
import getStroke, { StrokeOptions } from 'perfect-freehand'

import getSvgPathFromStroke from './utils/get-svg-path-from-stroke'
import { DEFAULT_OPTIONS } from './utils/constants'

type Point = [number, number, number]

const initialPointsData = {
    allPoints: [] as Point[][],
    currentPoints: null as Point[] | null
}

export default defineComponent({
    data: () => ({
        ...initialPointsData,
        isDrawing: false,
    }),
    emits: ['onBegin', 'onEnd'],
    props: {
        width: {
            type: String,
            required: false,
            default: '100%'
        },
        height: {
            type: String,
            required: false,
            default: '100%'
        },
        options: {
            type: Object as PropType<typeof DEFAULT_OPTIONS>,
            required: false,
            default: DEFAULT_OPTIONS
        }
    },
    methods: {
        handlePointerDown(e: PointerEvent) {
            e.preventDefault()
            this.currentPoints = [[e.pageX, e.pageY, e.pressure]]
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
        clear() {
            this.allPoints = []
            this.currentPoints = null
        }
    },
    computed: {
        strokeOptions(): StrokeOptions {
            return {
                size: this.options.dotSize ?? DEFAULT_OPTIONS.dotSize,
                simulatePressure: this.options.simulatePressure ?? DEFAULT_OPTIONS.simulatePressure
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
    render() {
        const paths = this.paths.map((path) => h('path', { d: path }))
        if (this.currentPath) {
            paths.push(h('path', { d: this.currentPath }))
        }

        const {
            penColor,
            backgroundColor
        } = this.options
        
        const group = h('g', {
            stroke: penColor,
            fill: penColor
        }, paths)

        return h('svg', {
            ref: 'signaturePad',
            style: {
                width: this.width,
                height: this.height,
                backgroundColor
            },
            on: {
                pointerdown: this.handlePointerDown,
                pointerup: this.handlePointerUp,
                pointermove: this.handlePointerMove,
                pointerenter: this.handlePointerEnter,
                pointerleave: this.handlePointerLeave
            }
        }, group)
    }
})