import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  dts: true,
  outExtension ({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : `.${format}`
    }
  }
})
