import { defineComponent } from 'vue-demi'

export default defineComponent({
    render() {
        return h('div', {
            ref: 'root'
        })
    }
})