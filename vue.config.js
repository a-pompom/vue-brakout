module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/global.scss";`
      }
    }
  },
  publicPath: "./",
  assetsDir: "",
  outputDir: "dist"
};