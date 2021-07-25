<template>
  <VSignature
    :stroke-options="strokeOptions"
    height="500"
    width="500"
    ref="canvas"
  />
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
    strokeOptions: {
      size: 5
    }
  }),
  mounted() {
  },
  methods: {
    async doSomething() {
      const res = await this.$refs.canvas.toDataURL('image')
      console.log(res)
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

/* html {
  height: 100vh;
  width: 100vw;
} */
</style>