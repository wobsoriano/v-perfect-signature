# v-perfect-signature

Pressure-sensitive signature drawing for Vue 2 and 3 built on top of [perfect-freehand](https://github.com/steveruizok/perfect-freehand).

TODO: Add demo link

## Install

```bash
yarn add v-perfect-signature
```

## Usage

```html
<template>
  <VPerfectSignature :stroke-options="strokeOptions" ref="signaturePad" />
</template>

<script lang="ts">
import Vue from 'vue'
import VPerfectSignature, { StrokeOptions } from 'v-perfect-signature'

export default Vue.extend({
  components: {
    VPerfectSignature
  },
  data: () => ({
    strokeOptions: {
        size: 16,
        thinning: 0.75,
        smoothing: 0.5,
        streamline: 0.5
    } as StrokeOptions
  }),
  methods: {
    toDataURL() {
        const dataURL = this.$refs.signaturePad.toDataURL()
        console.log(dataURL)
    }
  }
})
</script>
```

## Props

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`width` | String | `100%` | Set canvas width |
`height` | String | `100%` | Set canvas height |
`backgroundColor` | String | `rgba(0,0,0,0)` | Canvas background color |
`penColor` | String | `#000` | Canvas pen color |
`strokeOptions` | Object | [Reference](https://github.com/steveruizok/perfect-freehand#options) | Perfect freehand options  |
`customStyle` | Object | `{}` | Custom canvas style |

## Methods

Name | Argument Type | Description |
------ | ------ | ------ |
`toDataURL(type)` | [String](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) | Returns signature image as data URL |
`fromDataURL(dataUri)` | [String](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) | Draws signature image from data URL |
`toData` | - | Returns signature image as an array of array of input points |
`fromData(data)` | [Array](https://github.com/wobsoriano/v-perfect-signature/blob/master/packages/lib/src/components/__tests__/mock.ts#L1) | Draws signature image from array of array of input points |
`clear()` | - | Clears the canvas |
`isEmpty()` | - | Returns true if canvas is empty |
`resizeCanvas(shouldClear)` | `Boolean` | Resizes and clears the canvas |

Note: `fromDataURL` does not populate internal data structure. Thus, after using `fromDataURL`, `toData` won't work properly.

## Events

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`onBegin` | Function | - | Fired when stroke begin |
`onEnd` | Function | - | Fired when stroke end  |

## Credits

- [perfect-freehand](https://github.com/steveruizok/perfect-freehand) - Draw perfect pressure-sensitive freehand strokes.
- [signature_pad](https://github.com/szimek/signature_pad) - HTML 5 canvas based smooth signature drawing.
- [vue-signature-pad](https://github.com/neighborhood999/vue-signature-pad) - Vue wrapper of signature_pad.

## License
MIT - Copyright (c) 2021 [Robert Soriano](https://github.com/wobsoriano)