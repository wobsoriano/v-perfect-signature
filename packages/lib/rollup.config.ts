// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import dts from "rollup-plugin-dts"
import pkg from './package.json'

const external = ['vue-demi']

export default [
  {
    plugins: [typescript()],
    external,
    input: 'src/index.ts',
    output: [
      {
        format: 'esm',
        file: pkg.module,
        sourcemap: true,
      },
      {
        exports: 'named',
        format: 'cjs',
        file: pkg.main
      },
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'VSignature',
        sourcemap: true,
        globals: {
          'vue-demi': 'VueDemi',
        },
      }
    ]
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: {
      file: "dist/index.d.ts",
      format: "es"
    }
  }
]