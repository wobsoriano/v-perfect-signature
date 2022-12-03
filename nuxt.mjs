export default () => ({
  meta: {
    name: 'v-perfect-signature',
    configKey: 'vps'
  },
  setup(_, nuxt) {
    nuxt.options.build.transpile.push('v-perfect-signature')
  }
})
