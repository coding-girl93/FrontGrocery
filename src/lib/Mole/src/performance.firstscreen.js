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