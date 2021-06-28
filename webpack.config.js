const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            inject: "body",
            minify: false,
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}