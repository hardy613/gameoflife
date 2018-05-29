const HtmlWebpackPulgin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
	mode: 'development',
	entry: path.resolve(__dirname, 'src/app/index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: [
					/node_modules/
				]
			},
			{
				test: /\.html/,
				loader: 'raw-loader'
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					{	loader: 'style-loader' },
					{	loader: 'css-loader' },
					{	loader: 'sass-loader' }
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPulgin({
			template: path.resolve(__dirname, 'src/public/index.html'),
			inject: 'body'
		})
	],
	devServer: {
		contentBase: path.resolve(__dirname, 'src/public'),
		port: 8000
	}
};
