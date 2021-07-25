import { defineComponent, PropType } from 'vue-demi'
import getStroke, { StrokeOptions } from 'perfect-freehand'

import h from './utils/h-demi'
import getSvgPathFromStroke from './utils/get-svg-path-from-stroke'
import svgToCanvas from './utils/svg-to-canvas'
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_PEN_COLOR, IMAGE_TYPES } from './utils/constants'

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
            return !this.allPoints.length && !this.currentPoints
        },
        clear() {
            this.allPoints = []
            this.currentPoints = null
        },
        toCanvas() {
            const svgElement = this.$refs.signaturePad as SVGElement
            return svgToCanvas(svgElement)
        },
        async toDataURL(type: string) {
            if (type && !IMAGE_TYPES.includes(type)) {
                throw new Error('Invalid image type!')
            }

            const svgElement = this.$refs.signaturePad as SVGElement
            const canvas = await svgToCanvas(svgElement)
            return canvas.toDataURL(type ?? 'image/png')
        }
    },
    computed: {
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
        
        const group = h('g', {
            stroke: this.penColor,
            fill: this.penColor
        }, paths)

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
        }, group)
    }
})