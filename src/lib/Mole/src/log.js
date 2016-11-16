
(function(root){
    var type = 'log';

    var isObject = function (msg) {
        return Object.prototype.toString.call(msg) === '[object Object]';
    };

    var isString = function (msg) {
        return Object.prototype.toString.call(msg) === '[object String]';
    };

    var isNumber = function (msg) {
        return Object.prototype.toString.call(msg) === '[object Number]';
    };

    var isArray = function (msg) {
        return Object.prototype.toString.call(msg) === '[object Array]';
    };

    var log = function (cxt) {
        this._cxt = cxt;
        this.init();
    };

    log.prototype.init = function () {
        var self = this;
        this._rewriteXHR();
        /**
         * window.onerror
         * @param msg  错误msg
         * @param url   出错url
         * @param line  出错行
         * @param col   出错竖
         * @param error  error堆栈
         */
        root.onerror = function (msg, url, line, col, error) {
            self.error(JSON.stringify({errorMsg: msg, line: line, col:col, info: error? (error.stack || '') : ''}),401);
        };

    };

    /**
     * 重写xhr open
     * @private
     */
    log.prototype._rewriteXHR = function () {
        var self = this;
        var open = XMLHttpRequest.prototype.open;
        var request = {};

        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            request.url = url;
            request.method = method;

            return open.apply(this, arguments);
        };

        var send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (data) {

            var requestTimeout = setTimeout(function () {
                if(!self._checkMoleVapPushed(request.url,'warning')){
                    return false;
                }

                request.status = 0;
                request.statusText = '请求超时';
                if(self._isMoleVap(request.url)){
                }else{
                    self._warning(JSON.stringify(request));
                }
            }, self._cxt.RT);

            var oldReady = this.onreadystatechange;

            this.onreadystatechange = function () {
                if (this.readyState === 4) {
                    clearTimeout(requestTimeout);

                    if (this.status<200 || (this.status>=300 && this.status!==304)) {
                        if(!self._checkMoleVapPushed(request.url,'fail')){
                            return false;
                        }

                        request.status = this.status;
                        request.statusText = this.statusText;

                        if(self._isMoleVap(request.url)){
                            //self.error(JSON.stringify(request),420);
                        }else{
                            self.error(JSON.stringify(request),404);
                        }
                    }
                }

                if(!oldReady){
                    return false;
                }

                return oldReady.apply(this, arguments);
            };

            return send.apply(this, arguments);
        };
    };

    /***
     * mole vap 接口只推送一次,防止因为mole vap挂了后,进入死循环上报
     * @param url
     * @param type
     * @private
     */
    log.prototype._checkMoleVapPushed = function (url, type) {
        if(this._isMoleVap(url)){
            this._MoleVapPushed = this._MoleVapPushed || {};
            var key = encodeURIComponent(url + type);

            if (this._MoleVapPushed[key]) {
                return false;
            } else {
                this._MoleVapPushed[key] = true;
                return true;
            }
        }else{
            return true;
        }
    };

    /**
     * 判断url是不是vap接口
     * @param url
     * @returns {boolean}
     * @private
     */
    log.prototype._isMoleVap = function(url){
        var check = false,
            self = this;
        Object.keys(this._cxt.vap).forEach(function(key){
            if (url.indexOf(self._cxt.vap[key]) > -1) {
                check = true;
            }
        });

        return check;
    };

    /**
     * debug日志上报
     * @param msg
     */
    log.prototype.debug = function (msg) {
        try {
            if(!isString(msg)){
                return false;
            }

            var data = {
                msg: msg, level: 1, type: type
            };

            //this._cxt.push(data);
        }catch (e){}
    };

    /**
     * 失败日志上报
     * @param msg
     * @param level   程序异常401，不安全域名403，网络异常404，自定义错误410，mole错误420  默认自定义错误
     */
    log.prototype.error = function (msg,level) {
        try{
            if(!isString(msg)){
                return false;
            }

            var data = {
                msg: msg, level: level || 410, type: type
            };

            //this._cxt.push(data,true);
        }catch (e){}
    };

    log.prototype._warning=function (msg) {
        if (!isString(msg)) {
            return false;
        }

        var data = {
            msg: msg, level: 2, type: type
        };

        //this._cxt.push(data);
    };

    MoleReg(log,'log');

}(window));