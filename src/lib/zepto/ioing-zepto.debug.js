(function () {
    'use strict'

    // module && components css style reset

    /*
     * scrolling > z-index : 1 !important 提升android手机中的性能关键
     */

    window.CSSBaseStyle = '* { user-select: none; user-drag : none; tap-highlight-color: rgba(0, 0, 0, 0); touch-callout: none; margin : 0; padding : 0; box-sizing: border-box } \n'
                        + 'html, body { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1; background: #fff; color: #000; font-size: 10dp; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; overflow: hidden } \n'
                        + 'a { text-decoration: none } \n'
                        + 'button { background-color: transparent; border: 0; outline: 0 } \n'
                        + 'input, textarea, *[contenteditable=true] { user-select: initial; touch-callout: initial; border: 0; outline: 0 } \n'
                        + 'htmlarea { display: inline-block; text-rendering: auto; letter-spacing: normal; word-spacing: normal; text-indent: 0px; text-align: start; font: initial }'
                        + 'article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block } \n'
                        + 'ol, ul { list-style: none } \n'
                        + 'table { border-collapse: collapse; border-spacing: 0 } \n'
                        + 'scroll, scrolling, scrollbar, indicator { display: block; box-sizing: border-box } \n'
                        + 'scroll { position: relative; overflow: hidden } \n'
                        + 'scroll[fullscreen] { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1 }'
                        + 'scroll scrolling { position: absolute; z-index: 1 } \n'
                        + 'scroll[flow-x] > scrolling { display: flex }'
                        + 'scroll[flow-y] > scrolling { min-width: 100% }'
                        + 'scroll[flow-free] > scrolling { min-width: 100%; min-height: 100% }'
                        + 'scroll scrollbar { position: absolute; z-index: 9999; border-radius: 2.5dp; overflow: hidden } \n'
                        + 'scroll scrollbar indicator { position: absolute; z-index: 1; border-radius: 2.5dp; background: rgba(0, 0, 0, 0.4) } \n'




    /*=============================================================================*/



    
    // viewportScale

    window.viewportScale = (function () {

        // init viewport {{

        document.write('<meta id="viewport" name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">')

        // mark document init width
        
        var windowInitWidth = window.innerWidth
        var documentElementInitWidth = document.documentElement.offsetWidth

        var viewport = document.getElementById('viewport')

        // remove test viewport

        viewport.parentNode.removeChild(viewport)

        // setting new viewport

        var scale = 1 / devicePixelRatio
        
        document.write('<meta name="viewport" content="width=device-width,initial-scale=' + scale + ',minimum-scale=' + scale + ',maximum-scale=' + scale + ',user-scalable=no' + (devicePixelRatio > 2 ? '' : ',target-densitydpi=device-dpi')  + '" />')

        /* viewport is ok?
         * 由屏幕斜角排列导致dpi缩放不精准，宽度相减值应小于 w * 0.01
         * devicePixelRatio floor * documentElementInitWidth 在某些设备上约等于实际像素
         * document.documentElement.offsetWidth 在部分手机中渲染完会发生变更
         */

        var viewportScale = ((Math.abs(windowInitWidth * devicePixelRatio - window.innerWidth) < window.innerWidth * 0.01) || (Math.abs(documentElementInitWidth * devicePixelRatio - document.documentElement.offsetWidth) < window.innerWidth * 0.01)) && window.innerWidth != window.screen.width ? devicePixelRatio : null

        // rest viewport

        if ( viewportScale == null ) {
            document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">')

            viewportScale = 1
        }

        // }}

        // append bace css

        document.write('<style>* { margin : 0; padding : 0 } \n module-container { background: #fff } \n</style>')

        return viewportScale

    })()




    /*=============================================================================*/


    

    // ELEMENT

    var _ELEMENT = document.createElement('div')
      , _STYLE = _ELEMENT.style


    // 设备属性检测

    var OS = (function (userAgent) {

        this.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false
        this.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false
        this.androidICS = this.android && userAgent.match(/(Android)\s4/) ? true : false
        this.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false
        this.iphone = !this.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false
        this.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false
        this.touchpad = this.webos && userAgent.match(/TouchPad/) ? true : false
        this.ios = this.ipad || this.iphone
        this.playbook = userAgent.match(/PlayBook/) ? true : false
        this.blackberry10 = userAgent.match(/BB10/) ? true : false
        this.blackberry = this.playbook || this.blackberry10|| userAgent.match(/BlackBerry/) ? true : false
        this.chrome = userAgent.match(/Chrome/) ? true : false
        this.opera = userAgent.match(/Opera/) ? true : false
        this.fennec = userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false
        this.ie = userAgent.match(/MSIE 10.0/i) ? true : false
        this.ieTouch = this.ie && userAgent.toLowerCase().match(/touch/i) ? true : false
        this.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window)

        // 主流系统版本检测

        if ( this.ios ) this.iosVersion = parseFloat(userAgent.slice(userAgent.indexOf("Version/")+8)) || -1
        if ( this.android && !this.webkit ) this.android = false
        if ( this.android ) this.androidVersion = parseFloat(userAgent.slice(userAgent.indexOf("Android")+8)) || -1

        return this

    }).call({}, navigator.userAgent)

    // DETECT

    var DETECT = (function (userAgent) {
                
        // features - 功能检测 or 返回最适合特性

        this.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
        this.vendor = OS.webkit ? "Webkit" : OS.fennec ? "Moz" : OS.ie ? "ms" : OS.opera ? "O" : ""
        this.prefix = OS.webkit ? "-webkit-" : OS.fennec ? "-moz-" : OS.ie ? "-ms-" : OS.opera ? "-O-" : ""
        this.cssTransformStart = !OS.opera ? "3d(" : "("
        this.cssTransformEnd = !OS.opera ? ",0)" : ")"
        
        // viewport 起效检测

        this.viewportScale = window.viewportScale

        // js or css 前缀支持

        var _JSPROPMAPS = {}
          , _CSSPROPMAPS = {}
          , VENDORS  = ['webkit', 'Moz', 'ms', 'O']
          , PREFIXS  = ['-webkit-', '-moz-', '-ms-', '-O-']

        this.prefixStyle = function (prop, css) {
            var api

            if ( css && prop in _CSSPROPMAPS ) {
                return _CSSPROPMAPS[prop]
            } else if ( !css && prop in _JSPROPMAPS ) {
                return _JSPROPMAPS[prop]
            }
            
            for ( var i = 0, l = VENDORS.length; i < l; i++ ) {
                api = VENDORS[i] + ('-' + prop).replace(/-(\w)/g,function () { return arguments[1].toUpperCase() })
                if ( api in _STYLE ) return css ? _CSSPROPMAPS[prop] = PREFIXS[i] + prop : _JSPROPMAPS[prop] = api
            }

            if ( prop in _STYLE ) return css ? _CSSPROPMAPS[prop] = prop : _JSPROPMAPS[prop] = prop

            return css ? _CSSPROPMAPS[prop] = prop : _JSPROPMAPS[prop] = false
        }

        // getPrefixStyleProp

        this.getPrefixStyleProp = function (prop) {
            if ( prop in _CSSPROPMAPS ) return _CSSPROPMAPS[prop]

            for ( var i = 0, l = VENDORS.length; i < l; i++ ) {
                var prefix = VENDORS[i] + ('-' + prop).replace(/-(\w)/g, function (context, word) { return word.toUpperCase() })

                if ( prefix in _STYLE ) {
                    return _CSSPROPMAPS[prop] = PREFIXS[i] + prop
                }
            }

            return _CSSPROPMAPS[prop] = prop
        }

        this.hasTranslate3d = this.prefixStyle('transform') && window.getComputedStyle ? true : false

        // This should find all Android browsers lower than build 535.19 (both stock browser and webview)

        this.isBadTransition = (OS.android && OS.androidVersion < 6.5) || (OS.ios && OS.iosVersion < 6) || (!OS.ios && !OS.android) || !OS.webkit || !this.hasTranslate3d

        this.isBadAndroid = devicePixelRatio < 2 && screen.width < 640 && OS.androidVersion < 3

        // 是否支持observer
        
        this.observer = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver) ? true : false

        // 是否支持ShadowRoot

        this.shadowRoot = document.documentElement.createShadowRoot ? true : false

        // 是否支持svg

        this.svg = window.SVGAngle ? true : false 

        // 是否支持贞动画

        this.keyframes = (window.CSSRule.WEBKIT_KEYFRAMES_RULE || window.CSSRule.MOZ_KEYFRAMES_RULE || window.CSSRule.MS_KEYFRAMES_RULE || window.CSSRule.O_KEYFRAMES_RULE) ? true : false
        
        // 获取贞动画前缀

        this.keyframesPrefix = window.CSSRule.WEBKIT_KEYFRAMES_RULE ? '-webkit-' : false || window.CSSRule.MOZ_KEYFRAMES_RULE ? '-moz-' : false || window.CSSRule.MS_KEYFRAMES_RULE ? '-ms-' : false || window.CSSRule.O_KEYFRAMES_RULE ? '-o-' : false || ''

        // 支持动画

        this.supportTransition = this.keyframes

        // iframeInputBlurBug

        this.iframeInputBlurBug = OS.ios && OS.iosVersion < 9

        //判断浏览器是否支持DOM树结构改变

        this.mutations = (function () {
            var type = [
                    "DOMSubtreeModified",
                    "DOMNodeInserted",
                    "DOMNodeRemoved",
                    "DOMNodeRemovedFromDocument",
                    "DOMNodeInsertedIntoDocument",
                    "DOMAttrModified",
                    "DOMCharacterDataModified"
                ]
              , documentElement = document.documentElement
              , method = "EventListener"
              , data = "deleteData"
              , p = document.createElement("p")
              , mutations = {}
              , i

            function check(addOrRemove) {
                for (i = type.length; i--;) {
                    p[addOrRemove](type[i], cb, false)
                    documentElement[addOrRemove](type[i], cb, false)
                }
            }

            function cb(e) {
                mutations[e.type] = true
            }

            check("add" + method)

            documentElement.insertBefore(
                p,
                documentElement.lastChild
            )

            p.setAttribute("i", i)
            p = p.appendChild(document.createTextNode(i))
            data in p && p[data](0, 1)
            documentElement.removeChild(p = p.parentNode)
            check("remove" + method)
            return (p = mutations)

        }())

        return this

    }).call({}, navigator.userAgent)




    /*=============================================================================*/


    

    // Define

    var Define = function (window) {

        var step = {}
        var modules = {}
        var handlerMap = {}
        var loadedFiles = {}
        var requireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/ig

        function addEventListener (topic, handler) {
            var handlers = handlerMap[topic]
            
            if ( handlers == null ) {
                handlerMap[topic] = []
            }

            handlerMap[topic].push(handler)
        }

        function addEventListeners (topics, handler) {
            var counter = 0
            
            for (var i = 0; i < topics.length; i++) {
                var topic = topics[i]
                var handlers = handlerMap[topic]

                if ( handlers == null ) {
                    handlerMap[topic] = []
                }

                handlerMap[topic].push(function (result){
                    if ( (++counter) === topics.length ) {
                        return handler(result)
                    } else {
                        return null
                    }
                })
            }
        }

        function dispatchEvent (topic, event) {
            var handlers = handlerMap[topic]
            if( handlers != null ) {
                for (var i=0; i<handlers.length; i++) {
                    handlers[i](event)
                }
            }
        }
      
        function Module (name, deps, body) {
            this.name = name
            this.deps = deps
            this.body = body
            this.exports = {}
            this.created = false
        }

        Module.prototype.create = function () {
            if ( this.created ) return
            this.created = true

            dispatchEvent('moduleExecute', this)

            this.body(this.getExports, this, this.exports)
            dispatchEvent(this.name, this)
        }

        Module.prototype.getExports = function (name, callback) {
            return !callback ? modules[name].exports : define('argument', name, function (require) {
                callback(require)
            })
        }

        function define () {
            var name = arguments[0]
            var deps = arguments[1]
            var body = arguments[2]

            if ( arguments.length == 1 ) {
                body = name
                deps = getRequireNames(body.toString())
                name = null
            } else if ( arguments.length == 2 ) {
                if ( typeof name == 'string' ) {
                    body = deps
                    deps = getRequireNames(body.toString())
                } else {
                    body = deps
                    deps = name
                    name = null
                }
            }

            deps = deps || []

            if ( name ) {
                step.call = null
                creat(name, deps, body)
            } else {
                step.call = function (name) {
                    creat(name, deps, body)
                }
            }
        }

        function creat (name, deps, body) {
            var newModule = new Module(name, deps, body)

            modules[name] = newModule

            dispatchEvent('moduleLoad', newModule)

            var unloadDeps = []

            for (var i = 0; i < deps.length; i++) {
                var dep = deps[i]
                if ( modules[dep] == null ) {
                    unloadDeps.push(dep)
                }
            }

            if ( unloadDeps.length == 0 ) {
                newModule.create()
            } else {
                addEventListeners(unloadDeps, function () {
                    newModule.create()
                })

                // 打包独立文件时，执行完函数再检查依赖

                setTimeout(function () {
                    for (var i = 0; i < unloadDeps.length; i++) {
                        var name = unloadDeps[i]
                        if ( !modules[name] ) {
                            load(name)
                        }
                    }
                }, 0)
            }
        }

        function getRequireNames (str) {
            var names = []
            var r = requireRegExp.exec(str)
            while(r != null) {
                names.push(r[1])
                r = requireRegExp.exec(str)
            }
            return names
        }

        function load (name) {
            if ( loadedFiles[name] != null ) return
            loadedFiles[name] = true

            var path = name + '.js'

            dispatchEvent('scriptLoad', path)

            var script = window.document.createElement('script')
            var head = window.document.head

            script.async = true
            script.src = path

            head.appendChild(script)

            script.onload = function () {
                dispatchEvent('scriptLoaded', path)

                if ( step.call ) {
                    step.call(name)
                }

                head.removeChild(script)

                // Dereference the node
                script = null
            }
        }

        define.modules = modules

        define.addEventListener = addEventListener
        define.dispatchEvent = dispatchEvent

        window.define = define
    }




    /*=============================================================================*/


    

    // UUID 

    var UUID = (function () {
        function UUID () {
            this.id = this.createUUID()
        }

        UUID.prototype.valueOf = function () { return this.id }
        UUID.prototype.toString = function () { return this.id }

        UUID.prototype.createUUID = function () {
            var dg = new Date(1582, 10, 15, 0, 0, 0, 0)
            var dc = new Date()
            var t = dc.getTime() - dg.getTime()
            var tl = UUID.getIntegerBits(t,0,31)
            var tm = UUID.getIntegerBits(t,32,47)
            var thv = UUID.getIntegerBits(t,48,59) + '1' // version 1, security version is 2
            var csar = UUID.getIntegerBits(UUID.rand(4095),0,7)
            var csl = UUID.getIntegerBits(UUID.rand(4095),0,7)
            // since detection of anything about the machine/browser is far to buggy,
            // include some more random numbers here
            // if NIC or an IP can be obtained reliably, that should be put in
            // here instead.
            var n = UUID.getIntegerBits(UUID.rand(8191),0,7) +
                    UUID.getIntegerBits(UUID.rand(8191),8,15) +
                    UUID.getIntegerBits(UUID.rand(8191),0,7) +
                    UUID.getIntegerBits(UUID.rand(8191),8,15) +
                    UUID.getIntegerBits(UUID.rand(8191),0,15) // this last number is two octets long
            return tl + tm  + thv  + csar + csl + n
        }

        //Pull out only certain bits from a very large integer, used to get the time
        //code information for the first part of a UUID. Will return zero's if there
        //aren't enough bits to shift where it needs to.
        UUID.getIntegerBits = function (val,start,end) {
            var base16 = UUID.returnBase(val,16)
            var quadArray = new Array()
            var quadString = ''
            var i = 0
            for (i = 0; i < base16.length; i++) {
                quadArray.push(base16.substring(i,i+1)) 
            }
            for (i = Math.floor(start/4); i <= Math.floor(end/4); i++) {
                if(!quadArray[i] || quadArray[i] == '') quadString += '0'
                else quadString += quadArray[i]
            }
            return quadString
        };

        //Replaced from the original function to leverage the built in methods in
        //JavaScript. Thanks to Robert Kieffer for pointing this one out
        UUID.returnBase = function (number, base) {
            return (number).toString(base).toUpperCase()
        }
         
        //pick a random number within a range of numbers
        //int b rand(int a); where 0 <= b <= a
        UUID.rand = function (max) {
            return Math.floor(Math.random() * (max + 1))
        }

        return UUID
    })()




    /*=============================================================================*/


    

    // watch - 变量改变观察

    var Watch = (function () {
        function watch (target, prop, handler) {
            if ( target.__lookupGetter__(prop) != null ) {
                return true
            }

            var oldval = target[prop]
              , newval = oldval
              , self = this
              , getter = function () {
                    return newval
                }
              , setter = function (val) {
                    if ( Object.prototype.toString.call(val) === '[object Array]' ) {
                        val = _extendArray(val, handler, self)
                    }
                    oldval = newval
                    newval = val
                    handler.call(target, prop, oldval, val)
                }

            if ( delete target[prop] ) { // can't watch constants
                if ( Object.defineProperty ) { // ECMAScript 5
                    Object.defineProperty(target, prop, {
                        get: getter,
                        set: setter,
                        enumerable: false,
                        configurable: true
                    });
                } else if ( Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__ ) { // legacy
                    Object.prototype.__defineGetter__.call(target, prop, getter)
                    Object.prototype.__defineSetter__.call(target, prop, setter)
                }
            }

            return this
        }

        // 解除变量监测器

        function unwatch (target, prop) {
            var val = target[prop]

            delete target[prop] // remove accessors
            target[prop] = val

            return this
        };

        // Allows operations performed on an array instance to trigger bindings

        function _extendArray (arr, callback, framework) {
            if (arr.__wasExtended === true) return

            function generateOverloadedFunction (target, methodName, self) {
                return function () {
                    var oldValue = Array.prototype.concat.apply(target)
                    var newValue = Array.prototype[methodName].apply(target, arguments)
                    target.updated(oldValue, motive)
                    return newValue
                }
            }
            arr.updated = function (oldValue, self) {
                callback.call(this, 'items', oldValue, this, motive)
            }
            arr.concat = generateOverloadedFunction(arr, 'concat', motive)
            arr.join = generateOverloadedFunction(arr, 'join', motive)
            arr.pop = generateOverloadedFunction(arr, 'pop', motive)
            arr.push = generateOverloadedFunction(arr, 'push', motive)
            arr.reverse = generateOverloadedFunction(arr, 'reverse', motive)
            arr.shift = generateOverloadedFunction(arr, 'shift', motive)
            arr.slice = generateOverloadedFunction(arr, 'slice', motive)
            arr.sort = generateOverloadedFunction(arr, 'sort', motive)
            arr.splice = generateOverloadedFunction(arr, 'splice', motive)
            arr.unshift = generateOverloadedFunction(arr, 'unshift', motive)
            arr.__wasExtended = true

            return arr
        }

        if ( typeof module !== 'undefined' ) {
          module.exports.watch = watch
          module.exports.unwatch = unwatch
        }

        return {
            watch : watch,
            unwatch : unwatch
        }
    
    })()




    /*=============================================================================*/


    

    // Sandbox

    var Sandbox = (function () {
        function Sandbox (unify, proto, setting, DNA) {
            var content, context

            this.sandbox = this.iframe = document.createElement('iframe')

            if ( setting ) {
                DNA && DNA(this.sandbox)
                this.sandbox.attr(setting.attr)
                setting.target.appendChild(this.sandbox)

                context = '<!DOCTYPE html>'
                        + '<html>'
                        + '<head>'
                        + (setting.style ? setting.style : '')
                        + (setting.script ? setting.script : '')
                        + '</head>'
                        + '<body>'
                        + '</body>'
                        + '</html>'
                        
            } else {
                this.sandbox.style.display = 'none'
                document.head.appendChild(this.sandbox)
                context = '<head><meta charset="utf-8"></head>'
            }

            content = this.sandbox.contentDocument

            content.open()
            content.write(context)
            content.close()

            this.window = this.sandbox.contentWindow.window
            this.document = this.sandbox.contentWindow.document

            // 获取被支持的iframe

            if ( unify ) {
                __defineUnify__(this.window)
            }

            if ( proto ) {
                __defineProto__(this.window)
            }
        }

        Sandbox.prototype = {

            exit : function () {
                document.head.removeChild(this.sandbox)
            },

            load : function (files, callback) {
                files = typeof files == 'object' ? files : [files]

                var html = ''
                for (var i = files.length - 1; i >= 0; i--) {
                    html += '<object data=' + files[i] + '</object>';
                }

                this.sandboxWindow.open()
                this.sandboxWindow.write(html)
                this.sandboxWindow.close()

                this.sandboxWindow.onload = function () {
                    callback()
                }
            }
        }

        return Sandbox
    })()

    // SandboxFunction

    var SandboxFunction = (function () {
        var sandbox = new Sandbox(),
            sandboxWindow = sandbox.window,
            sandboxFunction = sandboxWindow.Function

        sandbox.exit()

        return sandboxFunction
    })()

    // shadowRootFunction

    var ShadowRootFunction = (function () {
        var shadowRoot = new Sandbox()
          , shadowRootWindow = shadowRoot.window
          , shadowRootFunction = shadowRootWindow.Function

        return shadowRootFunction
    })()

    


    /*=============================================================================*/


    

    // 统一兼容性

    window.__defineUnify__ = (function () {

        // set ui

        var UI = {
                os          : OS,
                dpi         : window.devicePixelRatio,
                scale       : window.viewportScale,
                width       : window.document.documentElement.offsetWidth || window.innerWidth,
                height      : window.document.documentElement.offsetHeight || window.innerHeight,
                orientation : window.orientation
            }

        UI.viewportWidth = window.viewportWidth = UI.width / UI.scale
        UI.viewportHeight = window.viewportHeight = UI.height / UI.scale

        // define unit

        window.UNIT = {
            px : 1,
            dp : UI.scale,
            vw : UI.width / 100,
            vh : UI.height / 100,
            vm : Math.min(UI.width, UI.height) / 100
        }

        // Prefix, default unit

        var VENDOR_LENGTH = DETECT.vendor.length
        var REGEXP = {
                size : /\b(\d*\.?\d+)+(px|dp|vm|vw|vh)\b/ig,
                vendor : new RegExp("^" + DETECT.vendor, "ig")
            }

        // noop

        var noop = function () {}

        // preventDefaultEvent

        var stopPropagation = function (event) { return event.stopPropagation() }
        var preventDefaultEvent = function (event) { return event.preventDefault() }



        return function (window) {
            var document = window.document

            // Define

            Define(window)

            // device

            window.device = {
                ui   : UI,
                os   : OS,
                feat : DETECT
            }

            // 空函数

            window.noop = noop

            // 阻止默认事件行为 指针目的:所有preventDefault 函数指向同一内存，可在全局进行 add & remove

            window.stopPropagation = stopPropagation
            window.preventDefaultEvent = preventDefaultEvent




            /*=============================================================================*/



            // 修正开发商前缀为W3C API

            for ( var key in window ) {
                var vendor = REGEXP.vendor.exec(key)

                if ( vendor ) {
                    var start = key.charAt(VENDOR_LENGTH)
                    var rekey = key.substr(VENDOR_LENGTH).replace(/(\w)/,function(v){return v.toLowerCase()})

                    if ( start > 'A' || start < 'Z' ) {
                        try {
                            if ( !window[rekey] ) {
                                Object.defineProperty(window, rekey, {configurable:true, writable:true})
                                window[rekey] = window[key]
                            }
                        } catch (e) {}
                    }
                }
            }



            /*=============================================================================*/


            /* requestAnimationFrame & cancelAnimationFrame */

            if ( !window.requestAnimationFrame || !window.cancelAnimationFrame ) {

                Object.defineProperty(window, "requestAnimationFrame", {configurable:true, writable:true})
                Object.defineProperty(window, "cancelAnimationFrame", {configurable:true, writable:true})

                var lastTime = 0
                window.requestAnimationFrame = function(callback) {
                    var now = Date.now()
                    var nextTime = Math.max(lastTime + 16, now)
                    return setTimeout(function () { callback(lastTime = nextTime) }, nextTime - now)
                }
                window.cancelAnimationFrame = window.clearTimeout
            }

            if ( !window.document.head ) {
                window.document.head = window.document.getElementsByTagName("head")[0] || window.document.documentElement
            }

            /* time */

            if ( !window.Date.now ) {
                window.Date.now = function () {
                    return new Date().getTime();
                }
            }

            // Sandbox

            if ( !window.Sandbox ) {
                Object.defineProperty(window, "Sandbox", {configurable:true, writable:true})
                window.Sandbox = Sandbox
            }

            // SandboxFunction

            if ( !window.SandboxFunction ) {
                Object.defineProperty(window, "SandboxFunction", {configurable:true, writable:true})
                window.SandboxFunction = SandboxFunction
            }

            //ShadowRootFunction

            if ( !window.ShadowRootFunction ) {
                Object.defineProperty(window, "ShadowRootFunction", {configurable:true, writable:true})
                window.ShadowRootFunction = ShadowRootFunction
            }

            // safe eval

            if ( !window.seval ) {
                Object.defineProperty(window, "seval", {configurable:true, writable:true})
                window.seval = function (code) {

                    //安全闭包

                    return new SandboxFunction(' try { return ' + code + ' } catch (e) { console.log("safe-eval error!" + e) }')()
                }
            }

            // UUID

            if ( !window.UUID ) {
                Object.defineProperty(window, "UUID", {configurable:true, writable:true})
                window.UUID = UUID
            }

            // Object extend

            !(function () {

                var Array = window.Array,
                    Object = window.Object,
                    String = window.String,
                    DOMParser = window.DOMParser,
                    CSSStyleDeclaration = window.CSSStyleDeclaration

                // String;

                !(function (proto) {

                    if ( !proto.trim ) {
                        Object.defineProperty(proto, "trim", {configurable:true, writable:true})
                        proto.trim = function () {
                            return this.replace(/^\s+|\s+$/g, '')
                        };
                    }

                    if ( !proto.paramsToObject ) {
                        Object.defineProperty(proto, "paramsToObject", {configurable:true, writable:true})
                        proto.paramsToObject = function (Reg) {
                            var param,
                                params = {},
                                Reg = Reg || /\,|\&|\?|\#|\$/
                            ;

                            this.split(Reg).each(function (index, value) {
                                param = value.split(/\:|\=/);
                                
                                if ( param[0] ) {
                                    params[param[0]] = param[1];
                                }
                            })

                            return params
                        }
                    }

                    if ( !proto.parseStringOfURL ) {
                        Object.defineProperty(proto, "parseStringOfURL", {configurable:true, writable:true})
                        proto.parseStringOfURL = function (Reg) {
                            return /^(?:(\w+):\/\/)?(?:(\w+):?(\w+)?@)?([^:\/\?#]+)(?::(\d+))?(\/[^\?#]+)?(?:\?([^#]+))?(?:#(\w+))?/.exec(this)
                        }
                    }


                    if ( !proto.encodeToNumber ) {
                        Object.defineProperty(proto, "encodeToNumber", {configurable:true, writable:true})
                        proto.encodeToNumber = function (number, split) {
                            var i = 0,
                                pre = split ? "\\" : "", 
                                string = '',
                                length = this.length

                            while (i < length) {
                                string += pre + this.charCodeAt(i).toString(number)
                                i++;
                            }

                            return string
                        }
                    }

                    if ( !proto.decodeforNumber ) {
                        Object.defineProperty(proto, "decodeforNumber", {configurable:true, writable:true})
                        proto.decodeforNumber = function (number) {
                            var i = 0,
                                string = '',
                                charArry = this.split("\\"),
                                length = charArry.length

                            for (i = 0; i < length; i++) {
                                string += this.fromCharCode(parseInt(charArry[i], number))
                            }

                            return string
                        }
                    }

                    if ( !proto.removeQuotes ) {
                        Object.defineProperty(proto, "removeQuotes", {configurable:true, writable:true})
                        proto.removeQuotes = function () {
                            return this.replace(/\"|\'/g, '')
                        }
                    }

                    if ( !proto.repeat ) {
                        Object.defineProperty(proto, "repeat", {configurable:true, writable:true})
                        proto.repeat = function (n) {
                            return new Array(1 + n).join(this)
                        }
                    }

                    // 字符静态分析

                    if ( !proto.staticAnalysis ) {
                        Object.defineProperty(proto, "staticAnalysis", {configurable:true, writable:true});
                        proto.staticAnalysis = function () {
                            try { 
                                return typeof seval(this)
                            } catch(e) { 
                                return e.message
                            }
                        }
                    }

                })(String.prototype)
        

                // Object;

                !(function (proto) {

                    if ( !proto.extendProperty ) {
                        Object.defineProperty(proto, "extendProperty", {configurable:true, writable:true});
                        proto.extendProperty = function (prop, value) {
                            Object.defineProperty(this, prop, {configurable:true, writable:true});
                            if ( value ) this[prop] = value;
                        }
                    }

                    if ( !proto.getInstanceType ) {
                        Object.defineProperty(proto, "getInstanceType", {configurable:true, writable:true});
                        proto.getInstanceType = function (type) {
                            return proto.toString.call(this).match(/^\[object\s(.*)\]$/)[1];
                        }
                    }

                    // extend;

                    if ( !proto.extend ) {
                        Object.defineProperty(proto, "extend", {configurable:true, writable:true});
                        proto.extend = function () {
                            for (var i = 0, l = arguments.length; i < l; i++ ) {
                                var source = arguments[i];

                                for (var key in source)
                                    this[key] = source[key];
                            }

                            return this;
                        };
                    }

                    // objectToParams

                    if ( !proto.objectToParams ) {
                        Object.defineProperty(proto, "objectToParams", {configurable:true, writable:true});
                        proto.objectToParams = function () {
                            var payload = ""
                              , params = []
                              , e = encodeURIComponent
                            
                            if (typeof this === "string") {
                                payload = this
                            } else {

                                for (var k in this) {
                                    if ( this.hasOwnProperty(k) ) {
                                        var value = this[k]

                                        switch (typeof value) {
                                            case 'object':
                                                value = JSON.stringify(this[k])
                                            break
                                            case 'string':
                                                value = value
                                            break
                                        }

                                        params.push(k + '=' + e(value))
                                    }
                                }
                                payload = params.join('&')
                            }

                            return payload
                        }
                    }

                    // countProperties

                    if ( !proto.countProperties ) {
                        Object.defineProperty(proto, "countProperties", {configurable:true, writable:true});
                        proto.countProperties = function () {
                            var count = 0

                            for (var property in this) {
                                if (this.hasOwnProperty(property)) {
                                    count++
                                }
                            }

                            return count
                        }
                    }

                    // each

                    if ( !proto.each ) {
                        Object.defineProperty(proto, "each", {configurable:true, writable:true});
                        proto.each = function (callback, that) {
                            that = that || this
                            
                            var i, key, length

                            switch (this.getInstanceType()) {
                                case "Object":
                                    i = 0
                                    length = this.countProperties()

                                    for (key in this) {
                                        if (!this.hasOwnProperty(key))
                                            continue
                                        if (callback.call(that, key, this[key], i + 1, length) === false)
                                            return this

                                        i++
                                    }

                                    break

                                default:
                                // case "Array":
                                // case "NodeList":
                                // case "HTMLCollection":

                                    for (i = 0; i < this.length; i++) {
                                        if (callback.call(that, i, this[i], i + 1, this.length) === false)
                                            return this
                                    }

                                    break
                            }

                            return this
                        }
                    }

                    // equals
                    if ( !proto.equals ) {
                        Object.defineProperty(proto, "equals", {configurable:true, writable:true});
                        proto.equals = function(x, y) {
                            if ( arguments.length == 1 ) {
                                y = this
                            }

                            // If both x and y are null or undefined and exactly the same
                            if ( x === y ) {
                                return true
                            }

                            // If they are not strictly equal, they both need to be Objects
                            if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
                                return false
                            }

                            // They must have the exact same prototype chain, the closest we can do is
                            // test the constructor.
                            if ( x.constructor !== y.constructor ) {
                                return false
                            }

                            for ( var p in x ) {
                                // Inherited properties were tested using x.constructor === y.constructor
                                if ( x.hasOwnProperty( p ) ) {
                                    // Allows comparing x[ p ] and y[ p ] when set to undefined
                                    if ( ! y.hasOwnProperty( p ) ) {
                                        return false
                                    }

                                    // If they have the same strict value or identity then they are equal
                                    if ( x[ p ] === y[ p ] ) {
                                        continue
                                    }

                                    // Numbers, Strings, Functions, Booleans must be strictly equal
                                    if ( typeof( x[ p ] ) !== "object" ) {
                                        return false
                                    }

                                    // Objects and Arrays must be tested recursively
                                    if ( ! Object.equals( x[ p ],  y[ p ] ) ) {
                                        return false
                                    }
                                }
                            }

                            for ( p in y ) {
                                // allows x[ p ] to be set to undefined
                                if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
                                    return false
                                }
                            }
                            return true
                        }
                    }

                    // clone

                    if ( !proto.clone ) {
                        Object.defineProperty(proto, "clone", {configurable:true, writable:true});
                        proto.clone = function (callback) {
                            return Object.create(this)
                        }
                    }

                    // watch

                    if ( !proto.watch ) {
                        Object.defineProperty(proto, "watch", {configurable:true, writable:true});
                        proto.watch = function (prop, handler) {
                            Watch.watch(this, prop, handler)
                        }
                    }

                    // unwatch

                    if ( !proto.unwatch ) {
                        Object.defineProperty(proto, "unwatch", {configurable:true, writable:true});
                        proto.unwatch = function (prop) {
                            Watch.unwatch(this, prop)
                        }
                    }

                    // initial

                    if ( !proto.initial ) {
                        Object.defineProperty(proto, "initial", {configurable:true, writable:true});
                        proto.initial = function (prop, value) {
                            return this[prop] || (this[prop] = value)
                        }
                    }

                    // setValueOfHref

                    if ( !proto.setValueOfHref ) {
                        Object.defineProperty(proto, "setValueOfHref", {configurable:true, writable:true})
                        proto.setValueOfHref = function (link, value) {
                            var type = typeof value == 'string' ? value.staticAnalysis() : null,
                                script

                            switch (type) {
                                case 'number':
                                case 'boolean':
                                    script = 'scope.' + link + ' = ' + value

                                    break

                                default:
                                    script = 'scope.' + link + ' = value'

                                    break

                            }

                            new Function('scope', 'value', script)(this, value)
                        }
                    }

                    // getValueByString

                    if ( !proto.getValueByString ) {
                        Object.defineProperty(proto, "getValueByString", {configurable:true, writable:true})

                        proto.getValueByString = (function () {

                            var SPLITES_REG = /[^\w|\_|\$|\.|\[|\]$]+/

                            return function (link) {
                                
                                if ( !link ) return this

                                var i
                                  , l
                                  , val
                                  , scope = []
                                  , links = []
                                  , splits = []

                                link.split(SPLITES_REG).each(function (i, val) {
                                    val = val.split('.')[0]

                                    // /(^[\w_$!]?)+([\w_$]?)+[\w_$]$/.test(val)

                                    if ( val && val.staticAnalysis() === 'undefined' ) {
                                        links.push(val)
                                    }
                                })

                                for (i in this) {
                                    scope.push(this[i])
                                    splits.push(i)
                                }

                                // watched 可读变量

                                for (i = 0, l = links.length; i < l; i++) {
                                    val = links[i]

                                    if ( val in this) {
                                        splits.push(val)
                                        scope.push(this[val])
                                    }
                                }

                                return new Function(splits.join(','), 'try { return (' + link + ') } catch (e) {}').apply(this, scope)
                            }

                        })()
                    }

                })(Object.prototype)


                // Array

                !(function (proto) {

                    // inArray

                    if ( !proto.inArray ) {
                        Object.defineProperty(proto, "inArray", {configurable:true, writable:true});
                        proto.inArray = function (obj) {
                            var i = this.length; 

                            while (i--) {  
                                if ( this[i] === obj ) {  
                                    return true
                                }  
                            } 

                            return false 
                        }
                    }

                    // map

                    if ( !proto.map ) {
                        Object.defineProperty(proto, "map", {configurable:true, writable:true});
                        proto.map = function(fn){
                            var a = []
                            for(var i = 0; i < this.length; i++){
                                var value = fn(this[i], i)

                                if ( value == null ){
                                    continue
                                }

                                a.push(value)
                            }
                            return a
                        }
                    }

                    // unique

                    if ( !proto.unique ) {
                        Object.defineProperty(proto, "unique", {configurable:true, writable:true});
                        proto.unique = function () {
                            var result = [], hash = {}
                            for (var i = 0, elem; (elem = this[i]) != null; i++) {
                                if (!hash[elem]) {
                                    result.push(elem)
                                    hash[elem] = true
                                }
                            }
                            return result
                        }
                    }

                })(Array.prototype)


                // Element.prototype

                !(function (proto) {
                    if ( !proto.toucher ) {
                        Object.defineProperty(proto, "toucher", {configurable:true, writable:true})
                        proto.toucher = function (options) {
                            
                            // shadow box trans window

                            var win = this.ownerDocument.defaultView

                            if ( !this.touch ) {
                                this.extendProperty("touch", new win.Touch(this, options))
                            }

                            return this.touch
                        }
                    }

                    if ( !proto.scroller ) {
                        Object.defineProperty(proto, "scroller", {configurable:true, writable:true})
                        proto.scroller = function (options) {
                            
                            // shadow box trans window

                            var win = this.ownerDocument.defaultView

                            if ( !this.scroll ) {
                                this.extendProperty("scroll", new win.Scroll(this, options))
                            }

                            return this.scroll
                        }
                    }

                    if ( !proto.observer ) {

                        Object.defineProperty(proto, "observer", {configurable:true, writable:true})
                        /**
                        * @param {Object} options
                        * @param {Function} callback
                        * 元素attr change 监听 
                        * childList：子元素的变动。
                        * attributes：属性的变动。
                        * characterData：节点内容或节点文本的变动。
                        * subtree：所有下属节点（包括子节点和子节点的子节点）的变动。
                        */
                        proto.observer = function(options, callback) {
                            var MutationObserver = window.MutationObserver
                              , options = options || {
                                            attributes: true,
                                            childList: true,
                                            characterData: true,
                                            attributeOldValue : true,
                                            attributeFilter:["id", "class", "style", "src", "width", "height"]
                                        }
                            try {
                                if ( MutationObserver ) {
                                    new MutationObserver(function(record) {
                                            callback(record)
                                        }).observe(this, options)
                                } else {
                                    var queue = []
                                      , eventName = []

                                    if ( options ) {
                                        options.each(function (i, name) {
                                            switch (name) {
                                                case 'attributes':
                                                    eventName.push("DOMAttrModified")
                                                    break;
                                                case 'childList':
                                                    eventName.push("DOMNodeInserted")
                                                    eventName.push("DOMNodeRemoved")
                                                    break
                                                case 'characterData':
                                                    eventName.push("DOMCharacterDataModified")
                                                    break;
                                                case 'subtree':
                                                    eventName.push("DOMNodeInserted")
                                                    eventName.push("DOMNodeRemoved")
                                                    eventName.push("DOMNodeInsertedIntoDocument")
                                                    eventName.push("DOMNodeRemovedFromDocument")
                                                    break
                                            }
                                        })

                                        if ( eventName.length == 8 ) {
                                            eventName = "DOMSubtreeModified"
                                        } else {
                                            eventName = eventName.join(' ')
                                        }
                                    } else {
                                        eventName = "DOMSubtreeModified"
                                    }

                                    this.bind(eventName, function (e) {
                                        if ( queue.length == 0 ) {
                                            setTimeout(function () {
                                                callback([].concat(queue))
                                                queue = []
                                            }, 0)
                                        }

                                        queue.push(e)
                                    })
                                }
                            } catch (e) {
                                application.console.log(e)
                            }
                        }
                    }

                })(Element.prototype)


                !(function (proto) {

                    if ( !proto.insertToSelectionRange ) {
                        Object.defineProperty(proto, "insertToSelectionRange", {configurable:true, writable:true})
                        proto.insertToSelectionRange = function (target, append) {
                            var selection = (target || window.document).ownerDocument.defaultView.getSelection()
                              , range = selection.createRange ? selection.createRange() : selection.anchorNode ? selection.getRangeAt(0) : null
                              , text = this.textContent

                            if ( range == null ) {
                                if ( append ) {
                                    target.append(text)
                                }
                            } else {
                                range.collapse(false)

                                var content = range.createContextualFragment(text)
                                  , lastChild = content.lastChild
    
                                range.insertNode(content)

                                if ( lastChild ) {
                                    range.setEndAfter(lastChild)
                                    range.setStartAfter(lastChild)
                                }
                                selection.removeAllRanges()
                                selection.addRange(range)

                            }
                        }
                    }



                })(window.Node.prototype)


                // CSSStyleDeclaration;

                !(function (proto) {

                    // style.set;

                    if ( !proto.set ) {
                        Object.defineProperty(proto, "set", {configurable:true, writable:true})
                        proto.set = function (propertyName, value) {
                            if ( !propertyName || !value ) return

                            var i
                              , l
                              , vendors = [DETECT.prefix + propertyName, propertyName]
                              , propertyName

                            value = value.replace(REGEXP.size, function (size, length, unit) { 
                                return length * UNIT[unit] + 'px'
                            })

                            for (i = 0, l = vendors.length; i < l; i++) {
                                propertyName = vendors[i]

                                if ( propertyName in _STYLE ) {
                                    return this.setProperty(propertyName, value)
                                }
                            }
                        }
                    }

                    // style.remove;

                    if ( !proto.remove ) {
                        Object.defineProperty(proto, "remove", {configurable:true, writable:true})
                        proto.remove = function (propertyName) {

                            var vendors = [DETECT.prefix + propertyName, propertyName]

                            for (var i = 0, l = vendors.length; i < l; i++) {
                                var propertyName = vendors[i]

                                if ( this.propertyIsEnumerable(propertyName) ) {
                                    this.removeProperty(propertyName)
                                }
                            }
                        }
                    }

                })(CSSStyleDeclaration.prototype)

                // document 

                !(function (proto) {
                    if ( !proto.setCookie ) {
                        Object.defineProperty(proto, "setCookie", {configurable:true, writable:true})
                        proto.setCookie = function (name, value, domain, path) {
                            var Days = 30
                            var exp = new Date()
                            exp.setTime(exp.getTime() + Days*24*60*60*1000)
                            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + (domain ? ";path=" + (path ? path : "/") + ";domain=" + domain : "")
                        }
                    }

                    if ( !proto.getCookie ) {
                        Object.defineProperty(proto, "getCookie", {configurable:true, writable:true})
                        proto.getCookie = function (name) {
                            var arr
                            var reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)")
                            if ( arr = document.cookie.match(reg) )
                                return unescape(arr[2])
                            else
                                return null
                        }
                    }

                    if ( !proto.delCookie ) {
                        Object.defineProperty(proto, "delCookie", {configurable:true, writable:true})
                        proto.delCookie = function (name) {
                            var exp = new Date()
                            exp.setTime(exp.getTime() - 1)
                            var cval = getCookie(name)
                            if ( cval != null ) {
                                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
                            }
                        }
                    }

                })(document) 

                // DOMParser

                !(function(DOMParser) {
                    var DOMParser_proto = DOMParser.prototype,
                        real_parseFromString = DOMParser_proto.parseFromString

                    // Firefox/Opera/IE throw errors on unsupported types
                    try {

                        // WebKit returns null on unsupported types

                        if ( (new DOMParser).parseFromString("", "text/html") ) {

                            // text/html parsing is natively supported
                            var isParseHtmlFromString = true
                        }
                    } catch (ex) {}

                    DOMParser_proto.parseFromString = function (markup, type) {

                        if ( /^\s*text\/html\s*(?:;|$)/i.test(type) ) {
                            var doc

                            if ( isParseHtmlFromString ) {
                                doc = real_parseFromString.apply(this, arguments)
                            }

                            try {
                                var body = doc.body
                            } catch (e) {}

                            if ( !body ) {

                                doc = document.implementation.createHTMLDocument("")

                                if ( markup.toLowerCase().indexOf('<!doctype') > -1) {
                                    doc.documentElement.innerHTML = markup
                                } else {

                                    try {
                                        var body = doc.body
                                    } catch (e) {}

                                    // android parseFromString then body is not definde 

                                    if ( !body ) {
                                        doc.documentElement.innerHTML = markup

                                        var node
                                        var nodes = document.createNodeIterator(doc.documentElement, NodeFilter.SHOW_ALL, null, false)

                                        while ( node = nodes.nextNode() ) {
                                            if ( node.nodeName == 'BODY' ) {
                                                break
                                            }
                                        }

                                        nodes.body = node

                                        doc = nodes
                                    } else {
                                        doc.body.innerHTML = markup
                                    }
                                    
                                }
                            }

                            return doc

                        } else {

                            return real_parseFromString.apply(this, arguments)
                        }

                    }

                })(DOMParser)


                

                // iframe preventDefaultEvent : lock everyone iframe !!!important

                window.addEventListener('touchmove', preventDefaultEvent, false)

            })()



            /* ================================= TOP : By repeated nested case =================================== */

            top.factWindowWidth = top.innerWidth
            top.factWindowHeight = top.innerHeight

            top.addEventListener('resize', function () {

                // on focus innerHeight is not fact, then use of before onfocus

                top.factWindowWidth = top.innerWidth
                top.factWindowHeight = top.innerHeight
            })

            // lock top window
            
            top.addEventListener('touchmove', preventDefaultEvent, false)
        }
    })()

    __defineUnify__(window)

})()
define('frameworks/lib/application', ['frameworks/lib/proto', 'frameworks/lib/async', 'frameworks/lib/transform', 'frameworks/lib/template'], function (require, module, exports) {
	
	'use strict'

	// templates & trans viewport
	
	// var Async = require('frameworks/lib/async')
	// var Template = require('frameworks/lib/template')
	// var Transform = require('frameworks/lib/transform')

	// // Immunity

	// var IMMUNITY = []

	// function DNA (element, remove) {
	// 	if ( remove ) {
	// 		var i = IMMUNITY.indexOf(element)
	// 		if ( i >= 0 ) {
	// 			IMMUNITY.splice(i, 1)
	// 		}
	// 	} else {
	// 		IMMUNITY.push(element)
	// 	}
	// }

	// function Module (id) {

	// 	// initial

	// 	this.id = id
	// 	this.param = {}
	// 	this.status = {}
	// 	this.elements = {}
	// 	this.prefetch = {}
	// 	this.dimension = null
	// 	this.updatetime = {}
	// 	this.storagemaps = []
	// 	this.initialparam = {}
	// }

	// Module.prototype = {
	// 	setParam : function (param, initial) {
	// 		application.setParam(this.id, param, initial)
	// 	}
	// }

	// // define Application

	// function Application () {
	// 	if ( !(this instanceof Application) ) {
 //            return new Application()
 //        }

	// 	this.init()
	// }

	// Application.prototype = {
	// 	modules : {},

	// 	init : function () {
	// 		this._events = {}
	// 		this._prefetchs = {}

	// 		this.async = new Async()
	// 		this.sandbox = new Sandbox(true, true)
	// 		this.transform = new Transform()

	// 		this.version = '2.0'
	// 		this.console.log('IOING v' + this.version + ' - ioing.com')
	// 	},

	// 	on : function (types, fn) {
	// 		var that = this

 //            types.split(' ').each(function (i, type) {
 //            	that._events.initial(type, []).push(fn)
 //            })
 //        },

 //        one : function (types, fn) {
 //        	var that = this

 //        	function once () {
 //        		fn.apply(this, arguments)
 //        		this.off(types, once)
 //        	}

 //        	types.split(' ').each(function (i, type) {
 //        		that._events.initial(type, []).push(once)
 //        	})
 //        },

 //        off : function (types, fn) {
 //        	var that = this

 //            types.split(' ').each(function (i, type) {
 //            	if ( !that._events[type] ) return

 //            	var index = that._events[type].indexOf(fn)

 //            	if ( index > -1 ) {
 //                    that._events[type].splice(index, 1)
 //                }
 //            })
 //        },

 //        trigger : function (type) {
 //        	var that = this,
 //        		args = arguments

 //            if ( !this._events[type] ) return

 //            this._events[type].each(function (i, fn) {
 //            	fn.apply(that, [].slice.call(args, 1))
 //            })
 //        },

 //        to : function () {
 //        	application.transform.to.apply(application.transform, arguments)
 //        },

	// 	get : function (ids, callback) {
	// 		var that = this
	// 		  , config = []
	// 		  , modules = this.modules

	// 		ids = typeof ids == 'string' ? [ids] : ids

	// 		ids.each(function (i, id) {
	// 			if ( modules[id] === undefined ) { 
	// 				if ( id.indexOf('\/') == -1 ) {
	// 					config.push('modules/' + id + '/config')
	// 				} else {
	// 					config.push(id + '/config')
	// 				}
	// 			}
	// 		})

	// 		if ( config.length == 0 ) return this

	// 		require(config, function (require) {
	// 			ids.each(function (i, id) {
	// 				modules[id] = new Module(id).extend(require(config[i]))
	// 				modules[id].initialparam = {}.extend(modules[id].param)

	// 				that.filter(modules[id].config)
	// 			})

	// 			callback && callback()
	// 		})

	// 	},

	// 	origin : function (id) {
	// 		var remote = id.indexOf('\/') == -1 ? false : true
			
	// 		return {
	//                 root : remote ? (function () { 
	//                                 var root = id.split('\/')
	//                                     root.shift()
	//                                 return root.join('\/') 
	//                             })() : 'modules',
	//                 modpath : remote ? id : 'modules/' + id
	//             }
	// 	},

	// 	realpath : function (id, sid, url, path) {

	// 		// removeQuotes

 //            url = url.removeQuotes()
 //            url = url.trim()

 //            if ( !url ) return ''

 //            // indexOf keyWord

 //            if ( url.match(/^\w+\:/) === null && url.indexOf('//') != 0 ) {

 //            	var origin = this.origin(id)
 //            	  , root = origin.root
 //            	  , prepath = path ? path : sid ? origin.root + '/' + sid : origin.modpath

 //                if ( url.indexOf('/') == 0 ) {
 //                    url = root + url
 //                } else if ( url.indexOf('./') == 0 ) {
 //                    url = prepath + url.substr(1)
 //                } else if ( url.indexOf('-/') == 0 ) {
 //                    url = origin.modpath + '/' + url.substr(1)
 //                } else {
 //                    url = prepath + '/' + url
 //                }
 //            }

 //            return url
	// 	},

	// 	template : function (id) {
	// 		return new Template(id, DNA)
	// 	},

	// 	prefetch : function (id, param) {
	// 		var that = this
	// 		  , modules = this.modules
	// 		  , prefetch = this._prefetchs

	// 		/*
 //         	 * 模块配置未存在时推入预取队列
 //         	 * prefetch : app 状态 > 预取队列
	// 		 */

	// 		param = param || null

	// 		prefetch.initial(id, []).push(param)
	// 		if ( modules[id] === undefined || prefetch[id] === undefined ) {
	// 			return  that.get(id, function () {
	// 						that.prefetch(id, param)
	// 					})
	// 		}

	// 		/*
	// 		 * 模块已存在
	// 		 * 按参数预取模块source
	// 		 * 通过extend模块参数获取新的数据
	// 		 */

	// 		prefetch[id].each(function (i, params) {
	// 			if ( modules[id].prefetch[params] === undefined ) {

	// 				// waiting

	// 				modules[id].prefetch[params] = false

	// 				// 标记为update模块预取无效

	// 				if ( modules[id].config.update === true || modules[id].config.cache === 0 ) {
	// 					return that.console.warn('Modules[' + id + '] > config[update == true or cache == 0] cannot prefetch')
	// 				}

	// 				// 预取资源

	// 				application.async.get(id, modules[id].config, {}.extend(modules[id].param, params ? params.paramsToObject() : {}), function (sids, suri, data) {
						
 //                		that.console.info('Module [' + id + '] has been prefetch')

	// 					/* 
	// 					 * 预取成功
	// 					 * 以参数为key存储预取状态
	// 					 */

	// 					modules[id].prefetch[params] = arguments
	// 					modules[id].updatetime[params] = Date.now()
	// 				}, function (err) {

	// 					delete modules[id].prefetch[params]

	// 					that.console.error('Module [' + id + '] prefetch failed')
	// 				})
	// 			}
	// 		})

	// 		delete prefetch[id]
	// 	},

	// 	refresh : function () {
	// 		var that = this

	// 		this.clearSessionStorage()

	// 		// remove module element

	// 		this.modules.each(function (id, module) {

	// 			if ( id !== 'frameworks' ) {
	// 				if ( module.elements ) {
	// 					module.elements.container.remove()
	// 				}
					
	// 				delete that.modules[id]
	// 			}
				
	// 		})
	// 	},

	// 	clearSessionStorage : function (key) {
	// 		if ( key ) {				
	// 			(typeof key == 'string' ? [key] : key).each(function (i, key) {
	// 				try {
	// 					sessionStorage.removeItem(key)
	// 				} catch (e) {}
	// 			})
	// 		} else {
	// 			for (var i = sessionStorage.length; i >= 0; i--) {
	// 				try {
	// 					sessionStorage.removeItem(sessionStorage.key(i))
	// 				} catch (e) {}
	// 			}
	// 		}
	// 	},

	// 	clearLocalStorage : function (key) {
	// 		if ( key ) {
	// 			(typeof key == 'string' ? [key] : key).each(function (i, key) {
	// 				localStorage.removeItem(key)
	// 			})
	// 		} else {
	// 			for (var i = sessionStorage.length; i >= 0; i--) {
	// 				sessionStorage.removeItem(sessionStorage.key(i))
	// 			}
	// 		}
	// 	},

	// 	clearCache : function (id, dimension, storage) {
			
	// 		var module = this.modules[id]

	// 		if ( !module ) return

	// 		// clear dimension

	// 		module.dimension = null

	// 		if ( dimension ) {
	// 			delete module.prefetch[dimension]
	// 		} else {
	// 			module.prefetch = {}
	// 		}

	// 		if ( storage ) {
	// 			this.clearSessionStorage(module.storagemaps)
	// 		}
			
	// 	},
		
	// 	setParam : function (id, param, initial) {
 //            var module = application.modules[id]
 //            var params = (typeof param == 'string' ? param.paramsToObject() : param) || {}

 //            // if this module cache param != param ? update = ture
            
 //            if ( typeof param == 'string' ) {
 //            	module.update = module.dimension != param ? true : false
 //            	module.dimension = param
 //            }

 //            if ( initial ) {
 //            	module.param.extend(module.initialparam, params)
 //            } else {
 //            	module.param.extend(params)
 //            }
 //        },

 //        defend : function (element, clear) {
 //        	if ( clear ) element.innerHTML = null

 //        	element.observer(
	//         	{ childList: true },
	//         	function (records) {
	// 				records.each(function (i, record) {
	// 					var garbages = record.addedNodes
	// 					garbages.each(function (i, garbage) {
	// 						if ( IMMUNITY.indexOf(garbage) == -1 ) {
	// 							garbage.remove()
	// 						}
	// 					})
	// 				})
	// 			}
	// 		)
 //        },

 //        filter : function (config) {

 //        	// 1. iframe input blur bug

 //            if ( device.feat.iframeInputBlurBug ) {
 //            	this.console.warn('There iframe input focus bug in your browser sandbox > been config sandbox = false')
 //            }

 //            // 2. shadowRoot

 //            if ( device.feat.shadowRoot == false ) {
 //                config.shadowbox = false
 //            }

 //            // if is Bad GPU exit

 //            if ( device.feat.isBadAndroid ) {
 //                config.animation = false
 //            }

 //            // cache timeout

 //            config.cache = config.cache ? config.cache : 0

 //            // WARMING: cache and update cannot coexist

 //            if ( config.cache && config.update ) {
 //            	this.console.warn('config > cache and config > update cannot coexist')
 //            }

 //            // module type

 //            if ( config.absolute !== false ) {
 //            	config.absolute = true
 //            }

 //        },

 //        console : {
 //        	log : function (e) {
 //        		console.log("%c %c %c  " + e + "  %c %c ", 
 //        			"background: #999999", 
 //        			"background: #666666", 
 //        			"color: #ffffff; background: #333333", 
 //        			"background: #666666", 
 //        			"background: #999999"
 //                )
 //        	},
 //        	info : function (e) {
 //        		console.info("%c %c %c  " + e + "  %c %c ", 
 //        			"background: #00bff3", 
 //        			"background: #0072bc", 
 //        			"color: #ffffff; background: #003471", 
 //        			"background: #0072bc", 
 //        			"background: #00bff3"
 //                )
 //        	},
 //        	warn : function (e) {
 //        		console.warn("%c %c %c  " + e + "  %c %c ", 
 //        			"background: #ffcc00", 
 //        			"background: #ff9900", 
 //        			"color: #ffffff; background: #ff6600", 
 //        			"background: #ff9900", 
 //        			"background: #ffcc00"
 //                )
 //        	},
 //        	error : function (e) {
 //        		console.error("%c %c %c  " + e + "  %c %c ", 
 //        			"background: #ff0066", 
 //        			"background: #cc0033", 
 //        			"color: #ffffff; background: #990033", 
 //        			"background: #cc0033", 
 //        			"background: #ff0066"
 //                )
 //        	},
 //        	dir : function (e) {
 //        		console.dir.apply(console, e)
 //        	}
 //        }
	// }


	// // define proto

	// window.__defineProto__ = require('frameworks/lib/proto')
	// window.__defineProto__(window)

	// // 初始化 Application

	// window.application = new Application()


	// // document ready after

	// document.ready(function () {

	// 	try {
	// 		var hash = document.location.hash.substr(1).split(/\$|\?/)
	// 		  , id = hash[0]
	// 		  , ids = id ? ['frameworks', id] : ['frameworks']
	// 		  , param = hash[1]
	// 		  , exists = history.length && sessionStorage.length

	// 	} catch (e) {
	// 		throw 'IOING ERROR { Missing configuration module front view. path: frameworks > config.js > config > index }'
	// 	}

	// 	application.defend(document.body, true)
	// 	application.transform.init(DNA)

	// 	// mark EXISTS

	// 	try {
	// 		sessionStorage.setItem('EXISTS', history.length)
	// 	} catch (e) {}
		
	// 	// load module config
		
	// 	application.get(ids, function () {

	// 		var index = application.modules.frameworks.config.index

	// 		// history classify

	// 		application.transform.singleflow = application.modules.frameworks.config.singleflow
			
	// 		// start App

	// 		application.transform.to('frameworks', null, -1, function () {

	// 			// only page

	// 			if ( !id && !index ) {
	// 				application.absoluteViewport.style.display = 'none'
	// 				application.transform.param('frameworks', param)

	// 				return
	// 			}


	// 			if ( id ) {

	// 				// !exists : first run

	// 				if ( !exists && index && id != index ) {
	// 					application.transform.hash(index)

	// 					setTimeout(function () {
	// 						application.transform.to(id, param)
	// 					}, 0)
						
	// 				} else {

	// 					// no need mark hash, because id is hash

	// 					application.transform.to(id, param, -1)
	// 				}

	// 				// 预取得默认首页

	// 				if ( !application.modules[index] ) {
	// 					application.prefetch(index)
	// 				}

	// 			} else {

	// 				// mark index hash

	// 				application.transform.to(index, param)
	// 			}
	// 		})

	// 	})

	// 	// error

	// 	window.onerror = function () {
	// 		application.console.error('IOING ERROR : more >>')
	// 		application.trigger('unknownerror', arguments)

	// 		return false
	// 	}

	// })

})
define('frameworks/lib/proto', ['frameworks/lib/query', 'frameworks/lib/move', 'frameworks/lib/promise', 'frameworks/lib/scroll', 'frameworks/lib/touch', 'frameworks/lib/loader'], function (require, module, exports) {
    'use strict'

    module.exports = (function () {
        
        // compatible body ======================================== body ========================================

        return function (window) {

            // jquery

            Object.defineProperty(window, "$$", {configurable:true, writable:true})
            window.$ = window.query = require('frameworks/lib/query')(window)

            window.$.fn.scroll = function (opt) {
                this.scroller(opt)
            }

            // move

            Object.defineProperty(window, "move", {configurable:true, writable:true})
            window.move = require('frameworks/lib/move')

            // Promise
   
            Object.defineProperty(window, "Promise", {configurable:true, writable:true})
            window.promise = require('frameworks/lib/promise')
 

            // Scroll

            Object.defineProperty(window, "Scroll", {configurable:true, writable:true})
            window.Scroll = require('frameworks/lib/scroll')(window, window.document, window.Math)

            // Touch

            Object.defineProperty(window, "Touch", {configurable:true, writable:true})
            window.Touch = require('frameworks/lib/touch')(window, window.document, undefined)

            // Loader

            Object.defineProperty(window, "Loader", {configurable:true, writable:true})
            window.Loader = require('frameworks/lib/loader')

            // Object extend

            !(function () {

                // element extend

                (function ($) {
                    var proto = window.Node.prototype

                        // == $(document.createElement('div'))

                      , $element = [
                                    "namepsace", 
                                    "constructor", 
                                    "forEach", 
                                    "reduce", 
                                    "push", 
                                    "indexOf", 
                                    "concat", 
                                    "selector", 
                                    "oldElement", 
                                    "slice", 
                                    "setupOld", 
                                    "find", 
                                    "html", 
                                    "text", 
                                    "css", 
                                    "computedStyle", 
                                    "empty", 
                                    "hide", 
                                    "show", 
                                    "toggle", 
                                    "val", 
                                    "attr", 
                                    "removeAttr", 
                                    "prop", 
                                    "removeProp", 
                                    "remove", 
                                    "addClass", 
                                    "removeClass", 
                                    "toggleClass", 
                                    "replaceClass", 
                                    "hasClass", 
                                    "append", 
                                    "appendTo", 
                                    "prependTo", 
                                    "prepend", 
                                    "before", 
                                    "after", 
                                    "get", 
                                    "offset", 
                                    "height", 
                                    "width", 
                                    "parent", 
                                    "parents", 
                                    "childrens", 
                                    "siblings", 
                                    "closest", 
                                    "filter", 
                                    "not", 
                                    "data", 
                                    "end", 
                                    "clone", 
                                    "size", 
                                    "serialize", 
                                    "eq", 
                                    "index", 
                                    "is", 
                                    "bind", 
                                    "unbind", 
                                    "one", 
                                    "delegate", 
                                    "undelegate", 
                                    "on", 
                                    "off", 
                                    "trigger", 
                                    "click", 
                                    "keydown", 
                                    "keyup", 
                                    "keypress", 
                                    "submit", 
                                    "load", 
                                    "resize", 
                                    "change", 
                                    "select", 
                                    "error"
                                ]
                      , $window = ['trigger', 'bind', 'unbind', 'on', 'one', 'off', 'load']
                      , $document = ['trigger', 'bind', 'unbind', 'on', 'one', 'off','ready']
                      , applyQuery = function (key) {
                            return (function (key) {
                                return function () {
                                    var that = $(this)
                                    return that[key].apply(that, arguments)
                                }
                            })(key)
                        }
                        

                    // element extend

                    $element.each(function (i, key) {
                        if ( !proto[key] ) proto[key] = applyQuery(key)
                    })

                    // window events extend

                    for (var i in $window) {
                        var key = $window[i]
                        window[key] = applyQuery(key)
                    }

                    // document events extend

                    for (var i in $document) {
                        var key = $document[i]
                        window.document[key] = applyQuery(key)
                    }

                })(window.$$)

            })()

            // ScrollEvent

            !(function () {
                var scrollid = 0

                window.top.addEventListener('scroll', function () {

                    var event = {
                        x : top.scrollX,
                        y : top.scrollY
                    }
                    
                    if ( scrollid == 0 ) {
                        if ( window.onscrollstart ) window.onscrollstart(event)
                        window.trigger('scrollstart', event)
                    }

                    clearTimeout(scrollid)

                    scrollid = setTimeout(function () {
                        scrollid = 0
                        if ( window.onscrollend ) window.onscrollend(event)
                        window.trigger('scrollend', event)
                    }, 50)

                    if ( window !== top ) {
                        if ( window.onscrollend ) window.onscroll(event)
                        window.trigger('scroll')
                    }
                }, false)
            })()


        }
        
    })()

})
define('frameworks/lib/transform', [], function (require, module, exports) {
    
    'use strict'

    // Trans to this module

    function Transform () {

        if ( !(this instanceof Transform) ) {
            return new Transform()
        }

    }

    Transform.prototype = {
        init : function (DNA) {

            this.DNA = DNA

            // go to history

            window.addEventListener("hashchange", function (event) {
                application.transform.back(event)
            }, false)

            // reset viewport
            /* use preserve-3d */

            document.documentElement.style.height = document.body.style.height = "100%"
            document.body.style.overflow = "hidden"

            // creat relative view

            var relativeViewport = document.createElement('relative-windows')
                relativeViewport.id = "relative-viewport"
                relativeViewport.style.position = "fixed"
                relativeViewport.style.zIndex = 1
                relativeViewport.style.width = relativeViewport.style.height = "100%"
                relativeViewport.style.overflow = "hidden"

                // set DNA

                DNA(relativeViewport)

            // defend

            application.defend(relativeViewport)

            application.relativeViewport = relativeViewport

            // creat absolute view

            var absoluteViewport = document.createElement('absolute-windows')
                absoluteViewport.id = "absolute-viewport"
                absoluteViewport.style.position = "fixed"
                absoluteViewport.style.zIndex = 10000
                absoluteViewport.style.width = absoluteViewport.style.height = "100%"
                absoluteViewport.style.overflow = "hidden"

                // set DNA

                DNA(absoluteViewport)
            
            // defend

            application.defend(absoluteViewport)

            application.absoluteViewport = absoluteViewport

            // append to document

            document.body.appendChild(application.relativeViewport)
            document.body.appendChild(application.absoluteViewport)
        },

        back : function (event) {

            // no module or no hashchange block trans

            if ( this.module === undefined ) return
            if ( this.hashchange === false ) return this.hashchange = true

            // level == 0 return

            if ( this.singleflow && this.module.config.level === 0 ) return this.hash(this.module.id)
            
            // Target module id & param

            var md = location.hash.replace("#","").split("$")
              , id = md[0]
              , param = md[1]
              , module = application.modules[id]
            
            // continuity back or trans to module

            if ( id ) {
                if ( this.singleflow && module && module.config.level >= this.module.config.level ) {

                    // back to >> 0 

                    top.history.back()
                } else {
                    application.transform.to(id, param, -1)
                }
            }

            application.trigger('back', { id : id, module : module })
        },

        hash : function (id, param) {
            
            // block hashchange

            this.hashchange = false

            // param trim all \s

            window.location.hash = id + (param ? '$' + param.replace(/\s/g, '') : '')
        },

        status : function (param, push) {
            param = this.module.param.extend(param).objectToParams()

            // push or replace

            if ( push ) {
                this.hash(this.id, param)
            } else {
                history.replaceState({}, null, '#' + this.id + (param ? '$' + param.replace(/\s/g, '') : ''))
            }
        },

        to : function (id, param, history, callback) {
            var that = this

            this.id = id
            param = param || null
            this.callback = callback || noop

            // is number ? go to history

            if ( !isNaN(id) ) return window.history.go(parseInt(id))

            var od = this.od
              , ids = od ? [id, od] : [id]
              , module = application.modules[id]
              , modulu = application.modules[od]
              , moduli = od ? [module, modulu] : [module]

            // close pre loading

            that.loading(od, 0)

            // check module config

            if ( module === undefined ) {
                
                // open loading

                this.loading(od, 1)

                return application.get(id, function () {
                    
                    // close loading

                    that.loading(od, 0)

                    // RE

                    that.to(id, param, history)
                })
            }

            // module cheak end then apply this

            this.ids = ids
            this.module = module
            this.modulu = modulu
            this.moduli = moduli

            // check fetch

            this.fetch(module, param)

            // activity page = this page ? return

            if ( od && id == od && module.dimension == param && !module.update ) return

            // set param && update

            if ( param ) {
                module.setParam(param, true)
            }

            // get animation

            this.animation = (!od || id == od || od == 'frameworks') ? false
                                : (module.config.animation === true 
                                    ? application.modules.frameworks.config.animation 
                                    : module.config.animation) 

            this.cutting = od && module.config.absolute != modulu.config.absolute ? true : false

            // 初始化模块

            this.build(id, function () {

                this.start(function () {

                    // is first ?

                    if ( od ) {
                        this.transform(id, history)
                    } else {
                        this.cut()
                        this.end()
                    }

                    // pre module

                    this.od = application.activity = id == "frameworks" ? null : id

                    // history -1 ? 0 : ++

                    if ( history != -1 ) {
                        this.hash(id, param)
                    }

                })
            })
        },

        // 检测cache 周期

        fetch : function (module, param) {

            if ( Date.now() - module.updatetime[param] > module.config.cache * 1000 ) {
                delete module.prefetch[param]

                module.dimension = false
            }

            this.prefetched = module.prefetch[param] ? true : false
        },

        build : function (id, callback) {
            var that = this
              , modules = application.modules
              , module = modules[id]
              , callbacks = function () { callback.call(that) }

            // module is infinite or module Ele ? creat new elements

            if ( !module.elements.container ) this.container(id)
            if ( !module.loaded 
                || module.update === true 
                || module.config.update === true 
            ) {
                if ( this.prefetched ) {
                    this.include(id, callbacks)
                } else {
                    callbacks()
                    this.include(id)
                }
            } else {
                callbacks()
            }
        },

        reset : function (id, rested) {
            var style = this.module.elements.container.style

            style.cssText = ""
            style.position = id == "frameworks" ? "static" : "fixed"
            style.zIndex = (this.module.config.level || 0) + 1
            style.top = 0
            style.right = 0
            style.bottom = 0
            style.left = 0
            style.width = "100%"
            style.height = "100%"
            style.set("transform", rested ? "translate(0, 0) translateZ(0)" : "translate(200%, 200%) translateZ(0)")
        },

        include : function (id, callback) {
            var that = this
              , module = application.modules[id]
              , dimension = module.dimension

            callback = callback || noop

            // no update && status == waiting return

            if ( module.update !== true && module.status[dimension] == 0 ) return

            // lock module

            module.status[dimension] = 0

            // clear old dom

            module.elements.container.innerHTML = null
            module.elements.loader = null

            // open loading

            this.loading(id, 1)

            // preload on event

            if ( typeof module.preload == "function" ) {
                module.preload()
            }

            // include module page

            application.template(id, this.DNA).prefetch(function () {
                
                // prefetch callback

                that.callback()

            }).then(function () {

                module.status[dimension] = 'loaded'
                module.loaded = true

                callback()

            }).end(function () {

                // preload on event

                if ( typeof module.onload == "function" ) {
                    module.onload()
                }

                // close loading
                
                that.loading(id, 0)
            }).error(function () {

                if ( typeof module.onerror == "function" ) {
                    module.onerror()
                }

                // close loading

                module.status[dimension] = 'error'
                
                that.loading(id, 0)
            })
        },

        loading : function (id, display) {
            var modules = application.modules
              , module = modules[id]

            if ( !module ) return

            var loader = module.elements.loader

            // open loader or close loader

            switch (display) {
                case 0:

                    if ( !loader ) return

                    loader.hide()
                    module.elements.loader.hidden = true
                    module.elements.loader.cont.style.display = "none"

                    break
                    
                case 1:

                    if ( loader && loader.hidden == false ) return

                    var size = 38 * device.ui.scale
                      , opts = {
                            shape: "roundRect",
                            diameter: size * devicePixelRatio,
                            density: 12,
                            speed: 1,
                            FPS: 12,
                            range: 0.95,
                            color: "#999999"
                        }
                      , config = module.config.loader || modules['frameworks'].config.loader

                    // loader config

                    if ( config ) {
                        opts.extend(config)
                    }

                    loader = new Loader(module.elements.container, {safeVML: true})
                    loader.setShape(opts.shape)
                    loader.setDiameter(opts.diameter)
                    loader.setDensity(opts.density)
                    loader.setSpeed(opts.speed)
                    loader.setFPS(opts.FPS)
                    loader.setRange(opts.range)
                    loader.setColor(opts.color)
                    loader.show()

                    loader.cont.style.position = "absolute"
                    loader.cont.style.zIndex = 999
                    loader.cont.style.top = loader.cont.style.left = "50%"
                    loader.cont.style.marginTop = loader.cont.style.marginLeft = size * -0.5 + "px"
                    loader.cont.style.width = loader.cont.style.height = size + "px"

                    loader.cont.children.each(function (i, can) {
                        can.style.width = can.style.height = size + "px"
                    })

                    this.DNA(loader.cont)

                    module.elements.loader = loader
                    module.elements.loader.hidden = false

                    break
            }

        },

        container : function (id) {
            var that = this
              , module = application.modules[id]
              , target = module.config.absolute === false ? application.relativeViewport : application.absoluteViewport

            var container = document.createElement('module-container')
                container.setAttribute('name', id)

                // set DNA

                this.DNA(container)

                // set defend

                application.defend(container)

            // set module container

            module.elements.container = container

            // reset status

            this.reset(id, this.cutting || !this.animation)

            // append

            target.appendChild(container)
        },

        transform : function (id, history) {
            var that = this,
                module = this.module,
                modulu = this.modulu,
                modules = this.moduli,
                cutting = module.config.absolute != modulu.config.absolute ? true : false,
                backset = (modules.length == 1 || module.config.level == modulu.config.level) ? 0 : (module.config.level > modulu.config.level ? 1 : -1),
                reverse = backset == 1 ? false : true,
                animation = this.animation || function (event) { event.callback(!that.animation) }

            // animation end

            function end (rested) {
                if ( cutting ) {
                    that.cut(rested)
                }
                
                that.end(rested)
            }

            animation({
                "view"     : cutting ? [module.config.absolute === false ? application.relativeViewport : application.absoluteViewport, modulu.config.absolute === false ? application.relativeViewport : application.absoluteViewport] : [module.elements.container, modulu.elements.container],
                "viewport" : [application.relativeViewport, application.absoluteViewport],
                "modules"  : modules,
                "reverse"  : reverse,
                "backset"  : backset,
                "callback" : end
            })
        },

        start : function (callback) {

            // transformstart on event

            if ( typeof this.module.transformstart == "function" ) {
                if ( this.module.transformstart() == false ) {
                    return false
                }
            }

            // module show

            if ( this.module.elements.sandbox ) {
                this.module.elements.sandbox.window.trigger('moduleshow', { ids : this.ids, modules : this.modules })
            }

            // modulu hidden

            if ( this.modulu ) {
                if ( this.modulu.elements.sandbox ) {
                    this.modulu.elements.sandbox.window.trigger('modulehidden', { ids : this.ids, modules : this.modules })
                }
            }
            
            
            /*
                没有动画或不适合动画设备
                先隐藏－当前模块－再显示－未来模块 先释放内存有助于加快显示
            */

            if ( this.cutting || !this.animation ) {
                this.module.elements.container.css({"transform": "translate(0, 0) translateZ(0)"})
            }

            application.trigger("transformstart", {
                ids: this.ids,
                modules: this.moduli
            })

            // start

            callback.call(this)
        },

        end : function (rested) {

            /*
             * cutting 模块类型集装箱视图切换
            */

            if ( !rested || !this.animation ) {
                if ( this.modulu ) {
                    this.modulu.elements.container.css({"transform": "translate(200%, 200%) translateZ(0)"})
                    this.reset(this.id, true)
                }
            }

            // transformend on event

            if ( typeof this.module.transformend == "function" ) {
                this.module.transformend()
            }

            application.trigger("transformend", {
                ids: this.ids,
                modules: this.moduli
            })
        },

        cut : function (rested) {
            
            /*
             * cut : 场景切牌
             * 没有动画时直接切牌视窗
            */

            if ( !this.animation || !rested ) {
                if ( this.module.config.absolute === false ) {
                    application.absoluteViewport.css({"transform": "translate(200%, 200%) translateZ(0)"})
                    application.relativeViewport.css({"transform": "translate(0, 0) translateZ(0)"})
                } else {
                    application.relativeViewport.css({"transform": "translate(200%, 200%) translateZ(0)"})
                    application.absoluteViewport.css({"transform": "translate(0, 0) translateZ(0)"})
                }
            }

        }
    }


    module.exports = Transform
})
define('frameworks/lib/template', ['frameworks/lib/css', 'frameworks/lib/dom'], function (require, module, exports) {
    'use strict';

    var CSS = require('frameworks/lib/css')
      , DOM = require('frameworks/lib/dom')

    function Template (id, DNA) {

        if ( !(this instanceof Template) ) {
            return new Template(id, DNA)
        }

        if ( !id || !DNA ) return

        this.init(id, DNA)
    }

    Template.prototype = {
        init : function (id, DNA) {
            var that = this

            // include lib
            
            this.id = id
            this.DNA = DNA

            this.css = new CSS()
            this.dom = new DOM()
            this.dom.css = this.css

            this.module = application.modules[id]
            this.config = this.module.config
            this.target = this.module.elements.container
        },

        render : function (id, source) {

            /*
             * dimension 确保多个异步数据完成后执行当前到达的dimension模块
             */

            if ( id && source ) {
                this.write(this.compile(id, source[0], source[1], source[2]))
            }

            return this
        },

        write : function (source) {
            this.config.sandbox ? this.sandbox(source[0], source[1]) : this.embed(source[0], source[1])
        },

        compile : function (id, sids, suri, data) {
            this.css.setup({
                module     : id,
                data       : {
                    module     : id,
                    config     : this.config,
                    device     : device,
                    dpi        : device.ui.dpi,
                    os         : device.os,
                    feat       : device.feat,
                    prefix     : device.feat.prefix
                },
                modle       : (this.config.sandbox || this.config.shadowbox || id == 'frameworks') ? null : "#module-" + id + "-context"
            })
            
            data.data.extend({
                module : this.module,
                device : device
            })

            // init 清除 Dom 的未完成异步回调

            this.dom.init(id).setup({
                module     : id,
                suri       : suri,
                dids       : sids.data,
                sids       : sids.source
            })

            return [
                this.css.render(this.config.style, sids.style, data.style), 
                this.dom.render(this.config.source[0], data.source, data.data)
            ]
        },

        include : function (id) {
            var that = this
              , module = this.module
              , config = this.config
              , dimension = module.dimension
              , prefetched = module.prefetch[dimension]

            // 如果存在缓存并且没有被定义为强制刷新模块

            if ( prefetched && Date.now() - module.updatetime[module.dimension] < module.config.cache * 1000 ) {
                return this.render(id, prefetched)
            }

            application.async.get(id, config, module.param, function () {
                
                // prefetch callback

                that.fetched()

                // render

                that.render(id, arguments)

                if ( module.config.cache && !module.config.update ) {
                    module.prefetch[module.dimension] = arguments
                    module.updatetime[module.dimension] = Date.now()
                }
            }, this.errored)
        },

        scope : function (sandbox, context) {
            var id = this.id
              , dom = this.dom
              , config = this.config
              , module = this.module
              , scopeWindow = sandbox.window
              , scopeDocument = sandbox.document

            // set sandbox

            scopeWindow.module = this.module
            scopeWindow.application = application

            // valid window

            scopeWindow.validWindow = scopeWindow

            // react DATA ROOT

            scopeWindow.TOP = window
            scopeWindow.DOM = dom.DOM[0]
            scopeWindow.DATA = scopeWindow.SCOPE = scopeWindow.scope = dom.DATA
            scopeWindow.root = context
            scopeWindow.node = function (uuid) { return dom.DOM[0][uuid] || context.find(uuid) }

            // set application

            application.modules[id].elements.sandbox = sandbox
            application.modules[id].elements.context = context

            // update data && update view

            scopeWindow.application.update = function (id) {
                id = id ? id : config.source[0]
                
                application.async.source(id, config, 'data').then(function (err, sids, data) {
                    if ( !err && data ) {
                        dom.update(id, 0, data)
                    }
                })
            }

            // 模块错误收集

            scopeWindow.onerror = function () {
                application.trigger('error', {
                    id : id,
                    module : module
                })
            }

            if ( scopeWindow != window ) {
                
                // compatible window

                __defineUnify__(scopeWindow)
                __defineProto__(scopeWindow)

            }
        },

        trick : function (sandbox, context) {
            if ( sandbox.window == window ) return

            var that = this

            // valid window

            sandbox.validWindow = window

            sandbox.window.document.extendProperty("getElementById", function (id) { return that.dom.DOM[0][id] || context.find('#' + id)[0] || window.document.getElementById(id) })
            sandbox.window.document.extendProperty("getElementsByName", function (name) { return context.find('*[name=' + name + ']').toArray() || window.document.getElementsByName(name) })
            sandbox.window.document.extendProperty("getElementsByClassName", function (name) { return context.find('.' + name).toArray() || window.document.getElementsByClassName(name) })
            sandbox.window.document.extendProperty("getElementsByTagName", function (name) { return context.find(name).toArray() || window.document.getElementsByTagName(name) })
            sandbox.window.document.extendProperty("getElementsByTagNameNS", function (name, namespace) { return window.document.getElementsByTagNameNS(name, namespace) })
            sandbox.window.document.extendProperty("querySelector", sandbox.window.parent.document.querySelector)
            
        },

        wrap : function (id, style, dom, type) {

            // creat css

            var css = document.createElement('style')
                css.name = id
                css.innerHTML = style
                css.extendProperty("DNA", this.DNA)

            var body = document.createElement("module-context")
                body.id = "module-" + id + "-context"
                body.name = id
                body.className = "module-context"

                // DNA

                this.DNA(body)

            // inset style

            id == 'frameworks' && type == 0 ? document.head.appendChild(css) : body.appendChild(css)

            body.appendChild(dom)

            return body
        },

        script : function () {
            var that = this
              , id = this.id
              , links = '' 
              , module = this.module
              , config = module.config
              , script = config.script || []
              , resources = module.resources
              
            script.each(function (i, name) {
                links += '<script src=' + application.realpath(id, null, resources.script[name]) + '></script> \n'
            })

            return links
        },

        style : function (style) {
            return '<style>' + style + '</style>'
        },

        sandbox : function (style, dom) {
            var that = this,
                id = this.id,
                module = this.module,
                config = this.config

            var sandbox = new Sandbox(true, true, {
                    attr : {
                        "name"     : id, 
                        "src"      : "about:blank",
                        "seamless" : "seamless",
                        "sandbox"  : typeof config.sandbox == "string" ? config.sandbox : "allow-same-origin allow-scripts allow-forms allow-top-navigation",
                        "style"    : "display: block; position: absolute; z-index: 0; width: 100%; height: 100%; border: 0"
                    },
                    style : this.style(style),
                    script : this.script(),
                    target : this.target
                }, this.DNA)

            // scope

            this.scope(sandbox, sandbox.document)

            // sandbox ready

            sandbox.window.trigger('sandboxready')

            // ready event

            sandbox.document.ready(function () {

                // insert dom to body

                sandbox.document.body.appendChild(dom)

                // trigger dom is ready

                that.dom.space(sandbox.window, sandbox.document.body, that.DNA).load(that.loaded).end(0)

                // readied

                that.readied()

            })
        },

        embed : function (style, dom) {
            var that = this
              , id = this.id
              , module = this.module
              , config = this.config
              , target = config.shadowbox ? this.target.createShadowRoot() : this.target
              , context = this.wrap(id, style, dom, 0)
              , sandbox = id == 'frameworks' ? (function () {

                    var script = config.script || []
                      , resources = module.resources
                      
                    script.each(function (i, name) {
                        var js = document.createElement('script')
                            js.src = application.realpath(id, null, resources.script[name])

                        document.head.append(js)
                    })

                    return window

                })() : new Sandbox(true, true, {
                    attr : {
                        "name"     : id, 
                        "src"      : "about:blank",
                        "seamless" : "seamless",
                        "sandbox"  : typeof config.sandbox == "string" ? config.sandbox : "allow-scripts allow-top-navigation allow-same-origin",
                        "style"    : "display: none;"
                    },
                    script : this.script(),
                    target : target
                }, this.DNA)

            // scope

            this.scope(sandbox, context)

            // sandbox ready

            sandbox.window.trigger('sandboxready')

            // append context

            target.appendChild(context)

            // trick 移形幻影 乾坤大挪移

            this.trick(sandbox, context)

            // trigger dom is ready

            this.dom.space(sandbox.window, context, this.DNA).load(this.loaded).end(0)

            // readied

            this.readied()
        },

        prefetch : function (callback) {
            this.fetched = callback

            return this
        },

        then : function (callback) {
            this.readied = callback

            return this
        },

        end : function (callback) {
            this.loaded = callback

            this.include(this.id)

            return this
        },

        error : function (callback) {
            this.errored = callback

            return this
        }

    }

    module.exports = Template
})
define('frameworks/lib/dom', [], function (require, module, exports) {
    'use strict'

    
    module.exports = {}
})
define('frameworks/lib/css', [], function (require, module, exports) {
    "use strict"

    // class & global scope
    
    var CLASS = {}
    var GLOBAL = {}

    /*
     * 语法解释 提取
     * var, unit, url(), Math(), @section ()
    */

    // Capture groups

    var REGEXP = {
            variable : /\+?\$(\w+\-?\w?)\+?/g,
            size : /\b(\d*\.?\d+)+(px|dp|vm|vw|vh)\b/ig,
            if : /\((.*)\)/,
            url : /\burl\((.*)\)/,
            fun : /(\w+)\((.*)\)/,
            eval : /\<(.*)\>/,
            evals : /\<(.*)\>/g,
            class : /\bclass[\s]?(\w+)[\s]?\((.*)\)/,
            section : /\((.*)\)/,
            comment : /\/\*[\s\S]*?\*\//g,
            attr : /([^\:]+):([^\;]*)[\;\}]/,
            alt : /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+[\;\}](?!\s*\*\/))/gmi
        }

    // Capture groups

    var CAP_COMMENT = 1
      , CAP_SELECTOR = 2
      , CAP_END = 3
      , CAP_ATTR = 4

    var isEmpty = function (x) {
            return typeof x == 'undefined' || x.length == 0 || x == null
        }
      , getPrefixStyleProp = device.feat.getPrefixStyleProp



    // CLASS CSS

    var CSS = function (config) {
        if ( !(this instanceof CSS) ) {
            return new CSS(config)
        }

        this.setup(config)
    }

    CSS.prototype = {
        setup : function (config) {
            this.config = config || {
                root : "modules/",
                data : {},
                modle : false
            }

            // 更新模块css配置，同时清空模块css的变量

            this.variable = {
                attributes : {},
                children : {}
            }

            this._modle = device.feat.shadowRoot == false && this.config.modle ? this.config.modle + ' ' : ''
        },

        clear : function () {

            // 清除当前模块css变量

            this.variable = {
                attributes : {},
                children : {}
            }
        },

        render : function (list, sids, sources) {
            var css = this.compile('frameworks', CSSBaseStyle)

            if ( !list ) {
                throw 'IOING ERROR { module ' + sids + ' css source is null }'
            }

            for (var i = 0, l = list.length; i < l; i++) {
                var name = list[i]

                css += this.compile(sids[name], sources[name])
            }

            return css
        },

        compile : function (id, source, scope, opts) {
            this.id = id
            this.opts = opts || {}
            this.scope = {}.extend(this.config.data, scope)
            this.modle = this.opts.modle ? this._modle + this.opts.modle + ' ' : this._modle

            return this.toCSS(this.data = this.toJSON(source))
        },

        toJSON : function (cssString, args) {
            var node = {
                children: {},
                attributes: {}
            }
            var match = null
            var count = 0

            if ( typeof args == 'undefined' ) {
                var args = {
                    ordered: false,
                    comments: false,
                    stripComments: false,
                    split: false
                }
            }

            if ( args.stripComments ) {
                args.comments = false
                cssString = cssString.replace(REGEXP.comment, '')
            }

            while ( (match = REGEXP.alt.exec(cssString)) != null ) {
                if ( !isEmpty(match[CAP_COMMENT]) && args.comments ) {

                    // Comment

                    var add = match[CAP_COMMENT].trim()
                    node[count++] = add
                } else if ( !isEmpty(match[CAP_SELECTOR]) ) {

                    // New node, we recurse

                    var name = match[CAP_SELECTOR].trim()

                    // This will return when we encounter a closing brace

                    var newNode = this.toJSON(cssString, args)
                    if ( args.ordered ) {
                        var obj = {}
                        obj['name'] = name
                        obj['value'] = newNode

                        // Since we must use key as index to keep order and not
                        // name, this will differentiate between a Rule Node and an
                        // Attribute, since both contain a name and value pair.

                        obj['type'] = 'rule'
                        node[count++] = obj
                    } else {
                        if ( args.split ) {
                            var bits = name.split(',')
                        } else {
                            var bits = [name]
                        }
                        for (var i in bits) {
                            var sel = bits[i].trim()
                            if ( sel in node.children ) {
                                for (var att in newNode.attributes) {
                                    node.children[sel].attributes[att] = newNode.attributes[att]
                                }
                            } else {
                                node.children[sel] = newNode
                            }
                        }
                    }
                } else if ( !isEmpty(match[CAP_END]) ) {

                    // Node has finished

                    return node
                } else if ( !isEmpty(match[CAP_ATTR]) ) {
                    var line = match[CAP_ATTR].trim()

                    if ( line.charAt(line.length - 1) == '}' ) {
                        REGEXP.alt.lastIndex = REGEXP.alt.lastIndex - 1
                    }

                    var attr = REGEXP.attr.exec(line)

                    if (attr) {

                        // Attribute

                        var name = attr[1].trim()
                        var value = attr[2].trim()
                        if ( args.ordered ) {
                            var obj = {}
                            obj['name'] = name
                            obj['value'] = value
                            obj['type'] = 'attr'
                            node[count++] = obj
                        } else {
                            if ( name in node.attributes ) {
                                var currVal = node.attributes[name]
                                if ( !(currVal instanceof Array) ) {
                                    node.attributes[name] = [currVal]
                                }
                                node.attributes[name].push(value)
                            } else {
                                node.attributes[name] = value
                            }
                        }
                    } else {

                        // Semicolon terminated line

                        node[count++] = line
                    }
                }
            }

            return node
        },

        toCSS : function (node, depth, scope, breaks) {
            var cssString = ''
            if ( typeof depth == 'undefined' ) {
                depth = 0
            }
            if ( typeof scope == 'undefined' ) {
                scope = false
            }
            if ( typeof breaks == 'undefined' ) {
                breaks = false
            }
            if ( node.attributes ) {
                for (i in node.attributes) {
                    var att = node.attributes[i]
                    if ( att instanceof Array ) {
                        for (var j = 0; j < att.length; j++) {
                            cssString += this._setAttr(i, att[j], depth, scope)
                        }
                    } else {
                        cssString += this._setAttr(i, att, depth, scope)
                    }
                }
            }
            if ( node.children ) {
                var first = true
                for (var i in node.children) {
                    if (breaks && !first) {
                        cssString += '\n'
                    } else {
                        first = false
                    }
                    
                    cssString += this._setNode(i, node.children[i], depth, scope)
                }
            }

            return cssString
        },

        realpath : function (url) {
            return application.realpath(this.id, null, url, this.opts.path)
        },

        // $

        _getVariable : function (value, scope) {
            var data = this.scope
            var config = this.config
            var variable = this.variable

            // 解析变量

            return value.replace(REGEXP.variable, function (map, key) { 
                var val

                if ( scope && variable.children[scope] ) {
                   val = variable.children[scope].getValueByString(key)
                }

                if ( val ) return val
                
                return variable.attributes.getValueByString(key) || GLOBAL.getValueByString(key) || data.getValueByString(key)
            })
        },

        // Helpers

        _setAttr : function (name, value, depth, scope) {
            var that = this

            var id = this.id
            var data = this.scope
            var config = this.config
            var cssString = ''

            // 解析变量

            value = this._getVariable(value, scope)

            // 处理前缀

            name = getPrefixStyleProp(name)

            // 转换单位

            value = (value.indexOf('<') != -1 ? value.replace(REGEXP.eval, function (val, count) { 
                count = data.getValueByString(count.replace(REGEXP.size, function (size, length, unit) { 
                    return length * (UNIT[unit] || 1)
                }))
                return typeof count == 'number' ? count + 'px' : count
            }) : value).replace(REGEXP.size, function (size, length, unit) { 
                return length * (UNIT[unit] || 1) + 'px'
            })

            // url 相对路径转换

            switch (name) {
                case 'background-image':
                case 'border-image':
                case 'background':
                case 'content':
                case 'src':
                    value = value.indexOf('url(') != -1 ? value.replace(REGEXP.url, function (val, url) { 

                        return "url(" + that.realpath(url ? url.removeQuotes() : '') + ")"
                        
                    }) : value

                    break

                case '@extend':
                    var extend = this.data.children[value]

                    if ( extend ) {
                        var attributes = extend.attributes

                        for (name in attributes) {
                            cssString += '\t'.repeat(depth) + name + ': ' + attributes[name] + ';\n'
                        }

                        return cssString
                    }

                    break

                case '@class':
                    var methods = REGEXP.fun.exec(value),
                        name = methods[1],
                        args = methods[2].split(/[\s]?\,[\s]?/),
                        classes = this.data.children['@' + name] || CLASS[name] || {},
                        argsKey = classes.args,
                        attributes = classes.attr

                        for (name in attributes) {
                            cssString += this._setAttr(name, attributes[name].replace(REGEXP.evals, function (context, variable) { return args[argsKey[variable]] }), 0, false)
                        }

                        return cssString

                    break
            }

            return '\t'.repeat(depth) + name + ': ' + value + ';\n'
        },

        _setNode : function (name, value, depth, scope) {
            var cssString = '',
                modle = this.modle,
                names = [],
                range = 0,
                section = 0,
                command = false,
                attributes = {}

            // 预置大括号语法
            /*
             * @section 定义模块作用域
             * @global 定义全局变量
             * @var 定义变量
            */
            // ”@“ 语法
            // 修正css基本命名适配部分; ”@“ 语法不包含 “&” 并列逻辑，因此不影响下面的并列类 @ : @keyframes

            if ( name.indexOf('@') == 0 ) {
                modle = ''                    // ”@“ 语法作用域失效
                names = name.split(/\b/)
                switch (names[1]) {
                    case 'keyframes':
                        command = false

                        name = '@' + device.feat.keyframesPrefix + 'keyframes ' + names[1]
                        
                        break

                    case 'section':
                        command = false

                        if ( depth == 0 ) {
                            scope = REGEXP.section.exec(name)
                            scope = scope ? scope[1] : 'section:error'
                        }

                        break

                    case 'class':
                        command = true

                        name = REGEXP.class.exec(name)

                        var className = name[1],
                            classArgs = name[2]

                        var argsKey = {}
                        var argsMap = classArgs.split(/[\s]?\,[\s]?/)

                        for (var i = 0, l = argsMap.length; i < l; i++) {
                            argsKey[argsMap[i]] = i
                        }

                        this.data.children['@' + className] = {
                            args : argsKey,
                            attr : value.attributes
                        }

                        // CLASS 定义全局作用域

                        if ( this.id == 'frameworks' ) {
                            CLASS[className] = this.data.children['@' + className]
                        }

                        break

                    case 'global':
                        command = true

                        if ( depth == 0 ) {
                            attributes = value.attributes
                            for (var key in attributes) {
                                GLOBAL[key] = attributes[key]
                            }
                        }

                        break

                    case 'var':
                        command = true

                        if ( depth == 0 || scope ) {
                            attributes = value.attributes
                            for (var key in attributes) {
                                if ( scope ) {
                                    if ( !this.variable.children[scope] ) this.variable.children[scope] = {}
                                    this.variable.children[scope][key] = attributes[key]
                                } else {
                                    this.variable.attributes[key] = attributes[key]
                                }
                            }
                        }

                        break

                    case 'if':
                        command = false

                        if ( depth == 0 ) {

                            scope = true

                            if ( !this.scope.getValueByString(REGEXP.if.exec(name)[1]) ) {
                                delete value.children
                            }
                        }

                        break

                }
            }

            if ( scope ) {
                range = depth > 0
                section = depth == 0
            }

            if ( command == false ) {
                names = name.split(',')
                name = ''

                for (var i = 0, l = names.length; i < l; i++) {
                    name += (modle ? modle : '') + (scope == true || scope == false ? '' : scope + ' ') + names[i].trim() + (i == l-1 ? '' : ', ')
                }

                cssString += section ? '' : (range ? '' : '\t'.repeat(depth)) + name + ' {\n'
                cssString += this.toCSS(value, depth + 1, scope);
                cssString += section ? '' : (range ? '' : '\t'.repeat(depth)) + '}\n'
            }

            return cssString
        }

    }

    module.exports = CSS
})
define('frameworks/lib/async', ['frameworks/lib/promise'], function (require, module, exports) {
    "use strict"

    var promise = require('frameworks/lib/promise')
      , Promise = promise.Promise

    var Get = function () {
        if ( !(this instanceof Get) ) {
            return new Get();
        }
    }

    Get.prototype = {
        uri : function (id, param, name, type, callback) {
            var that = this,
                uri,
                realname,
                remote,
                module = application.modules[id]

            // 获取依赖模块配置

            if ( !module ) {
                return application.get(id, function () {
                    that.uri(id, param, name, type, callback)
                })
            }

            // 被映射数据源的真实key和映射key

            if ( typeof name == 'object' ) {
                realname = name[0]
                name = name[1]
            }

            // get uri

            try {

                uri = module.resources[type][name]

            } catch (e) {}

            // debug

            if ( !uri ) {
                application.console.error('resources.' + type + '["' + name + '"] is not definde')
            }

            // DATA TYPE

            if ( typeof uri === "function" ) {
                uri = callback.call(this, id, realname || name, function (callback) { return uri(param, callback) }, "function")

                // uri 的继续类型， 若uri == undefined, 则认为为异步数据，终止以下
                if ( uri === undefined ) return
            } 

            if ( typeof uri === "object" ) {
                return callback.call(this, id, realname || name, uri, "object")
            } 

            if ( typeof uri === "string" ) {

                // trim

                uri = uri.trim()

                // 映射

                if ( uri.indexOf('::') > 0 ) {
                    uri = uri.split(/\:\:/)

                    if ( uri.length === 2 ) return this.uri(uri[0], param, [name, uri[1]], type, callback)
                }

                // 第一页加速

                if ( uri.indexOf('#') === 0 ) {
                    uri = document.getElementById(uri.substr(1))
                    uri = uri ? uri.innerHTML : ''

                    return callback.call(this, id, realname || name, uri, "object")
                }

                // real path

                uri = application.realpath(id, null, uri)

                // mark module network

                if ( uri.indexOf('//') == 0 || uri.indexOf('://') > 0 ) {

                    // 网络请求类型标记
                    remote = application.modules[id].network = true
                } 

                // helpher

                if ( uri.indexOf("|@") > -1 ) {
                    var urs = uri.split(/\|\@/)
                    var url = urs[0]

                    uri = {
                        url : url,
                        remote : remote,
                        method : 'GET'
                    }

                    for (var i = 1, l = urs.length; i < l; i++) {
                        var helpher = /(\w+)\((.*)?\)/g.exec(urs[i]),
                            helper = helpher[1],
                            value = helpher[2]

                        switch (helper) {
                            case 'param':
                                uri.param = value ? eval('({' + value.replace(/\{\{(.*?)\}\}/g, function (context, origin) {
                                                return param.getValueByString(origin)
                                            }) + '})') : {}

                                break

                            case 'cache':
                                uri.cache = value || 60

                                break

                            case 'origin':
                                uri.origin = true

                                break

                            case 'method':
                                uri.method = value
                                break
                        }

                    }    
                    
                } else {
                    uri = {
                        url : uri,
                        remote : remote,
                        method : 'GET'
                    }
                }

                return callback.call(this, id, realname || name, uri, 'url')
            }
        },

        async : function (id, param, source, type, geter) {
            var that = this
              , gets = []
              , module = application.modules[id]

            for (var i in source) {
                gets.push(
                    (function () {
                        var geter = new Promise()

                        this.uri(id, param, source[i], type, function (sid, sname, suri, stype) {

                            switch (stype) {
                                case 'object':
                                    geter.done(null, sid, sname, null, suri)
                                    
                                    break

                                case 'function':
                                    var callback = function (data) {
                                            geter.done(null, sid, sname, suri, data)
                                        }
                                      , data = suri(callback)

                                    // suri return fn (param, callback) param 为模块参数
                                    
                                    // 支持同步和异步, 如果function返回的方式是异步则需要callback

                                    if ( typeof data === 'object' || data === undefined ) {
                                        callback(data)
                                    } else {
                                        return data
                                    }
                                    
                                    break

                                case 'url':
                                    var cacid = suri.cache ? suri.url + suri.param : false
                                    var cache = cacid ? sessionStorage.getItem(cacid) : false

                                    // 查看cache生命周期

                                    if ( cache ) {
                                        var time = /(\d+)\|\|\|/.exec(cache) || [0, 0]

                                        if ( Date.now() - time[1] > suri.cache*1000 ) {
                                            sessionStorage.removeItem(cacid)
                                            cache = false
                                        } else {
                                            cache = cache.substr(time[0].length)
                                        }
                                    }

                                    // 如果cache符合条件则从cache读取数据

                                    if ( cache ) {

                                        // debug

                                        application.console.info('Data [' + sname + '] from cache')

                                        geter.done(null, sid, sname, suri.url, JSON.parse(cache))

                                        break
                                    }
                                    
                                    // server请求发起时间

                                    if ( suri.remote ) {
                                        var sendTime = Date.now()
                                    }

                                    promise.ajax(suri.method, suri.url, suri.param, null, null, suri.origin ? sname : null, suri.origin ? type : null).then(function (err, data, xhr) {
                                        if ( err ) {
                                            return that.error()
                                        }

                                        if ( type == 'data' ) {
                                            if ( typeof data == 'string' ) {
                                                try {
                                                    data = JSON.parse(data)
                                                } catch (e) {

                                                    // debug

                                                    application.console.error('url[' + suri.url + ']' + ' callback error')

                                                    throw e
                                                }
                                            }

                                            // data filter

                                            if ( module.filter ) {
                                                data = module.filter(data, sname) || data
                                            }

                                            // 如果数据为远程数据将其缓存 

                                            if ( cacid && suri.remote ) {
                                                try {
                                                    sessionStorage.setItem(cacid, Date.now() + '|||' + (xhr.response || JSON.stringify(data)))

                                                    // storagemaps
                                                    
                                                    module.storagemaps.push(cacid)
                                                } catch (e) {
                                                    application.console.warn('your browser does not support sessionStorage')
                                                }
                                            }
                                        }

                                        geter.done(err, sid, sname, suri.url, data)

                                        // request 请求用时统计
                                        if ( suri.remote ) {
                                            application.trigger('requestserver', { url : suri.url, time : Date.now() - sendTime })
                                        }
                                    })

                                    break
                            }

                        })

                        return geter

                    }).call(this)
                )
            }

            promise.join(gets).then(
                function (results) {
                    var sids = [],
                        suri = [],
                        source = []

                    for (var i = 0, l = results.length; i < l; i++) {
                        var data = results[i],
                            id = data[1],
                            sid = data[2],
                            uri = data[3],
                            context = data[4]

                        sids[sid] = id
                        suri[sid] = uri
                        source[sid] = context
                    }

                    geter.done(null, sids, suri, source, type)
                }
            )
        },

        source : function (id, param, config, type) {
            var geter = new Promise()
            
            if ( !config[type] || !config[type].length ) {
                geter.done(null, id, null, {}, type)
            } else {
                this.async(id, param, config[type], type, geter)
            }

            return geter
        },

        get : function (id, config, param, callback, error) {
            this.error = error || noop

            promise.join([
                this.source(id, param, config, 'data'),
                this.source(id, param, config, 'style'),
                this.source(id, param, config, 'source')
            ]).then(
                function(results) {
                    var sids = [],
                        suri = [],
                        source = []

                    for (var i = 0, l = results.length; i < l; i++) {
                        var data = results[i],
                            type = data[4]

                        sids[type] = data[1] || {}
                        suri[type] = data[2] || {}
                        source[type] = data[3] || {}
                    }

                    callback(sids, suri, source)
                }
            )
        },
    }

    module.exports = Get
})
define('frameworks/lib/loader', [], function (require, module, exports) {
    /*
  * Copyright (c) 2011 Róbert Pataki
  * 
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  * 
  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.
  * 
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  * THE SOFTWARE.
  * 
  * ----------------------------------------------------------------------------------------
  * 
  * Check out my GitHub:  http://github.com/heartcode/
  * Send me an email:   heartcode@robertpataki.com
  * Follow me on Twitter: http://twitter.com/#iHeartcode
  * Blog:         http://heartcode.robertpataki.com
  */

  /**
  * CanvasLoader uses the HTML5 canvas element in modern browsers and VML in IE6/7/8 to create and animate the most popular preloader shapes (oval, spiral, rectangle, square and rounded rectangle).<br/><br/>
  * It is important to note that CanvasLoader doesn't show up and starts rendering automatically on instantiation. To start rendering and display the loader use the <code>show()</code> method.
  * @module CanvasLoader
  **/
  module.exports = (function (window) {
    "use strict";
    /**
    * CanvasLoader is a JavaScript UI library that draws and animates circular preloaders using the Canvas HTML object.<br/><br/>
    * A CanvasLoader instance creates two canvas elements which are placed into a placeholder div (the id of the div has to be passed in the constructor). The second canvas is invisible and used for caching purposes only.<br/><br/>
    * If no id is passed in the constructor, the canvas objects are paced in the document directly.
    * @class CanvasLoader
    * @constructor
    * @param id {String} The id of the placeholder div
    * @param opt {Object} Optional parameters<br/><br/>
    * <strong>Possible values of optional parameters:</strong><br/>
    * <ul>
    * <li><strong>id (String):</strong> The id of the CanvasLoader instance</li>
    * <li><strong>safeVML (Boolean):</strong> If set to true, the amount of CanvasLoader shapes are limited in VML mode. It prevents CPU overkilling when rendering loaders with high density. The default value is true.</li>
    **/
    var CanvasLoader = function (id, opt) {
      if (typeof(opt) == "undefined") { opt = {}; }
      this.init(id, opt);
    }, p = CanvasLoader.prototype, engine, engines = ["canvas", "vml"], shapes = ["oval", "spiral", "square", "rect", "roundRect"], cRX = /^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, ie8 = navigator.appVersion.indexOf("MSIE") !== -1 && parseFloat(navigator.appVersion.split("MSIE")[1]) === 8 ? true : false, canSup = !!document.createElement('canvas').getContext, safeDensity = 40, safeVML = true,
    /**
    * Creates a new element with the tag and applies the passed properties on it
    * @method addEl
    * @protected
    * @param tag {String} The tag to be created
    * @param par {String} The DOM element the new element will be appended to
    * @param opt {Object} Additional properties passed to the new DOM element
    * @return {Object} The DOM element
    */
      addEl = function (tag, par, opt) {
        var el = document.createElement(tag), n;
        for (n in opt) { el[n] = opt[n]; }
        if(typeof(par) !== "undefined") {
          par.appendChild(el);
        }
        return el;
      },
    /**
    * Sets the css properties on the element
    * @method setCSS
    * @protected
    * @param el {Object} The DOM element to be styled
    * @param opt {Object} The style properties
    * @return {Object} The DOM element
    */
      setCSS = function (el, opt) {
        for (var n in opt) { el.style[n] = opt[n]; }
        return el;
      },
    /**
    * Sets the attributes on the element
    * @method setAttr
    * @protected
    * @param el {Object} The DOM element to add the attributes to
    * @param opt {Object} The attributes
    * @return {Object} The DOM element
    */
      setAttr = function (el, opt) {
        for (var n in opt) { el.setAttribute(n, opt[n]); }
        return el;
      },
    /**
    * Transforms the cache canvas before drawing
    * @method transCon
    * @protected
    * @param  x {Object} The canvas context to be transformed
    * @param  x {Number} x translation
    * @param  y {Number} y translation
    * @param  r {Number} Rotation radians
    */
      transCon = function(c, x, y, r) {
        c.save();
        c.translate(x, y);
        c.rotate(r);
        c.translate(-x, -y);
        c.beginPath();
      };
    /** 
    * Initialization method
    * @method init
    * @protected
    * @param id {String} The id of the placeholder div, where the loader will be nested into
    * @param opt {Object} Optional parameters<br/><br/>
    * <strong>Possible values of optional parameters:</strong><br/>
    * <ul>
    * <li><strong>id (String):</strong> The id of the CanvasLoader instance</li>
    * <li><strong>safeVML (Boolean):</strong> If set to true, the amount of CanvasLoader shapes are limited in VML mode. It prevents CPU overkilling when rendering loaders with high density. The default value is true.</li>
    **/
    p.init = function (pId, opt) {
      
      if (typeof(opt.safeVML) === "boolean") { safeVML = opt.safeVML; }
      
      /*
      * Find the containing div by id
      * If the container element cannot be found we use the document body itself
      */
      try {
        // Look for the parent element
        if (document.getElementById(pId) !== undefined) {
          this.mum = document.getElementById(pId);
        } else {
          this.mum = document.body;
        }
      } catch (error) {
        this.mum = document.body;
      }

      this.mum = pId;
      // Creates the parent div of the loader instance
      this.cont = addEl("loader", this.mum);
      if (canSup) {
      // For browsers with Canvas support...
        engine = engines[0];
        // Create the canvas element
        this.can = addEl("canvas", this.cont);
        this.con = this.can.getContext("2d");
        // Create the cache canvas element
        this.cCan = setCSS(addEl("canvas", this.cont), { display: "none" });
        this.cCon = this.cCan.getContext("2d");
      } else {
      // For browsers without Canvas support...
        engine = engines[1];
        // Adds the VML stylesheet
        if (typeof (CanvasLoader.vmlSheet) === "undefined") {
          document.getElementsByTagName("head")[0].appendChild(addEl("style"));
          CanvasLoader.vmlSheet = document.styleSheets[document.styleSheets.length - 1];
          var a = ["group", "oval", "roundrect", "fill"], n;
          for ( var n = 0; n < a.length; ++n ) { CanvasLoader.vmlSheet.addRule(a[n], "behavior:url(#default#VML); position:absolute;"); }
        }
        this.vml = addEl("group", this.cont);
      }
      // Set the RGB color object
      this.setColor(this.color);
      // Draws the shapes on the canvas
      this.draw();
      //Hides the preloader
      setCSS(this.cont, {display: "none"});
    };
  /////////////////////////////////////////////////////////////////////////////////////////////
  // Property declarations
    /**
    * The div we place the canvas object into
    * @property cont
    * @protected
    * @type Object
    **/
    p.cont = {};
    /**
    * The div we draw the shapes into
    * @property can
    * @protected
    * @type Object
    **/
    p.can = {};
    /**
    * The canvas context
    * @property con
    * @protected
    * @type Object
    **/
    p.con = {};
    /**
    * The canvas we use for caching
    * @property cCan
    * @protected
    * @type Object
    **/
    p.cCan = {};
    /**
    * The context of the cache canvas
    * @property cCon
    * @protected
    * @type Object
    **/
    p.cCon = {};
    /**
    * Adds a timer for the rendering
    * @property timer
    * @protected
    * @type Boolean
    **/
    p.timer = {};
    /**
    * The active shape id for rendering
    * @property activeId
    * @protected
    * @type Number
    **/
    p.activeId = 0;
    /**
    * The diameter of the loader
    * @property diameter
    * @protected
    * @type Number
    * @default 40
    **/
    p.diameter = 40;
    /**
    * Sets the diameter of the loader
    * @method setDiameter
    * @public
    * @param diameter {Number} The default value is 40
    **/
    p.setDiameter = function (diameter) { this.diameter = Math.round(Math.abs(diameter)); this.redraw(); };
    /**
    * Returns the diameter of the loader.
    * @method getDiameter
    * @public
    * @return {Number}
    **/
    p.getDiameter = function () { return this.diameter; };
    /**
    * The color of the loader shapes in RGB
    * @property cRGB
    * @protected
    * @type Object
    **/
    p.cRGB = {};
    /**
    * The color of the loader shapes in HEX
    * @property color
    * @protected
    * @type String
    * @default "#000000"
    **/
    p.color = "#000000";
    /**
    * Sets hexadecimal color of the loader
    * @method setColor
    * @public
    * @param color {String} The default value is '#000000'
    **/
    p.setColor = function (color) { this.color = cRX.test(color) ? color : "#000000"; this.cRGB = this.getRGB(this.color); this.redraw(); };
    /**
    * Returns the loader color in a hexadecimal form
    * @method getColor
    * @public
    * @return {String}
    **/
    p.getColor = function () { return this.color; };
    /**
    * The type of the loader shapes
    * @property shape
    * @protected
    * @type String
    * @default "oval"
    **/
    p.shape = shapes[0];
    /**
    * Sets the type of the loader shapes.<br/>
    * <br/><b>The acceptable values are:</b>
    * <ul>
    * <li>'oval'</li>
    * <li>'spiral'</li>
    * <li>'square'</li>
    * <li>'rect'</li>
    * <li>'roundRect'</li>
    * </ul>
    * @method setShape
    * @public
    * @param shape {String} The default value is 'oval'
    **/
    p.setShape = function (shape) {
      var n;
      for (n in shapes) {
        if (shape === shapes[n]) { this.shape = shape; this.redraw(); break; }
      }
    };
    /**
    * Returns the type of the loader shapes
    * @method getShape
    * @public
    * @return {String}
    **/
    p.getShape = function () { return this.shape; };
    /**
    * The number of shapes drawn on the loader canvas
    * @property density
    * @protected
    * @type Number
    * @default 40
    **/
    p.density = 40;
    /**
    * Sets the number of shapes drawn on the loader canvas
    * @method setDensity
    * @public
    * @param density {Number} The default value is 40
    **/
    p.setDensity = function (density) { 
      if (safeVML && engine === engines[1]) {
        this.density = Math.round(Math.abs(density)) <= safeDensity ? Math.round(Math.abs(density)) : safeDensity;
      } else {
        this.density = Math.round(Math.abs(density));
      }
      if (this.density > 360) { this.density = 360; }
      this.activeId = 0;
      this.redraw();
    };
    /**
    * Returns the number of shapes drawn on the loader canvas
    * @method getDensity
    * @public
    * @return {Number}
    **/
    p.getDensity = function () { return this.density; };
    /**
    * The amount of the modified shapes in percent.
    * @property range
    * @protected
    * @type Number
    **/
    p.range = 1.3;
    /**
    * Sets the amount of the modified shapes in percent.<br/>
    * With this value the user can set what range of the shapes should be scaled and/or faded. The shapes that are out of this range will be scaled and/or faded with a minimum amount only.<br/>
    * This minimum amount is 0.1 which means every shape which is out of the range is scaled and/or faded to 10% of the original values.<br/>
    * The visually acceptable range value should be between 0.4 and 1.5.
    * @method setRange
    * @public
    * @param range {Number} The default value is 1.3
    **/
    p.setRange = function (range) { this.range = Math.abs(range); this.redraw(); };
    /**
    * Returns the modified shape range in percent
    * @method getRange
    * @public
    * @return {Number}
    **/
    p.getRange = function () { return this.range; };
    /**
    * The speed of the loader animation
    * @property speed
    * @protected
    * @type Number
    **/
    p.speed = 2;
    /**
    * Sets the speed of the loader animation.<br/>
    * This value tells the loader how many shapes to skip by each tick.<br/>
    * Using the right combination of the <code>setFPS</code> and the <code>setSpeed</code> methods allows the users to optimize the CPU usage of the loader whilst keeping the animation on a visually pleasing level.
    * @method setSpeed
    * @public
    * @param speed {Number} The default value is 2
    **/
    p.setSpeed = function (speed) { this.speed = Math.round(Math.abs(speed)); };
    /**
    * Returns the speed of the loader animation
    * @method getSpeed
    * @public
    * @return {Number}
    **/
    p.getSpeed = function () { return this.speed; };
    /**
    * The FPS value of the loader animation rendering
    * @property fps
    * @protected
    * @type Number
    **/
    p.fps = 24;
    /**
    * Sets the rendering frequency.<br/>
    * This value tells the loader how many times to refresh and modify the canvas in 1 second.<br/>
    * Using the right combination of the <code>setSpeed</code> and the <code>setFPS</code> methods allows the users to optimize the CPU usage of the loader whilst keeping the animation on a visually pleasing level.
    * @method setFPS
    * @public
    * @param fps {Number} The default value is 24
    **/
    p.setFPS = function (fps) { this.fps = Math.round(Math.abs(fps)); this.reset(); };
    /**
    * Returns the fps of the loader
    * @method getFPS
    * @public
    * @return {Number}
    **/
    p.getFPS = function () { return this.fps; };
  // End of Property declarations
  ///////////////////////////////////////////////////////////////////////////////////////////// 
    /**
    * Return the RGB values of the passed color
    * @method getRGB
    * @protected
    * @param color {String} The HEX color value to be converted to RGB
    */
    p.getRGB = function (c) {
      c = c.charAt(0) === "#" ? c.substring(1, 7) : c;
      return {r: parseInt(c.substring(0, 2), 16), g: parseInt(c.substring(2, 4), 16), b: parseInt(c.substring(4, 6), 16) };
    };
    /**
    * Draw the shapes on the canvas
    * @method draw
    * @protected
    */
    p.draw = function () {
      var i = 0, size, w, h, x, y, ang, rads, rad, de = this.density, animBits = Math.round(de * this.range), bitMod, minBitMod = 0, s, g, sh, f, d = 1000, arc = 0, c = this.cCon, di = this.diameter, e = 0.47;
      if (engine === engines[0]) {
        c.clearRect(0, 0, d, d);
        setAttr(this.can, {width: di, height: di});
        setAttr(this.cCan, {width: di, height: di});
        while (i < de) {
          bitMod = i <= animBits ? 1 - ((1 - minBitMod) / animBits * i) : bitMod = minBitMod;
          ang = 270 - 360 / de * i;
          rads = ang / 180 * Math.PI;
          c.fillStyle = "rgba(" + this.cRGB.r + "," + this.cRGB.g + "," + this.cRGB.b + "," + bitMod.toString() + ")";
          switch (this.shape) {
          case shapes[0]:
          case shapes[1]:
            size = di * 0.07;
            x = di * e + Math.cos(rads) * (di * e - size) - di * e;
            y = di * e + Math.sin(rads) * (di * e - size) - di * e;
            c.beginPath();
            if (this.shape === shapes[1]) { c.arc(di * 0.5 + x, di * 0.5 + y, size * bitMod, 0, Math.PI * 2, false); } else { c.arc(di * 0.5 + x, di * 0.5 + y, size, 0, Math.PI * 2, false); }
            break;
          case shapes[2]:
            size = di * 0.12;
            x = Math.cos(rads) * (di * e - size) + di * 0.5;
            y = Math.sin(rads) * (di * e - size) + di * 0.5;
            transCon(c, x, y, rads);
            c.fillRect(x, y - size * 0.5, size, size);
            break;
          case shapes[3]:
          case shapes[4]:
            w = di * 0.24;
            h = w * 0.36;
            x = Math.cos(rads) * (h + (di - h) * 0.13) + di * 0.5;
            y = Math.sin(rads) * (h + (di - h) * 0.13) + di * 0.5;
            transCon(c, x, y, rads);
            if(this.shape === shapes[3]) {
              c.fillRect(x, y - h * 0.5, w, h);
            } else {
              rad = h * 0.55;
              c.moveTo(x + rad, y - h * 0.5);
              c.lineTo(x + w - rad, y - h * 0.5);
              c.quadraticCurveTo(x + w, y - h * 0.5, x + w, y - h * 0.5 + rad);
              c.lineTo(x + w, y - h * 0.5 + h - rad);
              c.quadraticCurveTo(x + w, y - h * 0.5 + h, x + w - rad, y - h * 0.5 + h);
              c.lineTo(x + rad, y - h * 0.5 + h);
              c.quadraticCurveTo(x, y - h * 0.5 + h, x, y - h * 0.5 + h - rad);
              c.lineTo(x, y - h * 0.5 + rad);
              c.quadraticCurveTo(x, y - h * 0.5, x + rad, y - h * 0.5);
            }
            break;
          }
          c.closePath();
          c.fill();
          c.restore();
          ++i;
        }
      } else {
        setCSS(this.cont, {width: di, height: di});
        setCSS(this.vml, {width: di, height: di});
        switch (this.shape) {
        case shapes[0]:
        case shapes[1]:
          sh = "oval";
          size = d * 0.14;
          break;
        case shapes[2]:
          sh = "roundrect";
          size = d * 0.12;
          break;
        case shapes[3]:
        case shapes[4]:
          sh = "roundrect";
          size = d * 0.3;
          break;
        }
        w = h = size;
        x = d * 0.5 - h;
        y = -h * 0.5;   
        while (i < de) {
          bitMod = i <= animBits ? 1 - ((1 - minBitMod) / animBits * i) : bitMod = minBitMod;
          ang = 270 - 360 / de * i;
          switch (this.shape) {
          case shapes[1]:
            w = h = size * bitMod;
            x = d * 0.5 - size * 0.5 - size * bitMod * 0.5;
            y = (size - size * bitMod) * 0.5;
            break;
          case shapes[0]:
          case shapes[2]:
            if (ie8) {
              y = 0;
              if(this.shape === shapes[2]) {
                x = d * 0.5 -h * 0.5;
              }
            }
            break;
          case shapes[3]:
          case shapes[4]:
            w = size * 0.95;
            h = w * 0.28;
            if (ie8) {
              x = 0;
              y = d * 0.5 - h * 0.5;
            } else {
              x = d * 0.5 - w;
              y = -h * 0.5;
            }
            arc = this.shape === shapes[4] ? 0.6 : 0; 
            break;
          }
          g = setAttr(setCSS(addEl("group", this.vml), {width: d, height: d, rotation: ang}), {coordsize: d + "," + d, coordorigin: -d * 0.5 + "," + (-d * 0.5)});
          s = setCSS(addEl(sh, g, {stroked: false, arcSize: arc}), { width: w, height: h, top: y, left: x});
          f = addEl("fill", s, {color: this.color, opacity: bitMod});
          ++i;
        }
      }
      this.tick(true);
    };
    /**
    * Cleans the canvas
    * @method clean
    * @protected
    */
    p.clean = function () {
      if (engine === engines[0]) {
        this.con.clearRect(0, 0, 1000, 1000);
      } else {
        var v = this.vml;
        if (v.hasChildNodes()) {
          while (v.childNodes.length >= 1) {
            v.removeChild(v.firstChild);
          }
        }
      }
    };
    /**
    * Redraws the canvas
    * @method redraw
    * @protected
    */
    p.redraw = function () {
        this.clean();
        this.draw();
    };
    /**
      * Resets the timer
      * @method reset
      * @protected
      */
      p.reset = function () {
        if (typeof (this.timer) === "number") {
          this.hide();
          this.show();
        }
      };
    /**
    * Renders the loader animation
    * @method tick
    * @protected
    */
    p.tick = function (init) {
      var c = this.con, di = this.diameter;
      if (!init) { this.activeId += 360 / this.density * this.speed; }
      if (engine === engines[0]) {
        c.clearRect(0, 0, di, di);
        transCon(c, di * 0.5, di * 0.5, this.activeId / 180 * Math.PI);
        c.drawImage(this.cCan, 0, 0, di, di);
        c.restore();
      } else {
        if (this.activeId >= 360) { this.activeId -= 360; }
        setCSS(this.vml, {rotation:this.activeId});
      }
    };
    /**
    * Shows the rendering of the loader animation
    * @method show
    * @public
    */
    p.show = function () {
      if (typeof (this.timer) !== "number") {
        var t = this;
        this.timer = self.setInterval(function () { t.tick(); }, Math.round(1000 / this.fps));
        setCSS(this.cont, {display: "block"});
      }
    };
    /**
    * Stops the rendering of the loader animation and hides the loader
    * @method hide
    * @public
    */
    p.hide = function () {
      if (typeof (this.timer) === "number") {
        clearInterval(this.timer);      
        delete this.timer;
        setCSS(this.cont, {display: "none"});
      }
    };
    /**
    * Removes the CanvasLoader instance and all its references
    * @method kill
    * @public
    */
    p.kill = function () {
      var c = this.cont;
      if (typeof (this.timer) === "number") { this.hide(); }
      if (engine === engines[0]) {
        c.removeChild(this.can);
        c.removeChild(this.cCan);
      } else {
        c.removeChild(this.vml);
      }
      var n;
      for (n in this) { delete this[n]; }
    };

    return CanvasLoader;
  }(window));

})
define('frameworks/lib/promise', [], function (require, module, exports) {
    "use strict"

    function Promise () {
        this._callbacks = []
    }

    Promise.prototype.then = function (func, context) {
        var p

        if (this._isdone) {
            p = func.apply(context, this.result)
        } else {
            p = new Promise()
            this._callbacks.push(function () {
                var res = func.apply(context, arguments)
                if (res && typeof res.then === 'function')
                    res.then(p.done, p)
            })
        }
        return p
    }

    Promise.prototype.done = function () {
        this.result = arguments
        this._isdone = true
        for (var i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i].apply(null, arguments)
        }
        this._callbacks = []
    }

    function join (promises) {
        var p = new Promise()
        var results = []

        if (!promises || !promises.length) {
            p.done(results)
            return p
        }

        var numdone = 0
        var total = promises.length

        function notifier (i) {
            return function () {
                numdone += 1
                results[i] = Array.prototype.slice.call(arguments)
                if (numdone === total) {
                    p.done(results)
                }
            }
        }

        for (var i = 0; i < total; i++) {
            promises[i].then(notifier(i))
        }

        return p
    }

    function chain (funcs, args) {
        var p = new Promise()
        if (funcs.length === 0) {
            p.done.apply(p, args)
        } else {
            funcs[0].apply(null, args).then(function () {
                funcs.splice(0, 1)
                chain(funcs, arguments).then(function () {
                    p.done.apply(p, arguments)
                })
            })
        }
        return p
    }

    /*
     * AJAX requests
     */

    function new_xhr () {
        var xhr = new XMLHttpRequest()

        // CORS 跨域支持 后端输出：header(“Access-Control-Allow-Origin：*“)

        if ( !("withCredentials" in xhr) ) {

            if ( typeof XDomainRequest != "undefined" ) {
                xhr = new XDomainRequest()
            } else {
                xhr = null
            }

        }

        return xhr
    }


    function ajax (method, url, data, headers, settings, call, type) {
        if ( call || /=\~/.test(url) ) {
            return origin(url, data, call, type)
        }

        var p = new Promise()
        var xhr

        settings = settings || {}
        headers = headers || {}
        data = data || {}

        var payload = data.objectToParams()

        if ( method === 'GET' && payload ) {
            url += (url.indexOf('?') != -1 ? '&' : '?') + payload
            payload = null
        }

        try {
            xhr = new_xhr(method, url)
        } catch (e) {
            p.done(promise.ENOXHR, "")
            return p
        }

        // 是否同域 withCredentials 解决跨域

        if ( url.indexOf('//') == 0 || url.indexOf('://') > 0 ) {
            if ( url.indexOf(window.location.host) <= 8 ) {
                xhr.withCredentials = true
            }
        }

        function open () {
            xhr.open(method, url, true)

            if ( settings.withCredentials ) xhr.withCredentials = true
            if ( settings.contentType ) headers['Content-Type'] = settings.contentType

            var content_type = 'application/x-www-form-urlencoded'
            for (var h in headers) {
                if (headers.hasOwnProperty(h)) {
                    if (h.toLowerCase() === 'content-type')
                        content_type = headers[h]
                    else
                        xhr.setRequestHeader(h, headers[h])
                }
            }
            xhr.setRequestHeader('Content-type', content_type)
        }

        // abort

        function abort () {
            if ( timeout ) {
                clearTimeout(tid)
            }

            xhr.abort()
        }

        // send

        function send () {
            open()
            xhr.send(payload)
        }

        // tryAgain

        function over () {

            abort()
            
            tryAgain(url, abort, send)
        }

        // timeout

        var timeout = promise.ajaxTimeout
        if ( timeout ) {
            var tid = setTimeout(over, timeout)
        }

        xhr.onerror = over 

        xhr.onload = function () {
            if ( timeout ) {
                clearTimeout(tid)
            }
            if ( xhr.readyState === 4 ) {
                var err = (!xhr.status ||
                           (xhr.status < 200 || xhr.status >= 300) &&
                           xhr.status !== 304)

                delete _tryAgain[url]

                var data = xhr.responseText

                if ( data.charAt(0) == '{' ) {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {}
                }

                p.done(err, data, xhr)
            }
        }

        // open
        
        send()

        return p
    }

    function _ajaxer (method) {
        return function (url, data, headers, settings, call, type) {
            return ajax(method, url, data, headers, settings, call, type)
        }
    }

    function origin (url, data, call, type) {
        var p = new Promise()
        var callbackName = call ? type + '_' + call : 'call_' + (++_jsonPID)
        var script = sandboxDocument.createElement("script")

        var data = data || {}
        var payload = data.objectToParams()

        if ( payload ) {
            url += (url.indexOf('?') != -1 ? '&' : '?') + payload
            payload = null
        }

        // JsonP URL

        url = url.replace(/=\~/, '=' + callbackName)

        // abort

        function abort () {
            if ( timeout ) {
                clearTimeout(tid)
            }

            try {
                sandboxDocumentHead.removeChild(script)
            } catch (e) {}
        }

        // send

        function send () {
            script = sandboxDocument.createElement("script")
            script.charset = 'utf-8'
            script.src = url

            // failed

            script.onerror = over

            sandboxDocumentHead.appendChild(script)
        }

        // 错误处理

        function over () {

            abort()

            tryAgain(url, abort, send)
        }

        // DEBUG

        sandboxWindow.onerror = function (e) {
            over()
            application.trigger('jsonerror', e)
        }

        // timeout
        
        var timeout = promise.ajaxTimeout
        if ( timeout ) {
            var tid = setTimeout(over, timeout)
        }

        // callback ! 超时被移除的script加载成功后仍会被执行
        
        sandboxWindow[callbackName] = function (data, type) {
            abort()

            if ( (type == 'data' || type == 'js') && typeof data !== 'object' ) return

            delete sandboxWindow[callbackName]
            delete _tryAgain[url]

            p.done(null, data, {})
        }

        send()

        return p
    }

    function tryAgain (url, abort, send) {
        var again = _tryAgain[url]

        if ( again && again >= promise.TRYAGAIN ) {
            application.trigger('loadfaile', {
                url : url,
                again : again
            })

            return
        }

        // again times++

        _tryAgain[url] = again ? again : 1
        _tryAgain[url]++

        function regain () {
            abort()
            
            setTimeout(function () {
                send()
            }, 1000)

            if ( !_tryAgain[url] ) {
                window.removeEventListener("online", regain, false)
            }
        }

        if ( navigator.onLine === false ) {
            window.addEventListener("online", regain, false)
        } else {
            setTimeout(function () {
                send()
            }, 3000)
        }
    }

    var sandbox = new Sandbox(true)
      , sandboxWindow = sandbox.window
      , sandboxDocument = sandbox.document
      , sandboxDocumentHead = sandboxDocument.head
      , _jsonPID = 0
      , _tryAgain = []

    // JsonP define

    sandboxWindow.define = function (type, name, context) {
        sandboxWindow[type + '_' + name](context, type)
    }

    sandboxWindow.style = function (name, context) {
        sandboxWindow['style_' + name](context, 'style')
    }

    sandboxWindow.source = function (name, context) {
        sandboxWindow['source_' + name](context, 'source')
    }

    var promise = {
        Promise: Promise,
        join: join,
        chain: chain,
        ajax: ajax,
        origin: origin,
        get: _ajaxer('GET'),
        post: _ajaxer('POST'),
        put: _ajaxer('PUT'),
        del: _ajaxer('DELETE'),

        /* Error codes */
        ENOXHR: 1,
        ETIMEOUT: 2,

        /* Network error then try again */
        TRYAGAIN: 3,

        /**
         * Configuration parameter: time in milliseconds after which a
         * pending AJAX request is considered unresponsive and is
         * aborted. Useful to deal with bad connectivity (e.g. on a
         * mobile network). A 0 value disables AJAX timeouts.
         *
         * Aborted requests resolve the promise with a ETIMEOUT error
         * code.
         */
        ajaxTimeout: 60000
    }


    module.exports = promise

})

define('frameworks/lib/query', [], function (require, module, exports) {
    'use strict';
    
    module.exports = function(window) {
        
        var document = window.document,
            emptyArray = [],
            slice = emptyArray.slice,
            classCache = {},
            eventHandlers = [],
            _eventID = 1,
            jsonPHandlers = [],
            _jsonPID = 1,
            fragmentRE = /<(\w+)[^>]*>/,
            classSelectorRE = /^\.([\w-]+)$/,
            tagSelectorRE = /^[\w-]+$/,
            _attrCache = {},
            _propCache = {},
            isWin8 = (typeof(MSApp) === "object");

        /**
         * internal function to use domfragments for insertion
         *
         * @api private
         */

        function _insertFragments(afm, container, insert) {
            var frag = document.createDocumentFragment();
            if (insert) {
                for (var j = afm.length - 1; j >= 0; j--) {
                    frag.insertBefore(afm[j], frag.firstChild);
                }
                container.insertBefore(frag, container.firstChild);

            } else {

                for (var k = 0; k < afm.length; k++) {
                    frag.appendChild(afm[k]);
                }
                container.appendChild(frag);
            }
            frag = null;
        }

        /**
         * Internal function to test if a class name fits in a regular expression
         * @param {String} name to search against
         * @return {Boolean}
         * @api private
         */

        function classRE(name) {
            return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
        }

        /**
         * Internal function that returns a array of unique elements
         * @param {Array} array to compare against
         * @return {Array} array of unique elements
         * @api private
         */

        function unique(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr.indexOf(arr[i]) != i) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            return arr;
        }

        /**
         * Given a set of nodes, it returns them as an array.  Used to find
         * siblings of an element
         * @param {Nodelist} Node list to search
         * @param {Object} [element] to find siblings off of
         * @return {Array} array of sibblings
         * @api private
         */

        function siblings(nodes, element) {
            var elems = [];
            if (nodes == undefined)
                return elems;

            for (; nodes; nodes = nodes.nextSibling) {
                if (nodes.nodeType == 1 && nodes !== element) {
                    elems.push(nodes);
                }
            }
            return elems;
        }

        /**
         * This is the internal appframework object that gets extended and added on to it
         * This is also the start of our query selector engine
         * @param {String|Element|Object|Array} selector
         * @param {String|Element|Object} [context]
         */
        var $query = function(toSelect, what) {
            this.length = 0;

            if (!toSelect) {
                return this;
            } else if (toSelect instanceof $query && what == undefined) {
                return toSelect;
            } else if ($.isFunction(toSelect)) {
                return $(document).ready(toSelect);
            } else if ($.isArray(toSelect) && toSelect.length != undefined) { //Passing in an array or object
                for (var i = 0; i < toSelect.length; i++)
                    this[this.length++] = toSelect[i];
                return this;
            } else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
                if (toSelect.length == undefined) {
                    if (toSelect.parentNode == what)
                        this[this.length++] = toSelect;
                } else {
                    for (var j = 0; j < toSelect.length; j++)
                        if (toSelect[j].parentNode == what)
                            this[this.length++] = toSelect[j];
                }
                return this;
            } else if ($.isObject(toSelect) && what == undefined) { //Single object
                this[this.length++] = toSelect;
                return this;
            } else if (what !== undefined) {
                if (what instanceof $query) {
                    return what.find(toSelect);
                }

            } else {
                what = document;
            }

            return this.selector(toSelect, what);

        };

        /**
         * This calls the $query function
         * @param {String|Element|Object|Array} selector
         * @param {String|Element|Object} [context]
         */
        var $ = function(selector, what) {
            return new $query(selector, what);
        };

        /**
         * this is the engine for "all" and is only exposed internally
         * @api private
         */

        function _selectorAll(selector, what) {
            try {
                return what.querySelectorAll(selector);

            } catch (e) {
                return [];
            }
        }
        /**
         * this is the query selector engine for elements
         * @param {String} selector
         * @param {String|Element|Object} [context]
         * @api private
         */

        function _selector(selector, what) {

            selector = selector.trim();

            if (selector[0] === "#" && selector.indexOf(".") == -1 &&selector.indexOf(",") == -1 && selector.indexOf(" ") === -1 && selector.indexOf(">") === -1) {
                if (what == document)
                    _shimNodes(what.getElementById(selector.replace("#", "")), this);
                else
                    _shimNodes(_selectorAll(selector, what), this);
            } else if ((selector[0] === "<" && selector[selector.length - 1] === ">") || (selector.indexOf("<") !== -1 && selector.indexOf(">") !== -1)) //html

            {
                var tmp = document.createElement("div");
                if (isWin8) {
                    MSApp.execUnsafeLocalFunction(function() {
                        tmp.innerHTML = selector.trim();
                    });
                } else
                    tmp.innerHTML = selector.trim();
                _shimNodes(tmp.childNodes, this);
            } else {
                _shimNodes((_selectorAll(selector, what)), this);
            }
            return this;
        }

        function _shimNodes(nodes, obj) {
            if (!nodes)
                return;
            if (nodes.nodeType) {
                obj[obj.length++] = nodes;
                return;
            }
            for (var i = 0, iz = nodes.length; i < iz; i++)
                obj[obj.length++] = nodes[i];
        }
        /**
        * Checks to see if the parameter is a $query object
            ```
            var foo=$('#header');
            $.is$(foo);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.is$(param)
        */
        $.is$ = function(obj) {
            return obj instanceof $query;
        };
        /**
        * Map takes in elements and executes a callback function on each and returns a collection
        ```
        $.map([1,2],function(ind){return ind+1});
        ```

        * @param {Array|Object} elements
        * @param {Function} callback
        * @return {Object} appframework object with elements in it
        * @title $.map(elements,callback)
        */
        $.map = function(elements, callback) {
            var value, values = [],
                i, key;
            if ($.isArray(elements))
                for (i = 0; i < elements.length; i++) {
                    value = callback.apply(elements[i],[i,elements[i]]);
                    if (value !== undefined)
                        values.push(value);
            } else if ($.isObject(elements))
                for (key in elements) {
                    if (!elements.hasOwnProperty(key) || key == "length")
                        continue;
                    value = callback(elements[key],[key,elements[key]]);
                    if (value !== undefined)
                        values.push(value);
            }
            return $(values);
        };

        /**
        * Checks to see if the parameter is an array
            ```
            var arr=[];
            $.isArray(arr);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @example $.isArray([1]);
        * @title $.isArray(param)
        */
        $.isArray = function(obj) {
            return obj.getInstanceType() == 'Array'
        };

        /**
        * Checks to see if the parameter is a function
            ```
            var func=function(){};
            $.isFunction(func);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.isFunction(param)
        */
        $.isFunction = function(obj) {
            return typeof obj === "function" && !(obj instanceof RegExp);
        };

        /*
        NEW LIEN
        */
        $.isWindow = function(obj) { 
            return obj != null && obj == obj.window;
        };
        /**
        * Checks to see if the parameter is a object
            ```
            var foo={bar:'bar'};
            $.isObject(foo);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.isObject(param)
        */
        $.isObject = function(obj) {
            return typeof obj === "object" && obj !== null;
        };
        /*
        NEW LIEN
        */
        $.isPlainObject = function(obj) {
            return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
        };

        $.isEmptyObject = function( obj ) {
            var name;
            for ( name in obj ) {
                return false;
            }
            return true;
        };

        /**
         * Prototype for afm object.  Also extens $.fn
         */
        $.fn = $query.prototype = {
            namepsace:"appframework",
            constructor: $query,
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            indexOf: emptyArray.indexOf,
            concat: emptyArray.concat,
            selector: _selector,
            oldElement: undefined,
            slice: emptyArray.slice,
            length: 0,
            /**
             * This is a utility function for .end()
             * @param {Object} params
             * @return {Object} an appframework with params.oldElement set to this
             * @api private
             */
            setupOld: function(params) {
                if (params == undefined)
                    return $();
                params.oldElement = this;
                return params;

            },
            /**
            * This is a wrapper to $.map on the selected elements
                ```
                $().map(function(){this.value+=ind});
                ```

            * @param {Function} callback
            * @return {Object} an appframework object
            * @title $().map(function)
            */
            map: function(fn) {
                var value, values = [],
                    i;
                for (i = 0; i < this.length; i++) {
                    value = fn.apply(this[i],[i,this[i]]);
                    if (value !== undefined)
                        values.push(value);
                }
                return $(values);
            },
            /**
            * Iterates through all elements and applys a callback function
                ```
                $().each(function(){console.log(this.value)});
                ```

            * @param {Function} callback
            * @return {Object} an appframework object
            * @title $().each(function)
            */
            each: function(callback) {
                this.forEach(function(el, idx) {
                    callback.call(el, idx, el);
                });
                return this;
            },
            /**
            * This is executed when DOMContentLoaded happens, or after if you've registered for it.
                ```
                $(document).ready(function(){console.log('I'm ready');});
                ```

            * @param {Function} callback
            * @return {Object} an appframework object
            * @title $().ready(function)
            */

            // BY LIEN !!! add iframe event

            ready: function(callback) {
                var document = this[0];
                if (document.readyState === "complete" || document.readyState === "loaded" || (!$.os.ie && document.readyState === "interactive")) //IE10 fires interactive too early
                    callback();
                else
                    document.addEventListener("DOMContentLoaded", callback, false);
                return this;
            },
            /**
            * Searches through the collection and reduces them to elements that match the selector
                ```
                $("#foo").find('.bar');
                $("#foo").find($('.bar'));
                $("#foo").find($('.bar').get(0));
                ```

            * @param {String|Object|Array} selector
            * @return {Object} an appframework object filtered
            * @title $().find(selector)

            */
            find: function(sel) {
                if (this.length === 0)
                    return this;
                var elems = [];
                var tmpElems;
                for (var i = 0; i < this.length; i++) {
                    tmpElems = ($(sel, this[i]));

                    for (var j = 0; j < tmpElems.length; j++) {
                        elems.push(tmpElems[j]);
                    }
                }
                
                return $(unique(elems));
            },
            /**
            * Gets or sets the innerHTML for the collection.
            * If used as a get, the first elements innerHTML is returned
                ```
                $("#foo").html(); //gets the first elements html
                $("#foo").html('new html');//sets the html
                $("#foo").html('new html',false); //Do not do memory management cleanup
                ```

            * @param {String} html to set
            * @param {Bool} [cleanup] - set to false for performance tests and if you do not want to execute memory management cleanup
            * @return {Object} an appframework object
            * @title $().html([html])
            */
            html: function(html, cleanup) {
                if (this.length === 0)
                    return this;
                if (html === undefined)
                    return this[0].innerHTML;

                for (var i = 0; i < this.length; i++) {
                    if (cleanup !== false)
                        $.cleanUpContent(this[i], false, true);
                    if (isWin8) {
                        var item=this[i];
                        MSApp.execUnsafeLocalFunction(function() {
                            item.innerHTML = html;
                        });
                    } else
                        this[i].innerHTML = html;
                }
                return this;
            },


            /**
            * Gets or sets the innerText for the collection.
            * If used as a get, the first elements innerText is returned
                ```
                $("#foo").text(); //gets the first elements text;
                $("#foo").text('new text'); //sets the text
                ```

            * @param {String} text to set
            * @return {Object} an appframework object
            * @title $().text([text])
            */
            text: function(text) {
                if (this.length === 0)
                    return this;
                if (text === undefined)
                    return this[0].textContent;
                for (var i = 0; i < this.length; i++) {
                    this[i].textContent = text;
                }
                return this;
            },
            /**
            * Gets or sets a css property for the collection
            * If used as a get, the first elements css property is returned
            * This will add px to properties that need it.
                ```
                $().css("background"); // Gets the first elements background
                $().css("background","red")  //Sets the elements background to red
                ```

            * @param {String} attribute to get
            * @param {String} value to set as
            * @return {Object} an appframework object
            * @title $().css(attribute,[value])
            */
            css: function(attribute, value, obj) {
                var toAct = obj != undefined ? obj : this[0];
                if (this.length === 0)
                    return this;
                if (value == undefined && typeof(attribute) === "string") {
                    var styles = window.getComputedStyle(toAct);
                    return toAct.style[attribute] ? toAct.style[attribute] : window.getComputedStyle(toAct)[attribute];
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(attribute)) {
                        for (var j in attribute) {
                            this[i].style.set(j, attribute[j]);
                        }
                    } else {
                        this[i].style.set(attribute, value);
                    }
                }
                return this;
            },
            /**
             * Gets the computed style of CSS values
             *
            ```
               $("#main").computedStyle('display');
            ```
             * @param {String} css property
             * @return {Int|String|Float|} css vlaue
             * @title $().computedStyle()
             */
            computedStyle: function(val) {
                if (this.length === 0 || val == undefined) return;
                return window.getComputedStyle(this[0], '')[val];
            },
            /**
            * Sets the innerHTML of all elements to an empty string
                ```
                $().empty();
                ```

            * @return {Object} an appframework object
            * @title $().empty()
            */
            empty: function() {
                for (var i = 0; i < this.length; i++) {
                    $.cleanUpContent(this[i], false, true);
                    this[i].textContent = '';
                }
                return this;
            },
            /**
            * Sets the elements display property to "none".
            * This will also store the old property into an attribute for hide
                ```
                $().hide();
                ```

            * @return {Object} an appframework object
            * @title $().hide()
            */
            hide: function() {
                if (this.length === 0)
                    return this;
                for (var i = 0; i < this.length; i++) {
                    if (this.css("display", null, this[i]) != "none") {
                        this[i].setAttribute("afmOldStyle", this.css("display", null, this[i]));
                        this[i].style.display = "none";
                    }
                }
                return this;
            },
            /**
            * Shows all the elements by setting the css display property
            * We look to see if we were retaining an old style (like table-cell) and restore that, otherwise we set it to block
                ```
                $().show();
                ```

            * @return {Object} an appframework object
            * @title $().show()
            */
            show: function() {
                if (this.length === 0)
                    return this;
                for (var i = 0; i < this.length; i++) {
                    if (this.css("display", null, this[i]) == "none") {
                        this[i].style.display = this[i].getAttribute("afmOldStyle") ? this[i].getAttribute("afmOldStyle") : 'block';
                        this[i].removeAttribute("afmOldStyle");
                    }
                }
                return this;
            },
            /**
            * Toggle the visibility of a div
                ```
                $().toggle();
                $().toggle(true); //force showing
                ```

            * @param {Boolean} [show] -force the hiding or showing of the element
            * @return {Object} an appframework object
            * @title $().toggle([show])
            */
            toggle: function(show) {
                if(this.length === 0)
                    return this;
                var show2 = !!(show === true);
                for (var i = 0; i < this.length; i++) {
                    if (this.css("display", null, this[i]) != "none" && (show == undefined || show2 === false)) {
                        this[i].setAttribute("afmOldStyle", this.css("display", null, this[i]));
                        this[i].style.display = "none";
                    } else if (this.css("display", null, this[i]) == "none" && (show == undefined || show2 === true)) {
                        this[i].style.display = this[i].getAttribute("afmOldStyle") ? this[i].getAttribute("afmOldStyle") : 'block';
                        this[i].removeAttribute("afmOldStyle");
                    }
                }
                return this;
            },
            /**
            * Gets or sets an elements value
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().value; //Gets the first elements value;
                $().value="bar"; //Sets all elements value to bar
                ```

            * @param {String} [value] to set
            * @return {String|Object} A string as a getter, appframework object as a setter
            * @title $().val([value])
            */
            val: function(value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;
                if (value == undefined)
                    return this[0].value;
                for (var i = 0; i < this.length; i++) {
                    this[i].value = value;
                }
                return this;
            },
            /**
            * Gets or sets an attribute on an element
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().attr("foo"); //Gets the first elements 'foo' attribute
                $().attr("foo","bar");//Sets the elements 'foo' attribute to 'bar'
                $().attr("foo",{bar:'bar'}) //Adds the object to an internal cache
                ```

            * @param {String|Object} attribute to act upon.  If it's an object (hashmap), it will set the attributes based off the kvp.
            * @param {String|Array|Object|function} [value] to set
            * @return {String|Object|Array|Function} If used as a getter, return the attribute value.  If a setter, return an appframework object
            * @title $().attr(attribute,[value])
            */
            attr: function(attr, value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;
                if (value === undefined && !$.isObject(attr)) {
                    var val = (this[0].afmCacheId && _attrCache[this[0].afmCacheId][attr]) ? (this[0].afmCacheId && _attrCache[this[0].afmCacheId][attr]) : this[0].getAttribute(attr);
                    return val;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(attr)) {
                        for (var key in attr) {
                            $(this[i]).attr(key, attr[key]);
                        }
                    } else if ($.isArray(value) || $.isObject(value) || $.isFunction(value)) {

                        if (!this[i].afmCacheId)
                            this[i].afmCacheId = $.uuid();

                        if (!_attrCache[this[i].afmCacheId])
                            _attrCache[this[i].afmCacheId] = {};
                        _attrCache[this[i].afmCacheId][attr] = value;
                    } else if (value === null) {
                        this[i].removeAttribute(attr);
                        if (this[i].afmCacheId && _attrCache[this[i].afmCacheId][attr])
                            delete _attrCache[this[i].afmCacheId][attr];
                    } else {
                        this[i].setAttribute(attr, value);
                    }
                }
                return this;
            },
            /**
            * Removes an attribute on the elements
                ```
                $().removeAttr("foo");
                ```

            * @param {String} attributes that can be space delimited
            * @return {Object} appframework object
            * @title $().removeAttr(attribute)
            */
            removeAttr: function(attr) {
                var that = this;
                for (var i = 0; i < this.length; i++) {
                    attr.split(/\s+/g).forEach(function(param) {
                        that[i].removeAttribute(param);
                        if (that[i].afmCacheId && _attrCache[that[i].afmCacheId][attr])
                            delete _attrCache[that[i].afmCacheId][attr];
                    });
                }
                return this;
            },

            /**
            * Gets or sets a property on an element
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().prop("foo"); //Gets the first elements 'foo' property
                $().prop("foo","bar");//Sets the elements 'foo' property to 'bar'
                $().prop("foo",{bar:'bar'}) //Adds the object to an internal cache
                ```

            * @param {String|Object} property to act upon.  If it's an object (hashmap), it will set the attributes based off the kvp.
            * @param {String|Array|Object|function} [value] to set
            * @return {String|Object|Array|Function} If used as a getter, return the property value.  If a setter, return an appframework object
            * @title $().prop(property,[value])
            */
            prop: function(prop, value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;
                if (value === undefined && !$.isObject(prop)) {
                    var res;
                    var val = (this[0].afmCacheId && _propCache[this[0].afmCacheId][prop]) ? (this[0].afmCacheId && _propCache[this[0].afmCacheId][prop]) : !(res = this[0][prop]) && prop in this[0] ? this[0][prop] : res;
                    return val;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(prop)) {
                        for (var key in prop) {
                            $(this[i]).prop(key, prop[key]);
                        }
                    } else if ($.isArray(value) || $.isObject(value) || $.isFunction(value)) {

                        if (!this[i].afmCacheId)
                            this[i].afmCacheId = $.uuid();

                        if (!_propCache[this[i].afmCacheId])
                            _propCache[this[i].afmCacheId] = {};
                        _propCache[this[i].afmCacheId][prop] = value;
                    } else if (value === null && value !== undefined) {
                        $(this[i]).removeProp(prop);
                    } else {
                        this[i][prop] = value;
                    }
                }
                return this;
            },
            /**
            * Removes a property on the elements
                ```
                $().removeProp("foo");
                ```

            * @param {String} properties that can be space delimited
            * @return {Object} appframework object
            * @title $().removeProp(attribute)
            */
            removeProp: function(prop) {
                var that = this;
                for (var i = 0; i < this.length; i++) {
                    prop.split(/\s+/g).forEach(function(param) {
                        if (that[i][param])
                            that[i][param] = undefined;
                        if (that[i].afmCacheId && _propCache[that[i].afmCacheId][prop]) {
                            delete _propCache[that[i].afmCacheId][prop];
                        }
                    });
                }
                return this;
            },

            /**
            * Removes elements based off a selector
                ```
                $().remove();  //Remove all
                $().remove(".foo");//Remove off a string selector
                var element=$("#foo").get(0);
                $().remove(element); //Remove by an element
                $().remove($(".foo"));  //Remove by a collection

                ```

            * @param {String|Object|Array} selector to filter against
            * @return {Object} appframework object
            * @title $().remove(selector)
            */
            remove: function(selector) {
                var elems = $(this).filter(selector);
                if (elems == undefined)
                    return this;
                for (var i = 0; i < elems.length; i++) {
                    $.cleanUpContent(elems[i], true, true);
                    if (elems[i] && elems[i].parentNode) {
                        elems[i].parentNode.removeChild(elems[i]);
                    }
                }
                return this;
            },
            /**
            * Adds a css class to elements.
                ```
                $().addClass("selected");
                ```

            * @param {String} classes that are space delimited
            * @return {Object} appframework object
            * @title $().addClass(name)
            */
            addClass: function(name) {
                if (name == undefined) return this;
                for (var i = 0; i < this.length; i++) {
                    var cls = this[i].className;
                    var classList = [];
                    var that = this;
                    name.split(/\s+/g).forEach(function(cname) {
                        if (!that.hasClass(cname, that[i]))
                            classList.push(cname);
                    });

                    this[i].className += (cls ? " " : "") + classList.join(" ");
                    this[i].className = this[i].className.trim();
                }
                return this;
            },
            /**
            * Removes a css class from elements.
                ```
                $().removeClass("foo"); //single class
                $().removeClass("foo selected");//remove multiple classess
                ```

            * @param {String} classes that are space delimited
            * @return {Object} appframework object
            * @title $().removeClass(name)
            */
            removeClass: function(name) {
                if (name == undefined) return this;
                for (var i = 0; i < this.length; i++) {
                    if (name == undefined) {
                        this[i].className = '';
                        return this;
                    }
                    var classList = this[i].className;
                    //SGV LINK EVENT
                    if (typeof this[i].className == "object") {
                        classList = " ";
                    }
                    name.split(/\s+/g).forEach(function(cname) {
                        classList = classList.replace(classRE(cname), " ");
                    });
                    if (classList.length > 0)
                        this[i].className = classList.trim();
                    else
                        this[i].className = "";
                }
                return this;
            },
            /**
            * Adds or removes a css class to elements.
                ```
                $().toggleClass("selected");
                ```

            * @param {String} classes that are space delimited
            * @param {Boolean} [state] force toggle to add or remove classes
            * @return {Object} appframework object
            * @title $().toggleClass(name)
            */
            toggleClass: function(name, state) {
                if (name == undefined) return this;
                for (var i = 0; i < this.length; i++) {
                    if (typeof state != "boolean") {
                        state = this.hasClass(name, this[i]);
                    }
                    $(this[i])[state ? 'removeClass' : 'addClass'](name);
                }
                return this;
            },
            /**
            * Replaces a css class on elements.
                ```
                $().replaceClass("on", "off");
                ```

            * @param {String} classes that are space delimited
            * @param {String} classes that are space delimited
            * @return {Object} appframework object
            * @title $().replaceClass(old, new)
            */
            replaceClass: function(name, newName) {
                if (name == undefined || newName == undefined) return this;
                for (var i = 0; i < this.length; i++) {
                    if (name == undefined) {
                        this[i].className = newName;
                        continue;
                    }
                    var classList = this[i].className;
                    name.split(/\s+/g).concat(newName.split(/\s+/g)).forEach(function(cname) {
                        classList = classList.replace(classRE(cname), " ");
                    });
                    classList = classList.trim();
                    if (classList.length > 0) {
                        this[i].className = (classList + " " + newName).trim();
                    } else
                        this[i].className = newName;
                }
                return this;
            },
            /**
            * Checks to see if an element has a class.
                ```
                $().hasClass('foo');
                $().hasClass('foo',element);
                ```

            * @param {String} class name to check against
            * @param {Object} [element] to check against
            * @return {Boolean}
            * @title $().hasClass(name,[element])
            */
            hasClass: function(name, element) {
                if (this.length === 0)
                    return false;
                if (!element)
                    element = this[0];
                return classRE(name).test(element.className);
            },
            /**
            * Appends to the elements
            * We boil everything down to an appframework object and then loop through that.
            * If it's HTML, we create a dom element so we do not break event bindings.
            * if it's a script tag, we evaluate it.
                ```
                $().append("<div></div>"); //Creates the object from the string and appends it
                $().append($("#foo")); //Append an object;
                ```

            * @param {String|Object} Element/string to add
            * @param {Boolean} [insert] insert or append
            * @return {Object} appframework object
            * @title $().append(element,[insert])
            */
            append: function(element, insert) {
                if (element && element.length != undefined && element.length === 0)
                    return this;
                if ($.isArray(element) || $.isObject(element))
                    element = $(element);
                var i;


                for (i = 0; i < this.length; i++) {
                    if (element.length && typeof element != "string") {
                        element = $(element);
                        _insertFragments(element, this[i], insert);
                    } else {
                        var obj = fragmentRE.test(element) ? $(element) : undefined;                        
                        if (obj == undefined || obj.length === 0) {
                            obj = document.createTextNode(element);
                        }
                        if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
                            window['eval'](obj.innerHTML);
                        } else if (obj instanceof $query) {
                            _insertFragments(obj, this[i], insert);
                        } else {
                            insert != undefined ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
                        }
                    }
                }
                return this;
            },
            /**
            * Appends the current collection to the selector
                ```
                $().appendTo("#foo"); //Append an object;
                ```

            * @param {String|Object} Selector to append to
            * @param {Boolean} [insert] insert or append
            * @title $().appendTo(element,[insert])
            */
            appendTo: function(selector, insert) {
                var tmp = $(selector);
                tmp.append(this);
                return this;
            },
            /**
            * Prepends the current collection to the selector
                ```
                $().prependTo("#foo"); //Prepend an object;
                ```

            * @param {String|Object} Selector to prepent to
            * @title $().prependTo(element)
            */
            prependTo: function(selector) {
                var tmp = $(selector);
                tmp.append(this, true);
                return this;
            },
            /**
            * Prepends to the elements
            * This simply calls append and sets insert to true
                ```
                $().prepend("<div></div>");//Creates the object from the string and appends it
                $().prepend($("#foo")); //Prepends an object
                ```

            * @param {String|Object} Element/string to add
            * @return {Object} appframework object
            * @title $().prepend(element)
            */
            prepend: function(element) {
                return this.append(element, 1);
            },
            /**
             * Inserts collection before the target (adjacent)
                ```
                $().inBefore(af("#target"));
                ```

             * @param {String|Object} Target
             * @title $().before(target);
             */
            before: function(target, after) {
                if (this.length === 0)
                    return this;
                target = $(target).get(0);
                if (!target)
                    return this;

                for (var i = 0; i < this.length; i++) {
                    after ? target.parentNode.insertBefore(this[i], target.nextSibling) : target.parentNode.insertBefore(this[i], target);
                }
                return this;
            },
            /**
             * Inserts collection after the target (adjacent)
                ```
                $().inAfter(af("#target"));
                ```
             * @param {String|Object} target
             * @title $().after(target);
             */
            after: function(target) {
                this.before(target, true);
            },
            /**
            * Returns the raw DOM element.
                ```
                $().get(0); //returns the first element
                $().get(2);// returns the third element
                ```

            * @param {Int} [index]
            * @return {Object} raw DOM element
            * @title $().get([index])
            */
            get: function(index) {
                index = index == undefined ? 0 : index;
                if (index < 0)
                    index += this.length;
                return (this[index]) ? this[index] : undefined;
            },
            /**
            * Returns the offset of the element, including traversing up the tree
                ```
                $().offset();
                ```

            * @return {Object} with left, top, width and height properties
            * @title $().offset()
            */
            offset: function() {
                var obj;
                if (this.length === 0)
                    return this;
                if (this[0] == window)
                    return {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                else
                    obj = this[0].getBoundingClientRect();

                return {
                    left: obj.left + window.pageXOffset,
                    top: obj.top + window.pageYOffset,
                    right: obj.right + window.pageXOffset,
                    bottom: obj.bottom + window.pageYOffset,
                    width: obj.right - obj.left,
                    height: obj.bottom - obj.top
                };
            },
            /**
             * returns the height of the element, including padding on IE
               ```
               $().height();
               ```
             * @return {string} height
             * @title $().height()
             */
            height: function(val) {
                if (this.length === 0)
                    return this;
                if (val != undefined)
                    return this.css("height", val);
                if (this[0] == this[0].window)
                    return window.innerHeight;
                if (this[0].nodeType == this[0].DOCUMENT_NODE)
                    return this[0].documentElement.offsetheight;
                else {
                    var tmpVal = this.css("height").replace("px", "");
                    if (tmpVal)
                        return tmpVal;
                    else
                        return this.offset().height;
                }
            },
            /**
             * returns the width of the element, including padding on IE
               ```
               $().width();
               ```
             * @return {string} width
             * @title $().width()
             */
            width: function(val) {
                if (this.length === 0)
                    return this;
                if (val != undefined)
                    return this.css("width", val);
                if (this[0] == this[0].window)
                    return window.innerWidth;
                if (this[0].nodeType == this[0].DOCUMENT_NODE)
                    return this[0].documentElement.offsetwidth;
                else {
                    var tmpVal = this.css("width").replace("px", "");
                    if (tmpVal)
                        return tmpVal;
                    else
                        return this.offset().width;
                }
            },
            /**
            * Returns the parent nodes of the elements based off the selector
                ```
                $("#foo").parent('.bar');
                $("#foo").parent($('.bar'));
                $("#foo").parent($('.bar').get(0));
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} appframework object with unique parents
            * @title $().parent(selector)
            */
            parent: function(selector, recursive) {
                if (this.length === 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    var tmp = this[i];
                    while (tmp.parentNode && tmp.parentNode != document) {
                        elems.push(tmp.parentNode);
                        if (tmp.parentNode)
                            tmp = tmp.parentNode;
                        if (!recursive)
                            break;
                    }
                }
                return this.setupOld($(unique(elems)).filter(selector));
            },
            /**
            * Returns the parents of the elements based off the selector (traversing up until html document)
                ```
                $("#foo").parents('.bar');
                $("#foo").parents($('.bar'));
                $("#foo").parents($('.bar').get(0));
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} appframework object with unique parents
            * @title $().parents(selector)
            */
            parents: function(selector) {
                return this.parent(selector, true);
            },
            /**
            * Returns the child nodes of the elements based off the selector
                ```
                $("#foo").children('.bar'); //Selector
                $("#foo").children($('.bar')); //Objects
                $("#foo").children($('.bar').get(0)); //Single element
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} appframework object with unique children
            * @title $().children(selector)
            */
            childrens: function(selector) {

                if (this.length === 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    elems = elems.concat(siblings(this[i].firstChild));
                }
                return this.setupOld($((elems)).filter(selector));

            },
            /**
            * Returns the siblings of the element based off the selector
                ```
                $("#foo").siblings('.bar'); //Selector
                $("#foo").siblings($('.bar')); //Objects
                $("#foo").siblings($('.bar').get(0)); //Single element
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} appframework object with unique siblings
            * @title $().siblings(selector)
            */
            siblings: function(selector) {
                if (this.length === 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode)
                        elems = elems.concat(siblings(this[i].parentNode.firstChild, this[i]));
                }
                return this.setupOld($(elems).filter(selector));
            },
            /**
            * Returns the closest element based off the selector and optional context
                ```
                $("#foo").closest('.bar'); //Selector
                $("#foo").closest($('.bar')); //Objects
                $("#foo").closest($('.bar').get(0)); //Single element
                ```

            * @param {String|Array|Object} selector
            * @param {Object} [context]
            * @return {Object} Returns an appframework object with the closest element based off the selector
            * @title $().closest(selector,[context]);
            */
            closest: function(selector, context) {
                if (this.length === 0)
                    return this;
                var elems = [],
                    cur = this[0];

                var start = $(selector, context);
                if (start.length === 0)
                    return $();
                while (cur && start.indexOf(cur) == -1) {
                    cur = cur !== context && cur !== document && cur.parentNode;
                }
                return $(cur);

            },
            /**
            * Filters elements based off the selector
                ```
                $("#foo").filter('.bar'); //Selector
                $("#foo").filter($('.bar')); //Objects
                $("#foo").filter($('.bar').get(0)); //Single element
                ```

            * @param {String|Array|Object} selector
            * @return {Object} Returns an appframework object after the filter was run
            * @title $().filter(selector);
            */
            filter: function(selector) {
                if (this.length === 0)
                    return this;

                if (selector == undefined)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    var val = this[i];
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) >= 0)
                        elems.push(val);
                }
                return this.setupOld($(unique(elems)));
            },
            /**
            * Basically the reverse of filter.  Return all elements that do NOT match the selector
                ```
                $("#foo").not('.bar'); //Selector
                $("#foo").not($('.bar')); //Objects
                $("#foo").not($('.bar').get(0)); //Single element
                ```

            * @param {String|Array|Object} selector
            * @return {Object} Returns an appframework object after the filter was run
            * @title $().not(selector);
            */
            not: function(selector) {
                if (this.length === 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    var val = this[i];
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) == -1)
                        elems.push(val);
                }
                return this.setupOld($(unique(elems)));
            },
            /**
            * Gets or set data-* attribute parameters on elements (when a string)
            * When used as a getter, it's only the first element
                ```
                $().data("foo"); //Gets the data-foo attribute for the first element
                $().data("foo","bar"); //Sets the data-foo attribute for all elements
                $().data("foo",{bar:'bar'});//object as the data
                ```

            * @param {String} key
            * @param {String|Array|Object} value
            * @return {String|Object} returns the value or appframework object
            * @title $().data(key,[value]);
            */
            data: function(key, value) {
                return this.attr('data-' + key, value);
            },
            /**
            * Rolls back the appframework elements when filters were applied
            * This can be used after .not(), .filter(), .children(), .parent()
                ```
                $().filter(".panel").end(); //This will return the collection BEFORE filter is applied
                ```

            * @return {Object} returns the previous appframework object before filter was applied
            * @title $().end();
            */
            end: function() {
                return this.oldElement != undefined ? this.oldElement : $();
            },
            /**
            * Clones the nodes in the collection.
                ```
                $().clone();// Deep clone of all elements
                $().clone(false); //Shallow clone
                ```

            * @param {Boolean} [deep] - do a deep copy or not
            * @return {Object} appframework object of cloned nodes
            * @title $().clone();
            */
            clone: function(deep) {
                deep = deep === false ? false : true;
                if (this.length === 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    elems.push(this[i].cloneNode(deep));
                }

                return $(elems);
            },
            /**
            * Returns the number of elements in the collection
                ```
                $().size();
                ```

            * @return {Int}
            * @title $().size();
            */
            size: function() {
                return this.length;
            },
            /**
             * Serailizes a form into a query string
               ```
               $().serialize();
               ```
             * @return {String}
             * @title $().serialize()
             */
            serialize: function() {
                if (this.length === 0)
                    return "";
                var params = [];
                for (var i = 0; i < this.length; i++) {
                    this.slice.call(this[i].elements).forEach(function(elem) {
                        var type = elem.getAttribute("type");
                        if (elem.nodeName.toLowerCase() != "fieldset" && !elem.disabled && type != "submit" && type != "reset" && type != "button" && ((type != "radio" && type != "checkbox") || elem.checked)) {

                            if (elem.getAttribute("name")) {
                                if (elem.type == "select-multiple") {
                                    for (var j = 0; j < elem.options.length; j++) {
                                        if (elem.options[j].selected)
                                            params.push(elem.getAttribute("name") + "=" + encodeURIComponent(elem.options[j].value));
                                    }
                                } else
                                    params.push(elem.getAttribute("name") + "=" + encodeURIComponent(elem.value));
                            }
                        }
                    });
                }
                return params.join("&");
            },

            /* added in 1.2 */
            /**
             * Reduce the set of elements based off index
                ```
               $().eq(index)
               ```
             * @param {Int} index - Index to filter by. If negative, it will go back from the end
             * @return {Object} appframework object
             * @title $().eq(index)
             */
            eq: function(ind) {
                return $(this.get(ind));
            },
            /**
             * Returns the index of the selected element in the collection
               ```
               $().index(elem)
               ```
             * @param {String|Object} element to look for.  Can be a selector or object
             * @return integer - index of selected element
             * @title $().index(elem)
             */
            index: function(elem) {
                return elem ? this.indexOf($(elem)[0]) : this.parent().children().indexOf(this[0]);
            },
            /**
              * Returns boolean if the object is a type of the selector
              ```
              $().is(selector)
              ```
             * param {String|Object} selector to act upon
             * @return boolean
             * @title $().is(selector)
             */
            is: function(selector) {
                return !!selector && this.filter(selector).length > 0;
            },

            /**
              * query transform to native array
             */
            toArray: function() {
                var query = []

                for (var i = 0, l = this.length; i < l; i++) {
                    query.push(this[i])
                }

                return query
            }

        };


        /* AJAX functions */

        function empty() {}
        $.ajaxSettings = {
            type: 'GET',
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: undefined,
            timeout: 0,
            crossDomain: null
        };
        /**
        * Execute a jsonP call, allowing cross domain scripting
        * options.url - URL to call
        * options.success - Success function to call
        * options.error - Error function to call
            ```
            $.jsonP({url:'mysite.php?callback=?&foo=bar',success:function(){},error:function(){}});
            ```

        * @param {Object} options
        * @title $.jsonP(options)
        */
        $.jsonP = function(options) {
            if (isWin8) {
                options.type = "get";
                options.dataType = null;
                return $.get(options);
            }
            var callbackName = 'jsonp_callback' + (++_jsonPID);
            var abortTimeout = "",
                context;
            var script = document.createElement("script");
            var abort = function() {
                $(script).remove();
                if (window[callbackName])
                    window[callbackName] = empty;
            };
            window[callbackName] = function(data) {
                clearTimeout(abortTimeout);
                $(script).remove();
                delete window[callbackName];
                options.success.call(context, data);
            };
            script.src = options.url.replace(/=\?/, '=' + callbackName);
            if (options.error) {
                script.onerror = function() {
                    clearTimeout(abortTimeout);
                    options.error.call(context, "", 'error');
                };
            }
            $('head').append(script);
            if (options.timeout > 0)
                abortTimeout = setTimeout(function() {
                    options.error.call(context, "", 'timeout');
                }, options.timeout);
            return {};
        };

        /**
        * Execute an Ajax call with the given options
        * options.type - Type of request
        * options.beforeSend - function to execute before sending the request
        * options.success - success callback
        * options.error - error callback
        * options.complete - complete callback - callled with a success or error
        * options.timeout - timeout to wait for the request
        * options.url - URL to make request against
        * options.contentType - HTTP Request Content Type
        * options.headers - Object of headers to set
        * options.dataType - Data type of request
        * options.data - data to pass into request.  $.param is called on objects
            ```
            var opts={
            type:"GET",
            success:function(data){},
            url:"mypage.php",
            data:{bar:'bar'},
            }
            $.ajax(opts);
            ```

        * @param {Object} options
        * @title $.ajax(options)
        */
        $.ajax = function(opts) {
            var xhr;
            try {

                var settings = opts || {};
                for (var key in $.ajaxSettings) {
                    if (typeof(settings[key]) == 'undefined')
                        settings[key] = $.ajaxSettings[key];
                }

                if (!settings.url)
                    settings.url = window.location;
                if (!settings.contentType)
                    settings.contentType = "application/x-www-form-urlencoded";
                if (!settings.headers)
                    settings.headers = {};

                if (!('async' in settings) || settings.async !== false)
                    settings.async = true;

                if (!settings.dataType)
                    settings.dataType = "text/html";
                else {
                    switch (settings.dataType) {
                        case "script":
                            settings.dataType = 'text/javascript, application/javascript';
                            break;
                        case "json":
                            settings.dataType = 'application/json';
                            break;
                        case "xml":
                            settings.dataType = 'application/xml, text/xml';
                            break;
                        case "html":
                            settings.dataType = 'text/html';
                            break;
                        case "text":
                            settings.dataType = 'text/plain';
                            break;
                        default:
                            settings.dataType = "text/html";
                            break;
                        case "jsonp":
                            return $.jsonP(opts);
                    }
                }
                if ($.isObject(settings.data))
                    settings.data = $.param(settings.data);
                if (settings.type.toLowerCase() === "get" && settings.data) {
                    if (settings.url.indexOf("?") === -1)
                        settings.url += "?" + settings.data;
                    else
                        settings.url += "&" + settings.data;
                }

                if (/=\?/.test(settings.url)) {
                    return $.jsonP(settings);
                }
                if (settings.crossDomain === null) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
                        RegExp.$2 != window.location.host;

                if (!settings.crossDomain)
                    settings.headers = {}.extend({
                        'X-Requested-With': 'XMLHttpRequest'
                    }, settings.headers);

                var abortTimeout;
                var context = settings.context;
                var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;

                //ok, we are really using xhr
                xhr = new window.XMLHttpRequest();


                xhr.onreadystatechange = function() {
                    var mime = settings.dataType;
                    if (xhr.readyState === 4) {
                        clearTimeout(abortTimeout);
                        var result, error = false;
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0 && protocol == 'file:') {
                            if (mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
                                try {
                                    result = JSON.parse(xhr.responseText);
                                } catch (e) {
                                    error = e;
                                }
                            } else if (mime === 'application/xml, text/xml') {
                                result = xhr.responseXML;
                            } else if (mime == "text/html") {
                                result = xhr.responseText;
                                $.parseJS(result);
                            } else
                                result = xhr.responseText;
                            //If we're looking at a local file, we assume that no response sent back means there was an error
                            if (xhr.status === 0 && result.length === 0)
                                error = true;
                            if (error)
                                settings.error.call(context, xhr, 'parsererror', error);
                            else {
                                settings.success.call(context, result, 'success', xhr);
                            }
                        } else {
                            error = true;
                            settings.error.call(context, xhr, 'error');
                        }
                        settings.complete.call(context, xhr, error ? 'error' : 'success');
                    }
                };
                xhr.open(settings.type, settings.url, settings.async);
                if (settings.withCredentials) xhr.withCredentials = true;

                if (settings.contentType)
                    settings.headers['Content-Type'] = settings.contentType;
                for (var name in settings.headers)
                    if (typeof settings.headers[name] === 'string')
                        xhr.setRequestHeader(name, settings.headers[name]);
                if (settings.beforeSend.call(context, xhr, settings) === false) {
                    xhr.abort();
                    return false;
                }

                if (settings.timeout > 0)
                    abortTimeout = setTimeout(function() {
                        xhr.onreadystatechange = empty;
                        xhr.abort();
                        settings.error.call(context, xhr, 'timeout');
                    }, settings.timeout);
                xhr.send(settings.data);
            } catch (e) {
                // General errors (e.g. access denied) should also be sent to the error callback
                console.log(e);
                settings.error.call(context, xhr, 'error', e);
            }
            return xhr;
        };


        /**
        * Shorthand call to an Ajax GET request
            ```
            $.get("mypage.php?foo=bar",function(data){});
            ```

        * @param {String} url to hit
        * @param {Function} success
        * @title $.get(url,success)
        */
        $.get = function(url, success) {
            return this.ajax({
                url: url,
                success: success
            });
        };
        /**
        * Shorthand call to an Ajax POST request
            ```
            $.post("mypage.php",{bar:'bar'},function(data){});
            ```

        * @param {String} url to hit
        * @param {Object} [data] to pass in
        * @param {Function} success
        * @param {String} [dataType]
        * @title $.post(url,[data],success,[dataType])
        */
        $.post = function(url, data, success, dataType) {
            if (typeof(data) === "function") {
                success = data;
                data = {};
            }
            if (dataType === undefined)
                dataType = "html";
            return this.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: dataType,
                success: success
            });
        };
        /**
        * Shorthand call to an Ajax request that expects a JSON response
            ```
            $.getJSON("mypage.php",{bar:'bar'},function(data){});
            ```

        * @param {String} url to hit
        * @param {Object} [data]
        * @param {Function} [success]
        * @title $.getJSON(url,data,success)
        */
        $.getJSON = function(url, data, success) {
            if (typeof(data) === "function") {
                success = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                success: success,
                dataType: "json"
            });
        };

        /**
        * Converts an object into a key/value par with an optional prefix.  Used for converting objects to a query string
            ```
            var obj={
            foo:'foo',
            bar:'bar'
            }
            var kvp=$.param(obj,'data');
            ```

        * @param {Object} object
        * @param {String} [prefix]
        * @return {String} Key/value pair representation
        * @title $.param(object,[prefix];
        */
        $.param = function(obj, prefix) {
            var str = [];
            if (obj instanceof $query) {
                obj.each(function() {
                    var k = prefix ? prefix + "[" + this.id + "]" : this.id,
                        v = this.value;
                    str.push((k) + "=" + encodeURIComponent(v));
                });
            } else {
                for (var p in obj) {

                    if ($.isFunction(obj[p]))
                        continue;
                    var k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push($.isObject(v) ? $.param(v, k) : (k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };
        /**
        * Used for backwards compatibility.  Uses native JSON.parse function
            ```
            var obj=$.parseJSON("{\"bar\":\"bar\"}");
            ```

        * @params {String} string
        * @return {Object}
        * @title $.parseJSON(string)
        */
        $.parseJSON = function(string) {
            return JSON.parse(string);
        };
        /**
        * Helper function to convert XML into  the DOM node representation
            ```
            var xmlDoc=$.parseXML("<xml><foo>bar</foo></xml>");
            ```

        * @param {String} string
        * @return {Object} DOM nodes
        * @title $.parseXML(string)
        */
        $.parseXML = function(string) {
            if (isWin8) {
                MSApp.execUnsafeLocalFunction(function() {
                    return (new DOMParser()).parseFromString(string, "text/xml");
                });
            } else
                return (new DOMParser()).parseFromString(string, "text/xml");
        };
        /**
         * Helper function to parse the user agent.  Sets the following
         * .os.webkit
         * .os.android
         * .os.ipad
         * .os.iphone
         * .os.webos
         * .os.touchpad
         * .os.blackberry
         * .os.opera
         * .os.fennec
         * .os.ie
         * .os.ieTouch
         * .os.supportsTouch
         * .os.playbook
         * .feat.nativetouchScroll
         * @api private
         */

        $.os = device.os;
        $.feat = device.feat;

        /**
         * Utility function to create a psuedo GUID
           ```
           var id= $.uuid();
           ```
         * @title $.uuid
         */
        $.uuid = function() {
            var S4 = function() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        };

        /**
         * Gets the css matrix, or creates a fake one
           ```
           $.getCssMatrix(domElement)
           ```
           @returns matrix with postion
           */
        $.getCssMatrix = function(ele) {
            if ($.is$(ele)) ele = ele.get(0);

            var matrixFn = window.WebKitCSSMatrix || window.MSCSSMatrix;

            if (ele === undefined) {
                if (matrixFn) {
                    return new matrixFn();
                }
                else {
                    return {
                        a: 0,
                        b: 0,
                        c: 0,
                        d: 0,
                        e: 0,
                        f: 0
                    };
                }
            }

            var computedStyle = window.getComputedStyle(ele);

            var transform = computedStyle.webkitTransform ||
                            computedStyle.transform ||
                            computedStyle[$.feat.cssPrefix + 'Transform'];

            if (matrixFn)
                return new matrixFn(transform);
            else if (transform) {
                //fake css matrix
                var mat = transform.replace(/[^0-9\-.,]/g, '').split(',');
                return {
                    a: +mat[0],
                    b: +mat[1],
                    c: +mat[2],
                    d: +mat[3],
                    e: +mat[4],
                    f: +mat[5]
                };
            }
            else {
                return {
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                    e: 0,
                    f: 0
                };
            }
        };

        /**
         * $.create - a faster alertnative to $("<div id='main'>this is some text</div>");
          ```
          $.create("div",{id:'main',innerHTML:'this is some text'});
          $.create("<div id='main'>this is some text</div>");
          ```
          * @param {String} DOM Element type or html
          * @param [{Object}] properties to apply to the element
          * @return {Object} Returns an appframework object
          * @title $.create(type,[params])
          */
        $.create = function(type, props) {
            var elem;
            var f = new $query();
            if (props || type[0] !== "<") {
                if (props.html)
                    props.innerHTML = props.html, delete props.html;

                elem = document.createElement(type);
                for (var j in props) {
                    elem[j] = props[j];
                }
                f[f.length++] = elem;
            } else {
                elem = document.createElement("div");
                if (isWin8) {
                    MSApp.execUnsafeLocalFunction(function() {
                        elem.innerHTML = selector.trim();
                    });
                } else
                    elem.innerHTML = type;
                _shimNodes(elem.childNodes, f);
            }
            return f;
        };
        /**
         * $.query  - a faster alertnative to $("div");
          ```
          $.query(".panel");
          ```
          * @param {String} selector
          * @param {Object} [context]
          * @return {Object} Returns an appframework object
          * @title $.query(selector,[context])
          */
        $.query = function(sel, what) {
            if (!sel)
                return new $query();
            what = what || document;
            var f = new $query();
            return f.selector(sel, what);
        };
        /**
         Zepto.js events
         @api private
         */

        //The following is modified from Zepto.js / events.js
        //We've removed depricated  events like .live and allow anonymous functions to be removed
        var handlers = {},
            _afmid = 1;
        /**
         * Gets or sets the expando property on a javascript element
         * Also increments the internal counter for elements;
         * @param {Object} element
         * @return {Int} afmid
         * @api private
         */

        function afmid(element) {
            return element._afmid || (element._afmid = _afmid++);
        }
        /**
         * Searches through a local array that keeps track of event handlers for proxying.
         * Since we listen for multiple events, we match up the event, function and selector.
         * This is used to find, execute, remove proxied event functions
         * @param {Object} element
         * @param {String} [event]
         * @param {Function} [function]
         * @param {String|Object|Array} [selector]
         * @return {Function|null} handler function or false if not found
         * @api private
         */

        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns)
                var matcher = matcherFor(event.ns);
            return (handlers[afmid(element)] || []).filter(function(handler) {
                return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn == fn || (typeof handler.fn === 'function' && typeof fn === 'function' && handler.fn === fn)) && (!selector || handler.sel == selector);
            });
        }
        /**
         * Splits an event name by "." to look for namespaces (e.g touch.click)
         * @param {String} event
         * @return {Object} an object with the event name and namespace
         * @api private
         */

        function parse(event) {
            var parts = ('' + event).split('.');
            return {
                e: parts[0],
                ns: parts.slice(1).sort().join(' ')
            };
        }
        /**
         * Regular expression checker for event namespace checking
         * @param {String} namespace
         * @return {Regex} regular expression
         * @api private
         */

        function matcherFor(ns) {
            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
        }

        /**
         * Utility function that will loop through events that can be a hash or space delimited and executes the function
         * @param {String|Object} events
         * @param {Function} fn
         * @param {Iterator} [iterator]
         * @api private
         */

        function eachEvent(events, fn, iterator) {
            if ($.isObject(events))
                events.each(iterator)
            else
                events.split(/\s/).forEach(function(type) {
                    iterator(type, fn);
                });
        }

        /**
         * Helper function for adding an event and creating the proxy handler function.
         * All event handlers call this to wire event listeners up.  We create proxy handlers so they can be removed then.
         * This is needed for delegate/on
         * @param {Object} element
         * @param {String|Object} events
         * @param {Function} function that will be executed when event triggers
         * @param {String|Array|Object} [selector]
         * @param {Function} [getDelegate]
         * @api private
         */

        function add(element, events, fn, selector, getDelegate) {

            var id = afmid(element),
                set = (handlers[id] || (handlers[id] = []));
            eachEvent(events, fn, function(event, fn) {
                var delegate = getDelegate && getDelegate(fn, event),
                    callback = delegate || fn;
                var proxyfn = function(event) {
                    var result = callback.apply(element, [event].concat(event.data));
                    if (result === false)
                        event.preventDefault();
                    return result;
                };
                var handler = {}.extend(parse(event), {
                    fn: fn,
                    proxy: proxyfn,
                    sel: selector,
                    del: delegate,
                    i: set.length
                });
                set.push(handler);
                element.addEventListener(handler.e, proxyfn, false);
            });
            //element=null;
        }

        /**
         * Helper function to remove event listeners.  We look through each event and then the proxy handler array to see if it exists
         * If found, we remove the listener and the entry from the proxy array.  If no function is specified, we remove all listeners that match
         * @param {Object} element
         * @param {String|Object} events
         * @param {Function} [fn]
         * @param {String|Array|Object} [selector]
         * @api private
         */

        function remove(element, events, fn, selector) {

            var id = afmid(element);
            eachEvent(events || '', fn, function(event, fn) {
                findHandlers(element, event, fn, selector).forEach(function(handler) {
                    delete handlers[id][handler.i];
                    element.removeEventListener(handler.e, handler.proxy, false);
                });
            });
        }

        $.event = {
            add: add,
            remove: remove
        };

        /**
        * Binds an event to each element in the collection and executes the callback
            ```
            $().bind('click',function(){console.log('I clicked '+this.id);});
            ```

        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} appframework object
        * @title $().bind(event,callback)
        */
        $.fn.bind = function(event, callback) {
            for (var i = 0; i < this.length; i++) {
                add(this[i], event, callback);
            }
            return this;
        };
        /**
        * Unbinds an event to each element in the collection.  If a callback is passed in, we remove just that one, otherwise we remove all callbacks for those events
            ```
            $().unbind('click'); //Unbinds all click events
            $().unbind('click',myFunc); //Unbinds myFunc
            ```

        * @param {String|Object} event
        * @param {Function} [callback]
        * @return {Object} appframework object
        * @title $().unbind(event,[callback]);
        */
        $.fn.unbind = function(event, callback) {
            for (var i = 0; i < this.length; i++) {
                remove(this[i], event, callback);
            }
            return this;
        };

        /**
        * Binds an event to each element in the collection that will only execute once.  When it executes, we remove the event listener then right away so it no longer happens
            ```
            $().one('click',function(){console.log('I was clicked once');});
            ```

        * @param {String|Object} event
        * @param {Function} [callback]
        * @return appframework object
        * @title $().one(event,callback);
        */
        $.fn.one = function(event, callback) {
            return this.each(function(i, element) {
                add(this, event, callback, null, function(fn, type) {
                    return function() {
                        remove(element, type, fn);
                        if (!fn) return
                        var result = fn.apply(element, arguments);
                        return result;
                    };
                });
            });
        };

        /**
         * internal variables
         * @api private
         */

        var returnTrue = function() {
            return true;
        };
        var returnFalse = function() {
            return false;
        };
        var eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        };
        /**
         * Creates a proxy function for event handlers.
         * As "some" browsers dont support event.stopPropagation this call is bypassed if it cant be found on the event object.
         * @param {String} event
         * @return {Function} proxy
         * @api private
         */

        function createProxy(event) {
            var proxy = {}.extend({
                originalEvent: event
            }, event);
            eventMethods.each(function(name, predicate) {
                proxy[name] = function() {
                    this[predicate] = returnTrue;
                    if (name == "stopImmediatePropagation" || name == "stopPropagation") {
                        event.cancelBubble = true;
                        if (!event[name])
                            return;
                    }
                    return event[name].apply(event, arguments);
                };
                proxy[predicate] = returnFalse;
            });
            return proxy;
        }

        /**
        * Delegate an event based off the selector.  The event will be registered at the parent level, but executes on the selector.
            ```
            $("#div").delegate("p",'click',callback);
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} appframework object
        * @title $().delegate(selector,event,callback)
        */
        function addDelegate(element,event,callback,selector) {
            add(element, event, callback, selector, function(fn) {
                    return function(e) {
                        var evt, match = $(e.target).closest(selector, element).get(0);
                        if (match) {
                            evt = {}.extend(createProxy(e), {
                                currentTarget: match,
                                liveFired: element
                            });
                            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
                        }
                    };
                });
        }
        $.fn.delegate = function(selector, event, callback) {

            for (var i = 0; i < this.length; i++) {
                addDelegate(this[i],event,callback,selector)
            }
            return this;
        };

        /**
        * Unbinds events that were registered through delegate.  It acts upon the selector and event.  If a callback is specified, it will remove that one, otherwise it removes all of them.
            ```
            $("#div").undelegate("p",'click',callback);//Undelegates callback for the click event
            $("#div").undelegate("p",'click');//Undelegates all click events
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} appframework object
        * @title $().undelegate(selector,event,[callback]);
        */
        $.fn.undelegate = function(selector, event, callback) {
            for (var i = 0; i < this.length; i++) {
                remove(this[i], event, callback, selector);
            }
            return this;
        };

        /**
        * Similar to delegate, but the function parameter order is easier to understand.
        * If selector is undefined or a function, we just call .bind, otherwise we use .delegate
            ```
            $("#div").on("click","p",callback);
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} appframework object
        * @title $().on(event,selector,callback);
        */
        $.fn.on = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.bind(event, selector) : this.delegate(selector, event, callback);
        };
        /**
        * Removes event listeners for .on()
        * If selector is undefined or a function, we call unbind, otherwise it's undelegate
            ```
            $().off("click","p",callback); //Remove callback function for click events
            $().off("click","p") //Remove all click events
            ```

        * @param {String|Object} event
        * @param {String|Array|Object} selector
        * @param {Sunction} callback
        * @return {Object} appframework object
        * @title $().off(event,selector,[callback])
        */
        $.fn.off = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.unbind(event, selector) : this.undelegate(selector, event, callback);
        };

        /**
        This triggers an event to be dispatched.  Usefull for emulating events, etc.
        ```
        $().trigger("click",{foo:'bar'});//Trigger the click event and pass in data
        ```

        * @param {String|Object} event
        * @param {Object} [data]
        * @return {Object} appframework object
        * @title $().trigger(event,data);
        */
        $.fn.trigger = function(event, data, props) {
            if (typeof event == 'string')
                event = $.Event(event, props);
            event.data = data;
            for (var i = 0; i < this.length; i++) {
                this[i].dispatchEvent(event);
            }
            return this;
        };

        /**
         * Creates a custom event to be used internally.
         * @param {String} type
         * @param {Object} [properties]
         * @return {event} a custom event that can then be dispatched
         * @title $.Event(type,props);
         */

        $.Event = function(type, props) {
            var event = document.createEvent('Events'),
                bubbles = true;
            if (props)
                for (var name in props)
                    (name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name]);
            event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
            return event;
        };

        /* The following are for events on objects */
        /**
         * Bind an event to an object instead of a DOM Node
           ```
           $.bind(this,'event',function(){});
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Function} function to execute
         * @title $.bind(object,event,function);
         */
        $.bind = function(obj, ev, f) {
            if (!obj) return;
            if (!obj.__events) obj.__events = {};
            if (!$.isArray(ev)) ev = [ev];
            for (var i = 0; i < ev.length; i++) {
                if (!obj.__events[ev[i]]) obj.__events[ev[i]] = [];
                obj.__events[ev[i]].push(f);
            }
        };

        /**
         * Trigger an event to an object instead of a DOM Node
           ```
           $.trigger(this,'event',arguments);
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Array} arguments
         * @title $.trigger(object,event,argments);
         */
        $.trigger = function(obj, ev, args) {
            if (!obj) return;
            var ret = true;
            if (!obj.__events) return ret;
            if (!$.isArray(ev)) ev = [ev];
            if (!$.isArray(args)) args = [];
            for (var i = 0; i < ev.length; i++) {
                if (obj.__events[ev[i]]) {
                    var evts = obj.__events[ev[i]].slice(0);
                    for (var j = 0; j < evts.length; j++)
                        if ($.isFunction(evts[j]) && evts[j].apply(obj, args) === false)
                            ret = false;
                }
            }
            return ret;
        };
        /**
         * Unbind an event to an object instead of a DOM Node
           ```
           $.unbind(this,'event',function(){});
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Function} function to execute
         * @title $.unbind(object,event,function);
         */
        $.unbind = function(obj, ev, f) {
            if (!obj.__events) return;
            if (!$.isArray(ev)) ev = [ev];
            for (var i = 0; i < ev.length; i++) {
                if (obj.__events[ev[i]]) {
                    var evts = obj.__events[ev[i]];
                    for (var j = 0; j < evts.length; j++) {
                        if (f == undefined)
                            delete evts[j];
                        if (evts[j] == f) {
                            evts.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        };


        /**
         * Creates a proxy function so you can change the 'this' context in the function
         * Update: now also allows multiple argument call or for you to pass your own arguments
           ```
            var newObj={foo:bar}
            $("#main").bind("click",$.proxy(function(evt){console.log(this)},newObj);

            or

            ( $.proxy(function(foo, bar){console.log(this+foo+bar)}, newObj) )('foo', 'bar');

            or

            ( $.proxy(function(foo, bar){console.log(this+foo+bar)}, newObj, ['foo', 'bar']) )();
           ```
         * @param {Function} Callback
         * @param {Object} Context
         * @title $.proxy(callback,context);
         */
        $.proxy = function(f, c, args) {
            return function() {
                if (args) return f.apply(c, args); //use provided arguments
                return f.apply(c, arguments); //use scope function call arguments
            };
        };


        /**
         * Removes listeners on a div and its children recursively
            ```
             cleanUpNode(node,kill)
            ```
         * @param {HTMLDivElement} the element to clean up recursively
         * @api private
         */

        function cleanUpNode(node, kill) {
            //kill it before it lays eggs!
            if (kill && node.dispatchEvent) {
                var e = $.Event('destroy', {
                    bubbles: false
                });
                node.dispatchEvent(e);
            }
            //cleanup itself
            var id = afmid(node);
            if (id && handlers[id]) {
                for (var key in handlers[id])
                    node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
                delete handlers[id];
            }
        }

        function cleanUpContent(node, kill) {
            if (!node) return;
            //cleanup children
            var children = node.childNodes;
            if (children && children.length > 0) {
                for (var i; i < children.length; i++) {
                    cleanUpContent(children[i], kill);
                }
            }

            cleanUpNode(node, kill);
        }
        var cleanUpAsap = function(els, kill) {
            for (var i = 0; i < els.length; i++) {
                cleanUpContent(els[i], kill);
            }
        };

        /**
         * Function to clean up node content to prevent memory leaks
           ```
           $.cleanUpContent(node,itself,kill)
           ```
         * @param {HTMLNode} node
         * @param {Bool} kill itself
         * @param {bool} Kill nodes
         * @title $.cleanUpContent(node,itself,kill)
         */
        $.cleanUpContent = function(node, itself, kill) {
            if (!node) return;
            //cleanup children
            var cn = node.childNodes;
            if (cn && cn.length > 0) {
                //destroy everything in a few ms to avoid memory leaks
                //remove them all and copy objs into new array
                $.asap(cleanUpAsap, {}, [slice.apply(cn, [0]), kill]);
            }
            //cleanUp this node
            if (itself) cleanUpNode(node, kill);
        };

        // Like setTimeout(fn, 0); but much faster
        var timeouts = [];
        var contexts = [];
        var params = [];
        /**
         * This adds a command to execute in the JS stack, but is faster then setTimeout
           ```
           $.asap(function,context,args)
           ```
         * @param {Function} function
         * @param {Object} context
         * @param {Array} arguments
         */
        $.asap = function(fn, context, args) {
            if (!$.isFunction(fn)) throw "$.asap - argument is not a valid function";
            timeouts.push(fn);
            contexts.push(context ? context : {});
            params.push(args ? args : []);
            //post a message to ourselves so we know we have to execute a function from the stack
            window.postMessage("afm-asap", "*");
        };
        window.addEventListener("message", function(event) {
            if (event.source == window && event.data == "afm-asap") {
                event.stopPropagation();
                if (timeouts.length > 0) { //just in case...
                    (timeouts.shift()).apply(contexts.shift(), params.shift());
                }
            }
        }, true);

        /**
         * this function executes javascript in HTML.
           ```
           $.parseJS(content)
           ```
        * @param {String|DOM} content
        * @title $.parseJS(content);
        */
        var remoteJSPages = {};
        $.parseJS = function(div) {
            if (!div)
                return;
            if (typeof(div) == "string") {
                var elem = document.createElement("div");
                if (isWin8) {
                    MSApp.execUnsafeLocalFunction(function() {
                        elem.innerHTML = div;
                    });
                } else
                    elem.innerHTML = div;

                div = elem;
            }
            var scripts = div.getElementsByTagName("script");
            div = null;
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.length > 0 && !remoteJSPages[scripts[i].src] && !isWin8) {
                    var doc = document.createElement("script");
                    doc.type = scripts[i].type;
                    doc.src = scripts[i].src;
                    document.getElementsByTagName('head')[0].appendChild(doc);
                    remoteJSPages[scripts[i].src] = 1;
                    doc = null;
                } else {
                    window['eval'](scripts[i].innerHTML);
                }
            }
        };


        /**
        //custom events since people want to do $().click instead of $().bind("click")
        */

        ["click", "keydown", "keyup", "keypress", "submit", "load", "resize", "change", "select", "error"].forEach(function(event) {
            $.fn[event] = function(cb) {
                return cb ? this.bind(event, cb) : this.trigger(event);
            };
        });

        // only $query

        ['focus', 'blur'].forEach(function(name) {
            $.fn[name] = function(callback) {
                if (this.length === 0) return;
                if (callback)
                    this.bind(name, callback);
                else
                    for (var i = 0; i < this.length; i++) {
                        try {
                            this[i][name]();
                        } catch (e) {}
                }
                return this;
            };
        });

        /**
         * End of APIS
         * @api private
         */
        return $;
    };

})
define('frameworks/lib/move', [], function (require, module, exports) {
    'use strict';

    var browser = {
            prefixStyle : device.feat.prefixStyle
        }


    /**
    * CSS Easing functions
    */

    var ease = {
          'in':                'ease-in'
        , 'out':               'ease-out'
        , 'in-out':            'ease-in-out'
        , 'snap':              'cubic-bezier(0, 1, .5, 1)'
        , 'linear':            'cubic-bezier(0.250, 0.250, 0.750, 0.750)'
        , 'ease-in-quad':      'cubic-bezier(0.550, 0.085, 0.680, 0.530)'
        , 'ease-in-cubic':     'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
        , 'ease-in-quart':     'cubic-bezier(0.895, 0.030, 0.685, 0.220)'
        , 'ease-in-quint':     'cubic-bezier(0.755, 0.050, 0.855, 0.060)'
        , 'ease-in-sine':      'cubic-bezier(0.470, 0.000, 0.745, 0.715)'
        , 'ease-in-expo':      'cubic-bezier(0.950, 0.050, 0.795, 0.035)'
        , 'ease-in-circ':      'cubic-bezier(0.600, 0.040, 0.980, 0.335)'
        , 'ease-in-back':      'cubic-bezier(0.600, -0.280, 0.735, 0.045)'
        , 'ease-out-quad':     'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
        , 'ease-out-cubic':    'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
        , 'ease-out-quart':    'cubic-bezier(0.165, 0.840, 0.440, 1.000)'
        , 'ease-out-quint':    'cubic-bezier(0.230, 1.000, 0.320, 1.000)'
        , 'ease-out-sine':     'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
        , 'ease-out-expo':     'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
        , 'ease-out-circ':     'cubic-bezier(0.075, 0.820, 0.165, 1.000)'
        , 'ease-out-back':     'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
        , 'ease-in-out-quad':  'cubic-bezier(0.455, 0.030, 0.515, 0.955)'
        , 'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)'
        , 'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)'
        , 'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'
        , 'ease-in-out-sine':  'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
        , 'ease-in-out-expo':  'cubic-bezier(1.000, 0.000, 0.000, 1.000)'
        , 'ease-in-out-circ':  'cubic-bezier(0.785, 0.135, 0.150, 0.860)'
        , 'ease-in-out-back':  'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
    }



    /**
    * Module Dependencies.
    */

    var after = (function () {

        var hasTransitions = device.feat.prefixStyle('transition')
            , transitionend = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd'

        function after (el, fn) {
            if ( !hasTransitions ) return fn()
            el.bind(transitionend, fn)
            return fn
        }

        /**
        * Same as `after()` only the function is invoked once.
        *
        * @param {Element} el
        * @param {Function} fn
        * @return {Function}
        * @api public
        */

        after.once = function (el, fn) {
            var callback = function () {
                  el.unbind(transitionend, callback)
                  fn()
                }
                
            after(el, callback)
        }

        return after

    })()

    /**
    * Get computed style.
    */

    var style = window.getComputedStyle || window.currentStyle

    /**
    * Export `ease`
    */

    Move.ease = ease

    /**
    * Defaults.
    *
    *   `duration` - default duration of 500ms
    *
    */


    Move.select = function (selector) {
        if ('string' != typeof selector) return selector
        return $(selector)[0]
    }

    function Move (el) {
        if (!(this instanceof Move)) return new Move(el)
        if ('string' == typeof el) el = $(el)[0]
        if (!el) throw new TypeError('Move must be initialized with element or selector')
        this.el = el
        this._props = {}
        this._rotate = 0
        this._transitionProps = []
        this._transforms = {}
        this.duration(0)
    }

    var proto = Move.prototype

    /**
    * Buffer `transform`.
    *
    * @param {String} transform
    * @return {Move} for chaining
    * @api private
    */

    proto.transform = function (transform) {
        var prop = transform.match(/\w+\b/)

        this._transforms[prop] = transform

        return this
    }

    proto._applyTransform = function () {
        var transform = []

        for (var i in this._transforms) {
            transform.push(this._transforms[i])
        }

        if ( transform.length ) {
            this.setProperty('transform', transform.join(' '))
        }

        return this
    }

    proto.skew = function (x, y) {
        return this.transform('skew(' + x + 'deg, ' + (y || 0) + 'deg)')
    }

    proto.skewX = function (n) {
        return this.transform('skewX(' + n + 'deg)')
    }

    proto.skewY = function (n) {
        return this.transform('skewY(' + n + 'deg)')
    }

    proto.translate =
    proto.translate3d =
    proto.to = function (x, y, z) {
        if ( x != undefined ) this.x(x)
        if ( y != undefined ) this.y(y)
        if ( z != undefined ) this.z(z)

        return this
    }

    proto.translateX =
    proto.x = function (n) {
        return this.transform('translateX(' + n + 'px)')
    }

    proto.translateY =
    proto.y = function (n) {
        return this.transform('translateY(' + n + 'px)')
    }

    proto.translateZ =
    proto.z = function (n) {
        return this.transform('translateZ(' + n + 'px)')
    }

    proto.scale = function (x, y) {
        return this.transform('scale('
          + x + ', '
          + (y || x)
          + ')')
    }

    proto.scaleX = function (n) {
        return this.transform('scaleX(' + n + ')')
    }

    proto.matrix = function (m11, m12, m21, m22, m31, m32) {
        return this.transform('matrix(' + [m11,m12,m21,m22,m31,m32].join(',') + ')')
    }

    proto.scaleY = function (n) {
        return this.transform('scaleY(' + n + ')')
    }

    proto.rotate = function (n) {
        return this.transform('rotate(' + n + 'deg)')
    }

    proto.rotateX = function (n) {
        return this.transform('rotateX(' + n + 'deg)')
    }

    proto.rotateY = function (n) {
        return this.transform('rotateY(' + n + 'deg)')
    }

    proto.rotateZ = function (n) {
        return this.transform('rotateZ(' + n + 'deg)')
    }

    proto.rotate3d = function (x, y, z, d) {
        return this.transform('rotate3d(' + x + 'px, ' + y + 'px,' + z +'px,' + d + 'deg)')
    }

    proto.perspective = function (z) {
        this.el.parentNode.style.set('transform-style', 'preserve-3d')
        this.el.parentNode.style.set('perspective', z + 'px')
        return this
    }

    /**
    * Set transition easing function to to `fn` string.
    *
    * When:
    *
    *   - null "ease" is used
    *   - "in" "ease-in" is used
    *   - "out" "ease-out" is used
    *   - "in-out" "ease-in-out" is used
    *
    * @param {String} fn
    * @return {Move} for chaining
    * @api public
    */

    proto.ease = function (fn) {
        fn = ease[fn] || fn || 'ease'
        return this.setProperty('transition-timing-function', fn)
    }

    /**
    * Set animation properties
    *
    * @param {String} name
    * @param {Object} props
    * @return {Move} for chaining
    * @api public
    */

    proto.animate = function (name, props) {
        for (var i in props) {
            if ( props.hasOwnProperty(i) ) {
                this.setProperty('animation-' + i, props[i])
            }
        }
        return this.setProperty('animation-name', name)
    }

    /**
    * Set duration to `n`.
    *
    * @param {Number|String} n
    * @return {Move} for chaining
    * @api public
    */

    proto.duration = function (n) {
        n = this._duration = 'string' == typeof n
          ? parseFloat(n) * 1000
          : n

        return this.setProperty('transition-duration', n + 'ms')
    }

    /**
    * Delay the animation by `n`.
    *
    * @param {Number|String} n
    * @return {Move} for chaining
    * @api public
    */

    proto.delay = function (n) {
        n = this._delay = 'string' == typeof n
          ? parseFloat(n) * 1000
          : n

        return this.setProperty('transition-delay', n + 'ms')
    }

    /**
    * Set `prop` to `val`, deferred until `.end()` is invoked.
    *
    * @param {String} prop
    * @param {String} val
    * @return {Move} for chaining
    * @api public
    */

    proto.setProperty = function (prop, val) {
        this._props[prop] = val
        return this
    }

    /**
    * Set `prop` to `value`, deferred until `.end()` is invoked
    * and adds the property to the list of transition props.
    *
    * @param {String} prop
    * @param {String} val
    * @return {Move} for chaining
    * @api public
    */

    proto.set = function (prop, val) {
        this.transition(prop)
        this._props[prop] = val
        return this
    }

    proto.css = function (attribute, value, obj) {
        this.el.css(attribute, value, obj)
        return this
    }

    /**
    * Increment `prop` by `val`, deferred until `.end()` is invoked
    * and adds the property to the list of transition props.
    *
    * @param {String} prop
    * @param {Number} val
    * @return {Move} for chaining
    * @api public
    */

    proto.add = function (prop, val) {
        if (!style) return
        var self = this
        return this.on('start', function () {
          var curr = parseInt(self.current(prop), 10)
          self.set(prop, curr + val + 'px')
        })
    }

    /**
    * Decrement `prop` by `val`, deferred until `.end()` is invoked
    * and adds the property to the list of transition props.
    *
    * @param {String} prop
    * @param {Number} val
    * @return {Move} for chaining
    * @api public
    */

    proto.sub = function (prop, val) {
        if (!style) return
        var self = this
        return this.on('start', function () {
          var curr = parseInt(self.current(prop), 10)
          self.set(prop, curr - val + 'px')
        })
    }

    /**
    * Get computed or "current" value of `prop`.
    *
    * @param {String} prop
    * @return {String}
    * @api public
    */

    proto.current = function (prop) {
        return style(this.el).getPropertyValue(prop)
    }

    /**
    * Add `prop` to the list of internal transition properties.
    *
    * @param {String} prop
    * @return {Move} for chaining
    * @api private
    */

    proto.transition = function (prop) {
        if ( !this._transitionProps.indexOf(prop) ) return this
        this._transitionProps.push(prop)
        return this
    }

    /**
    * Commit style properties, aka apply them to `el.style`.
    *
    * @return {Move} for chaining
    * @see Move#end()
    * @api private
    */

    proto.applyProperties = function () {
        for (var prop in this._props) {
            this.el.style.set(prop, this._props[prop])
        }
        return this
    }

    /**
    * Re-select element via `selector`, replacing
    * the current element.
    *
    * @param {String} selector
    * @return {Move} for chaining
    * @api public
    */

    proto.move =
    proto.select = function (selector) {
        this.el = Move.select(selector)
        return this
    }

    /**
    * Defer the given `fn` until the animation
    * is complete. `fn` may be one of the following:
    *
    *   - a function to invoke
    *   - an instanceof `Move` to call `.end()`
    *   - nothing, to return a clone of this `Move` instance for chaining
    *
    * @param {Function|Move} fn
    * @return {Move} for chaining
    * @api public
    */

    proto.then = function (fn) {
        //invoke .end()
        if ( fn instanceof Move ) {
          this.on('end', function () {
            fn.end()
          })
        // callback
        } else if ('function' == typeof fn) {
          this.on('end', fn)
        // chain
        } else {
          var clone = new Move(this.el)
          clone._transforms = this._transforms.slice(0)
          this.then(clone)
          clone.parent = this
          return clone
        }

        return this
    }

    /**
    * Pop the move context.
    *
    * @return {Move} parent Move
    * @api public
    */

    proto.pop = function () {
        return this.parent
    }

    /**
    * Reset duration.
    *
    * @return {Move}
    * @api public
    */

    proto.clear = function () {
        this.el.style.set('transition-delay', '')
        this.el.style.set('transition-duration', '')
        return this
    }

    /**
    * Start animation, optionally calling `fn` when complete.
    *
    * @param {Function} fn
    * @return {Move} for chaining
    * @api public
    */

    proto.end = function (fn) {
        var that = this

        // transition properties 检索或设置对象中的参与过渡的属性

        this.setProperty('transition-properties', this._transitionProps.join(', '))

        // transforms

        this._applyTransform()
        
        // set properties

        this.applyProperties()

        // emit "end" when complete

        if ( this._duration == 0 ) {
            setTimeout(function () {
                window.requestAnimationFrame(function () {
                    that.clear()

                    if (fn) fn.call(that)
                })
            }, 60)
        } else {
            after.once(this.el, function () {
                that.clear()

                if (fn) fn.call(that)
            })
        }

        return this
    }

    module.exports = Move
})
define('frameworks/lib/touch', [], function (require, module, exports) {
    module.exports = function (window, document, undefined) {
        'use strict';

        var scale = device.ui.scale || 1;

        var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
        var TEST_ELEMENT = document.createElement('div');

        var TYPE_FUNCTION = 'function';

        var round = Math.round;
        var abs = Math.abs;
        var now = Date.now;

        /**
         * set a timeout with a given scope
         * @param {Function} fn
         * @param {Number} timeout
         * @param {Object} context
         * @returns {number}
         */
        function setTimeoutContext(fn, timeout, context) {
            return setTimeout(bindFn(fn, context), timeout);
        }

        /**
         * if the argument is an array, we want to execute the fn on each entry
         * if it aint an array we don't want to do a thing.
         * this is used by all the methods that accept a single and array argument.
         * @param {*|Array} arg
         * @param {String} fn
         * @param {Object} [context]
         * @returns {Boolean}
         */
        function invokeArrayArg(arg, fn, context) {
            if (Array.isArray(arg)) {
                each(arg, context[fn], context);
                return true;
            }
            return false;
        }

        /**
         * walk objects and arrays
         * @param {Object} obj
         * @param {Function} iterator
         * @param {Object} context
         */
        function each(obj, iterator, context) {
            var i;

            if (!obj) {
                return;
            }

            if (obj.forEach) {
                obj.forEach(iterator, context);
            } else if (obj.length !== undefined) {
                i = 0;
                while (i < obj.length) {
                    iterator.call(context, obj[i], i, obj);
                    i++;
                }
            } else {
                for (i in obj) {
                    obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
                }
            }
        }

        /**
         * extend object.
         * means that properties in dest will be overwritten by the ones in src.
         * @param {Object} dest
         * @param {Object} src
         * @param {Boolean} [merge]
         * @returns {Object} dest
         */
        function extend(dest, src, merge) {
            var keys = Object.keys(src);
            var i = 0;
            while (i < keys.length) {
                if (!merge || (merge && dest[keys[i]] === undefined)) {
                    dest[keys[i]] = src[keys[i]];
                }
                i++;
            }
            return dest;
        }

        /**
         * merge the values from src in the dest.
         * means that properties that exist in dest will not be overwritten by src
         * @param {Object} dest
         * @param {Object} src
         * @returns {Object} dest
         */
        function merge(dest, src) {
            return extend(dest, src, true);
        }

        /**
         * simple class inheritance
         * @param {Function} child
         * @param {Function} base
         * @param {Object} [properties]
         */
        function inherit(child, base, properties) {
            var baseP = base.prototype,
                childP;

            childP = child.prototype = Object.create(baseP);
            childP.constructor = child;
            childP._super = baseP;

            if (properties) {
                extend(childP, properties);
            }
        }

        /**
         * simple function bind
         * @param {Function} fn
         * @param {Object} context
         * @returns {Function}
         */
        function bindFn(fn, context) {
            return function boundFn() {
                return fn.apply(context, arguments);
            };
        }

        /**
         * let a boolean value also be a function that must return a boolean
         * this first item in args will be used as the context
         * @param {Boolean|Function} val
         * @param {Array} [args]
         * @returns {Boolean}
         */
        function boolOrFn(val, args) {
            if (typeof val == TYPE_FUNCTION) {
                return val.apply(args ? args[0] || undefined : undefined, args);
            }
            return val;
        }

        /**
         * use the val2 when val1 is undefined
         * @param {*} val1
         * @param {*} val2
         * @returns {*}
         */
        function ifUndefined(val1, val2) {
            return (val1 === undefined) ? val2 : val1;
        }

        /**
         * addEventListener with multiple events at once
         * @param {EventTarget} target
         * @param {String} types
         * @param {Function} handler
         */
        function addEventListeners(target, types, handler) {
            each(splitStr(types), function(type) {
                target.addEventListener(type, handler, false);
            });
        }

        /**
         * removeEventListener with multiple events at once
         * @param {EventTarget} target
         * @param {String} types
         * @param {Function} handler
         */
        function removeEventListeners(target, types, handler) {
            each(splitStr(types), function(type) {
                target.removeEventListener(type, handler, false);
            });
        }

        /**
         * find if a node is in the given parent
         * @method hasParent
         * @param {HTMLElement} node
         * @param {HTMLElement} parent
         * @return {Boolean} found
         */
        function hasParent(node, parent) {
            while (node) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }

        /**
         * small indexOf wrapper
         * @param {String} str
         * @param {String} find
         * @returns {Boolean} found
         */
        function inStr(str, find) {
            return str.indexOf(find) > -1;
        }

        /**
         * split string on whitespace
         * @param {String} str
         * @returns {Array} words
         */
        function splitStr(str) {
            return str.trim().split(/\s+/g);
        }

        /**
         * find if a array contains the object using indexOf or a simple polyFill
         * @param {Array} src
         * @param {String} find
         * @param {String} [findByKey]
         * @return {Boolean|Number} false when not found, or the index
         */
        function inArray(src, find, findByKey) {
            if (src.indexOf && !findByKey) {
                return src.indexOf(find);
            } else {
                var i = 0;
                while (i < src.length) {
                    if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                        return i;
                    }
                    i++;
                }
                return -1;
            }
        }

        /**
         * convert array-like objects to real arrays
         * @param {Object} obj
         * @returns {Array}
         */
        function toArray(obj) {
            return Array.prototype.slice.call(obj, 0);
        }

        /**
         * unique array with objects based on a key (like 'id') or just by the array's value
         * @param {Array} src [{id:1},{id:2},{id:1}]
         * @param {String} [key]
         * @param {Boolean} [sort=False]
         * @returns {Array} [{id:1},{id:2}]
         */
        function uniqueArray(src, key, sort) {
            var results = [];
            var values = [];
            var i = 0;

            while (i < src.length) {
                var val = key ? src[i][key] : src[i];
                if (inArray(values, val) < 0) {
                    results.push(src[i]);
                }
                values[i] = val;
                i++;
            }

            if (sort) {
                if (!key) {
                    results = results.sort();
                } else {
                    results = results.sort(function sortUniqueArray(a, b) {
                        return a[key] > b[key];
                    });
                }
            }

            return results;
        }

        /**
         * get the prefixed property
         * @param {Object} obj
         * @param {String} property
         * @returns {String|Undefined} prefixed
         */
        function prefixed(obj, property) {
            var prefix, prop;
            var camelProp = property[0].toUpperCase() + property.slice(1);

            var i = 0;
            while (i < VENDOR_PREFIXES.length) {
                prefix = VENDOR_PREFIXES[i];
                prop = (prefix) ? prefix + camelProp : property;

                if (prop in obj) {
                    return prop;
                }
                i++;
            }
            return undefined;
        }

        /**
         * get a unique id
         * @returns {number} uniqueId
         */
        var _uniqueId = 1;
        function uniqueId() {
            return _uniqueId++;
        }

        /**
         * get the window object of an element
         * @param {HTMLElement} element
         * @returns {DocumentView|Window}
         */
        function getWindowForElement(element) {
            var doc = element.ownerDocument;
            return (doc.defaultView || doc.parentWindow);
        }

        var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

        var SUPPORT_TOUCH = ('ontouchstart' in window);
        var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
        var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

        var INPUT_TYPE_TOUCH = 'touch';
        var INPUT_TYPE_PEN = 'pen';
        var INPUT_TYPE_MOUSE = 'mouse';
        var INPUT_TYPE_KINECT = 'kinect';

        var COMPUTE_INTERVAL = 25;

        var INPUT_START = 1;
        var INPUT_MOVE = 2;
        var INPUT_END = 4;
        var INPUT_CANCEL = 8;

        var DIRECTION_NONE = 1;
        var DIRECTION_LEFT = 2;
        var DIRECTION_RIGHT = 4;
        var DIRECTION_UP = 8;
        var DIRECTION_DOWN = 16;

        var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
        var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
        var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

        var PROPS_XY = ['x', 'y'];
        var PROPS_CLIENT_XY = ['clientX', 'clientY'];

        /**
         * create new input type manager
         * @param {Manager} manager
         * @param {Function} callback
         * @returns {Input}
         * @constructor
         */
        function Input(manager, callback) {
            var self = this;
            this.manager = manager;
            this.callback = callback;
            this.element = manager.element;
            this.target = manager.options.inputTarget;

            // smaller wrapper around the handler, for the scope and the enabled state of the manager,
            // so when disabled the input events are completely bypassed.
            this.domHandler = function(ev) {
                if (boolOrFn(manager.options.enable, [manager])) {
                    self.handler(ev);
                }
            };

            this.init();

        }

        Input.prototype = {
            /**
             * should handle the inputEvent data and trigger the callback
             * @virtual
             */
            handler: function() { },

            /**
             * bind the events
             */
            init: function() {
                this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
                this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
                this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
            },

            /**
             * unbind the events
             */
            destroy: function() {
                this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
                this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
                this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
            }
        };

        /**
         * create new input type manager
         * called by the Manager constructor
         * @param {Touch} manager
         * @returns {Input}
         */
        function createInputInstance(manager) {
            var Type;
            var inputClass = manager.options.inputClass;

            if (inputClass) {
                Type = inputClass;
            } else if (SUPPORT_POINTER_EVENTS) {
                Type = PointerEventInput;
            } else if (SUPPORT_ONLY_TOUCH) {
                Type = TouchInput;
            } else if (!SUPPORT_TOUCH) {
                Type = MouseInput;
            } else {
                Type = TouchMouseInput;
            }
            return new (Type)(manager, inputHandler);
        }

        /**
         * handle input events
         * @param {Manager} manager
         * @param {String} eventType
         * @param {Object} input
         */
        function inputHandler(manager, eventType, input) {
            var pointersLen = input.pointers.length;
            var changedPointersLen = input.changedPointers.length;
            var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
            var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

            input.isFirst = !!isFirst;
            input.isFinal = !!isFinal;

            if (isFirst) {
                manager.session = {};
            }

            // source event is the normalized value of the domEvents
            // like 'touchstart, mouseup, pointerdown'
            input.eventType = eventType;

            // compute scale, rotation etc
            computeInputData(manager, input);

            // emit secret event
            manager.emit('Touch.input', input);

            manager.recognize(input);
            manager.session.prevInput = input;
        }

        /**
         * extend the data with some usable properties like scale, rotate, velocity etc
         * @param {Object} manager
         * @param {Object} input
         */
        function computeInputData(manager, input) {
            var session = manager.session;
            var pointers = input.pointers;
            var pointersLength = pointers.length;

            // store the first input to calculate the distance and direction
            if (!session.firstInput) {
                session.firstInput = simpleCloneInputData(input);
            }

            // to compute scale and rotation we need to store the multiple touches
            if (pointersLength > 1 && !session.firstMultiple) {
                session.firstMultiple = simpleCloneInputData(input);
            } else if (pointersLength === 1) {
                session.firstMultiple = false;
            }

            var firstInput = session.firstInput;
            var firstMultiple = session.firstMultiple;
            var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

            var center = input.center = getCenter(pointers);
            input.timeStamp = now();
            input.deltaTime = input.timeStamp - firstInput.timeStamp;

            input.angle = getAngle(offsetCenter, center);
            input.distance = getDistance(offsetCenter, center);

            computeDeltaXY(session, input);
            input.offsetDirection = getDirection(input.deltaX, input.deltaY);

            input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
            input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

            computeIntervalInputData(session, input);

            // find the correct target
            var target = manager.element;
            if (hasParent(input.srcEvent.target, target)) {
                target = input.srcEvent.target;
            }
            input.target = target;
        }

        function computeDeltaXY(session, input) {
            var center = input.center;
            var offset = session.offsetDelta || {};
            var prevDelta = session.prevDelta || {};
            var prevInput = session.prevInput || {};

            if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
                prevDelta = session.prevDelta = {
                    x: prevInput.deltaX || 0,
                    y: prevInput.deltaY || 0
                };

                offset = session.offsetDelta = {
                    x: center.x,
                    y: center.y
                };
            }

            input.deltaX = prevDelta.x + (center.x - offset.x);
            input.deltaY = prevDelta.y + (center.y - offset.y);
        }

        /**
         * velocity is calculated every x ms
         * @param {Object} session
         * @param {Object} input
         */
        function computeIntervalInputData(session, input) {
            var last = session.lastInterval || input,
                deltaTime = input.timeStamp - last.timeStamp,
                velocity, velocityX, velocityY, direction;

            if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
                var deltaX = last.deltaX - input.deltaX;
                var deltaY = last.deltaY - input.deltaY;

                var v = getVelocity(deltaTime, deltaX, deltaY);
                velocityX = v.x;
                velocityY = v.y;
                velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
                direction = getDirection(deltaX, deltaY);

                session.lastInterval = input;
            } else {
                // use latest velocity info if it doesn't overtake a minimum period
                velocity = last.velocity;
                velocityX = last.velocityX;
                velocityY = last.velocityY;
                direction = last.direction;
            }

            input.velocity = velocity;
            input.velocityX = velocityX;
            input.velocityY = velocityY;
            input.direction = direction;
        }

        /**
         * create a simple clone from the input used for storage of firstInput and firstMultiple
         * @param {Object} input
         * @returns {Object} clonedInputData
         */
        function simpleCloneInputData(input) {
            // make a simple copy of the pointers because we will get a reference if we don't
            // we only need clientXY for the calculations
            var pointers = [];
            var i = 0;
            while (i < input.pointers.length) {
                pointers[i] = {
                    clientX: round(input.pointers[i].clientX),
                    clientY: round(input.pointers[i].clientY)
                };
                i++;
            }

            return {
                timeStamp: now(),
                pointers: pointers,
                center: getCenter(pointers),
                deltaX: input.deltaX,
                deltaY: input.deltaY
            };
        }

        /**
         * get the center of all the pointers
         * @param {Array} pointers
         * @return {Object} center contains `x` and `y` properties
         */
        function getCenter(pointers) {
            var pointersLength = pointers.length;

            // no need to loop when only one touch
            if (pointersLength === 1) {
                return {
                    x: round(pointers[0].clientX),
                    y: round(pointers[0].clientY)
                };
            }

            var x = 0,
                y = 0,
                i = 0;
            while (i < pointersLength) {
                x += pointers[i].clientX;
                y += pointers[i].clientY;
                i++;
            }

            return {
                x: round(x / pointersLength),
                y: round(y / pointersLength)
            };
        }

        /**
         * calculate the velocity between two points. unit is in px per ms.
         * @param {Number} deltaTime
         * @param {Number} x
         * @param {Number} y
         * @return {Object} velocity `x` and `y`
         */
        function getVelocity(deltaTime, x, y) {
            return {
                x: x / deltaTime || 0,
                y: y / deltaTime || 0
            };
        }

        /**
         * get the direction between two points
         * @param {Number} x
         * @param {Number} y
         * @return {Number} direction
         */
        function getDirection(x, y) {
            if (x === y) {
                return DIRECTION_NONE;
            }

            if (abs(x) >= abs(y)) {
                return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
            }
            return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
        }

        /**
         * calculate the absolute distance between two points
         * @param {Object} p1 {x, y}
         * @param {Object} p2 {x, y}
         * @param {Array} [props] containing x and y keys
         * @return {Number} distance
         */
        function getDistance(p1, p2, props) {
            if (!props) {
                props = PROPS_XY;
            }
            var x = p2[props[0]] - p1[props[0]],
                y = p2[props[1]] - p1[props[1]];

            return Math.sqrt((x * x) + (y * y));
        }

        /**
         * calculate the angle between two coordinates
         * @param {Object} p1
         * @param {Object} p2
         * @param {Array} [props] containing x and y keys
         * @return {Number} angle
         */
        function getAngle(p1, p2, props) {
            if (!props) {
                props = PROPS_XY;
            }
            var x = p2[props[0]] - p1[props[0]],
                y = p2[props[1]] - p1[props[1]];
            return Math.atan2(y, x) * 180 / Math.PI;
        }

        /**
         * calculate the rotation degrees between two pointersets
         * @param {Array} start array of pointers
         * @param {Array} end array of pointers
         * @return {Number} rotation
         */
        function getRotation(start, end) {
            return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
        }

        /**
         * calculate the scale factor between two pointersets
         * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
         * @param {Array} start array of pointers
         * @param {Array} end array of pointers
         * @return {Number} scale
         */
        function getScale(start, end) {
            return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
        }

        var MOUSE_INPUT_MAP = {
            mousedown: INPUT_START,
            mousemove: INPUT_MOVE,
            mouseup: INPUT_END
        };

        var MOUSE_ELEMENT_EVENTS = 'mousedown';
        var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

        /**
         * Mouse events input
         * @constructor
         * @extends Input
         */
        function MouseInput() {
            this.evEl = MOUSE_ELEMENT_EVENTS;
            this.evWin = MOUSE_WINDOW_EVENTS;

            this.allow = true; // used by Input.TouchMouse to disable mouse events
            this.pressed = false; // mousedown state

            Input.apply(this, arguments);
        }

        inherit(MouseInput, Input, {
            /**
             * handle mouse events
             * @param {Object} ev
             */
            handler: function MEhandler(ev) {
                var eventType = MOUSE_INPUT_MAP[ev.type];

                // on start we want to have the left mouse button down
                if (eventType & INPUT_START && ev.button === 0) {
                    this.pressed = true;
                }

                if (eventType & INPUT_MOVE && ev.which !== 1) {
                    eventType = INPUT_END;
                }

                // mouse must be down, and mouse events are allowed (see the TouchMouse input)
                if (!this.pressed || !this.allow) {
                    return;
                }

                if (eventType & INPUT_END) {
                    this.pressed = false;
                }

                this.callback(this.manager, eventType, {
                    pointers: [ev],
                    changedPointers: [ev],
                    pointerType: INPUT_TYPE_MOUSE,
                    srcEvent: ev
                });
            }
        });

        var POINTER_INPUT_MAP = {
            pointerdown: INPUT_START,
            pointermove: INPUT_MOVE,
            pointerup: INPUT_END,
            pointercancel: INPUT_CANCEL,
            pointerout: INPUT_CANCEL
        };

        // in IE10 the pointer types is defined as an enum
        var IE10_POINTER_TYPE_ENUM = {
            2: INPUT_TYPE_TOUCH,
            3: INPUT_TYPE_PEN,
            4: INPUT_TYPE_MOUSE,
            5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
        };

        var POINTER_ELEMENT_EVENTS = 'pointerdown';
        var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

        // IE10 has prefixed support, and case-sensitive
        if (window.MSPointerEvent) {
            POINTER_ELEMENT_EVENTS = 'MSPointerDown';
            POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
        }

        /**
         * Pointer events input
         * @constructor
         * @extends Input
         */
        function PointerEventInput() {
            this.evEl = POINTER_ELEMENT_EVENTS;
            this.evWin = POINTER_WINDOW_EVENTS;

            Input.apply(this, arguments);

            this.store = (this.manager.session.pointerEvents = []);
        }

        inherit(PointerEventInput, Input, {
            /**
             * handle mouse events
             * @param {Object} ev
             */
            handler: function PEhandler(ev) {
                var store = this.store;
                var removePointer = false;

                var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
                var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
                var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

                var isTouch = (pointerType == INPUT_TYPE_TOUCH);

                // start and mouse must be down
                if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
                    store.push(ev);
                } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                    removePointer = true;
                }

                // get index of the event in the store
                // it not found, so the pointer hasn't been down (so it's probably a hover)
                var storeIndex = inArray(store, ev.pointerId, 'pointerId');
                if (storeIndex < 0) {
                    return;
                }

                // update the event in the store
                store[storeIndex] = ev;

                this.callback(this.manager, eventType, {
                    pointers: store,
                    changedPointers: [ev],
                    pointerType: pointerType,
                    srcEvent: ev
                });

                if (removePointer) {
                    // remove from the store
                    store.splice(storeIndex, 1);
                }
            }
        });

        var TOUCH_INPUT_MAP = {
            touchstart: INPUT_START,
            touchmove: INPUT_MOVE,
            touchend: INPUT_END,
            touchcancel: INPUT_CANCEL
        };

        var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

        /**
         * Touch events input
         * @constructor
         * @extends Input
         */
        function TouchInput() {
            this.evTarget = TOUCH_TARGET_EVENTS;
            this.targetIds = {};

            Input.apply(this, arguments);
        }

        inherit(TouchInput, Input, {
            /**
             * handle touch events
             * @param {Object} ev
             */
            handler: function TEhandler(ev) {
                var type = TOUCH_INPUT_MAP[ev.type];
                var touches = getTouches.call(this, ev, type);
                if (!touches) {
                    return;
                }

                this.callback(this.manager, type, {
                    pointers: touches[0],
                    changedPointers: touches[1],
                    pointerType: INPUT_TYPE_TOUCH,
                    srcEvent: ev
                });
            }
        });

        /**
         * @this {TouchInput}
         * @param {Object} ev
         * @param {Number} type flag
         * @returns {undefined|Array} [all, changed]
         */
        function getTouches(ev, type) {
            var allTouches = toArray(ev.touches);
            var targetIds = this.targetIds;

            // when there is only one touch, the process can be simplified
            if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
                targetIds[allTouches[0].identifier] = true;
                return [allTouches, allTouches];
            }

            var i,
                targetTouches = toArray(ev.targetTouches),
                changedTouches = toArray(ev.changedTouches),
                changedTargetTouches = [];

            // collect touches
            if (type === INPUT_START) {
                i = 0;
                while (i < targetTouches.length) {
                    targetIds[targetTouches[i].identifier] = true;
                    i++;
                }
            }

            // filter changed touches to only contain touches that exist in the collected target ids
            i = 0;
            while (i < changedTouches.length) {
                if (targetIds[changedTouches[i].identifier]) {
                    changedTargetTouches.push(changedTouches[i]);
                }

                // cleanup removed touches
                if (type & (INPUT_END | INPUT_CANCEL)) {
                    delete targetIds[changedTouches[i].identifier];
                }
                i++;
            }

            if (!changedTargetTouches.length) {
                return;
            }

            return [
                // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
                uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
                changedTargetTouches
            ];
        }

        /**
         * Combined touch and mouse input
         *
         * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
         * This because touch devices also emit mouse events while doing a touch.
         *
         * @constructor
         * @extends Input
         */
        function TouchMouseInput() {
            Input.apply(this, arguments);

            var handler = bindFn(this.handler, this);
            this.touch = new TouchInput(this.manager, handler);
            this.mouse = new MouseInput(this.manager, handler);
        }

        inherit(TouchMouseInput, Input, {
            /**
             * handle mouse and touch events
             * @param {Touch} manager
             * @param {String} inputEvent
             * @param {Object} inputData
             */
            handler: function TMEhandler(manager, inputEvent, inputData) {
                var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
                    isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

                // when we're in a touch event, so  block all upcoming mouse events
                // most mobile browser also emit mouseevents, right after touchstart
                if (isTouch) {
                    this.mouse.allow = false;
                } else if (isMouse && !this.mouse.allow) {
                    return;
                }

                // reset the allowMouse when we're done
                if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
                    this.mouse.allow = true;
                }

                this.callback(manager, inputEvent, inputData);
            },

            /**
             * remove the event listeners
             */
            destroy: function destroy() {
                this.touch.destroy();
                this.mouse.destroy();
            }
        });

        var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
        var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

        // magical touchAction value
        var TOUCH_ACTION_COMPUTE = 'compute';
        var TOUCH_ACTION_AUTO = 'auto';
        var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
        var TOUCH_ACTION_NONE = 'none';
        var TOUCH_ACTION_PAN_X = 'pan-x';
        var TOUCH_ACTION_PAN_Y = 'pan-y';

        /**
         * Touch Action
         * sets the touchAction property or uses the js alternative
         * @param {Manager} manager
         * @param {String} value
         * @constructor
         */
        function TouchAction(manager, value) {
            this.manager = manager;
            this.set(value);
        }

        TouchAction.prototype = {
            /**
             * set the touchAction value on the element or enable the polyfill
             * @param {String} value
             */
            set: function(value) {
                // find out the touch-action by the event handlers
                if (value == TOUCH_ACTION_COMPUTE) {
                    value = this.compute();
                }

                if (NATIVE_TOUCH_ACTION) {
                    this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
                }
                this.actions = value.toLowerCase().trim();
            },

            /**
             * just re-set the touchAction value
             */
            update: function() {
                this.set(this.manager.options.touchAction);
            },

            /**
             * compute the value for the touchAction property based on the recognizer's settings
             * @returns {String} value
             */
            compute: function() {
                var actions = [];
                each(this.manager.recognizers, function(recognizer) {
                    if (boolOrFn(recognizer.options.enable, [recognizer])) {
                        actions = actions.concat(recognizer.getTouchAction());
                    }
                });
                return cleanTouchActions(actions.join(' '));
            },

            /**
             * this method is called on each input cycle and provides the preventing of the browser behavior
             * @param {Object} input
             */
            preventDefaults: function(input) {
                // not needed with native support for the touchAction property
                if (NATIVE_TOUCH_ACTION) {
                    return;
                }

                var srcEvent = input.srcEvent;
                var direction = input.offsetDirection;

                // if the touch action did prevented once this session
                if (this.manager.session.prevented) {
                    srcEvent.preventDefault();
                    return;
                }

                var actions = this.actions;
                var hasNone = inStr(actions, TOUCH_ACTION_NONE);
                var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
                var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

                if (hasNone ||
                    (hasPanY && direction & DIRECTION_HORIZONTAL) ||
                    (hasPanX && direction & DIRECTION_VERTICAL)) {
                    return this.preventSrc(srcEvent);
                }
            },

            /**
             * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
             * @param {Object} srcEvent
             */
            preventSrc: function(srcEvent) {
                this.manager.session.prevented = true;
                srcEvent.preventDefault();
            }
        };

        /**
         * when the touchActions are collected they are not a valid value, so we need to clean things up. *
         * @param {String} actions
         * @returns {*}
         */
        function cleanTouchActions(actions) {
            // none
            if (inStr(actions, TOUCH_ACTION_NONE)) {
                return TOUCH_ACTION_NONE;
            }

            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

            // pan-x and pan-y can be combined
            if (hasPanX && hasPanY) {
                return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
            }

            // pan-x OR pan-y
            if (hasPanX || hasPanY) {
                return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
            }

            // manipulation
            if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
                return TOUCH_ACTION_MANIPULATION;
            }

            return TOUCH_ACTION_AUTO;
        }

        /**
         * Recognizer flow explained; *
         * All recognizers have the initial state of POSSIBLE when a input session starts.
         * The definition of a input session is from the first input until the last input, with all it's movement in it. *
         * Example session for mouse-input: mousedown -> mousemove -> mouseup
         *
         * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
         * which determines with state it should be.
         *
         * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
         * POSSIBLE to give it another change on the next cycle.
         *
         *               Possible
         *                  |
         *            +-----+---------------+
         *            |                     |
         *      +-----+-----+               |
         *      |           |               |
         *   Failed      Cancelled          |
         *                          +-------+------+
         *                          |              |
         *                      Recognized       Began
         *                                         |
         *                                      Changed
         *                                         |
         *                                  Ended/Recognized
         */
        var STATE_POSSIBLE = 1;
        var STATE_BEGAN = 2;
        var STATE_CHANGED = 4;
        var STATE_ENDED = 8;
        var STATE_RECOGNIZED = STATE_ENDED;
        var STATE_CANCELLED = 16;
        var STATE_FAILED = 32;

        /**
         * Recognizer
         * Every recognizer needs to extend from this class.
         * @constructor
         * @param {Object} options
         */
        function Recognizer(options) {
            this.id = uniqueId();

            this.manager = null;
            this.options = merge(options || {}, this.defaults);

            // default is enable true
            this.options.enable = ifUndefined(this.options.enable, true);

            this.state = STATE_POSSIBLE;

            this.simultaneous = {};
            this.requireFail = [];
        }

        Recognizer.prototype = {
            /**
             * @virtual
             * @type {Object}
             */
            defaults: {},

            /**
             * set options
             * @param {Object} options
             * @return {Recognizer}
             */
            set: function(options) {
                extend(this.options, options);

                // also update the touchAction, in case something changed about the directions/enabled state
                this.manager && this.manager.touchAction.update();
                return this;
            },

            /**
             * recognize simultaneous with an other recognizer.
             * @param {Recognizer} otherRecognizer
             * @returns {Recognizer} this
             */
            recognizeWith: function(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
                    return this;
                }

                var simultaneous = this.simultaneous;
                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                if (!simultaneous[otherRecognizer.id]) {
                    simultaneous[otherRecognizer.id] = otherRecognizer;
                    otherRecognizer.recognizeWith(this);
                }
                return this;
            },

            /**
             * drop the simultaneous link. it doesnt remove the link on the other recognizer.
             * @param {Recognizer} otherRecognizer
             * @returns {Recognizer} this
             */
            dropRecognizeWith: function(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
                    return this;
                }

                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                delete this.simultaneous[otherRecognizer.id];
                return this;
            },

            /**
             * recognizer can only run when an other is failing
             * @param {Recognizer} otherRecognizer
             * @returns {Recognizer} this
             */
            requireFailure: function(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
                    return this;
                }

                var requireFail = this.requireFail;
                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                if (inArray(requireFail, otherRecognizer) === -1) {
                    requireFail.push(otherRecognizer);
                    otherRecognizer.requireFailure(this);
                }
                return this;
            },

            /**
             * drop the requireFailure link. it does not remove the link on the other recognizer.
             * @param {Recognizer} otherRecognizer
             * @returns {Recognizer} this
             */
            dropRequireFailure: function(otherRecognizer) {
                if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
                    return this;
                }

                otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                var index = inArray(this.requireFail, otherRecognizer);
                if (index > -1) {
                    this.requireFail.splice(index, 1);
                }
                return this;
            },

            /**
             * has require failures boolean
             * @returns {boolean}
             */
            hasRequireFailures: function() {
                return this.requireFail.length > 0;
            },

            /**
             * if the recognizer can recognize simultaneous with an other recognizer
             * @param {Recognizer} otherRecognizer
             * @returns {Boolean}
             */
            canRecognizeWith: function(otherRecognizer) {
                return !!this.simultaneous[otherRecognizer.id];
            },

            /**
             * You should use `tryEmit` instead of `emit` directly to check
             * that all the needed recognizers has failed before emitting.
             * @param {Object} input
             */
            emit: function(input) {
                var self = this;
                var state = this.state;

                function emit(withState) {
                    self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
                }

                // 'panstart' and 'panmove'
                if (state < STATE_ENDED) {
                    emit(true);
                }

                emit(); // simple 'eventName' events

                // panend and pancancel
                if (state >= STATE_ENDED) {
                    emit(true);
                }
            },

            /**
             * Check that all the require failure recognizers has failed,
             * if true, it emits a gesture event,
             * otherwise, setup the state to FAILED.
             * @param {Object} input
             */
            tryEmit: function(input) {
                if (this.canEmit()) {
                    return this.emit(input);
                }
                // it's failing anyway
                this.state = STATE_FAILED;
            },

            /**
             * can we emit?
             * @returns {boolean}
             */
            canEmit: function() {
                var i = 0;
                while (i < this.requireFail.length) {
                    if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                        return false;
                    }
                    i++;
                }
                return true;
            },

            /**
             * update the recognizer
             * @param {Object} inputData
             */
            recognize: function(inputData) {
                // make a new copy of the inputData
                // so we can change the inputData without messing up the other recognizers
                var inputDataClone = extend({}, inputData);

                // is is enabled and allow recognizing?
                if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
                    this.reset();
                    this.state = STATE_FAILED;
                    return;
                }

                // reset when we've reached the end
                if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
                    this.state = STATE_POSSIBLE;
                }

                this.state = this.process(inputDataClone);

                // the recognizer has recognized a gesture
                // so trigger an event
                if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
                    this.tryEmit(inputDataClone);
                }
            },

            /**
             * return the state of the recognizer
             * the actual recognizing happens in this method
             * @virtual
             * @param {Object} inputData
             * @returns {Const} STATE
             */
            process: function(inputData) { }, // jshint ignore:line

            /**
             * return the preferred touch-action
             * @virtual
             * @returns {Array}
             */
            getTouchAction: function() { },

            /**
             * called when the gesture isn't allowed to recognize
             * like when another is being recognized or it is disabled
             * @virtual
             */
            reset: function() { }
        };

        /**
         * get a usable string, used as event postfix
         * @param {Const} state
         * @returns {String} state
         */
        function stateStr(state) {
            if (state & STATE_CANCELLED) {
                return 'cancel';
            } else if (state & STATE_ENDED) {
                return 'end';
            } else if (state & STATE_CHANGED) {
                return 'move';
            } else if (state & STATE_BEGAN) {
                return 'start';
            }
            return '';
        }

        /**
         * direction cons to string
         * @param {Const} direction
         * @returns {String}
         */
        function directionStr(direction) {
            if (direction == DIRECTION_DOWN) {
                return 'down';
            } else if (direction == DIRECTION_UP) {
                return 'up';
            } else if (direction == DIRECTION_LEFT) {
                return 'left';
            } else if (direction == DIRECTION_RIGHT) {
                return 'right';
            }
            return '';
        }

        /**
         * get a recognizer by name if it is bound to a manager
         * @param {Recognizer|String} otherRecognizer
         * @param {Recognizer} recognizer
         * @returns {Recognizer}
         */
        function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
            var manager = recognizer.manager;
            if (manager) {
                return manager.get(otherRecognizer);
            }
            return otherRecognizer;
        }

        /**
         * This recognizer is just used as a base for the simple attribute recognizers.
         * @constructor
         * @extends Recognizer
         */
        function AttrRecognizer() {
            Recognizer.apply(this, arguments);
        }

        inherit(AttrRecognizer, Recognizer, {
            /**
             * @namespace
             * @memberof AttrRecognizer
             */
            defaults: {
                /**
                 * @type {Number}
                 * @default 1
                 */
                pointers: 1
            },

            /**
             * Used to check if it the recognizer receives valid input, like input.distance > 10.
             * @memberof AttrRecognizer
             * @param {Object} input
             * @returns {Boolean} recognized
             */
            attrTest: function(input) {
                var optionPointers = this.options.pointers;
                return optionPointers === 0 || input.pointers.length === optionPointers;
            },

            /**
             * Process the input and return the state for the recognizer
             * @memberof AttrRecognizer
             * @param {Object} input
             * @returns {*} State
             */
            process: function(input) {
                var state = this.state;
                var eventType = input.eventType;

                var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
                var isValid = this.attrTest(input);

                // on cancel input and we've recognized before, return STATE_CANCELLED
                if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
                    return state | STATE_CANCELLED;
                } else if (isRecognized || isValid) {
                    if (eventType & INPUT_END) {
                        return state | STATE_ENDED;
                    } else if (!(state & STATE_BEGAN)) {
                        return STATE_BEGAN;
                    }
                    return state | STATE_CHANGED;
                }
                return STATE_FAILED;
            }
        });

        /**
         * Pan
         * Recognized when the pointer is down and moved in the allowed direction.
         * @constructor
         * @extends AttrRecognizer
         */
        function PanRecognizer() {
            AttrRecognizer.apply(this, arguments);

            this.pX = null;
            this.pY = null;
        }

        inherit(PanRecognizer, AttrRecognizer, {
            /**
             * @namespace
             * @memberof PanRecognizer
             */
            defaults: {
                event: 'pan',
                threshold: 10 * scale,
                pointers: 1,
                direction: DIRECTION_ALL
            },

            getTouchAction: function() {
                var direction = this.options.direction;
                var actions = [];
                if (direction & DIRECTION_HORIZONTAL) {
                    actions.push(TOUCH_ACTION_PAN_Y);
                }
                if (direction & DIRECTION_VERTICAL) {
                    actions.push(TOUCH_ACTION_PAN_X);
                }
                return actions;
            },

            directionTest: function(input) {
                var options = this.options;
                var hasMoved = true;
                var distance = input.distance;
                var direction = input.direction;
                var x = input.deltaX;
                var y = input.deltaY;

                // lock to axis?
                if (!(direction & options.direction)) {
                    if (options.direction & DIRECTION_HORIZONTAL) {
                        direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                        hasMoved = x != this.pX;
                        distance = Math.abs(input.deltaX);
                    } else {
                        direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                        hasMoved = y != this.pY;
                        distance = Math.abs(input.deltaY);
                    }
                }
                input.direction = direction;
                return hasMoved && distance > options.threshold && direction & options.direction;
            },

            attrTest: function(input) {
                return AttrRecognizer.prototype.attrTest.call(this, input) &&
                    (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
            },

            emit: function(input) {
                this.pX = input.deltaX;
                this.pY = input.deltaY;

                var direction = directionStr(input.direction);
                if (direction) {
                    this.manager.emit(this.options.event + direction, input);
                }

                this._super.emit.call(this, input);
            }
        });

        /**
         * Pinch
         * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
         * @constructor
         * @extends AttrRecognizer
         */
        function PinchRecognizer() {
            AttrRecognizer.apply(this, arguments);
        }

        inherit(PinchRecognizer, AttrRecognizer, {
            /**
             * @namespace
             * @memberof PinchRecognizer
             */
            defaults: {
                event: 'pinch',
                threshold: 0,
                pointers: 2
            },

            getTouchAction: function() {
                return [TOUCH_ACTION_NONE];
            },

            attrTest: function(input) {
                return this._super.attrTest.call(this, input) &&
                    (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
            },

            emit: function(input) {
                this._super.emit.call(this, input);
                if (input.scale !== 1) {
                    var inOut = input.scale < 1 ? 'in' : 'out';
                    this.manager.emit(this.options.event + inOut, input);
                }
            }
        });

        /**
         * Press
         * Recognized when the pointer is down for x ms without any movement.
         * @constructor
         * @extends Recognizer
         */
        function PressRecognizer() {
            Recognizer.apply(this, arguments);

            this._timer = null;
            this._input = null;
        }

        inherit(PressRecognizer, Recognizer, {
            /**
             * @namespace
             * @memberof PressRecognizer
             */
            defaults: {
                event: 'press',
                pointers: 1,
                time: 500, // minimal time of the pointer to be pressed
                threshold: 5 * scale // a minimal movement is ok, but keep it low
            },

            getTouchAction: function() {
                return [TOUCH_ACTION_AUTO];
            },

            process: function(input) {
                var options = this.options;
                var validPointers = input.pointers.length === options.pointers;
                var validMovement = input.distance < options.threshold;
                var validTime = input.deltaTime > options.time;

                this._input = input;

                // we only allow little movement
                // and we've reached an end event, so a tap is possible
                if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
                    this.reset();
                } else if (input.eventType & INPUT_START) {
                    this.reset();
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.time, this);
                } else if (input.eventType & INPUT_END) {
                    return STATE_RECOGNIZED;
                }
                return STATE_FAILED;
            },

            reset: function() {
                clearTimeout(this._timer);
            },

            emit: function(input) {
                if (this.state !== STATE_RECOGNIZED) {
                    return;
                }

                if (input && (input.eventType & INPUT_END)) {
                    this.manager.emit(this.options.event + 'up', input);
                } else {
                    this._input.timeStamp = now();
                    this.manager.emit(this.options.event, this._input);
                }
            }
        });

        /**
         * Rotate
         * Recognized when two or more pointer are moving in a circular motion.
         * @constructor
         * @extends AttrRecognizer
         */
        function RotateRecognizer() {
            AttrRecognizer.apply(this, arguments);
        }

        inherit(RotateRecognizer, AttrRecognizer, {
            /**
             * @namespace
             * @memberof RotateRecognizer
             */
            defaults: {
                event: 'rotate',
                threshold: 0,
                pointers: 2
            },

            getTouchAction: function() {
                return [TOUCH_ACTION_NONE];
            },

            attrTest: function(input) {
                return this._super.attrTest.call(this, input) &&
                    (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
            }
        });

        /**
         * Swipe
         * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
         * @constructor
         * @extends AttrRecognizer
         */
        function SwipeRecognizer() {
            AttrRecognizer.apply(this, arguments);
        }

        inherit(SwipeRecognizer, AttrRecognizer, {
            /**
             * @namespace
             * @memberof SwipeRecognizer
             */
            defaults: {
                event: 'swipe',
                threshold: 10 * scale,
                velocity: 0.65,
                direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
                pointers: 1
            },

            getTouchAction: function() {
                return PanRecognizer.prototype.getTouchAction.call(this);
            },

            attrTest: function(input) {
                var direction = this.options.direction;
                var velocity;

                if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
                    velocity = input.velocity;
                } else if (direction & DIRECTION_HORIZONTAL) {
                    velocity = input.velocityX;
                } else if (direction & DIRECTION_VERTICAL) {
                    velocity = input.velocityY;
                }

                return this._super.attrTest.call(this, input) &&
                    direction & input.direction &&
                    input.distance > this.options.threshold &&
                    abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
            },

            emit: function(input) {
                var direction = directionStr(input.direction);
                if (direction) {
                    this.manager.emit(this.options.event + direction, input);
                }

                this.manager.emit(this.options.event, input);
            }
        });

        /**
         * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
         * between the given interval and position. The delay option can be used to recognize multi-taps without firing
         * a single tap.
         *
         * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
         * multi-taps being recognized.
         * @constructor
         * @extends Recognizer
         */
        function TapRecognizer() {
            Recognizer.apply(this, arguments);

            // previous time and center,
            // used for tap counting
            this.pTime = false;
            this.pCenter = false;

            this._timer = null;
            this._input = null;
            this.count = 0;
        }

        inherit(TapRecognizer, Recognizer, {
            /**
             * @namespace
             * @memberof PinchRecognizer
             */
            defaults: {
                event: 'tap',
                pointers: 1,
                taps: 1,
                interval: 300, // max time between the multi-tap taps
                time: 250, // max time of the pointer to be down (like finger on the screen)
                threshold: 10 * scale, // a minimal movement is ok, but keep it low
                posThreshold: 10 * scale // a multi-tap can be a bit off the initial position
            },

            getTouchAction: function() {
                return [TOUCH_ACTION_MANIPULATION];
            },

            process: function(input) {
                var options = this.options;

                var validPointers = input.pointers.length === options.pointers;
                var validMovement = input.distance < options.threshold;
                var validTouchTime = input.deltaTime < options.time;

                this.reset();

                if ((input.eventType & INPUT_START) && (this.count === 0)) {
                    return this.failTimeout();
                }

                // we only allow little movement
                // and we've reached an end event, so a tap is possible
                if (validMovement && validTouchTime && validPointers) {
                    if (input.eventType != INPUT_END) {
                        return this.failTimeout();
                    }

                    var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
                    var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

                    this.pTime = input.timeStamp;
                    this.pCenter = input.center;

                    if (!validMultiTap || !validInterval) {
                        this.count = 1;
                    } else {
                        this.count += 1;
                    }

                    this._input = input;

                    // if tap count matches we have recognized it,
                    // else it has began recognizing...
                    var tapCount = this.count % options.taps;
                    if (tapCount === 0) {
                        // no failing requirements, immediately trigger the tap event
                        // or wait as long as the multitap interval to trigger
                        if (!this.hasRequireFailures()) {
                            return STATE_RECOGNIZED;
                        } else {
                            this._timer = setTimeoutContext(function() {
                                this.state = STATE_RECOGNIZED;
                                this.tryEmit();
                            }, options.interval, this);
                            return STATE_BEGAN;
                        }
                    }
                }
                return STATE_FAILED;
            },

            failTimeout: function() {
                this._timer = setTimeoutContext(function() {
                    this.state = STATE_FAILED;
                }, this.options.interval, this);
                return STATE_FAILED;
            },

            reset: function() {
                clearTimeout(this._timer);
            },

            emit: function() {
                if (this.state == STATE_RECOGNIZED ) {
                    this._input.tapCount = this.count;
                    this.manager.emit(this.options.event, this._input);
                }
            }
        });

        /**
         * Simple way to create an manager with a default set of recognizers.
         * @param {HTMLElement} element
         * @param {Object} [options]
         * @constructor
         */
        function Touch(element, options) {
            options = options || {};
            options.recognizers = ifUndefined(options.recognizers, Touch.defaults.preset);
            return new Manager(element, options);
        }

        /**
         * @const {string}
         */
        Touch.VERSION = '2.0.3';

        /**
         * default settings
         * @namespace
         */
        Touch.defaults = {
            /**
             * set if DOM events are being triggered.
             * But this is slower and unused by simple implementations, so disabled by default.
             * @type {Boolean}
             * @default false
             */
            domEvents: false,

            /**
             * The value for the touchAction property/fallback.
             * When set to `compute` it will magically set the correct value based on the added recognizers.
             * @type {String}
             * @default compute
             */
            touchAction: TOUCH_ACTION_COMPUTE,

            /**
             * @type {Boolean}
             * @default true
             */
            enable: true,

            /**
             * EXPERIMENTAL FEATURE -- can be removed/changed
             * Change the parent input target element.
             * If Null, then it is being set the to main element.
             * @type {Null|EventTarget}
             * @default null
             */
            inputTarget: null,

            /**
             * force an input class
             * @type {Null|Function}
             * @default null
             */
            inputClass: null,

            /**
             * Default recognizer setup when calling `Touch()`
             * When creating a new Manager these will be skipped.
             * @type {Array}
             */
            preset: [
                // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
                [RotateRecognizer, { enable: false }],
                [PinchRecognizer, { enable: false }, ['rotate']],
                [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
                [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
                [TapRecognizer],
                [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
                [PressRecognizer]
            ],

            /**
             * Some CSS properties can be used to improve the working of Touch.
             * Add them to this method and they will be set when creating a new Manager.
             * @namespace
             */
            cssProps: {
                /**
                 * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
                 * @type {String}
                 * @default 'none'
                 */
                userSelect: 'none',

                /**
                 * Disable the Windows Phone grippers when pressing an element.
                 * @type {String}
                 * @default 'none'
                 */
                touchSelect: 'none',

                /**
                 * Disables the default callout shown when you touch and hold a touch target.
                 * On iOS, when you touch and hold a touch target such as a link, Safari displays
                 * a callout containing information about the link. This property allows you to disable that callout.
                 * @type {String}
                 * @default 'none'
                 */
                touchCallout: 'none',

                /**
                 * Specifies whether zooming is enabled. Used by IE10>
                 * @type {String}
                 * @default 'none'
                 */
                contentZooming: 'none',

                /**
                 * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
                 * @type {String}
                 * @default 'none'
                 */
                userDrag: 'none',

                /**
                 * Overrides the highlight color shown when the user taps a link or a JavaScript
                 * clickable element in iOS. This property obeys the alpha value, if specified.
                 * @type {String}
                 * @default 'rgba(0,0,0,0)'
                 */
                tapHighlightColor: 'rgba(0,0,0,0)'
            }
        };

        var STOP = 1;
        var FORCED_STOP = 2;

        /**
         * Manager
         * @param {HTMLElement} element
         * @param {Object} [options]
         * @constructor
         */
        function Manager(element, options) {
            options = options || {};

            this.options = merge(options, Touch.defaults);
            this.options.inputTarget = this.options.inputTarget || element;

            this.handlers = {};
            this.session = {};
            this.recognizers = [];

            this.element = element;
            this.input = createInputInstance(this);
            this.touchAction = new TouchAction(this, this.options.touchAction);

            toggleCssProps(this, true);

            each(options.recognizers, function(item) {
                var recognizer = this.add(new (item[0])(item[1]));
                item[2] && recognizer.recognizeWith(item[2]);
                item[3] && recognizer.requireFailure(item[3]);
            }, this);
        }

        Manager.prototype = {
            /**
             * set options
             * @param {Object} options
             * @returns {Manager}
             */
            set: function(options) {
                extend(this.options, options);

                // Options that need a little more setup
                if (options.touchAction) {
                    this.touchAction.update();
                }
                if (options.inputTarget) {
                    // Clean up existing event listeners and reinitialize
                    this.input.destroy();
                    this.input.target = options.inputTarget;
                    this.input.init();
                }
                return this;
            },

            /**
             * stop recognizing for this session.
             * This session will be discarded, when a new [input]start event is fired.
             * When forced, the recognizer cycle is stopped immediately.
             * @param {Boolean} [force]
             */
            stop: function(force) {
                this.session.stopped = force ? FORCED_STOP : STOP;
            },

            /**
             * run the recognizers!
             * called by the inputHandler function on every movement of the pointers (touches)
             * it walks through all the recognizers and tries to detect the gesture that is being made
             * @param {Object} inputData
             */
            recognize: function(inputData) {
                var session = this.session;
                if (session.stopped) {
                    return;
                }

                // run the touch-action polyfill
                this.touchAction.preventDefaults(inputData);

                var recognizer;
                var recognizers = this.recognizers;

                // this holds the recognizer that is being recognized.
                // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
                // if no recognizer is detecting a thing, it is set to `null`
                var curRecognizer = session.curRecognizer;

                // reset when the last recognizer is recognized
                // or when we're in a new session
                if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
                    curRecognizer = session.curRecognizer = null;
                }

                var i = 0;
                while (i < recognizers.length) {
                    recognizer = recognizers[i];

                    // find out if we are allowed try to recognize the input for this one.
                    // 1.   allow if the session is NOT forced stopped (see the .stop() method)
                    // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
                    //      that is being recognized.
                    // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
                    //      this can be setup with the `recognizeWith()` method on the recognizer.
                    if (session.stopped !== FORCED_STOP && ( // 1
                            !curRecognizer || recognizer == curRecognizer || // 2
                            recognizer.canRecognizeWith(curRecognizer))) { // 3
                        recognizer.recognize(inputData);
                    } else {
                        recognizer.reset();
                    }

                    // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
                    // current active recognizer. but only if we don't already have an active recognizer
                    if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                        curRecognizer = session.curRecognizer = recognizer;
                    }
                    i++;
                }
            },

            /**
             * get a recognizer by its event name.
             * @param {Recognizer|String} recognizer
             * @returns {Recognizer|Null}
             */
            get: function(recognizer) {
                if (recognizer instanceof Recognizer) {
                    return recognizer;
                }

                var recognizers = this.recognizers;
                for (var i = 0; i < recognizers.length; i++) {
                    if (recognizers[i].options.event == recognizer) {
                        return recognizers[i];
                    }
                }
                return null;
            },

            /**
             * add a recognizer to the manager
             * existing recognizers with the same event name will be removed
             * @param {Recognizer} recognizer
             * @returns {Recognizer|Manager}
             */
            add: function(recognizer) {
                if (invokeArrayArg(recognizer, 'add', this)) {
                    return this;
                }

                // remove existing
                var existing = this.get(recognizer.options.event);
                if (existing) {
                    this.remove(existing);
                }

                this.recognizers.push(recognizer);
                recognizer.manager = this;

                this.touchAction.update();
                return recognizer;
            },

            /**
             * remove a recognizer by name or instance
             * @param {Recognizer|String} recognizer
             * @returns {Manager}
             */
            remove: function(recognizer) {
                if (invokeArrayArg(recognizer, 'remove', this)) {
                    return this;
                }

                var recognizers = this.recognizers;
                recognizer = this.get(recognizer);
                recognizers.splice(inArray(recognizers, recognizer), 1);

                this.touchAction.update();
                return this;
            },

            /**
             * bind event
             * @param {String} events
             * @param {Function} handler
             * @returns {EventEmitter} this
             */
            on: function(events, handler) {
                var handlers = this.handlers;
                each(splitStr(events), function(event) {
                    handlers[event] = handlers[event] || [];
                    handlers[event].push(handler);
                });
                return this;
            },

            /**
             * unbind event, leave emit blank to remove all handlers
             * @param {String} events
             * @param {Function} [handler]
             * @returns {EventEmitter} this
             */
            off: function(events, handler) {
                var handlers = this.handlers;
                each(splitStr(events), function(event) {
                    if (!handler) {
                        delete handlers[event];
                    } else {
                        handlers[event].splice(inArray(handlers[event], handler), 1);
                    }
                });
                return this;
            },

            /**
             * emit event to the listeners
             * @param {String} event
             * @param {Object} data
             */
            emit: function(event, data) {
                // we also want to trigger dom events
                if (this.options.domEvents) {
                    triggerDomEvent(event, data);
                }

                // no handlers, so skip it all
                var handlers = this.handlers[event] && this.handlers[event].slice();
                if (!handlers || !handlers.length) {
                    return;
                }

                data.type = event;
                data.preventDefault = function() {
                    data.srcEvent.preventDefault();
                };
                data.stopPropagation = function() {
                    data.srcEvent.stopPropagation();
                };

                var i = 0;
                while (i < handlers.length) {
                    handlers[i](data);
                    i++;
                }
            },

            /**
             * destroy the manager and unbinds all events
             * it doesn't unbind dom events, that is the user own responsibility
             */
            destroy: function() {
                this.element && toggleCssProps(this, false);

                this.handlers = {};
                this.session = {};
                this.input.destroy();
                this.element = null;
            }
        };

        /**
         * add/remove the css properties as defined in manager.options.cssProps
         * @param {Manager} manager
         * @param {Boolean} add
         */
        function toggleCssProps(manager, add) {
            var element = manager.element;
            each(manager.options.cssProps, function(value, name) {
                element.style[prefixed(element.style, name)] = add ? value : '';
            });
        }

        /**
         * trigger dom event
         * @param {String} event
         * @param {Object} data
         */
        function triggerDomEvent(event, data) {
            var gestureEvent = document.createEvent('Event');
            gestureEvent.initEvent(event, true, true);
            gestureEvent.gesture = data;
            data.target.dispatchEvent(gestureEvent);
        }

        extend(Touch, {
            INPUT_START: INPUT_START,
            INPUT_MOVE: INPUT_MOVE,
            INPUT_END: INPUT_END,
            INPUT_CANCEL: INPUT_CANCEL,

            STATE_POSSIBLE: STATE_POSSIBLE,
            STATE_BEGAN: STATE_BEGAN,
            STATE_CHANGED: STATE_CHANGED,
            STATE_ENDED: STATE_ENDED,
            STATE_RECOGNIZED: STATE_RECOGNIZED,
            STATE_CANCELLED: STATE_CANCELLED,
            STATE_FAILED: STATE_FAILED,

            DIRECTION_NONE: DIRECTION_NONE,
            DIRECTION_LEFT: DIRECTION_LEFT,
            DIRECTION_RIGHT: DIRECTION_RIGHT,
            DIRECTION_UP: DIRECTION_UP,
            DIRECTION_DOWN: DIRECTION_DOWN,
            DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
            DIRECTION_VERTICAL: DIRECTION_VERTICAL,
            DIRECTION_ALL: DIRECTION_ALL,

            Manager: Manager,
            Input: Input,
            TouchAction: TouchAction,

            TouchInput: TouchInput,
            MouseInput: MouseInput,
            PointerEventInput: PointerEventInput,
            TouchMouseInput: TouchMouseInput,

            Recognizer: Recognizer,
            AttrRecognizer: AttrRecognizer,
            Tap: TapRecognizer,
            Pan: PanRecognizer,
            Swipe: SwipeRecognizer,
            Pinch: PinchRecognizer,
            Rotate: RotateRecognizer,
            Press: PressRecognizer,

            on: addEventListeners,
            off: removeEventListeners,
            each: each,
            merge: merge,
            extend: extend,
            inherit: inherit,
            bindFn: bindFn,
            prefixed: prefixed
        });

        return Touch;

    };
});
define('frameworks/lib/scroll', [], function (require, module, exports) {

	var UI = device.ui
	  , DP = function (px) { return px * UI.scale }
	  , FEAT = device.feat
	  , PREFIX = FEAT.prefixStyle
	  , EASEING = {
			linear: {
				style: 'cubic-bezier(0, 0, 1, 1)',
				fn: function (k) {
					return k
				}
			},
			quadratic: {
				style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				fn: function (k) {
					return k * ( 2 - k )
				}
			},
			circular: {
				style: 'cubic-bezier(0, 0, 0.1, 1)',	// ?cubic-bezier(0, 0, 0, 1)? cubic-bezier(0.1, 0.57, 0.1, 1) : Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
				fn: function (k) {
					return Math.sqrt( 1 - ( --k * k ) )
				}
			},
			back: {
				style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				fn: function (k) {
					var b = 4
					return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1
				}
			},
			bounce: {
				style: '',
				fn: function (k) {
					if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
						return 7.5625 * k * k
					} else if ( k < ( 2 / 2.75 ) ) {
						return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75
					} else if ( k < ( 2.5 / 2.75 ) ) {
						return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375
					} else {
						return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375
					}
				}
			},
			elastic: {
				style: '',
				fn: function (k) {
					var f = 0.22,
						e = 0.4

					if ( k === 0 ) { return 0 }
					if ( k == 1 ) { return 1 }

					return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 )
				}
			}
		}
	  , BROWSER = {
	          	touch : FEAT.touch,
	          	isBadTransition : FEAT.isBadTransition,
	          	supportTransition : FEAT.supportTransition,
	          	feat : {
					hasObserver : FEAT.observer,
	                hasTransform : PREFIX('transform') !== false,
					hasPerspective : PREFIX('perspective'),
					hasTouch : FEAT.touch,
					hasPointer : navigator.msPointerEnabled,
					hasTransition : PREFIX('transition')
	            },
	            prefixStyle : {
		           	transform : PREFIX('transform'),
		           	transition : PREFIX('transition'),
					transitionTimingFunction : PREFIX('transitionTimingFunction'),
					transitionDuration : PREFIX('transitionDuration'),
					transitionDelay : PREFIX('transitionDelay'),
					transformOrigin : PREFIX('transformOrigin')
		        },
		        prefixPointerEvent : function (pointerEvent) {
					return window.MSPointerEvent ? 
						'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
						pointerEvent;
				}
	        }
	      , COMMON = (function () {

				this.addEvent = function (el, type, fn, capture) {
					el.addEventListener(type, fn, !!capture)
				}

				this.removeEvent = function (el, type, fn, capture) {
					el.removeEventListener(type, fn, !!capture)
				}

				this.offset = function (el) {
					var left = -el.offsetLeft,
						top = -el.offsetTop

					while (el = el.offsetParent) {
						left -= el.offsetLeft
						top -= el.offsetTop
					}

					return {
						left: left,
						top: top
					}
				}

				this.preventDefaultException = function (el, exceptions) {
					for ( var i in exceptions ) {
						if ( exceptions[i].test(el[i]) ) {
							return true
						}
					}

					return false
				}

				this.eventType = {
					touchstart: 1,
					touchmove: 1,
					touchend: 1,

					mousedown: 2,
					mousemove: 2,
					mouseup: 2,

					MSPointerDown: 3,
					MSPointerMove: 3,
					MSPointerUp: 3
				}

				return this
			}).call({})
	
	module.exports = function (window, document, Math) {
		'use strict'

		var GCS = window.getComputedStyle
	  	  , RAF = window.requestAnimationFrame

		function Scroll (el, options) {

			this.options = {

				bindToWrapper : false,

				scrollbars : true,
				fadeScrollbars : true,
				resizeScrollbars : true,

				mouseWheel : true,
				mouseWheelSpeed : 20,

				infiniteDeferLoad : false,
				infiniteCacheBuffer : 50,

				momentum : true,
				durationMinTime : 600,
				deceleration : 0.0012,
				speedLimit : 3,

				startX : 0,
				startY : 0,
				scrollX : false,
				scrollY : true,
				directionLockThreshold : 5,

				bounce : true,
				bounceDrag : 3,
				bounceTime : 400,
				bounceEasing : '',
				boundariesLimit : 0.6,
				bounceBreakThrough : true,

				snap : false,
				snapSpeed : 400,
				snapEasing : '',
				snapThreshold : 0.15,

				preventDefault : true,
				preventDefaultException : { tagName: /^(INPUT|TEXTAREA|HTMLAREA|BUTTON|SELECT)$/ },
				stopPropagation : false,

				HWCompositing : true,
				useTransition : true
				
			}

			for ( var i in options ) {
				this.options[i] = options[i]
			}

			this.wrapper = el
			this.scroller = this.wrapper.childrens('scrolling')[0]
			this.scrollbar = this.wrapper.childrens('scrollbar')[0]

			if ( !this.scroller ) {
				application.console.warn('<SCROLLING> is not defined')

				this.scroller = this.wrapper.children[0]

				if ( !this.scroller ) throw 'scrolling is not defined'
			}

			this.scrollerStyle = this.scroller.style		// cache style for better performance

			this.wrapperWidth = this.wrapper.clientWidth
			this.wrapperHeight = this.wrapper.clientHeight

			// Normalize options

			this.translateZ = this.options.HWCompositing && BROWSER.feat.hasPerspective ? ' translateZ(0px)' : ''

			this.options.useTransition = BROWSER.feat.hasTransition && this.options.useTransition

			this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough
			this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault

			// If you want eventPassthrough I have to lock one of the axes

			this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY
			this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX

			// With eventPassthrough we also need lockDirection mechanism

			this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough
			this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold

			this.options.snapEasing = typeof this.options.snapEasing == 'string' ? EASEING[this.options.snapEasing] || EASEING.circular : this.options.snapEasing
			this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? EASEING[this.options.bounceEasing] || EASEING.quadratic : this.options.bounceEasing

			this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling

			this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1

			this.options.indicators = this.scrollbar ? { el: this.scrollbar } : null
			

			// snap

			if ( this.options.snap ) {

				if ( !options.mouseWheel ) {
					this.options.mouseWheel = false
				}

				if ( !options.speedLimit ) {
					this.options.speedLimit = .5
				}

				if ( !options.fadeScrollbars ) {
					this.options.fadeScrollbars = false
				}

				if ( this.options.indicators ) {
					this.options.indicators.resize = false
				}
			}

			if ( !BROWSER.supportTransition ) {
				this.options.useTransition = false
			}

			// 初始化 scroll wrapper style

			if ( this.options.scrollX && this.options.scrollY ) {
                this.wrapper.setAttribute('flow-free', '')
            } else if ( this.options.scrollX ) {
                this.wrapper.setAttribute('flow-x', '')
                this.wrapper.style.height = this.scroller.offsetHeight + 'px'
            } else if ( this.options.scrollY ) {
                this.wrapper.setAttribute('flow-y', '')
            }

			// NORMALIZATION

			// Some defaults	

			this.x = 0
			this.y = 0
			this.directionX = 0
			this.directionY = 0

			this.decelerationRate = 1

			this._events = {}

			// DEFAULTS

			this.revert(true)
		}

		Scroll.prototype = {

			handleEvent : function (e) {
				switch (e.type) {
					case 'touchstart':
					case 'MSPointerDown':
					case 'mousedown':
						this._start(e)
						break
					case 'touchmove':
					case 'MSPointerMove':
					case 'mousemove':
						this._move(e)
						break
					case 'touchend':
					case 'MSPointerUp':
					case 'mouseup':
					case 'touchcancel':
					case 'MSPointerCancel':
					case 'mousecancel':
						this._end(e)
						break
					case 'orientationchange':
					case 'resize':
						this._resize()
						break
					case 'transitionend':
					case 'webkitTransitionEnd':
					case 'oTransitionEnd':
					case 'MSTransitionEnd':
						this._transitionEnd(e)
						break
					case 'wheel':
					case 'DOMMouseScroll':
					case 'mousewheel':
						this._wheel(e)
						break
					case 'keydown':
						this._key(e)
						break
					case 'click':
						if ( !e._constructed ) {
							e.preventDefault()
							e.stopPropagation()
						}
						break
				}
				// 监听infinite item的dom节点更新，更新后刷新节点位置;
			},

			_initEvents : function (remove) {
				var bind = remove ? COMMON.removeEvent : COMMON.addEvent
				  , target = this.options.bindToWrapper ? this.wrapper : window

				bind(window, 'orientationchange', this)
				bind(window, 'resize', this)

				if ( !this.options.disableMouse ) {
					bind(this.wrapper, 'mousedown', this)
					bind(target, 'mousemove', this)
					bind(target, 'mousecancel', this)
					bind(target, 'mouseup', this)
				}

				if ( BROWSER.feat.hasPointer && !this.options.disablePointer ) {
					bind(this.wrapper, BROWSER.prefixPointerEvent('pointerdown'), this)
					bind(target, BROWSER.prefixPointerEvent('pointermove'), this)
					bind(target, BROWSER.prefixPointerEvent('pointercancel'), this)
					bind(target, BROWSER.prefixPointerEvent('pointerup'), this)
				}

				if ( BROWSER.feat.hasTouch && !this.options.disableTouch ) {
					bind(this.wrapper, 'touchstart', this)
					bind(target, 'touchmove', this)
					bind(target, 'touchcancel', this)
					bind(target, 'touchend', this)
				}

				bind(this.scroller, 'transitionend', this)
				bind(this.scroller, 'webkitTransitionEnd', this)
				bind(this.scroller, 'oTransitionEnd', this)
				bind(this.scroller, 'MSTransitionEnd', this)
			},

			_initObserver : function () {
				// set refresh event

				if ( !this.options.infiniteElements ) {
					this._observer(this.scroller, function () {
						this.refresh()
					})
				}
			},

			_initIndicators : function () {
				var interactive = this.options.interactiveScrollbars,
					customStyle = typeof this.options.scrollbars != 'string',
					indicators = [],
					indicator

				var that = this

				this.indicators = []

				if ( this.options.scrollbars ) {

					// Vertical scrollbar

					if ( this.options.scrollY ) {
						indicator = {
							el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
							interactive: interactive,
							defaultScrollbars: true,
							customStyle: customStyle,
							resize: this.options.resizeScrollbars,
							drag: this.options.bounceDrag,
							fade: this.options.fadeScrollbars,
							listenX: false
						}

						this.wrapper.appendChild(indicator.el)
						indicators.push(indicator)
					}

					// Horizontal scrollbar

					if ( this.options.scrollX ) {
						indicator = {
							el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
							interactive: interactive,
							defaultScrollbars: true,
							customStyle: customStyle,
							resize: this.options.resizeScrollbars,
							drag: this.options.bounceDrag,
							fade: this.options.fadeScrollbars,
							listenY: false
						}

						this.wrapper.appendChild(indicator.el)
						indicators.push(indicator)
					}
				}

				if ( this.options.indicators ) {

					// TODO: check concat compatibility

					indicators = indicators.concat(this.options.indicators)
				}

				for ( var i = indicators.length; i--; ) {
					this.indicators.push( new Indicator(this, indicators[i]) )
				}

				// TODO: check if we can use array.map (wide compatibility and performance issues)

				function _indicatorsMap (fn) {
					if ( !that.indicators ) return
						
					for ( var i = that.indicators.length; i--; ) {
						fn.call(that.indicators[i])
					}
				}

				if ( this.options.fadeScrollbars ) {
					this.on('scrollend', function () {
						_indicatorsMap(function () {
							this.fade()
						})
					})

					this.on('scrollcancel', function () {
						_indicatorsMap(function () {
							this.fade()
						})
					})

					this.on('scrollstart', function () {
						_indicatorsMap(function () {
							this.fade(1)
						})
					})

					this.on('beforescrollstart', function () {
						_indicatorsMap(function () {
							this.fade(1, true)
						})
					})
				}


				this.on('refresh', function () {
					_indicatorsMap(function () {
						this.refresh()
					})
				})

				this.on('modify', function () {
					_indicatorsMap(function () {
						this.refresh()
					})
				})

				this.on('destroy', function () {
					_indicatorsMap(function () {
						this.destroy()
					})

					delete this.indicators
				})
			},

			_initWheel : function () {
				COMMON.addEvent(this.wrapper, 'wheel', this)
				COMMON.addEvent(this.wrapper, 'mousewheel', this)
				COMMON.addEvent(this.wrapper, 'DOMMouseScroll', this)

				this.on('destroy', function () {
					COMMON.removeEvent(this.wrapper, 'wheel', this)
					COMMON.removeEvent(this.wrapper, 'mousewheel', this)
					COMMON.removeEvent(this.wrapper, 'DOMMouseScroll', this)
				})
			},

			_initKeys : function (e) {

				// default key bindings

				var keys = {
					pageUp: 33,
					pageDown: 34,
					end: 35,
					home: 36,
					left: 37,
					up: 38,
					right: 39,
					down: 40
				}
				var i

				// if you give me characters I give you keycode

				if ( typeof this.options.keyBindings == 'object' ) {
					for ( i in this.options.keyBindings ) {
						if ( typeof this.options.keyBindings[i] == 'string' ) {
							this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0)
						}
					}
				} else {
					this.options.keyBindings = {}
				}

				for ( i in keys ) {
					this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i]
				}

				COMMON.addEvent(window, 'keydown', this)

				this.on('destroy', function () {
					COMMON.removeEvent(window, 'keydown', this)
				})
			},

			_initSnap : function () {
				this.currentPage = {}

				if ( typeof this.options.snap == 'string' ) {
					this.options.snap = this.scroller.querySelectorAll(this.options.snap)
				}

				this.on('refresh', function () {
					var i = 0, l,
						m = 0, n,
						cx, cy,
						x = 0, y,
						stepX = this.options.snapStepX || this.wrapperWidth,
						stepY = this.options.snapStepY || this.wrapperHeight,
						el

					this.pages = []

					if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
						return
					}

					if ( this.options.snap === true ) {
						cx = Math.round( stepX / 2 )
						cy = Math.round( stepY / 2 )

						while ( x > -this.scrollerWidth ) {
							this.pages[i] = []
							l = 0
							y = 0

							while ( y > -this.scrollerHeight ) {
								this.pages[i][l] = {
									x: Math.max(x, this.maxScrollX),
									y: Math.max(y, this.maxScrollY),
									width: stepX,
									height: stepY,
									cx: x - cx,
									cy: y - cy
								}

								y -= stepY
								l++
							}

							x -= stepX
							i++
						}
					} else {
						el = this.options.snap
						l = el.length
						n = -1

						for ( ; i < l; i++ ) {
							if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
								m = 0
								n++
							}

							if ( !this.pages[m] ) {
								this.pages[m] = []
							}

							x = Math.max(-el[i].offsetLeft, this.maxScrollX)
							y = Math.max(-el[i].offsetTop, this.maxScrollY)
							cx = x - Math.round(el[i].offsetWidth / 2)
							cy = y - Math.round(el[i].offsetHeight / 2)

							this.pages[m][n] = {
								x: x,
								y: y,
								width: el[i].offsetWidth,
								height: el[i].offsetHeight,
								cx: cx,
								cy: cy
							}

							if ( x > this.maxScrollX ) {
								m++
							}
						}
					}

					this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0)

					// Update snap threshold if needed

					if ( this.options.snapThreshold % 1 === 0 ) {
						this.snapThresholdX = this.options.snapThreshold
						this.snapThresholdY = this.options.snapThreshold
					} else {
						this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold)
						this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold)
					}
				})
			},

			_initInfinite : function () {
				var that = this

			    this.infiniteElements = this.options.infiniteElements
				this.infiniteLength = this.infiniteElements.length
				this.infiniteCache = []
				this.infiniteDataLength = 0
				this.scrollerHeight = 0

				this.infiniteItemSize = this.options.infiniteItemSize ? DP(this.options.infiniteItemSize) : false

				// data filler & cache buffer

				this.getInfiniteDataset = this.options.getInfiniteDataset
				this.setInfiniteDataFiller = this.options.setInfiniteDataFiller
			    this.getInfiniteDataFiller = this.options.getInfiniteDataFiller
			    this.getInfiniteCacheBuffer = this.options.getInfiniteCacheBuffer

			    // setup

				this.setupInfinite()

				// 默认节点不可见

				this.one('infiniteDataInited', function () {

					// scroll刷新后更新计算数据

					this.on('refresh', function () {
						this.reorderInfinite()
					})

					// 监听节点变化后刷新

					this.infiniteElements.map(function (item) {
						that._observer(item, function () {
							if ( !that.isInTransition && !that.isAnimating ) {
								that.refreshInfiniteAll()
							}
						})
					})

					this.refresh()
				})

				// 滚动事件触发排序

				this.on('scroll scrollend', function (type) {

					/* 
						!important: 高速滚动与防干扰
						!important: 分离更新事件与滚动主进程
						type moving: 防止move过程中进行数据更新
						type break: 防止start与move事件间进行数据更新
						process: 事件进程状态，防止更新数据延迟end事件，以至于动画延迟
						note: 事件为异步执行，start move end 事件间需要保持主线程通畅，在动画设定后执行更新
					*/

					if ( type == "break" || type == "moving" || this.borderBouncing ) return

					/*
						阶段性更新
						当移动超出一定范围时才执行更新infinite操作
					*/

					this.reorderInfinite()
					
				})

				// 开始infinite >> 获取数据 >> 排序

				this.datasetInfinite()
			},

			_initBase : function () {
				// 被卸载后的重置项

				this.initiated = false
			},

			_init : function () {
				this._initBase()
				this._initEvents()
				this._initObserver()

				if ( this.options.scrollbars || this.options.indicators ) {
					this._initIndicators()
				}

				if ( this.options.mouseWheel ) {
					this._initWheel()
				}

				if ( this.options.snap ) {
					this._initSnap()
				}

				if ( this.options.keyBindings ) {
					this._initKeys()
				}

				if ( this.options.infiniteElements && !this.options.infiniteDeferLoad ) {
					this._initInfinite()
				}

			},

			_resize : function () {
				var that = this

				clearTimeout(this.resizeTimeout)

				this.resizeTimeout = setTimeout(function () {
					that.refresh()
				}, this.options.resizePolling)
			},

			_momentum : function (current, start, time, lowerMargin, wrapperSize) {
				var distance = current - start,
					speed = Math.min(Math.abs(distance) / time / UI.scale, this.options.speedLimit),
					speedCube = Math.pow(speed, 2),
					deceleration = this.options.deceleration * this.decelerationRate,
					parabolaSpan = speedCube / deceleration,
					destination,
					duration

				destination = current + parabolaSpan * (distance < 0 ? -1 : 1)
				duration = Math.max(parabolaSpan / speed, this.options.durationMinTime)

				if ( destination < lowerMargin ) {
					destination = wrapperSize ? lowerMargin - wrapperSize * this.options.boundariesLimit * Math.min(speed / DP(8), 1) : lowerMargin
					distance = Math.abs(destination - current)
					duration = distance / speedCube
				} else if ( destination > 0 ) {
					destination = wrapperSize ? wrapperSize * this.options.boundariesLimit * Math.min(speed / DP(8), 1) : 0
					distance = Math.abs(current) + destination
					duration = distance / speedCube
				}

				return {
					destination: Math.round(destination),
					duration: duration
				}
			},

			_translate : function (x, y) {
				this.scrollerStyle[BROWSER.prefixStyle.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ

				this.x = this._x = x
				this.y = this._y = y

				if ( this.indicators ) {
					for ( var i = this.indicators.length; i--; ) {
						this.indicators[i].updatePosition()
					}
				}

			},

			_transitionTime : function (time) {
				this.scrollerStyle[BROWSER.prefixStyle.transitionDuration] = time ? time + 'ms' : ''

				this.x = this._x
				this.y = this._y

				if ( this.indicators ) {
					for ( var i = this.indicators.length; i--; ) {
						this.indicators[i].transitionTime(time)
					}
				}

			},

			_transitionTimingFunction : function (easing) {
				this.scrollerStyle[BROWSER.prefixStyle.transitionTimingFunction] = easing

				if ( this.indicators ) {
					for ( var i = this.indicators.length; i--; ) {
						this.indicators[i].transitionTimingFunction(easing)
					}
				}

			},

			_transitionScroll : function () {
				var that = this,
					pos

				// useTransition 的scroll事件

				function step () {
					if ( !that.isInTransition ) return

					pos = that.getComputedPosition()

					// drop rate

					that.dropX = Math.round(pos.x - that.x) || that.dropX
					that.dropY = Math.round(pos.y - that.y) || that.dropY

					that.x = Math.round(pos.x)
					that.y = Math.round(pos.y)
					
					that._execEvent('scroll')

					RAF(step)
				}

				step()
			},

			_transitionEnd : function (e) {
				if ( e.target != this.scroller || !this.isInTransition ) {
					return
				}

				this._transitionTime()

				// css3 动画无效自动切换, weixin webview bug

				if ( BROWSER.supportTransition && Date.now() - this.transitionStartTime < this.transitionCountTime * .9 ) {
					this.options.useTransition = false

					// 设备标记不支持动画过渡

					BROWSER.supportTransition = false
					device.feat.supportTransition = false

				}

				// 非边缘弹性时不进行end

				if ( !this.resetPosition(this.options.bounceTime) ) {
					this.isInTransition = false
					this._execEvent('scrollend')
				}

				// drawingEnd

				this.drawingEnd()
			},

			_observer : function (element, callback) {
				var that = this;

				element.observer({
                    childList: true,
                    subtree: true,
                    characterData: true
				}, function (records) {
					if ( records.length ) {
						callback.call(that);
					}
				})
			},

			_animate : function (destX, destY, duration, easingFn) {
				var that = this,
					startX = this.x,
					startY = this.y,
					startTime = Date.now(),
					destTime = startTime + duration

				function step () {
					var now = Date.now(),
						newX, newY,
						easing

					if ( now >= destTime ) {
						that.isAnimating = false
						that._translate(destX, destY)
						
						if ( !that.resetPosition(that.options.bounceTime) ) {
							that._execEvent('scrollend')
						}

						return
					}

					now = ( now - startTime ) / duration
					easing = easingFn(now)
					newX = ( destX - startX ) * easing + startX
					newY = ( destY - startY ) * easing + startY
					that._translate(newX, newY)

					if ( that.isAnimating ) {
						RAF(step)
					}
					
					that._execEvent('scroll')
				}

				this.isAnimating = true
				step()
			},

			on : function (types, fn) {
				var that = this

	            types.split(' ').map(function (type) {
	            	that._events.initial(type, []).push(fn)
	            })
	        },

	        one : function (types, fn) {
	        	var that = this

	        	function once () {
	        		fn.apply(this, arguments)
	        		this.off(types, once)
	        	}

	        	types.split(' ').map(function (type) {
	        		that._events.initial(type, []).push(once)
	        	})
	        },

	        off : function (types, fn) {
	        	var that = this

	            types.split(' ').map(function (type) {
	            	if ( !that._events[type] ) return

	            	var index = that._events[type].indexOf(fn)

	            	if ( index > -1 ) {
	                    that._events[type].splice(index, 1)
	                }
	            })
	        },

	        _execEvent : function (type) {
	        	var that = this,
	        		args = arguments

	            if ( !this._events[type] ) return

	            this._events[type].map(function (fn) {
	            	fn.apply(that, [].slice.call(args, 1))
	            })
	        },

			_start : function (e) {
				// React to left mouse button only

				if ( COMMON.eventType[e.type] != 1 ) {
					if ( e.button !== 0 ) {
						return
					}
				}

				if ( !this.enabled || (this.initiated && COMMON.eventType[e.type] !== this.initiated) ) {
					return
				}

				if ( this.options.preventDefault && !COMMON.preventDefaultException(e.target, this.options.preventDefaultException) ) {
					e.preventDefault()
				}

				if ( this.options.stopPropagation ) {
					e.stopPropagation()
				}

				var finger = e.touches ? e.touches.length - 1 : 0,
					point = e.touches ? e.touches[e.touches.length-1] : e,
					time = 0,
					pos

				this.finger = finger

				this.initiated	= COMMON.eventType[e.type]
				this.moved		= false
				this.distX		= 0
				this.distY		= 0
				this.trendX     = 0
				this.trendY     = 0
				this.directionX = 0
				this.directionY = 0
				this.directionLocked = 0

				this.startTime = Date.now()

				if ( this.options.useTransition && this.isInTransition ) {

					/*
						=== 动画终止锁定 ===
						锁定防止被 scrolling 刷新位置 
						重要－置顶处理
					*/

					this.isInTransition = false

					// 针对 0ms停止无效 做处理
					
					/*
						动画积压bug
						当前置动画未执行完时，元素被设置了新的动画，0ms暂停无效时
						后置的动画会积压到gpu内存中，因前置动画时间结束才能被释放
						此时gpu内存则可能溢出，导致gpu性能直线下降，此处采用0.0001ms
						动画进行快速释放gpu内存
					*/

					if ( BROWSER.isBadTransition ) {

						time = 0.0001
						this.transitionGap = true

					}

					// 动画时间清零

					this._transitionTime(time)

					// 获取当前停止位置

					pos = this.getComputedPosition()

					// 修正动画追加, 获取

					if ( this.trendX >= 0 && this.trendY >= 0 && this.borderBouncing == false ) {
						pos.x += this.dropX
						pos.y += this.dropY
					}

					this.x = Math.round(pos.x)
					this.y = Math.round(pos.y)

					this._translate(this.x, this.y)
						
					this._execEvent('scrollend', "break")
			
				} else if ( !this.options.useTransition && this.isAnimating ) {
					this.isAnimating = false
					this._execEvent('scrollend', "break")
				}

				// drop rate by LIEN;

				this.dropX = 0
				this.dropY = 0

				this.startX    = this.x
				this.startY    = this.y
				this.absStartX = this.x
				this.absStartY = this.y
				this.pointX    = point.pageX
				this.pointY    = point.pageY

				this._execEvent('beforescrollstart')
			},

			_move : function (e) {

				if ( !this.enabled || COMMON.eventType[e.type] !== this.initiated ) {
					return
				}

				if ( this.options.preventDefault && !COMMON.preventDefaultException(e.target, this.options.preventDefaultException) ) {
					e.preventDefault()
				}

				if ( this.options.stopPropagation ) {
					e.stopPropagation()
				}

				// FOR BAD TRANSITION: {

					// clear 0.0001，reset time;

					if ( this.transitionGap ) {
						this._transitionTime()

						var pos = this.getComputedPosition()

						this.x = Math.round(pos.x)
						this.y = Math.round(pos.y)

						this.transitionGap = false
					}

				// }

				var finger 		= e.touches ? e.touches.length - 1 : 0,
					point		= e.touches ? e.touches[e.touches.length-1] : e,
					deltaX		= point.pageX - this.pointX,
					deltaY		= point.pageY - this.pointY,
					timestamp	= Date.now(),
					newX, newY,
					absDistX, absDistY,
					directionX, directionY

				this.finger = finger

				this.pointX		= point.pageX
				this.pointY		= point.pageY

				this.distX		+= deltaX
				this.distY		+= deltaY
				absDistX		= Math.abs(this.distX)
				absDistY		= Math.abs(this.distY)


				// We need to move at least 10 pixels for the scrolling to initiate

				if ( timestamp - this.endTime > 200 && (absDistX < DP(10) && absDistY < DP(10)) ) {
					return
				}

				// If you are scrolling in one direction lock the other

				if ( !this.directionLocked && !this.options.freeScroll ) {
					if ( absDistX > absDistY + this.options.directionLockThreshold ) {
						this.directionLocked = 'h'		// lock horizontally
					} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
						this.directionLocked = 'v'		// lock vertically
					} else {
						this.directionLocked = 'n'		// no lock
					}
				}

				if ( this.directionLocked == 'h' ) {
					if ( this.options.eventPassthrough == 'vertical' ) {
						e.preventDefault()
					} else if ( this.options.eventPassthrough == 'horizontal' ) {
						this.initiated = false
						return
					}

					deltaY = 0
				} else if ( this.directionLocked == 'v' ) {
					if ( this.options.eventPassthrough == 'horizontal' ) {
						e.preventDefault()
					} else if ( this.options.eventPassthrough == 'vertical' ) {
						this.initiated = false
						return
					}

					deltaX = 0
				}

				deltaX = this.hasHorizontalScroll ? deltaX : 0
				deltaY = this.hasVerticalScroll ? deltaY : 0

				newX = this.x + deltaX
				newY = this.y + deltaY

				// Slow down if outside of the boundaries

				if ( newX > 0 || newX < this.maxScrollX ) {
					newX = this.options.bounce ? this.x + deltaX / (this.options.bounceDrag + Math.pow(absDistX, 0.05)) : newX > 0 ? 0 : this.maxScrollX
				}
				if ( newY > 0 || newY < this.maxScrollY ) {
					newY = this.options.bounce ? this.y + deltaY / (this.options.bounceDrag + Math.pow(absDistY, 0.05)) : newY > 0 ? 0 : this.maxScrollY
				}
 
				directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0
				directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0

				this.trendX = this.directionX == directionX ? 1 : -1
				this.trendY = this.directionY == directionY ? 1 : -1

				this.directionX = directionX
				this.directionY = directionY

				if ( !this.moved ) {
					this._execEvent('scrollstart')
				}

				this.moved = true

				this._translate(newX, newY)


				if ( timestamp - this.startTime > 300 ) {
					this.startTime = timestamp
					this.startX = this.x
					this.startY = this.y
				}
				
				this._execEvent('scroll', 'moving')

			},

			_end : function (e) {

				if ( !this.enabled || COMMON.eventType[e.type] !== this.initiated ) {
					return
				}

				if ( this.finger > 0 ) {
					return
				}

				if ( this.options.preventDefault && !COMMON.preventDefaultException(e.target, this.options.preventDefaultException) ) {
					e.preventDefault()
				}

				if ( this.options.stopPropagation ) {
					e.stopPropagation()
				}

				var changedTouches = e.changedTouches ? e.changedTouches.length : 0,
					point = changedTouches ? e.changedTouches[changedTouches] : e,
					momentumX,
					momentumY,
					duration = Date.now() - this.startTime,
					newX = Math.round(this.x),
					newY = Math.round(this.y),
					distanceX = Math.abs(newX - this.startX),
					distanceY = Math.abs(newY - this.startY),
					panDirectionX = newX - this.startX > 0 ? 1 : newX - this.startX < 0 ? -1 : 0,
					panDirectionY = newY - this.startY > 0 ? 1 : newY - this.startY < 0 ? -1 : 0,
					time = 0,
					easing = ''

				this.finger -= changedTouches

				this.isInTransition = false
				this.initiated = 0
				this.gapTime = Date.now() - this.endTime
				this.endTime = Date.now()

				// reset if we are outside of the boundaries

				if ( this.resetPosition(this.options.bounceTime) ) {
					return
				}

				// ensures that the last position is rounded

				this.scrollTo(newX, newY)

				// we scrolled less than 10 pixels

				if ( !this.moved ) {
					this._execEvent('scrollcancel')
					return
				}

				// start momentum animation if needed

				if ( this.options.momentum && duration < 300 ) {
					momentumX = this.hasHorizontalScroll ? this._momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce && this.options.bounceBreakThrough ? this.wrapperWidth : 0) : { destination: newX, duration: 0 }
					momentumY = this.hasVerticalScroll ? this._momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce && this.options.bounceBreakThrough ? this.wrapperHeight : 0) : { destination: newY, duration: 0 }
					newX = momentumX.destination
					newY = momentumY.destination
					time = Math.max(momentumX.duration, momentumY.duration)

					this.isInTransition = true
				}


				if ( this.options.snap ) {
					var snap = this._nearestSnap(newX, newY)
					this.currentPage = snap
					time = this.options.snapSpeed || Math.max(
							Math.max(
								Math.min(Math.abs(newX - snap.x), 1000),
								Math.min(Math.abs(newY - snap.y), 1000)
							), 300)
					newX = snap.x
					newY = snap.y

					this.directionX = 0
					this.directionY = 0
					easing = this.options.snapEasing
				}

				if ( newX != this.x || newY != this.y ) {

					// change easing function when scroller goes out of the boundaries

					if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
						easing = EASEING.quadratic
					}

					// 两次连续滚动且两次滚动方向一致则重力加速

					if ( this.gapTime < 600 && this.panDirectionY == panDirectionY && this.panDirectionX == panDirectionX ) {
						this.decelerationRate = Math.max(this.decelerationRate - 0.1, 0.5)
					} else {
						this.decelerationRate = 1
					}

					// panDirection 手指的每次走向记录

					this.panDirectionX = panDirectionX
					this.panDirectionY = panDirectionY

					this.scrollTo(newX, newY, time, easing)
					
					return
				}

				// def event

				this._execEvent('scrollend')
			},

			_wheel : function (e) {
				if ( !this.enabled ) {
					return
				}

				e.preventDefault()

				if ( this.options.stopPropagation ) {
					e.stopPropagation()
				}

				var wheelDeltaX, wheelDeltaY,
					newX, newY,
					that = this

				if ( this.wheelTimeout === undefined ) {
					that._execEvent('scrollstart')
				}

				// Execute the scrollend event after 400ms the wheel stopped scrolling

				clearTimeout(this.wheelTimeout)
				this.wheelTimeout = setTimeout(function () {
					that._execEvent('scrollend')
					that.wheelTimeout = undefined
				}, 400)

				if ( 'deltaX' in e ) {
					wheelDeltaX = -e.deltaX
					wheelDeltaY = -e.deltaY
				} else if ( 'wheelDeltaX' in e ) {
					wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed
					wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed
				} else if ( 'wheelDelta' in e ) {
					wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed
				} else if ( 'detail' in e ) {
					wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed
				} else {
					return
				}

				wheelDeltaX *= this.options.invertWheelDirection
				wheelDeltaY *= this.options.invertWheelDirection

				if ( !this.hasVerticalScroll ) {
					wheelDeltaX = wheelDeltaY
					wheelDeltaY = 0
				}

				if ( this.options.snap ) {
					newX = this.currentPage.pageX
					newY = this.currentPage.pageY

					if ( wheelDeltaX > 0 ) {
						newX--
					} else if ( wheelDeltaX < 0 ) {
						newX++
					}

					if ( wheelDeltaY > 0 ) {
						newY--
					} else if ( wheelDeltaY < 0 ) {
						newY++
					}

					this.goToPage(newX, newY)

					return
				}

				newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0)
				newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0)

				if ( newX > 0 ) {
					newX = 0
				} else if ( newX < this.maxScrollX ) {
					newX = this.maxScrollX
				}

				if ( newY > 0 ) {
					newY = 0
				} else if ( newY < this.maxScrollY ) {
					newY = this.maxScrollY
				}

				this.scrollTo(newX, newY, 0)

				this._execEvent('scroll')
			},

			_key : function (e) {
				if ( !this.enabled ) {
					return
				}

				var snap = this.options.snap,	// we are using this alot, better to cache it
					newX = snap ? this.currentPage.pageX : this.x,
					newY = snap ? this.currentPage.pageY : this.y,
					now = Date.now(),
					prevTime = this.keyTime || 0,
					acceleration = 0.250,
					pos

				if ( this.options.useTransition && this.isInTransition ) {
					pos = this.getComputedPosition()

					this._translate(Math.round(pos.x), Math.round(pos.y))
					this.isInTransition = false
				}

				this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0

				switch ( e.keyCode ) {
					case this.options.keyBindings.pageUp:
						if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
							newX += snap ? 1 : this.wrapperWidth
						} else {
							newY += snap ? 1 : this.wrapperHeight
						}
						break
					case this.options.keyBindings.pageDown:
						if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
							newX -= snap ? 1 : this.wrapperWidth
						} else {
							newY -= snap ? 1 : this.wrapperHeight
						}
						break
					case this.options.keyBindings.end:
						newX = snap ? this.pages.length-1 : this.maxScrollX
						newY = snap ? this.pages[0].length-1 : this.maxScrollY
						break
					case this.options.keyBindings.home:
						newX = 0
						newY = 0
						break
					case this.options.keyBindings.left:
						newX += snap ? -1 : 5 + this.keyAcceleration>>0
						break
					case this.options.keyBindings.up:
						newY += snap ? 1 : 5 + this.keyAcceleration>>0
						break
					case this.options.keyBindings.right:
						newX -= snap ? -1 : 5 + this.keyAcceleration>>0
						break
					case this.options.keyBindings.down:
						newY -= snap ? 1 : 5 + this.keyAcceleration>>0
						break
					default:
						return
				}

				if ( snap ) {
					this.goToPage(newX, newY)
					return
				}

				if ( newX > 0 ) {
					newX = 0
					this.keyAcceleration = 0
				} else if ( newX < this.maxScrollX ) {
					newX = this.maxScrollX
					this.keyAcceleration = 0
				}

				if ( newY > 0 ) {
					newY = 0
					this.keyAcceleration = 0
				} else if ( newY < this.maxScrollY ) {
					newY = this.maxScrollY
					this.keyAcceleration = 0
				}

				this.scrollTo(newX, newY, 0)

				this.keyTime = now
			},

			_nearestSnap : function (x, y) {
				if ( !this.pages.length ) {
					return { x: 0, y: 0, pageX: 0, pageY: 0 }
				}

				var i = 0,
					l = this.pages.length,
					m = 0

				// Check if we exceeded the snap threshold

				if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
					Math.abs(y - this.absStartY) < this.snapThresholdY ) {
					return this.currentPage
				}

				if ( x > 0 ) {
					x = 0
				} else if ( x < this.maxScrollX ) {
					x = this.maxScrollX
				}

				if ( y > 0 ) {
					y = 0
				} else if ( y < this.maxScrollY ) {
					y = this.maxScrollY
				}

				for ( ; i < l; i++ ) {
					if ( x >= this.pages[i][0].cx ) {
						x = this.pages[i][0].x
						break
					}
				}

				l = this.pages[i].length

				for ( ; m < l; m++ ) {
					if ( y >= this.pages[0][m].cy ) {
						y = this.pages[0][m].y
						break
					}
				}

				if ( i == this.currentPage.pageX ) {
					i += this.directionX

					if ( i < 0 ) {
						i = 0
					} else if ( i >= this.pages.length ) {
						i = this.pages.length - 1
					}

					x = this.pages[i][0].x
				}

				if ( m == this.currentPage.pageY ) {
					m += this.directionY

					if ( m < 0 ) {
						m = 0
					} else if ( m >= this.pages[0].length ) {
						m = this.pages[0].length - 1
					}

					y = this.pages[0][m].y
				}

				return {
					x: x,
					y: y,
					pageX: i,
					pageY: m
				}
			},

			next : function (time, easing) {
				var x = this.currentPage.pageX,
					y = this.currentPage.pageY

				x++

				if ( x >= this.pages.length && this.hasVerticalScroll ) {
					x = 0
					y++
				}

				this.goToPage(x, y, time, easing)
			},

			prev : function (time, easing) {
				var x = this.currentPage.pageX,
					y = this.currentPage.pageY

				x--

				if ( x < 0 && this.hasVerticalScroll ) {
					x = 0
					y--
				}

				this.goToPage(x, y, time, easing)
			},

			goToPage : function (x, y, time, easing) {
				easing = easing || this.options.bounceEasing

				if ( x >= this.pages.length ) {
					x = this.pages.length - 1
				} else if ( x < 0 ) {
					x = 0
				}

				if ( y >= this.pages[x].length ) {
					y = this.pages[x].length - 1
				} else if ( y < 0 ) {
					y = 0
				}

				var posX = this.pages[x][y].x,
					posY = this.pages[x][y].y

				time = time === undefined ? this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(posX - this.x), 1000),
						Math.min(Math.abs(posY - this.y), 1000)
					), 300) : time

				this.currentPage = {
					x: posX,
					y: posY,
					pageX: x,
					pageY: y
				}

				this.scrollTo(posX, posY, time, easing)
			},

			scrollBy : function (x, y, time, easing) {
				x = this.x + x
				y = this.y + y
				time = time || 0

				this.scrollTo(x, y, time, easing)
			},

			scrollTo : function (x, y, time, easing) {
				easing = easing || EASEING.circular

				this.isInTransition = this.options.useTransition && time > 0

				if ( !time || (this.options.useTransition && easing.style) ) {
					if ( this.options.useTransition ) {
						this._transitionTimingFunction(easing.style)
						this._transitionTime(time)
					}

					this.transitionStartTime = Date.now()
					this.transitionCountTime = time
					
					this._translate(x, y)

					this._transitionScroll()

				} else {
					this._animate(x, y, time, easing.fn)
				}
			},

			scrollToElement : function (el, time, offsetX, offsetY, easing) {
				el = el.nodeType ? el : this.scroller.querySelector(el)

				if ( !el ) {
					return
				}

				var pos = COMMON.offset(el)

				pos.left -= this.wrapperOffset.left
				pos.top  -= this.wrapperOffset.top

				// if offsetX/Y are true we center the element to the screen

				if ( offsetX === true ) {
					offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2)
				}
				if ( offsetY === true ) {
					offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2)
				}

				pos.left -= offsetX || 0
				pos.top  -= offsetY || 0

				pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left
				pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top

				time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time

				this.scrollTo(pos.left, pos.top, time, easing)
			},

			getComputedPosition : function () {
				var matrix = GCS(this.scroller, null),
					x, y

				matrix = matrix[BROWSER.prefixStyle.transform].split(')')[0].split(', ')
				x = +(matrix[12] || matrix[4])
				y = +(matrix[13] || matrix[5])

				return { x: x, y: y }
			},

			drawingEnd : function () {
				if ( this.options.infiniteElements ) return
				if ( (this.hasVerticalScroll && this.y < Math.min(this.maxScrollY + this.wrapperHeight, 0)) || (this.hasHorizontalScroll && this.x < Math.min(this.maxScrollX + this.wrapperHeight,0)) ) {
					if ( this.scrollerHeight !== this.scroller.offsetHeight || this.scrollerWidth !== this.scroller.offsetWidth ) {
						this.refresh()
					}
				}
			},

			resetPosition : function (time) {
				var x = this.x,
					y = this.y

				time = time || 0

				if ( !this.hasHorizontalScroll || this.x > 0 ) {
					x = 0
				} else if ( this.x < this.maxScrollX ) {
					x = this.maxScrollX
				}

				if ( !this.hasVerticalScroll || this.y > 0 ) {
					y = 0
				} else if ( this.y < this.maxScrollY ) {
					y = this.maxScrollY
				}

				if ( x == this.x && y == this.y ) {
					return this.borderBouncing = false
				}

				this.scrollTo(x, y, time, EASEING.quadratic)

				// 边缘弹性时触发刷新, 当滑到底部

				return this.borderBouncing = true
			},

			setupInfinite : function () {
				this.scrollerHeight = 0

				this.infinitePhase = 0
				this.infiniteMaxPhase = 0
				this.infiniteContentWidth = 0
				this.infiniteContentHeight = 0
				this.infiniteContentPos = [0, 0]
				this.infiniteContainerCenter = 0
				this.infiniteElementsPos = [0, 0]
				this.infiniteElementsEdge = [0, 0]
				this.infinitePhaseElements = []

			},

			resetInfinite : function (time) {
				this.infiniteElements.each(function (key, element) {
					this.setInfiniteDataFiller(element, element._phase)
				}, this)

				this.scrollTo(0, 0, time)
				this.setupInfinite()
				this.reorderInfinite()
			},

			// 加载数据回调

			datasetInfinite : function () {

				if ( this.datasetInfiniteLock === true ) return

				var that = this
				var start = this.infiniteCache.length

				// ajax lock

				this.datasetInfiniteLock = true

				this.getInfiniteDataset.call(this, start, function (data, end) {

					/*
						data [type : Array]
						datasetInfinite.lock: 数据加载完毕，不再尝试更新
					*/

					if ( data === undefined || !data.length ) {
						return that.datasetInfiniteLock = true
					}
					
					// 更新数据缓存

					that.updateInfiniteData(start, data)

					// 成功回调

					that.reorderInfinite()

					if ( start == 0 ) {
						that._execEvent('infiniteDataInited')
					}

					// 如果数据不足一页则为尾页

					if ( end ) {
						return that.datasetInfiniteLock = true
					}

					// open lock

					that.datasetInfiniteLock = false
				})
			},

			detectInfiniteBalance : function () {
				return (this.infiniteContentPos[1] + this.infiniteContentPos[0] - 2 * this.infiniteContainerCenter) * 2
			},

			// TO-DO: clean up the miss

			reorderInfinite : function () {
				var that = this
				  , point
				  , center
				  , supplement
				
				point = -this.y

				// 内容绝对中心位置

				center = point + this.wrapperHeight / 2

				// 移动补充正负值

				supplement = this.infiniteContainerCenter - center
				supplement = supplement === 0 ? -1 : supplement < 0 ? -1 : 1

				// 记录中心位置

				this.infiniteContainerCenter = center

				// 滚动内容高度

				this.infiniteContentHeight = this.infiniteContentPos[1] - this.infiniteContentPos[0]

				// 剩余容量

				this.infiniteSurplusBuffer = this.infiniteDataLength - this.infinitePhase

				// 检测剩余容量

				this.checkInfiniteDataBuffer()

				// 如果没有数据，停止排序

				if ( this.infiniteDataLength === 0 ) return

				// 重新排序

				this.rearrangeInfinite(supplement)
			},

			rearrangeInfinite : function (supplement) {
				var that = this
				  , item
				  , pos
				  , size
				  , phase
				  , index
				  , round
				  , i = 0
				  , limit = Math.min(this.infiniteLength, this.infiniteDataLength)
				  , first = supplement == 1 && this.infinitePhase <= limit
				  

				// lock

				function subStep () {
					/*
						if > 如果缓冲不足 或者 初始化
						detectInfiniteBalance: 上下缓冲平衡检测 and 初始化
						infinitePhase: 当前step id
						infiniteLength: 循环数量
					*/

					if ( that.detectInfiniteBalance() < 0 || first ) {

						if ( i >= limit ) return

						// infiniteSurplusBuffer: 过剩的缓存数据

						that.infiniteSurplusBuffer = that.infiniteDataLength - that.infinitePhase

						// 如果数据全部展示完毕则停止

						if ( that.infiniteSurplusBuffer <= 0 ) return that._execEvent('infiniteCachedEnd')

						// 当前操作data序列

						phase = that.infinitePhase++

						// 当前操作dom序列

						index = phase % that.infiniteLength

						// 循环序列

						round = Math.max((phase + 1 - that.infiniteLength) % that.infiniteLength, 0)
						
						// set item

						item = that.infiniteElements[index]
						item._index = index
						item.__phase = item._phase || 0
						item._phase = phase

						// infinite of content border top and bottom pos

						pos = that.infiniteContentPos[1]

						// update item pos

						that.updateInfinitePos(item, pos)

						// update item content

						that.updateInfiniteContent(item)

						// content item size

						size = that.infiniteItemSize || item.offsetHeight

						// mark item pos

						that.infiniteElementsPos[index] = [pos, pos + size]
						
						// update infinite of content border top and bottom pos

						that.infiniteElementsEdge = [round, index]
						that.infiniteContentPos[0] = that.infiniteElementsPos[round][0]
						that.infiniteContentPos[1] += size

						// update maxScrollY and scrollerHeight

						that.refreshInfinite(phase, pos + size)

						// limit

						i++

						// while

						subStep()

					}
				}

				function supStep () {
					/*
						if > 如果缓冲不足
						detectInfiniteBalance: 上下缓冲平衡检测
						infinitePhase: 当前step id
						infiniteLength: 循环数量
					*/

					if ( that.detectInfiniteBalance() > 0 ) {

						if ( i >= limit ) return
						
						// ignore init phase

						if ( that.infinitePhase - that.infiniteLength <= 0 ) return

						// step phase

						phase = --that.infinitePhase

						// dom of index id

						index = phase % that.infiniteLength

						// dom of round id

						round = (phase - 1) % that.infiniteLength

						// set item

						item = that.infiniteElements[index]
						item._index = index
						item.__phase = item._phase
						item._phase = phase - that.infiniteLength

						// update item content

						that.updateInfiniteContent(item)

						// content item size

						size = that.infiniteItemSize || item.offsetHeight

						// infinite of content border top and bottom pos

						pos = that.infiniteContentPos[0] - size

						// update item content

						that.updateInfinitePos(item, pos)

						// mark item pos

						that.infiniteElementsPos[index] = [pos, pos + size]

						// update infinite of content border top and bottom pos

						that.infiniteElementsEdge = [index, round]
						that.infiniteContentPos[0] -= size
						that.infiniteContentPos[1] = that.infiniteElementsPos[round][1]

						// limit

						i++

						// while

						supStep()

					}
				}

				switch (supplement) {
					case -1:
						subStep()
						break
					case 1:
						supStep()
						break
				}
				
			},

			refreshInfinite : function (phase, pos) {

				// 如果增量没有超出或者不进行强制更新位置

				if ( phase <= this.infiniteMaxPhase ) return

				// 如果还有缓存数据，则增加两倍视图高度的虚拟缓冲区

				this.scrollerHeight = pos + (this.infiniteSurplusBuffer - 1) * (pos / phase)
				this.maxScrollY = Math.min(this.wrapperHeight - this.scrollerHeight, 0)

				// 数据剩余为0或每十次循环刷新一次滚动条

				if ( (this.infiniteSurplusBuffer - 1) == 0 || phase % (this.infiniteLength * 10) == 0 ) {
					this._execEvent("modify")
				}

				this.infiniteMaxPhase = phase
			},

			refreshInfiniteAll : function () {
				var i,
					l = this.infiniteLength,
					minPhase = this.infiniteElementsEdge[0],
					index,
					item,
					pos,
					size,
					supplement,
					contentHeight = this.infiniteContentPos[1] - this.infiniteContentPos[0]

				this.infiniteContentPos[1] = this.infiniteContentPos[0]

				for ( i = 0; i < l; i++ ) {
					index = (minPhase + i) % this.infiniteLength
					item = this.infiniteElements[index]
					size = item.offsetHeight

					pos = this.infiniteContentPos[1]
					this.updateInfinitePos(item, pos)

					this.infiniteElementsPos[index] = [pos, pos+size]

					this.infiniteContentPos[1] += size
				}

				// item改变后总高度变化

				supplement = this.infiniteContentPos[1] - this.infiniteContentPos[0] - contentHeight

				// 修正最大滚动高度受内容改变的影响

				this.scrollerHeight += supplement
				this.maxScrollY = Math.min(this.wrapperHeight - this.scrollerHeight, 0)

				this._execEvent("modify")
			},

			updateInfinitePos : function (item, pos) {

				// set item pos

				if ( this.options.scrollX ) {
					item.style[BROWSER.prefixStyle.transform] = 'translate(' + pos + 'px, 0)' + this.translateZ
				} else if ( this.options.scrollY ) {
					item.style[BROWSER.prefixStyle.transform] = 'translate(0, ' + pos + 'px)' + this.translateZ
				}
			},

			updateInfiniteContent : function (element) {
				/**
			    * dataFiller
			    * @param  element {Object} replace box
			    * @param  index {Number} cur index
			    * @param  oldindex {Number} pre index
			    */

			    this.getInfiniteDataFiller.call(this, element, element._phase, element.__phase)
			},

			updateInfiniteData : function (start, data) {
				var that = this

				data.map(function (scope) {
					that.infiniteCache[start++] = scope
					
					// 第二屏内容异步预缓存

					if ( start > that.infiniteLength ) {
						(function (index) {
							setTimeout(function () {
								that.updateInfiniteCache(index)
							}, 0)
						})(start)
					}
				})

				this.infiniteDataLength = start
			},

			updateInfiniteCache : function (index) {
				return this.getInfiniteCacheBuffer.call(this, this.infiniteCache[index], index)
			},

			checkInfiniteDataBuffer : function () {
				var that = this
				// 数据缓冲不足

				if ( !this.datasetInfiniteLock && this.infiniteSurplusBuffer <= this.options.infiniteCacheBuffer ) {
					this.datasetInfinite()
				}
			},

			disable : function () {
				this.enabled = false
			},

			enable : function () {
				this.enabled = true
			},

			revert : function (reset) {
				this._init()
				this.refresh()

				// 重置位置

				if ( reset ) {
					this.scrollTo(this.options.startX, this.options.startY)
				}

				this.enable()
			},

			destroy : function () {
				this._initEvents(true)

				this._execEvent('destroy')
			},

			refresh : function () {
				var rf = this.wrapper.offsetHeight		// Force reflow

				this.wrapperWidth	= this.wrapper.clientWidth
				this.wrapperHeight	= this.wrapper.clientHeight

				if ( !this.options.infiniteElements ) {
					this.scrollerWidth	= this.scroller.offsetWidth
					this.scrollerHeight	= this.scroller.offsetHeight
				}

				this.maxScrollX		= this.wrapperWidth - this.scrollerWidth
				this.maxScrollY		= this.wrapperHeight - this.scrollerHeight
				
				this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0
				this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0

				if ( !this.hasHorizontalScroll ) {
					this.maxScrollX = 0
					this.scrollerWidth = this.wrapperWidth
				}

				if ( !this.hasVerticalScroll ) {
					this.maxScrollY = 0
					this.scrollerHeight = this.wrapperHeight
				}

				this.endTime = 0
				this.directionX = 0
				this.directionY = 0

				this.wrapperOffset = COMMON.offset(this.wrapper)

				this._execEvent('refresh')

				this.resetPosition()

			}
		}

		function createDefaultScrollbar (direction, interactive, type) {
			var scrollbar = document.createElement('scrollbar'),
				indicator = document.createElement('indicator')

			indicator.className = 'scroll-indicator'

			if ( direction == 'h' ) {
				if ( type === true ) {
					scrollbar.css({
						"height": "2.5dp",
						"right": "2dp",
						"bottom": "4dp",
						"left": "2dp"
					})

					indicator.css({
						"height": "100%"
					})
				}
				scrollbar.className = 'scroll-horizontal-scrollbar'
			} else {
				if ( type === true ) {
					scrollbar.css({
						"width": "2.5dp",
						"top": "2dp",
						"right": "4dp",
						"bottom": "2dp"
					})

					indicator.css({
						"width": "100%"
					})
				}
				scrollbar.className = 'scroll-vertical-scrollbar'
			}

			if ( !interactive ) {
				scrollbar.style.pointerEvents = 'none'
			}

			scrollbar.appendChild(indicator)

			return scrollbar
		}

		function Indicator (scroller, options) {
			this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el
			this.wrapperStyle = this.wrapper.style
			this.indicator = this.wrapper.children[0]
			this.indicatorStyle = this.indicator.style
			this.scroller = scroller

			this.options = {
				listenX: true,
				listenY: true,
				interactive: false,
				resize: true,
				defaultScrollbars: false,
				drag: 3,
				fade: false,
				speedRatioX: 0,
				speedRatioY: 0
			}

			for ( var i in options ) {
				this.options[i] = options[i]
			}

			this.sizeRatioX = 1
			this.sizeRatioY = 1
			this.maxPosX = 0
			this.maxPosY = 0

			if ( this.options.interactive ) {
				if ( !this.options.disableTouch ) {
					COMMON.addEvent(this.indicator, 'touchstart', this)
					COMMON.addEvent(window, 'touchend', this)
				}
				if ( !this.options.disablePointer ) {
					COMMON.addEvent(this.indicator, 'MSPointerDown', this)
					COMMON.addEvent(window, 'MSPointerUp', this)
				}
				if ( !this.options.disableMouse ) {
					COMMON.addEvent(this.indicator, 'mousedown', this)
					COMMON.addEvent(window, 'mouseup', this)
				}
			}

			if ( this.options.fade ) {
				this.wrapperStyle[BROWSER.prefixStyle.transform] = this.scroller.translateZ
				this.wrapperStyle[BROWSER.prefixStyle.transitionDuration] = '0ms'
				this.wrapperStyle.opacity = '0'
			}
		}

		Indicator.prototype = {
			handleEvent : function (e) {
				switch (e.type) {
					case 'touchstart':
					case 'MSPointerDown':
					case 'mousedown':
						this._start(e)
						break
					case 'touchmove':
					case 'MSPointerMove':
					case 'mousemove':
						this._move(e)
						break
					case 'touchend':
					case 'MSPointerUp':
					case 'mouseup':
					case 'touchcancel':
					case 'MSPointerCancel':
					case 'mousecancel':
						this._end(e)
						break
				}
			},

			destroy : function () {
				if ( this.options.interactive ) {
					COMMON.removeEvent(this.indicator, 'touchstart', this)
					COMMON.removeEvent(this.indicator, 'MSPointerDown', this)
					COMMON.removeEvent(this.indicator, 'mousedown', this)

					COMMON.removeEvent(window, 'touchmove', this)
					COMMON.removeEvent(window, 'MSPointerMove', this)
					COMMON.removeEvent(window, 'mousemove', this)

					COMMON.removeEvent(window, 'touchend', this)
					COMMON.removeEvent(window, 'MSPointerUp', this)
					COMMON.removeEvent(window, 'mouseup', this)
				}

				if ( this.options.defaultScrollbars ) {
					this.wrapper.remove()
				}
			},

			_start : function (e) {
				var point = e.touches ? e.touches[0] : e

				e.preventDefault()
				e.stopPropagation()

				this.transitionTime()

				this.initiated = true
				this.moved = false
				this.lastPointX	= point.pageX
				this.lastPointY	= point.pageY

				this.startTime	= Date.now()

				if ( !this.options.disableTouch ) {
					COMMON.addEvent(window, 'touchmove', this)
				}
				if ( !this.options.disablePointer ) {
					COMMON.addEvent(window, 'MSPointerMove', this)
				}
				if ( !this.options.disableMouse ) {
					COMMON.addEvent(window, 'mousemove', this)
				}

				this.scroller._execEvent('beforescrollstart')
			},

			_move : function (e) {
				var point = e.touches ? e.touches[0] : e,
					deltaX, deltaY,
					newX, newY,
					timestamp = Date.now()

				if ( !this.moved ) {
					this.scroller._execEvent('scrollstart')
				}

				this.moved = true

				deltaX = point.pageX - this.lastPointX
				this.lastPointX = point.pageX

				deltaY = point.pageY - this.lastPointY
				this.lastPointY = point.pageY

				newX = this.x + deltaX
				newY = this.y + deltaY

				this._pos(newX, newY)

		// INSERT POINT: indicator._move

				e.preventDefault()
				e.stopPropagation()
			},

			_end : function (e) {
				if ( !this.initiated ) {
					return
				}

				this.initiated = false

				e.preventDefault()
				e.stopPropagation()

				COMMON.removeEvent(window, 'touchmove', this)
				COMMON.removeEvent(window, 'MSPointerMove', this)
				COMMON.removeEvent(window, 'mousemove', this)

				if ( this.scroller.options.snap ) {
					var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y)

					var time = this.options.snapSpeed || Math.max(
							Math.max(
								Math.min(Math.abs(this.scroller.x - snap.x), 1000),
								Math.min(Math.abs(this.scroller.y - snap.y), 1000)
							), 300)

					if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
						this.scroller.directionX = 0
						this.scroller.directionY = 0
						this.scroller.currentPage = snap
						this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.snapEasing)
					}
				}

				if ( this.moved ) {
					this.scroller._execEvent('scrollend')
				}
			},

			_pos : function (x, y) {
				if ( x < 0 ) {
					x = 0
				} else if ( x > this.maxPosX ) {
					x = this.maxPosX
				}

				if ( y < 0 ) {
					y = 0
				} else if ( y > this.maxPosY ) {
					y = this.maxPosY
				}

				x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x
				y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y

				this.scroller.scrollTo(x, y)
			},

			fade : function (val, hold) {
				if ( hold && !this.visible ) {
					return
				}

				clearTimeout(this.fadeTimeout)
				this.fadeTimeout = null

				var time = val ? 0 : 250,
					delay = val ? 0 : 100

				if ( BROWSER.isBadTransition ) {
					time = 0.0001
				}

				val = val ? '1' : '0'

				this.wrapperStyle[BROWSER.prefixStyle.transitionDuration] = time + 'ms'

				this.fadeTimeout = setTimeout((function (val) {
					this.wrapperStyle.opacity = val
					this.visible = +val
				}).bind(this, val), delay)
			},

			transitionTime : function (time) {
				this.indicatorStyle[BROWSER.prefixStyle.transitionDuration] = time ? time + 'ms' : ''
			},

			transitionTimingFunction : function (easing) {
				this.indicatorStyle[BROWSER.prefixStyle.transitionTimingFunction] = easing
			},

			updatePosition : function () {
				var _x = this.scroller.x,
					_y = this.scroller.y,
					x = this.options.listenX && Math.round(this.sizeRatioX * _x) || 0,
					y = this.options.listenY && Math.round(this.sizeRatioY * _y) || 0

				if ( !this.options.ignoreBoundaries ) {
					if ( _x > 0 ) {
						x = this.options.resize ? Math.max(x - _x, DP(8) - this.indicatorWidth) : this.minBoundaryX
					} else if ( _x < this.scroller.maxScrollX ) {
						x = this.options.resize ? Math.min(x + (this.scroller.maxScrollX - _x), this.maxBoundaryX - DP(8)) : this.maxBoundaryX
					}

					if ( _y > 0 ) {
						y = this.options.resize ? Math.max(y - _y, DP(8) - this.indicatorHeight) : this.minBoundaryY
					} else if ( _y < this.scroller.maxScrollY ) {
						y = this.options.resize ? Math.min(y + (this.scroller.maxScrollY - _y), this.maxBoundaryY - DP(4)) : this.maxBoundaryY
					}
				}

				this.x = x
				this.y = y

				this.indicatorStyle[BROWSER.prefixStyle.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ
			},

			refresh : function () {

				this.transitionTime()

				if ( this.options.listenX && !this.options.listenY ) {
					this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none'
				} else if ( this.options.listenY && !this.options.listenX ) {
					this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none'
				} else {
					this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none'
				}

				if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
					this.wrapper.addClass('scroll-both-scrollbars').removeClass('scroll-lone-scrollbar')

					if ( this.options.defaultScrollbars && this.options.customStyle ) {
						if ( this.options.listenX ) {
							this.wrapper.style.right = DP(8) + 'px'
						} else {
							this.wrapper.style.bottom = DP(8) + 'px'
						}
					}
				} else {
					this.wrapper.removeClass('scroll-both-scrollbars').addClass('scroll-lone-scrollbar')

					if ( this.options.defaultScrollbars && this.options.customStyle ) {
						if ( this.options.listenX ) {
							this.wrapper.style.right = DP(2) + 'px'
						} else {
							this.wrapper.style.bottom = DP(2) + 'px'
						}
					}
				}

				var r = this.wrapper.offsetHeight	// force refresh

				if ( this.options.listenX ) {
					this.wrapperWidth = this.wrapper.clientWidth
					if ( this.options.resize ) {
						this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || DP(1))), DP(4))
						this.indicatorStyle.width = this.indicatorWidth + 'px'
					} else {
						this.indicatorWidth = this.indicator.clientWidth
					}

					this.maxPosX = this.wrapperWidth - this.indicatorWidth

					this.minBoundaryX = -this.indicatorWidth + DP(4)
					this.maxBoundaryX = this.wrapperWidth - DP(4)

					this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX))
				}

				if ( this.options.listenY ) {
					this.wrapperHeight = this.wrapper.clientHeight
					if ( this.options.resize ) {
						this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || DP(1))), DP(4))
						this.indicatorStyle.height = this.indicatorHeight + 'px'
					} else {
						this.indicatorHeight = this.indicator.clientHeight
					}

					this.maxPosY = this.wrapperHeight - this.indicatorHeight

					this.minBoundaryY = -this.indicatorHeight + DP(4)
					this.maxBoundaryY = this.wrapperHeight - DP(4)

					this.maxPosY = this.wrapperHeight - this.indicatorHeight
					this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY))
				}

				this.updatePosition()
			}
		}

		// extend

		Scroll.COMMON = COMMON
		Scroll.BROWSER = BROWSER
		Scroll.EASEING = EASEING

		return Scroll
	}
})