import { defineComponent } from 'vue-demi'
import getStroke from 'perfect-freehand'
import h from './utils/h-demi'
import getSvgPathFromStroke from './utils/get-svg-path-from-stroke'

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
    props: {
        width: {
            type: String,
            required: true
        },
        height: {
            type: String,
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
    },
    computed: {
        paths(): string[] {
            return this.allPoints.map((point: Point[]) => {
                return getSvgPathFromStroke(getStroke(point))
            })
        },
        currentPath(): null | string {
            if (!this.currentPoints) return null
            return getSvgPathFromStroke(getStroke(this.currentPoints))
        }
    },
    mounted() {
        const canvas = document.querySelector('canvas')
        console.log(canvas)
    },
    render() {
        return h('canvas', {
            style: `height: ${this.height}; width: ${this.width}; background: black`,
            on: {
                pointerdown: this.handlePointerDown,
                pointerup: this.handlePointerUp,
                pointermove: this.handlePointerMove
            }
        })
    }
})