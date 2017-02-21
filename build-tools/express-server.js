var config = require('./config')
var util = require('./util')
var path = require('path')
var cwd = cwd = process.cwd()
var express = require('express')
var router = express.Router()
var webpack = require('webpack-stream').webpack
var webpackConfig = require('./webpack.config')

// default port where dev server listens for incoming traffic
var port = config.port

var app = express()

webpackConfig.entry = util.getEntry(config)

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: '/',
    stats: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler,{
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        })
        cb()
    })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

app.use('/static', express.static(path.join(cwd, config.build, config.static)))

//app.use('/mock', express.static(path.join(cwd, config.mock)))

app.all('/mock/*',function(req,res,next){
    var filepath  = req.path + '.json';

    console.log(path.join(cwd, filepath))

    res.sendFile(path.join(cwd, filepath));

    res.end();
});

app.use('/', express.static(path.join(cwd, config.build,config.pages)))

module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
})
