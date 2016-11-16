
(function(root){
    var ua = navigator.userAgent;
    window.Mole = {};


    var vap ={
        "online":"//vap.gw.weidian.com/h5/mole/perf.collect/2.0",
        "pre":"//vap.gw.pre.weidian.com/h5/mole/perf.collect/1.0",
        "daily":"//vap.gw.daily.weidian.com/h5/mole/perf.collect/2.0"
    };

    var onlineUrls = ['//h5.weidian.com','//weidian.com','//www.weidian.com','//fxh5.weidian.com'];


    Mole.init = function (options) {
        try {
            MoleCxt.delay = options.delay || MoleCxt.delay;
            MoleCxt.RT = options.RT || MoleCxt.RT;
            MoleCxt.spma = options.spma || MoleCxt.spma;
            MoleCxt.spmb = options.spmb || MoleCxt.spmb;
            MoleCxt.version = options.version || MoleCxt.version;
            MoleCxt.id = options.id || MoleCxt.id;
        }catch (e){}
    };

//---------------MoleCxt(mole插件上下文 插件开发者需要关注)--------------------------
    root.MoleReg = function(func,name){
        Mole[name] = new func(MoleCxt);
    };


    var  uuid = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };



    var MoleCxt = {
        id:uuid(),
        version: 'unknow', //业务版本号
        env: /pre/.test(window.location.hostname)?'pre':'daily', //运行环境
        delay: 2000, //延迟上报时间
        RT: 5000,// 网络超时
        spma: '', //业务
        spmb: '' //页面
    };

    onlineUrls.forEach(function(v){
        if(('//'+window.location.hostname).indexOf(v)>-1){
            MoleCxt.env = 'online';
        }
    });


    MoleCxt.vap = vap;

    MoleCxt.push = function(msg,isNow){
        clearTimeout(this._timeout);
        MoleCxtHandel._reportData = MoleCxtHandel._reportData || [];
        MoleCxtHandel._reportData.push(msg);

        var delay = this.delay;

        if(isNow){
            MoleCxtHandel._send();
        }else{
            this._timeout = setTimeout(function(){
                MoleCxtHandel._send();
            },delay)
        }
    };

//------------MoleCxtHandel------------------

    var MoleCxtHandel = {};
    if(/debug/.test(window.location.search)){
        document.title = MoleCxt.id;
    }

    MoleCxtHandel._setSpm = function () {
        if (!MoleCxt.spma) {
            var spiderDom  = document.querySelector('meta[name="spider-id"]');
            MoleCxt.spma = spiderDom ? spiderDom.getAttribute('content') : '';
            if(!MoleCxt.spma){
                alert('必须设置spma');
                return false;
            }
        }

        if (!MoleCxt.spmb) {
            MoleCxt.spmb = (document.body ? document.body.dataset.spider : '') || '';
        }

        if(!MoleCxt.spmb){
            MoleCxt.spmb = window.location.pathname;
        }

        MoleCxt.id = [MoleCxt.spmb.substr(0,10),MoleCxt.id].join('-');
    };

    MoleCxtHandel._reset = function(){
        this._reportData = [];
    };

    MoleCxtHandel._send = function(){
        var self = this;

        if (!this._reportData || !this._reportData.length) {
            return false;
        }

        var logurl = vap[MoleCxt.env] || vap.daily;

        new MolePromise(this._getData.bind(this)).then(function(val){
            self._ajax({
                type: "POST",
                url: logurl+'?id='+MoleCxt.id,
                data: 'meta='+encodeURIComponent(JSON.stringify(val)),
                success: function(msg) {
                }
            });
            self._reset();
        });
    };


    /**
     * 获取nettype
     */
    MoleCxtHandel._getNetType = function(resolve){
        var nettype = ua.match(/NetType\/([^\s]+)/i);
        var tempNt = '';
        if(nettype && nettype[1]){
            tempNt = nettype[1].toUpperCase();
        }

        if(nettype && tempNt && (tempNt==='WIFI' || tempNt==='4G' || tempNt==='3G' || tempNt==='2G' || tempNt==='4.5G' || tempNt==='5G')){
            resolve(tempNt);
        }else if(/MicroMessenger/i.test(ua)){
            new MolePromise(this._getWxNetType).then(function(val){
                resolve(val);
            })
        }else if(/WDAPP/i.test(ua)){
            if(window.Cambridge){
                Cambridge.call('WDJSBridge','getNetworkStatus', {}, function (res) {
                    var maps= {"2":"wifi","3":"2g","4":"3g","5":"4g"};
                    if(res && res.data && res.data.network){
                        var network = res.data.network;
                        resolve(maps[network] || '');
                    }else{
                        resolve('');
                    }
                });
            }else{
                resolve('');
            }
        }else{
            resolve('');
        }
    };

    MoleCxtHandel._getWxNetType = function(resolve,reject){
        if(window.wx && wx['getNetworkType']){
            wx.getNetworkType({
                success: function (res) {
                    var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                    resolve(networkType);
                },
                fail:function(){
                    resolve('');
                }
            });
        }else{
            resolve('');
        }
    };

    MoleCxtHandel._formart = function(data){
        //如果是时间段 把时间段设置为负值 如果是0 改成'zero'
        Object.keys(data).forEach(function(key){
            if(!isNaN(data[key]) && key!=='ns'){
                data[key] = parseInt(data[key]);
                //时间段
                if(data[key]===0){
                    data[key]='zero';
                }else if(data['ns'] && data[key]>99999999){
                    data[key] = data[key]-data['ns'];
                }
            }
        })
    };


    MoleCxtHandel._getData = function(resolve){
        if (!MoleCxt.spma || !MoleCxt.spmb) {
            this._setSpm();
            if (!MoleCxt.spma || !MoleCxt.spmb) {
                this._reportData = [];
                alert('没有设置spm值');
                return false;
            }
        }


        var reportData = this._dataCloumnMap(this._reportData);


        var data = {
            id: MoleCxt.id,
            spma: MoleCxt.spma,
            spmb: MoleCxt.spmb,
            version: MoleCxt.version,
            ua: ua,
            url: window.location.href,
            referrer: document.referrer,
            nt:'',
            data: reportData
        };

        new MolePromise(this._getNetType.bind(this)).then(function(val){
            data.nt = val?val.toUpperCase() : '';
            resolve(data);
        })
    };

    MoleCxtHandel._dataCloumnMap = function(datas){
        var self = this;
        var maps = {
            navigationStart:"ns",
            unloadEventStart:"ues",
            unloadEventEnd:"uee",
            redirectStart:"rs",
            redirectEnd:"re",
            fetchStart:"fs",
            domainLookupStart:"dls",
            domainLookupEnd:"dle",
            connectStart:"cs",
            connectEnd:"ce",
            secureConnectionStart:"scs",
            requestStart:"rqs",
            responseStart:"rps",
            responseEnd:"rpe",
            domLoading:"dl",
            domInteractive:"di",
            domContentLoadedEventStart:"dcles",
            domContentLoadedEventEnd:"dclee",
            domComplete:"dc",
            loadEventStart:"les",
            loadEventEnd:"lee",
            firstScreenCost:"fcs",
            perfType:"pt",

            "duration": 'dur',//资源map
            "entryType": 'et',//资源map
            "startTime": 'st',//资源map
            "workerStart": 'ws',//资源map
            "initiatorType": 'rt'//资源map
        };

        var result = [];

        datas.forEach(function(data){
            var newData = {};
            Object.keys(data).forEach(function(key){
                var newKey = maps[key] || key;
                newData[newKey] = data[key];
            });
            self._formart(newData);
            result.push(newData);
        });

        return result;
    };


    MoleCxtHandel._ajax=function (settings){
        var xhr = new window.XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onreadystatechange = function() {

            if (xhr.readyState == 4) {
                xhr.onreadystatechange = function empty() {};
                var result,
                    error = false;

                if (xhr.status >= 200 && xhr.status < 300) {
                    result = xhr.responseText;

                    try {
                        result = JSON.parse(result);
                    } catch (e) {
                        error = e;
                    }

                    if (!error && settings && settings.success) {
                        settings.success(result, xhr);
                    }
                }
            }
        };
        xhr.open(settings.type, settings.url, true);
        //xhr.setRequestHeader('Accept','application/json');

        xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');

        xhr.send(settings.data ? settings.data : null);
        return xhr;
    };
}(window));