const generateCssLoader = function({ include, exclude, happyId }) {
  const hp = `happypack/loader?id=${happyId}`
  return {
    test: /\.(css|less)$/,
    include,
    exclude,
    use: ['style-loader', hp]
  }
}
module.exports = generateCssLoader
