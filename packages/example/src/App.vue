<template>
  <VSignature :dot-size="dotSize" pen-color="#000" height="500" width="500" ref="canvas" />
  <button @click="doSomething">do something</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VSignature from 'v-signature'

export default defineComponent({
  name: 'App',
  components: {
    VSignature
  },
  data: () => ({
    dotSize: 8
  }),
  methods: {
    doSomething() {
      this.$refs.canvas.clear()
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html {
  height: 100vh;
  width: 100vw;
}
</style>