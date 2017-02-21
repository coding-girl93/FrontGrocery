var path = require('path'),
    git = require('git-rev-sync'),
    del = require('del'),
    replace = require('gulp-replace'),
    chalk = require('chalk'),
    fileset = require('fileset'),
    path = require('path'),
    crypto = require('crypto'),
    cwd = process.cwd();

var util = {
    //获取参数
    getArguments: function(config) {
        return {
            //仓库组名
            group: config.group,
            //项目名称
            name: config.name,
            //版本号
            version: config.version,
            //hash串，如果为文件hash，则为空串
            hash: config.hash,
            //静态资源目录名称
            static: config.static,
            //当前环境变量
            environment: config.environment,
            //是否是开发环境
            dev: config.dev,
            //是否为mock环境
            mock:config.mock
        }
    },

    //决定采用函数运行还是字符串运行
    decideRunFunction: function(arg, config) {
        return typeof arg === 'function' ? arg(this.getArguments(config)) : arg;
    },

    //获取替换串
    getReplaceString: function(name, leftDelimiter, rightDelimiter) {
        return leftDelimiter && rightDelimiter ? leftDelimiter + name + rightDelimiter : name;
    },

    getGitVersion: function(config) {
        var defaultBranch = '0.0.0';

        try{
            var matchs = /publish\/([\d|\.]+)/ig.exec(git.branch());

            if (!matchs && !config.dev && !config.mock) {
                console.log(chalk.bold.red('切换到publish分支，确保版本递增。'));
                process.exit(1);
            }
            return matchs && matchs[1] || defaultBranch;
        }catch(e){
            return defaultBranch
        }
    },

    //获取git提交hash戳
    getGitCommitHash: function() {
        try{
            return git.short();
        }catch(e){
            return null;
        }

    },

    //获取版本号，默认以当前时间与随机数生成的md5戳，取前10位
    getRandomHash: function() {
        var md5 = crypto.createHash('md5'),
            date = new Date(),
            str = date.getTime().toString(),
            hash;
        md5.update(str);
        hash = md5.digest('hex').substr(0, 7);

        console.log(chalk.green('随机目录hash: ' + hash));
        return hash;
    },

    getHash: function() {
        return this.getGitCommitHash() || this.getRandomHash();
    },

    //替换变量
    replace: function(stream, config) {
        var replaceSettings = config.replace;

        replaceSettings.data && replaceSettings.data.forEach(function(value) {
            //获取替换字符串
            var replaceString = util.getReplaceString(value.name, replaceSettings.options.leftDelimiter, replaceSettings.options.rightDelimiter);
            //替换变量
            stream = stream.pipe(replace(replaceString, util.decideRunFunction(value.value, config)));
        });

        return stream;
    },

    //删除目录
    clean: function(config) {
        del.sync(config.build);
    },

    getEnvironment: function() {
        var env = {
                //标志环境配置变量，默认为线上环境
                environment: 3,
                //是否是开发环境
                dev: false
            },
            argv;

        try {
            argv = process.argv.pop();

            if (argv === '--dev') {
                env = {
                    dev: true,
                    environment: 0
                }
            } else if (argv === '--dev-daily') {
                env = {
                    dev: true,
                    environment: 1
                }
            } else if (argv === '--dev-pre') {
                env = {
                    dev: true,
                    environment: 2
                }
            } else if (argv === '--dev-prod') {
                env = {
                    dev: true,
                    environment: 3
                }
            } else if (argv === '--mock-daily') {
                env = {
                    dev: false,
                    mock:true,
                    environment: 1
                }
            } else if (argv === '--mock-pre') {
                env = {
                    dev: false,
                    mock:true,
                    environment: 2
                }
            } else if (argv === '--mock-prod') {
                env = {
                    dev: false,
                    mock:true,
                    environment: 3
                }
            } else if (argv === '--daily') {
                env = {
                    dev: false,
                    environment: 1
                }
            } else if (argv === '--pre') {
                env = {
                    dev: false,
                    environment: 2
                }
            } else if (argv === '--prod') {
                env = {
                    dev: false,
                    environment: 3
                }
            }
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
        return env;
    },

    // 获取需忽略的目录
    getIgnoreSource: function(config, suffix) {
        var source = ['!' + path.join(config.src, config.component, '/**/*.' + suffix),
            '!' + path.join(config.src, config.common, '/**/*.' + suffix),
            '!' + path.join(config.src, config.lib, '/**/*.' + suffix),
            '!' + path.join(config.src, config.asset, '/**/*.' + suffix)
        ];
        return source;
    },

    getPagesTemplateSource: function(config){
        return path.join(config.src, '**', config.tpl, '/**/*.' + config.template.options.suffix);
    },

    // 获取模板资源
    getTemplateSource: function(config){
        var suffix = config.template.options.suffix;

        return [
            path.join(config.src, config.component, '/**/*.' + suffix),
            path.join(config.src, config.common, '/**/*.' + suffix),
            path.join(config.src, config.module, '/**/*.' + suffix),
            this.getPagesTemplateSource(config)
        ];
    },

    getEntry: function(config) {
        var exclude = [path.join(cwd, config.src, config.lib, '/**/*.js'), path.join(cwd, config.src, config.common, '/**/*.js'), path.join(cwd, config.src, config.component, '/**/*.js')].join(' '),
            results = fileset.sync(path.join(cwd, config.src, '/**/*.js'), exclude),
            entry = {};

        results.forEach(function(file) {
            var filename = path.dirname(file.replace(path.join(cwd, config.src), '')) + '/' + path.basename(file, '.js');
            entry[filename] = [file];
        });

        Object.keys(entry).forEach(function(name) {
            entry[name] = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'].concat(entry[name])
        });

        return entry;
    }
};

module.exports = util;
