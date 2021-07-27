<template>
  <VPerfectSignature
    :stroke-options="strokeOptions"
    ref="canvas"
  />
  <button @click="clear">clear</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VPerfectSignature from 'v-perfect-signature'

export default defineComponent({
  name: 'App',
  components: {
    VPerfectSignature
  },
  data: () => ({
    strokeOptions: {
        size: 8,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
        last: true,
    }
  }),
  mounted() {
  },
  methods: {
    async clear() {
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

body {
  height: 100%;
  user-select: none;
}
</style>