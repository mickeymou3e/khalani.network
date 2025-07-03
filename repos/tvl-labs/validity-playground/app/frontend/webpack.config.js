const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './index.js',
	output: {
		path: `${__dirname}/dist`,
		filename: '_app.js'
	},

	module: {
		
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			},
			{
				test: /\.(gif|svg|jpg|png)$/,
				use: ['file-loader']
			},
		
            {
                test:/\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
		]
	},
	plugins: [
        new MonacoWebpackPlugin(),
        new HtmlWebpackPlugin({template: `${__dirname}/index.html`})
    ],
	devServer: {
		port: 9000,
		proxy: {
			'/validity': 'http://localhost:3000',
		  },
	}
};