const path = require('path');
module.exports = {
    entry: './client.js',
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    node: {
        fs: 'empty',
        net: 'empty'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [path.resolve(__dirname, 'node_modules')],
            use: {
                loader: 'babel-loader',
            },
        }]
    },
}