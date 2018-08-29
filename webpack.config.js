const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const progressbarWebpack = require('progress-bar-webpack-plugin');
module.exports = (options, webpackConfig) => {
    const distName = "dist"
    const packagePath = 'package/'
    //const proxyName = 'login'
    if (!options.dev) {
        const dockerContent = "FROM nginx\r\nCOPY nginx.conf /etc/nginx/nginx.conf\r\nCOPY " + distName + " /etc/nginx/" + distName
        fs.writeFile(packagePath + "Dockerfile", dockerContent)
    }
    const output_path = path.resolve(__dirname, packagePath + distName)
    return {
        mode: options.dev ? 'development' : 'production',
        entry: {
            app: './src/index.js',
        },
        output: {
            path: output_path,
            filename:  options.dev ? '[name].js' : '[name].[chunkhash].js',
            // publicPath: options.dev ? '/':'',
            publicPath: "login/",
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        ['import', { libraryName: "antd", style: true }]
                    ]
                },
            }, {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            }, {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: '8192'
                        }
                    }]
            }, {
                test: /\.(woff|woff2|ttf|eot|svg|otf)\/?.*$/i,
                loader: 'file-loader?name=res/fonts/[path][name].[ext]',
                exclude: /node_modules/,
            }, {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /node_modules/,
            }]
        },
        devtool: options.dev ? "cheap-module-eval-source-map" : undefined,
        optimization: {
            runtimeChunk: {
                name: "manifest"
            },
            splitChunks: {
                chunks: 'initial', // 只对入口文件处理
                cacheGroups: {
                    vendor: { // split `node_modules`目录下被打包的代码到 `vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                        test: /node_modules\//,
                        name: 'vendor',
                        priority: 10,
                        enforce: true
                    },
                    commons: { // split util、components、layouts、page、service目录下被打包的代码到`commons.js && .css`
                        test: /util\/|components\/|layout\/|page\/|service\//,
                        name: 'commons',
                        priority: 10,
                        enforce: true
                    }
                }
            }
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'src/public',
                    to: output_path,
                },
            ]),
            new HtmlWebpackPlugin({
                minify: {
                    removeAttributeQuotes: true
                },
                hash: true,
                template: './src/index.html'

            }),
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new cleanWebpackPlugin(['./package/dist', './build']),
            new progressbarWebpack()
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
                    //target: 'http://iiot.jowoiot.com',
                    target: 'http://192.168.3.184',
                    // target: 'http://imc.rexel.com.cn',
                    secure: false,
                    changeOrigin: true,
                    timeout: 0,
                },
                // {
                //     context: ['/sse'],
                //     target: 'http://localhost:8081',
                //     timeout: 0,
                //     changeOrigin: true,
                //     secure: false
                // }
                // {
                //     context: ['/api/usermanager'],
                //     pathRewrite: { '^/api/usermanager': '/' },
                //     target: 'http://localhost:8012',
                //     secure: false
                // }
            ]
        },
    }
}