var webpack = require('webpack');
var path = require('path');
var cgBanner = require('cg-components-banner');

var buildPath = path.resolve(__dirname, '.');

var pkg = require('./package.json');
var repoUrl = pkg.repository.url.replace('git+', '');
var banner = pkg.name + ' v' + pkg.version + ' - ' + pkg.description + '\n'
    + 'repo: ' + repoUrl + '\n'
    + cgBanner;

var entry = {};
entry[pkg.name] = [path.resolve(__dirname, './src/index.js')];

module.exports = {
    entry: entry,
    output: {
        path: buildPath,
        filename: pkg.name + '.js'
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin(banner)
    ]
};