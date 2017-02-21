var path = require('path'),
    koa = require('koa'),
    send = require('koa-send'),
    app = new koa();

var config = require('./config'),
    MOCK_PATH = config.mock || 'mock',
    STATIC_PATH = config.static || 'static',
    PAGES_PATH = config.pages || 'pages',
    BUILD_PATH = config.build || 'build',
    DELIMITER = '/',
    JSON_EXT = '.json';

app.use(function*(next) {
    var requestPath, splitedPaths, filePath = '';

    requestPath = this.request.path;

    //得到路径
    splitedPaths = requestPath.split(DELIMITER);

    //如果是mock数据
    var isMock = splitedPaths.indexOf(MOCK_PATH) !== -1;
    if (isMock) {
        //去除.json后缀，保持与后端接口路径一致
        requestPath += requestPath.endsWith(JSON_EXT) ? '' : JSON_EXT;

        filePath = path.join(process.cwd(), requestPath);
    } else {
        //如果不是静态资源，则添加Pages目录
        if (splitedPaths.indexOf(STATIC_PATH) === -1) {
            requestPath = path.join(PAGES_PATH, requestPath);
        }

        filePath = path.join(process.cwd(), BUILD_PATH, requestPath);
    }

    yield send(this, filePath, {
        root: '/',
        index: 'index.html'
    });
});

app.listen(config.port);

console.log('Listening at http://127.0.0.1:' + config.port);
