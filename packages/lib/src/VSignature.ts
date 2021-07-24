import { defineComponent } from 'vue-demi'
import getStroke from 'perfect-freehand'
import h from './utils/h-demi'
import getSvgPathFromStroke from './utils/get-svg-path-from-stroke'

type Point = [number, number, number]

const initialPointsData = {
    allPoints: [] as Point[][],
    currentPoints: null as Point[] | null
}

const initialSettings = {
    size: 16,
    thinning: 0.75,
    smoothing: 0.5,
    streamline: 0.5
}

export default defineComponent({
    data: () => ({
        ...initialPointsData,
        isDrawing: false,
    }),
    props: {
        width: {
            type: [String, Number],
            required: true
        },
        height: {
            type: [String, Number],
            required: true
        }
    },
    methods: {
        handlePointerDown(e: PointerEvent) {
            e.preventDefault()
            console.log('down', e)
            this.isDrawing = true
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
        },
        handlePointerEnter(e: PointerEvent) {
            if (e.buttons === 1) {
                this.handlePointerDown(e)
            }
        },
        handlePointerLeave(e: PointerEvent) {
            if (!this.isDrawing) return
            this.handlePointerUp(e)
        }
    },
    computed: {
        paths(): string[] {
            return this.allPoints.map((point: Point[]) => {
                return getSvgPathFromStroke(getStroke(point, initialSettings))
            })
        },
        currentPath(): null | string {
            if (!this.currentPoints) return null
            return getSvgPathFromStroke(getStroke(this.currentPoints, initialSettings))
        }
    },
    // watch: {
    //     currentPath(newValue: null | string) {
    //         const canvas = this.$refs.pad as HTMLCanvasElement
    //         if (newValue && canvas) {
    //             const ctx = canvas.getContext('2d')
    //             const myPath = new Path2D(newValue)
    //             // ctx!.fillStyle = "#FFF"
    //             ctx!.fill(myPath)
    //         }
    //     }
    // },
    mounted() {
        const svg = this.$refs.signaturePad as SVGElement
        console.log(svg)
    },
    render() {
        let paths = this.paths.map((path) => h('path', { d: path }))
        if (this.currentPath) {
            paths.push(h('path', { d: this.currentPath }))
        }
        const g = h('g', {
            stroke: '#000',
            fill: '#000'
        }, paths)

        return h('svg', {
            ref: 'signaturePad',
            style: `cursor: crosshair; touch-action: none;`,
            width: this.width,
            height: this.height,
            // width: window.innerWidth,
            // height: window.innerHeight,
            on: {
                pointerdown: this.handlePointerDown,
                pointerup: this.handlePointerUp,
                pointermove: this.handlePointerMove,
                pointerenter: this.handlePointerEnter,
                pointerleave: this.handlePointerLeave
            }
        }, g)
    }
})