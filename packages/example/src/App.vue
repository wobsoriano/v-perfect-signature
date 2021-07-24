<template>
  <VSignature height="600" width="600" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VSignature } from 'v-signature'

export default defineComponent({
  name: 'App',
  components: {
    VSignature
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>