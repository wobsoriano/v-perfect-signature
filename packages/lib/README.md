# v-perfect-signature

Perfect pressure-sensitive signature drawing for Vue 2 and 3 built on top of [perfect-freehand](https://github.com/steveruizok/perfect-freehand).

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
        streamline: 0.5,
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
`toDataURL` | `String` | Returns signature image as data URL |
`fromDataURL` | `String` | Draws signature image from data URL |
`toData` | - | Returns signature image as an array of array of input points |
`fromData` | `Array` | Draws signature image from array of array of input points |
`clear` | - | Clears the canvas |
`isEmpty` | - | Returns true if canvas is empty |
`resizeCanvas` | `Boolean` | Resize the canvas based on `window.devicePixelRatio` |

Note: `fromData` does not populate internal data structure. Thus, after using `fromDataURL` and `toData` won't work properly.

## Events

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`onBegin` | Function | - | Fired when stroke begin |
`onEnd` | Function | - | Fired when stroke end  |

## Credits

- [perfect-freehand](https://github.com/steveruizok/perfect-freehand)
- [signature_pad](https://github.com/szimek/signature_pad)
- [vue-signature-pad](https://github.com/neighborhood999/vue-signature-pad)

## License
MIT - Copyright (c) 2021 [Robert Soriano](https://github.com/wobsoriano)