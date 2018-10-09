var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: "./src/main.js", //我们开发时的入口文件
    output: {path: path.join(__dirname, "./dist"), filename: "bundle.js"}, //页面引用的文件
    devtool: 'cheap-module-eval-source-map',
    module: {
        loaders: [
            {test:/\.jsx$/, loader:['jsx?harmony']},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname),
                query: {
                    //添加两个预先加载的组件，用来处理js或jsx类型的文件
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}
