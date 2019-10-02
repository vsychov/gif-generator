const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    configureWebpack: {
        plugins: [
            new CopyPlugin([
                {from: './node_modules/gif.js/dist/gif.js', to: './node_modules/ccapture.js/src/gif.js'},
                {from: './node_modules/gif.js/dist/gif.worker.js', to: './js/gif.worker.js'},
            ]),
        ],
    }
};
