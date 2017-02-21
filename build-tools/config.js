var extend = require('extend'),
    less = require('gulp-less'),
    path = require('path'),
    config = require('../hap.config'),
    util = require('./util');

//项目配置
config = extend(true, {
    src: 'src',
    dist: 'dist',
    build: 'build',

    chunk: 'chunk',
    asset: 'assets',
    common: 'common',
    component: 'component',
    module: 'module',
    lib: 'lib',
    pages: 'pages',
    tpl: 'template',
    static: 'static',
    logs: 'logs',

    //标志环境配置变量，默认为线上环境
    environment: 3,

    //是否是开发环境
    dev: false,

    //需拷贝的静态资源
    assets: '', //'*.{jpg,png,gif}'

    cdn: function(args) {
        var staticUrl = path.join(args.group, args.name, args.version, args.hash),
            devStaticUrl = path.join('/', args.static, args.hash);

        if (args.dev || args.mock) {
            return devStaticUrl;
        }

        switch (args.environment) {
            case 0:
                return devStaticUrl;
            case 1:
                return '//assets.daily.geilicdn.com/' + staticUrl;
            case 2:
                return '//assets.pre.geilicdn.com/' + staticUrl;
            default:
                return '//assets.geilicdn.com/' + staticUrl;
        }
    },

    //是否使用react
    useReact: false,

    useVue: false,

    webpack: {
        options: {
            sourcemap: true,
            devtool: 'source-map'
        }
    },

    page: {
        options: {
            suffix: 'html',
            compile: true,
            min: {
                //htmlmin config
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }
        }
    },

    template: {
        options: {
            suffix: 'html',
            name: 'ejs',
            ejs: {
                //ejs config
                compileDebug: false,
                debug: false
            },
            min: {
                //htmlmin config
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }
        }
    },

    javascript: {
        options: {
            min: {
                //不进行 compressor 处理
                compress: {
                    warnings: false
                }
            }
        }
    },

    style: {
        options: {
            suffix: 'less',
            process: less,
            sourcemap: true,
            extract: true,
            extractFilename: '[name].extract.css',
            min: {
                advanced: false,
                aggressiveMerging: false,
                processImport: false,
                mediaMerging: false
            },
            autoprefixer: {
                //browsers: ['last 2 versions']
            }
        }
    },

    concat: {
        options: {
            newline: '\n'
        }
    },

    sprite: {
        options: {
            padding: 0,
            algorithm: 'top-down',
            sort: true
        }
    },

    replace: {
        options: {
            leftDelimiter: '$$_',
            rightDelimiter: '_$$'
        }
    }
}, config);

var updateConfig = function(config) {
    var env = util.getEnvironment();

    // 是否为开发环境
    config.dev = env.dev;

    config.mock = env.mock;

    // 环境
    config.environment = env.environment;

    //目录hash
    config.hash = util.getHash();

    //版本号
    config.version = util.getGitVersion(config);

    //静态资源输出路径
    config.staticPath = path.join(config.build, config.static, config.hash);

    //页面输出路径
    config.pagesPath = path.join(config.build, config.pages);

    // replace 功能
    var replaceData = [{
        //静态资源路径
        name: 'static_url',
        value: config.cdn(config)
    }, {
        //环境变量
        name: 'environment',
        value: function(args) {
            return args.environment;
        }
    }];

    config.replace.data = (config.replace.data || []).concat(replaceData);
};

updateConfig(config);

module.exports = config;
