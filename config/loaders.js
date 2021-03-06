const paths = require("./paths");
const generateCssLoader = require("./generateCssLoader");
const path = require("path");

module.exports = [
	{
		test: /\.jsx?$/,
		exclude: paths.appNodeModules,
		use: "happypack/loader?id=jsx"
	},
	generateCssLoader({
		include: paths.appSrc,
		happyId: "css_modules_post"
	}),
	generateCssLoader({
		include: paths.appNodeModules,
		happyId: "css"
	}),
	{
		test: /\.jsx?$/,
		loader: "eslint-loader",
		enforce: "pre",
		include: path.join(__dirname, "../src")
	},
	{
		test: /\.(jpe?g|png|gif|svg)$/,
		use: {
			loader: "url-loader",
			options: {
				limit: 10000,
				name: "images/[name].[hash:8].[ext]"
			}
		}
	},
	{
		test: /\.(woff2?|eot|ttf|otf)$/,
		use: {
			loader: "file-loader",
			options: {
				name: "fonts/[name].[ext]"
			}
		}
	}
];
