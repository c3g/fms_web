const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: ["babel-polyfill", path.resolve(__dirname, "./src/index.js")],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "bundle.js",
        chunkFilename: "[name].bundle.js"
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "FreezeMan",
            favicon: './src/static/favicon-16x16.png',
            template: path.resolve(__dirname, "./src/template.html"),
            hash: true,
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        historyApiFallback: true,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
            },
        },
    },
};
