// webpack.config.js

const path = require("path");

module.exports = {
  // other webpack configurations...

  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
      os: false,
      path: false,
    },
  },
};
