const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressbarWebpack = require('progress-bar-webpack-plugin');

module.exports = (options) => {
    const distName = 'dist';
    const packagePath = 'package/';
    const proxyName = 'login';
    if (!options.dev) {
        const dockerContent = 'FROM nginx\r\nCOPY nginx.conf /etc/nginx/nginx.conf\r\nCOPY ' + distName + ' /etc/nginx/' + distName;
        fs.writeFile(packagePath + 'Dockerfile', dockerContent);
    }
    const outputPath = path.resolve(__dirname, packagePath + distName);
    return {
        mode: options.dev ? 'development' : 'production',
        entry: {
            app: './src/index.js',
        },
        output: {
            path: outputPath,
            filename: proxyName + '/' + (options.dev ? '[name].js' : '[name].[chunkhash].js'),
            // publicPath: options.dev ? '/':'',
            publicPath: '',
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        ['import', { libraryName: 'antd', style: true }],
                    ],
                },
            },
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                loader: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules&&localIndexName=[local]-[hash:base64:8]', 'less-loader?sourceMap=true'],
                }),
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader'],
                }),
            }, {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: '8192',
                        },
                    }],
            }, {
                test: /\.(woff|woff2|ttf|eot|svg|otf)\/?.*$/i,
                loader: 'file-loader?name=res/fonts/[path][name].[ext]',
                exclude: /node_modules/,
            }, {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /node_modules/,
            }],
        },
        devtool: options.dev ? 'cheap-module-eval-source-map' : undefined,
        optimization: {
            runtimeChunk: {
                name: 'manifest',
            },
            splitChunks: {
                chunks: 'initial', // 只对入口文件处理
                cacheGroups: {
                    vendor: { // split `node_modules`目录下被打包的代码到 `vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                        test: /node_modules\//,
                        name: 'vendor',
                        priority: 10,
                        enforce: true,
                    },
                    commons: { // split util、components、layouts、page、service目录下被打包的代码到`commons.js && .css`
                        test: /util\/|components\/|layout\/|page\/|service\//,
                        name: 'commons',
                        priority: 10,
                        enforce: true,
                    },
                },
            },
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'src/public',
                    to: options.dev ? outputPath : ('./' + proxyName),
                },
            ]),
            new HtmlWebpackPlugin({
                minify: {
                    removeAttributeQuotes: true,
                },
                hash: true,
                template: './src/index.html',
            }),
            new ExtractTextPlugin('login/[name].[chunkhash].css'),
            new CleanWebpackPlugin(['./package/dist', './build']),
            new ProgressbarWebpack(),
        ],
        devServer: {
            historyApiFallback: true,
            contentBase: path.resolve(__dirname, 'dist'),
            host: 'localhost',
            compress: false,
            port: 8000,
            proxy: [
                // {
                //     context: ['/api/mdm/page'],
                //     pathRewrite: { '^/api/mdm/page': '/page' },
                //     target: 'http://localhost:8011',
                //     secure: false
                // },
                // {
                //     context: ['/api/mdm/relation'],
                //     pathRewrite: { '^/api/mdm/relation': '/page' },
                //     target: 'http://localhost:8011',
                //     secure: false
                // },
                {
                    context: ['/sse', '/manager', '/api', '/hlslive', '/pentaho', '/domain', '/static'],
                    // target: 'https://iiot.jowoiot.com',
                    target: 'http://192.168.3.184',
                    // target: 'http://imc.rexel.com.cn',
                    secure: false,
                    changeOrigin: true,
                    timeout: 0,
                },
                // {
                //     context: ['/#/index'],
                //     target: 'https://iiot.jowoiot.com',
                //     timeout: 0,
                //     changeOrigin: true,
                //     secure: false,
                // },
                // {
                //     context: ['/api/usermanager'],
                //     pathRewrite: { '^/api/usermanager': '/' },
                //     target: 'http://localhost:8012',
                //     secure: false
                // }
            ],
        },
    };
};
