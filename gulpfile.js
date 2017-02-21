var gulp = require('gulp'),
    extend = require('extend'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    spritesmith = require('gulp.spritesmith'),
    concat = require('gulp-concat'),
    named = require('vinyl-named'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack-stream').webpack,
    ejs = require('gulp-ejs'),
    usemin = require('gulp-usemin'),
    runSequence = require('run-sequence'),
    eslint = require('gulp-eslint'),
    csslint = require('gulp-csslint'),
    autoprefixer = require('autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    postcssClean = require('postcss-clean'),
    postcssImport = require('postcss-import'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    path = require('path'),
    fs = require('fs'),
    util = require('./build-tools/util'),
    config = require('./build-tools/config'),
    webpackConfig = require('./build-tools/webpack.config');

gulp.task('server', function() {
    connect.server({
        root: ['./', path.join(config.build), path.join(config.build, config.pages)],
        port: config.port,
        host: 'h5.dev.weidian.com',
        middleware: function(connect, options) {
            return [
                function a(req, res, next) {
                    if (req.url.indexOf('mock') !== -1 && req.url.indexOf('.json') == -1) {
                        req.url = req.url.replace(/\?.*/, '') + '.json';
                    }
                    next();
                },
                function(req, res, next) {
                    var filepath = path.join('./', req.url);
                    if ('POSTPUTDELETE'.indexOf(req.method.toUpperCase()) > -1 && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                        return res.end(fs.readFileSync(filepath));
                    }
                    return next();
                }
            ];
        },
        livereload: config.dev ? {
            port: config.port + 10000
        } : false
    });
});

function handlerWebpack(watch) {
    var opts = extend(webpackConfig, {
        watch: watch
    });

    var source = [path.join(config.src, config.pages, '/**/*.js'), path.join(config.src, config.module, '/**/*.js')],
        stream;

    stream = gulp.src(source)
        .pipe(named(function(file) {
            var args = path.parse(file.path),
                basenameParent = args.dir.replace(new RegExp('^' + path.resolve(config.src) + '\/?'), '');

            return path.join(basenameParent, args.name);
        }))
        .pipe(webpackStream(opts));

    //替换变量
    stream = util.replace(stream, config);

    stream = stream.pipe(gulp.dest(path.join(config.staticPath)));

    config.dev && stream && (stream = stream.pipe(connect.reload()));

    return stream;
}

//js
gulp.task('js', function() {
    return !config.dev ? handlerWebpack(false) : null;
});

//watch
gulp.task('watch', ['default'], function(cb) {
    //模板没有包含pages中的模板，因为不建议这么做，如果pages包含模板也不能是嵌套模板
    var templateSource = util.getTemplateSource(config),
        styleOptions = config.style.options,
        cssSource;

    // watch html
    var source = [path.join(config.src, config.pages, '/**/*.' + config.page.options.suffix)].concat(templateSource);
    gulp.watch(source, function() {
        gulp.start('html');
    });

    cssSource = [path.join(config.src, '/**/*.{' + styleOptions.suffix + ',css}')];

    // watch css & assets
    source = cssSource.slice(0);

    // add assets
    config.assets && source.push(path.join(config.src, '/**/', config.assets));
    gulp.watch(source, function() {
        gulp.start('css');
    });

    // watch lib files
    source = [path.join(config.src, config.lib, '**/*')];
    gulp.watch(source, function() {
        gulp.start('concat');
    });

    //watch js & template
    //嵌套模板，无法被webpack监听
    //嵌套样式文件，无法被webpack监听
    source = templateSource;
    !config.useVue && styleOptions.extract && source.push(cssSource);
    gulp.watch(source, function() {
        handlerWebpack(false);
    });

    handlerWebpack(true);
});

gulp.task('default', function(cb) {
    //删除目录
    util.clean(config);

    runSequence('copyassets', ['js', 'css', 'concat'], 'html', cb);
});

gulp.task('copyassets', function() {
    //不建议使用，图片建议采用先上传，使用绝对路径

    //如果assets为空，则直接返回
    if (!config.assets) {
        return null;
    }

    var source = path.join(config.src, '/**/', String(config.assets)),
        stream = gulp.src(source);

    stream = stream.pipe(gulp.dest(config.staticPath));

    config.dev && stream && (stream = stream.pipe(connect.reload()));

    return stream;
});

gulp.task('concat', function() {
    var data = config.concat.data,
        options = config.concat.options,
        styleOptions = config.style.options,
        stream, processors = [];

    data && data.forEach(function(value) {
        //获取路径数组
        var arys = value.source;

        //文件名以key命名
        stream = gulp.src(arys)
            .pipe(concat(value.name, {
                newLine: value.newline == undefined ? options.newline : value.newline
            }));

        //替换变量
        stream = util.replace(stream, config);

        //处理不同文件
        if (value.type == 'js') {

            !config.dev && (stream = stream.pipe(uglify(config.javascript.options.min)));

        } else if (value.type == 'css') {
            processors = [];

            //如果非开发环境，则压缩CSS
            !config.dev && (processors.push(postcssClean(styleOptions.min)));

            stream = stream.pipe(postcss(processors));

        } else if (value.type == styleOptions.suffix) {

            stream = stream.pipe(styleOptions.process());

            processors = [
                postcssImport(),
                autoprefixer(styleOptions.autoprefixer)
            ];

            //如果非开发环境，则压缩CSS
            !config.dev && (processors.push(postcssClean(styleOptions.min)));

            stream = stream.pipe(postcss(processors));
        }

        //输出到指定目录
        stream = stream.pipe(gulp.dest(util.decideRunFunction(value.output, config)));
    });

    config.dev && stream && (stream = stream.pipe(connect.reload()));

    return stream;
});

gulp.task('css', function() {
    var options = config.style.options,
        suffix = options.suffix,
        source = [path.join(config.src, config.pages, '/**/*.' + suffix), path.join(config.src, config.module, '/**/*.' + suffix)],
        stream = gulp.src(source, {
            base: config.src
        });

    config.dev && options.sourcemap && (stream = stream.pipe(sourcemaps.init()));

    stream = stream.pipe(options.process());

    var processors = [
        postcssImport(),
        autoprefixer(config.style.autoprefixer)
    ];

    //如果非开发环境，则压缩CSS
    !config.dev && (processors.push(postcssClean(options.min)));

    stream = stream.pipe(postcss(processors));

    //替换变量
    stream = util.replace(stream, config);

    config.dev && options.sourcemap && (stream = stream.pipe(sourcemaps.write()));

    stream = stream.pipe(gulp.dest(path.join(config.staticPath)));

    config.dev && stream && (stream = stream.pipe(connect.reload()));

    return stream;
});

gulp.task('html', function() {
    var options = config.page.options,
        suffix = options.suffix,
        source = [path.join(config.src, config.pages, '/**/*.' + suffix), '!' + util.getPagesTemplateSource(config)],
        stream;

    stream = gulp.src(source);

    //编译模板
    if (options.compile) {
        if (config.template.options.name === 'ejs') {
            stream = stream.pipe(ejs({
                '_ENVIRONMENT_': config.environment,
                '_DEVELOPMENT_': config.dev
            }));
        }
    }

    //将css 与 js嵌入到html中
    !config.dev && (stream = stream.pipe(usemin({
        //配置到build目录下
        path: path.resolve(config.staticPath),
        enableHtmlComment: true
    })));

    //替换变量
    stream = util.replace(stream, config);

    //如果非开发环境，则压缩CSS
    !config.dev && (stream = stream.pipe(htmlmin(options.min)));

    stream = stream.pipe(gulp.dest(config.pagesPath));

    config.dev && stream && (stream = stream.pipe(connect.reload()));

    return stream;
});

gulp.task('sprite', function() {
    // less 无法支持 . 命名

    var data = config.sprite.data,
        length = data.length;

    for (var i = 0; i < length; i++) {

        var opts = extend(true, {
                //设置css文件中image路径地址
                imgPath: 'images/' + data[i].imgName,
            }, config.sprite.options, data[i]),
            stream, imgStream, cssStream;

        stream = gulp.src(opts.source);

        stream = stream.pipe(spritesmith(opts));

        imgStream = stream.img
            //输出路径会跟随imgName路径变换
            .pipe(gulp.dest(util.decideRunFunction(opts.imgOutput, config)));

        cssStream = stream.css
            .pipe(gulp.dest(util.decideRunFunction(opts.cssOutput, config)));
    }
    return cssStream;
});

//eslint
gulp.task('eslint', function() {
    var source = [path.join(config.src, '/**/*.{js,vue}'), '!' + path.join(config.src, config.lib, '/**/*.js')];
    return gulp.src(source)
        .pipe(eslint())
        .pipe(eslint.format())
        //.pipe(eslint.failAfterError());
});

//csslint
gulp.task('csslint', ['default'], function() {
    var source = [path.join(config.build, '**/*.css')];
    return gulp.src(source)
        .pipe(csslint())
        .pipe(csslint.reporter());
});

//dev
gulp.task('dev',['server'], function(cb) {
    gulp.start('watch');
});
