function noOp () { }
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp})
  Object.defineProperty(window.URL, 'revokeObjectURL', { value: noOp})
}