<template>
  <VSignature height="500px" width="500px" />
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