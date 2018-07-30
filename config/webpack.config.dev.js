const paths = require("./paths");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const loaders = require("./loaders");
const happyPacks = require("./happyPacks");
const webpack = require("webpack");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");

module.exports = {
	mode: "development",
	entry: [require.resolve("./polyfills"), paths.appIndexJs],
	output: {
		path: path.resolve(__dirname, "dist"),
		chunkFilename: "[name].chunk.js",
		filename: "[name].min.js"
	},
	module: {
		rules: loaders
	},
	resolve: {
		alias: {
			react: path.resolve(__dirname, "../dist/Dut.js")
		}
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({ template: "template/index.html" }),
		new OpenBrowserPlugin({
			url: `http://localhost:1234`
		}),
		...happyPacks
	],
	devtool: "cheap-module-eval-source-map"
};
