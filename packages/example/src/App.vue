<template>
  <VSignature
    :stroke-options="strokeOptions"
    height="500"
    width="500"
    ref="canvas"
  />
  <button @click="clear">clear</button>
  <button @click="undo">Undo</button>
  <button @click="redo">Redo</button>
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
    async clear() {
      // this.$refs.canvas.clear()
      // console.log(JSON.parse(JSON.stringify(this.$refs.canvas.points)))
      // const data = await this.$refs.canvas.toDataURL()
      // console.log(data)
      this.$refs.canvas.toDataURL()
    },
    undo() {
      this.$refs.canvas.undo()
    },
    redo() {
      this.$refs.canvas.redo()
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