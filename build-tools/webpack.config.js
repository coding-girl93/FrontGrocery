var extend = require('extend'),
    webpack = require('webpack-stream').webpack,
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    postcssClean = require('postcss-clean'),
    postcssImport = require('postcss-import'),
    config = require('./config'),
    util = require('./util'),
    cwd = process.cwd(),
    path = require('path');

// 获取用户自定义配置
function getCustomConfig(config) {
    //获取webpack用户配置
    var options = config.webpack.options || {},
        opts = util.decideRunFunction(options, config);

    //如果非开发环境，则不打开sourcemap
    (!config.dev || !options.sourcemap) && (opts.devtool = null);

    return opts;
}

function getCssLoader(config) {
    return config.dev && config.style.options.sourcemap ? 'css?sourceMap' : 'css';
}

function getCssLoaders(config) {
    var cssLoader = getCssLoader(config);

    if (config.style.options.extract) {
        return ExtractTextPlugin.extract([cssLoader, 'postcss']);
    } else {
        return ['style', cssLoader, 'postcss'].join('!');
    }
}

function getLessLoaders(config) {
    var cssLoader = getCssLoader(config),
        options = config.style.options;

    if (options.extract) {
        return ExtractTextPlugin.extract([cssLoader, 'postcss', options.suffix]);
    } else {
        return ['style', cssLoader, 'postcss', options.suffix].join('!');
    }
}

function getEjsLoaders(config) {
    var templateDevOptions = !config.dev ? {} : {
            ejs: {
                compileDebug: true
            }
        },
        templateOptions = extend(true, config.template.options, templateDevOptions),
        loaders;

    loaders = 'ejs-template' + '?' + JSON.stringify(templateOptions.ejs);

    return !config.dev ? loaders + '!htmlmin?' + JSON.stringify(templateOptions.min) : loaders;
}

function getEjsOptions(config) {
    return {
        htmlmin: !config.dev,
        htmlminOptions: config.template.options.min
    }
}

function getPostcss(config) {
    return function() {
        var options = config.style.options,
            a = postcssClean(options.min),
            b = autoprefixer(options.autoprefixer),
            //处理import css
            c = postcssImport();

        return !config.dev ? [c, a, b] : [c, b];
    }
}

// 获取loaders
function getLoaders(config) {
    var loaders = [{
        test: /\.vue$/,
        loader: 'vue'
    }, {
        test: /\.json$/,
        loader: 'json'
    }, {
        test: /\.css$/,
        loader: getCssLoaders(config)
    }, {
        test: new RegExp('\.' + config.style.options.suffix + '$'),
        loader: getLessLoaders(config)
    }, {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(cwd, config.src),
        query: {
            presets: config.useReact ? ['react', 'es2015'] : ['es2015']
        }
    }, {
        test: new RegExp('\.' + config.template.options.suffix + '$'),
        loader: getEjsLoaders(config)
    }];

    return loaders;
}

function getVueOptions(config) {
    return {
        loaders: getVueStyleLoaders(),
        postcss: getPostcss(config)
    }
}

function getVueStyleLoaders(options) {
    var options = config.style.options,
        sourcemap = config.dev && options.sourcemap;

    function generateLoaders(loaders) {
        var sourceLoader = loaders.map(function(loader) {
            var extraParamChar
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?')
                extraParamChar = '&'
            } else {
                loader = loader + '-loader'
                extraParamChar = '?'
            }
            return loader + (sourcemap ? extraParamChar + 'sourceMap' : '')
        }).join('!')

        if (options.extract) {
            return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
        } else {
            return ['vue-style-loader', sourceLoader].join('!')
        }
    }

    return {
        css: generateLoaders(['css']),
        less: generateLoaders(['css', 'less'])
    }
}

// 获取插件
function getPlugins(config) {
    var plugins = [
        new ExtractTextPlugin(config.style.options.extractFilename, {
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            '_ENVIRONMENT_': config.environment,
            '_DEVELOPMENT_': config.dev
        })
    ];

    if (!config.dev) {
        plugins.push(new webpack.NoErrorsPlugin());

        //如果非开发环境，则压缩
        plugins.push(new webpack.optimize.UglifyJsPlugin(config.javascript.options.min));
    }

    return plugins;
}

//获取webpack配置
function getWebpackConfig(config) {
    var postcss = getPostcss(config),
        vueRoot = 'vue/dist/vue',
        vueRouterRoot = 'vue-router/dist/vue-router';

    !config.dev && (vueRoot = 'vue/dist/vue.min');

    !config.dev && (vueRouterRoot = 'vue-router/dist/vue-router.min');

    return extend(true, {
        module: {
            loaders: getLoaders(config)
        },

        resolve: {
            extensions: ['', '.js', '.vue'],
            alias: {
                'vue$': vueRoot,
                'vue-router$': vueRouterRoot
            }
        },

        postcss: postcss,

        vue: getVueOptions(config),

        plugins: getPlugins(config),

        //增加异步加载js配置
        output: {
            filename: '[name].js',
            path: path.join(cwd, config.staticPath),
            chunkFilename: path.join(config.chunk, '[chunkhash:10].js'),
            publicPath: config.cdn(config) + "/"
        }
    }, getCustomConfig(config));
}

module.exports = getWebpackConfig(config);
