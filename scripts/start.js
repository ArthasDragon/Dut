const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const devConfig = require('../config/webpack.config.dev')

const complier = webpack(devConfig)

const serverOptions = {}

const server = new webpackDevServer(complier, serverOptions)

server.listen('3000', '127.0.0.1', () => {})
