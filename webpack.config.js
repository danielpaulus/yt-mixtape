const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const PermissionsOutputPlugin = require('webpack-permissions-plugin');

var webpack = require('webpack');
module.exports = {
  mode: process.NODE_ENV || "development",
  entry: "./src",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: { publicPath: "dist" }
          }
        ]
      },
      {
        test: /\.node$/,
        use: [
          {
            loader: "native-addon-loader",
            options: { name: "[name]-[hash].[ext]" }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  externals: {
    sqlite3: 'commonjs sqlite3',
    
},
  plugins: [new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.FLUENTFFMPEG_COV': false
  }),
  new CopyPlugin(
    {patterns:[
    { from: 'node_modules/ffmpeg-static/ffmpeg', to: '' },
    { from: 'node_modules/ffprobe-static/bin', to: 'bin' },
]}),
new PermissionsOutputPlugin({
  buildFolders: [
    {
      path:  path.resolve(__dirname, "dist/bin"),
      fileMode: '755',
      dirMode: '755'
    },
  ]
    ,
  buildFiles: [
    {
      path: 'dist/ffmpeg',
      fileMode: '755'
    },]
}),

]
};
