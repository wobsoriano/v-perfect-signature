<template>
  <VSignaturePad
    :stroke-options="strokeOptions"
    ref="canvas"
  />
  <button @click="clear">clear</button>
  <button @click="undo">Undo</button>
  <button @click="redo">Redo</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VSignaturePad from 'v-signature-pad'

const testData = [
    [
        [
            85.8125,
            110.078125,
            0.5
        ],
        [
            86.0390625,
            110.078125,
            0.5
        ],
        [
            86.49609375,
            109.84765625,
            0.5
        ],
        [
            91.15234375,
            108.09765625,
            0.5
        ],
        [
            97.3359375,
            105.62109375,
            0.5
        ],
        [
            122.75390625,
            99.15234375,
            0.5
        ],
        [
            120.41015625,
            106.67578125,
            0.5
        ],
        [
            115.84375,
            113.84375,
            0.5
        ],
        [
            105.37890625,
            125.69921875,
            0.5
        ],
        [
            91.7265625,
            139.34765625,
            0.5
        ],
        [
            81.41796875,
            148.27734375,
            0.5
        ],
        [
            76.2734375,
            154.05859375,
            0.5
        ],
        [
            74.84375,
            156.4375,
            0.5
        ],
        [
            74.84375,
            157.30859375,
            0.5
        ],
        [
            75.0703125,
            157.53515625,
            0.5
        ],
        [
            77.44921875,
            158.0078125,
            0.5
        ],
        [
            82.8671875,
            158.609375,
            0.5
        ],
        [
            95.23046875,
            158.609375,
            0.5
        ],
        [
            97.609375,
            158.609375,
            0.5
        ],
        [
            97.609375,
            158.8359375,
            0.5
        ],
        [
            97.609375,
            159.0625,
            0.5
        ],
        [
            98.71875,
            162.95703125,
            0.5
        ]
    ],
    [
        [
            192.43359375,
            243.42578125,
            0.5
        ],
        [
            192.66015625,
            243.42578125,
            0.5
        ],
        [
            192.66015625,
            243.1953125,
            0.5
        ],
        [
            192.88671875,
            243.1953125,
            0.5
        ],
        [
            197.703125,
            240.1796875,
            0.5
        ],
        [
            202.51953125,
            237.1640625,
            0.5
        ],
        [
            217.984375,
            229.4296875,
            0.5
        ],
        [
            238.59375,
            219.9140625,
            0.5
        ],
        [
            250.8828125,
            217.1796875,
            0.5
        ],
        [
            254.77734375,
            216.62109375,
            0.5
        ],
        [
            255.00390625,
            216.62109375,
            0.5
        ],
        [
            255.00390625,
            216.84765625,
            0.5
        ],
        [
            253.33203125,
            220.7421875,
            0.5
        ],
        [
            246.546875,
            230.234375,
            0.5
        ],
        [
            242.046875,
            236.66015625,
            0.5
        ],
        [
            231.5,
            250.015625,
            0.5
        ],
        [
            222.515625,
            261.06640625,
            0.5
        ],
        [
            215.78515625,
            269.8125,
            0.5
        ],
        [
            213.375,
            275.23046875,
            0.5
        ],
        [
            212.8984375,
            277.609375,
            0.5
        ],
        [
            213.37109375,
            279.98828125,
            0.5
        ],
        [
            215.2734375,
            281.4140625,
            0.5
        ],
        [
            220.69140625,
            282.6171875,
            0.5
        ],
        [
            231.453125,
            284.6328125,
            0.5
        ],
        [
            238.3984375,
            285.89453125,
            0.5
        ],
        [
            249.92578125,
            289.28515625,
            0.5
        ]
    ]
]

const svg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTUwIDc1IiB3aWR0aD0iMTUwIiBoZWlnaHQ9Ijc1Ij48cGF0aCBkPSJNIDc0LjUwMCw1NC45NDkgQyA3OC40NTQsNTYuOTg2IDc4LjM4NSw1Ny4xMDQgODIuMjcwLDU5LjI1OCIgc3Ryb2tlLXdpZHRoPSI1LjQwMCIgc3Ryb2tlPSJibGFjayIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+PHBhdGggZD0iTSA4Mi4yNzAsNTkuMjU4IEMgODcuNDE1LDYyLjQ2MSA4Ny40NzUsNjIuMzU3IDkyLjU0Myw2NS42OTEiIHN0cm9rZS13aWR0aD0iMy42NDYiIHN0cm9rZT0iYmxhY2siIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9wYXRoPjxwYXRoIGQ9Ik0gOTIuNTQzLDY1LjY5MSBDIDk1Ljc2Nyw2Ny44MTkgOTUuODEwLDY3Ljc1MCA5OS4wNTksNjkuODM2IiBzdHJva2Utd2lkdGg9IjMuODQ0IiBzdHJva2U9ImJsYWNrIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD48cGF0aCBkPSJNIDk5LjA1OSw2OS44MzYgQyAxMDcuNDYzLDc0LjkxOSAxMDcuNDMzLDc0Ljk2NyAxMTUuODc1LDc5Ljk4OCIgc3Ryb2tlLXdpZHRoPSIyLjgxNSIgc3Ryb2tlPSJibGFjayIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+PHBhdGggZD0iTSAxMTUuODc1LDc5Ljk4OCBDIDExOC40NzUsODEuNzQ1IDExOC41NTMsODEuNjAyIDEyMS4yMzgsODMuMjAzIiBzdHJva2Utd2lkdGg9IjMuNjEzIiBzdHJva2U9ImJsYWNrIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD48cGF0aCBkPSJNIDEyMS4yMzgsODMuMjAzIEMgMTI4LjEyMCw4Ni42NjAgMTI4LjA0NSw4Ni43OTQgMTM1LjAxNiw5MC4wODYiIHN0cm9rZS13aWR0aD0iMy4xMjMiIHN0cm9rZT0iYmxhY2siIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTU3LjcyMyw0Mi4yNjIgQyAxNTcuNzIzLDQ2LjI3OSAxNTcuNzIzLDQ2LjI3OSAxNTcuNzIzLDUwLjI5NyIgc3Ryb2tlLXdpZHRoPSI1LjQwOSIgc3Ryb2tlPSJibGFjayIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+PHBhdGggZD0iTSAxNTcuNzIzLDUwLjI5NyBDIDE1Ny43MjMsNTIuOTczIDE1Ny43MjMsNTIuOTczIDE1Ny43MjMsNTUuNjQ4IiBzdHJva2Utd2lkdGg9IjQuNTE0IiBzdHJva2U9ImJsYWNrIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD48cGF0aCBkPSJNIDE1Ny43MjMsNTUuNjQ4IEMgMTU3LjcyMyw1OS45NzMgMTU3LjcyMyw1OS45NzMgMTU3LjcyMyw2NC4yOTciIHN0cm9rZS13aWR0aD0iMy44NzMiIHN0cm9rZT0iYmxhY2siIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTU3LjcyMyw2NC4yOTcgQyAxNTcuNTc5LDY4LjI1NyAxNTcuNzIzLDY4LjI1MCAxNTcuNzIzLDcyLjIwMyIgc3Ryb2tlLXdpZHRoPSIzLjg5OCIgc3Ryb2tlPSJibGFjayIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+PHBhdGggZD0iTSAxNTcuNzIzLDcyLjIwMyBDIDE1Ny44OTUsNzQuODQyIDE1Ny44MTksNzQuODQxIDE1OC4yMDMsNzcuNDY1IiBzdHJva2Utd2lkdGg9IjQuMTI0IiBzdHJva2U9ImJsYWNrIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD48cGF0aCBkPSJNIDE1OC4yMDMsNzcuNDY1IEMgMTU4LjY0Niw4MC40NjIgMTU4LjU1Nyw4MC40NzMgMTU5LjA0Nyw4My40NjUiIHN0cm9rZS13aWR0aD0iNC4xNDAiIHN0cm9rZT0iYmxhY2siIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9wYXRoPjwvc3ZnPg=='

export default defineComponent({
  name: 'App',
  components: {
    VSignaturePad
  },
  data: () => ({
    strokeOptions: {
        size: 16,
        thinning: 0.75,
        smoothing: 0.5,
        streamline: 0.5,
        last: true,
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
      // this.$refs.canvas.toDataURL()
      const dataUrl = this.$refs.canvas.toDataURL()
      console.log(dataUrl)
      // const data = this.$refs.canvas.toData()
      // console.log(JSON.parse(JSON.stringify(data)))
    //   this.$refs.canvas.fromData(testData)
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

body {
  height: 100%;
  user-select: none;
}
</style>