import px2viewport from 'postcss-px-to-viewport';

export default () => {
  return {
    plugins: [
      px2viewport({
        viewportUnit: "vw",
        fontViewportUnit: "vw",
        viewportWidth: 375,
        exclude: [/^(?!.*node_modules\/react-vant)/]
      }),
      px2viewport({
        viewportUnit: "vw",
        fontViewportUnit: "vw",
        viewportWidth: 750,
        exclude: [/node_modules\/react-vant/i]
      })
    ]
  }
}