<template>
    <Nav />
    <!-- <Header /> -->
    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div class="border-4 border-gray-200 h-96 rounded-lg">
                    <VPerfectSignature
                        :stroke-options="strokeOptions"
                        ref="signaturePad"
                    />
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import VPerfectSignature from 'v-perfect-signature'
import Nav from './components/Nav.vue'
import { onMounted, onUnmounted, ref } from 'vue'

const strokeOptions = {
    size: 8,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
    last: true,
}

const signaturePad = ref<HTMLCanvasElement>()

const clearCanvas = () => {
    signaturePad.value?.resizeCanvas()
}

onMounted(() => {
    window.addEventListener('resize', clearCanvas)
})

onUnmounted(() => {
    window.removeEventListener('resize', clearCanvas)
})
</script>