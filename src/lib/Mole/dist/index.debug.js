setTimeout(function(){
    !window.Mole && (window.Mole={});
    Mole.performance = Mole.performance || {};
    Mole.performance.firstScreenTime = Mole.performance.firstScreenTime || function(){};
    Mole.performance.custom = Mole.performance.custom || function(){};
    Mole.log = Mole.log || {};
    Mole.log.debug = Mole.log.debug || function(){};
    Mole.log.error = Mole.log.error || function(){};
    Mole.init = Mole.init || function(){};
},0);
var jsMoleStartTime = new Date().getTime();

if(window.location.href.indexOf('/fx')===-1 || window.location.href.indexOf('weidian.com/item.html')===-1 || Math.random()*10<=3 || window.location.href.indexOf('debug')>-1) {
    try {
/**
 * Created by fudongguang on 16/9/7.
 */
(function(){
    var molePromise = function (func) {
        this.pending = [];
        this.value = '';
        setTimeout(function(){
            func(this.resolve.bind(this),this.reject.bind(this));
        }.bind(this))
    };

    molePromise.prototype.resolve = function (val) {
        this.value = this.pending[0][0](val);
        this.doPending();
    };

    molePromise.prototype.reject = function (val) {
        this.value = this.pending[0][1](val);
        this.doPending();

    };

    molePromise.prototype.doPending = function(){
        for(var i=1;i<this.pending.length;i++){
            var callback = this.pending[i][0];
            this.value = callback(this.value);
        }
    };

    molePromise.prototype.then = function (callback,errorback) {
        this.pending.push([callback,errorback]);
        return this;
    };

    window.MolePromise = molePromise;
}());

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
(function() {
    var support = {};
    support.timing = window.performance && window.performance.timing;
    support.resourceTiming = window.performance && window.performance.getEntries;

    var firstScreenRecodeStartTime = 0;

    var convert2PlainObject = function(instanceObj) {
        var obj = {};
        for (var key in instanceObj) {
            if (typeof instanceObj[key] !== "function") {
                obj[key] = instanceObj[key];
            }
        }
        return obj;
    };


    var  getElementTop = function(element){
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null){
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    };


    var firstScreen = function(cxt){
        this._cxt = cxt;
    };

    var proto = firstScreen.prototype;
    var _bgimgs = [];


    proto._push = function(data){
        this._cxt.push(data);
    };

    proto.firstScreenTime = function(times,bgimgs){

        if(!support.timing){
            return false;
        }

        try {
            if(bgimgs && bgimgs.length){
                _bgimgs = _bgimgs.concat(bgimgs);
            }

            this._firstScreenTimes = this._firstScreenTimes || 0;
            this._firstScreenTimes++;

            if(this._firstScreenTimes===times){
                firstScreenRecodeStartTime = new Date().getTime();
                this._firstScreenTimeSrouce(_bgimgs);
            }

        }catch (e){}
    };

    /**
     * 设置首屏时间数据
     * @private
     */
    proto._setFirstScreenTime = function(){
        var timeNow = new Date().getTime();
        var data = support.timing;
        data = convert2PlainObject(data);
        data.perfType = 'firstScreen';
        data.type = 'performance';
        var time = timeNow - support.timing.navigationStart;
        data.firstScreenCost = time;

        if(window.location.search.indexOf('debug')>-1){
            console.log(time);
        }

        Mole.performance.custom('moleJsFirstScreen',new Date().getTime()-firstScreenRecodeStartTime);

        this._cxt.push(data);
    };

    /**
     * 获取首屏图片资源名
     * @param bgimgs
     * @private
     */
    proto._getResouce = function(){
        var screenHeight = window.innerHeight;
        var imgs = [];

        //fenxiaobuyer 特殊处理
        if(window.location.href.indexOf('m/fxbuyer/item.html')>-1){
            var imgEls = document.querySelectorAll('.mole-bg');
        }else{
            imgEls = document.querySelectorAll('body img,.mole-bg');
        }

        for(var i=0;i<imgEls.length;i++){
            var imgEl = imgEls[i];
            var t = getElementTop(imgEl);
            if(t+imgEl.offsetHeight>=document.body.scrollTop && t<=(screenHeight+document.body.scrollTop)){
                if(imgEl.tagName.toLowerCase()==='img'){
                    var src = imgEl.getAttribute('src');
                    var dataSrc = imgEl.getAttribute('data-src') || imgEl.getAttribute('data-echo');
                    if(dataSrc){
                        src = dataSrc;
                    }
                }else{
                    var bgimg = getComputedStyle(imgEl)['background-image'];
                    src = bgimg.replace(/url\([\'\"]{0,1}/,'').replace(/['"]{0,1}\)/,'');
                }

                if(src && src.indexOf('url(')===-1 && src.indexOf('data:')===-1 && /\.(jpg|gif|png|jpeg|webp)/i.test(src)){
                    imgs.push(src);
                }
            }
        }

        return imgs;
    };

    proto._firstScreenTimeSrouce = function(bgimgs){
        var self = this;
        var imgs = this._getResouce();

        if(!imgs.length && !bgimgs.length){
            this._setFirstScreenTime();
            return true;
        }


        var index = 0;
        var tempfunc = function(){
            index++;

            if(index===imgs.length + bgimgs.length){
                if(window.location.search.indexOf('debug')>-1){
                    console.log(imgs);
                    console.log(bgimgs);
                }

                self._setFirstScreenTime();
                self._getFirstResouce(bgimgs.concat(imgs));
            }
        };

        bgimgs.concat(imgs).forEach(function (v) {
            var img = new Image();
            self._imgOnload(img,tempfunc);
            img.src = v;
        });

    };

    proto._imgOnload = function(img,func){
        img.onload = func;
        img.onerror = func;
    };

    proto._getFirstResouce = function(screenResouces){
        if(!support.resourceTiming){
            return false;
        }
        var self = this;

        var resourceTiming = window.performance.getEntries({"entryType": "resource"});

        resourceTiming = resourceTiming.map(function(performanceResourceTiming) {
            var name = performanceResourceTiming.name;

            if(name.indexOf(window.location.href)===0){
                return '';
            }


            if(name.indexOf('??')===-1){
                name = name.replace(/\?.+/,'');
            }


            if(name.indexOf('assets.geilicdn.com')===-1 && name.indexOf('si.geilicdn.com')===-1 && name.indexOf('wd.geilicdn.com')===-1){
                return {
                    name: name || 'no-name',
                    initiatorType: performanceResourceTiming.initiatorType,
                    entryType: performanceResourceTiming.entryType,
                    startTime: performanceResourceTiming.startTime,
                    duration: performanceResourceTiming.duration,
                    perfType:"resourceTiming",
                    type:"performance"
                };

            }else{
                var newObj = {
                    perfType:"resourceTiming",
                    type:"performance"
                };

                var getType = function(val ){
                    return Object.prototype.toString.call(val);
                };

                for(var key in performanceResourceTiming){
                    if(getType(performanceResourceTiming[key])==='[object String]' || getType(performanceResourceTiming[key])==="[object Number]"){
                        newObj[key] = performanceResourceTiming[key];
                    }
                }

                newObj.name = name;

                return newObj;

            }
        });

        resourceTiming = resourceTiming.filter(function(performanceResourceTiming){
            if(!performanceResourceTiming){
                return false;
            }

            if (performanceResourceTiming.startTime <= 0) {
                return false;
            }

            if (performanceResourceTiming.duration <= 0) {
                return false;
            }



            var name = performanceResourceTiming.name.replace('http://','').replace('https://','');

            if(name.indexOf('analysis')>-1){
                return false;
            }

            if(!/\.(jpg|gif|png|jpeg|webp)/i.test(name)){
                return true;
            }

            var check = false;
            screenResouces.forEach(function(v){
                if(v.indexOf(name)>-1){
                    check=true;
                }
            });

            return check;

        });


        resourceTiming.map(function(val){
            self._push(val);
        });
    };

    MoleReg(firstScreen,'firstScreen');
}());
(function () {
    var support = {};
    support.timing = window.performance && window.performance.timing;

    function performance(cxt) {
        this._cxt = cxt;
    }

    var proto = performance.prototype;
    proto._push = function (data) {
        this._cxt.push(data);
    };

    proto.custom = function (name, duration) {
        if (!support.timing) {
            return false;
        }

        try {
            if (!name) {
                return false;
            }

            duration = duration || 0;

            var endTime = new Date().getTime() - support.timing.navigationStart;

            this._push({
                name: name,
                startTime: endTime - duration,
                duration: duration || 0,
                perfType: "custom",
                type: "performance"
            })
        } catch (e) {
        }

    };

    proto.firstScreenTime = function (times, bgimgs) {
        Mole.firstScreen.firstScreenTime(times, bgimgs);
    };

    MoleReg(performance, 'performance');
}());
} catch (e) {
        console.log(e)
    };
}

var jsMoleEndTime = new Date().getTime();
Mole.performance.custom('molejs',jsMoleEndTime-jsMoleStartTime);