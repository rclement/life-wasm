const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: "./bootstrap.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },

  mode: process.env.NODE_ENV,

  module: {
    rules: [{
      test: /\.(css|sass|scss)$/,
      use: [
        "style-loader",
        "css-loader", // translates CSS into CommonJS
        "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]
    }]
  },

  plugins: [
    new CopyWebpackPlugin(["index.html", ".nojekyll"])
  ],
};
