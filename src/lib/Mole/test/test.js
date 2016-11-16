!function (t) {
    var e = {
        online: "//vap.gw.weidian.com/h5/vdash/vdash.Hlog/1.0",
        offline: "//vap.gw.pre.weidian.com/h5/vdash/vdash.Hlog/1.0"
    }, i = {};
    t.Mole = i, i.init = function (t) {
        n.env = void 0 !== t.env ? t.env : n.env, n.delay = t.delay || n.delay, n.RT = t.RT || n.RT, n.spma = t.spma || n.spma, n.spmb = t.spmb || n.spmb, n.version = t.version || n.version
    }, t.MoleReg = function (t, e) {
        i[e] = new t(n)
    };
    var n = {
        version: "unknow",
        env: /h5\.weidian\.com/.test(window.location.hostname),
        delay: 2e3,
        RT: 5e3,
        spma: "",
        spmb: ""
    };
    n.vap = e, n.push = function (t, e) {
        r._reportData = r._reportData || [], r._reportData.push(t), e ? r._send() : setTimeout(function () {
            r._send()
        }, this.delay)
    };
    var r = {};
    r._setSpm = function () {
        n.spma || (n.spma = document.querySelector('meta[name="spider-id"]').getAttribute("content") || ""), n.spmb || (n.spmb = (document.body ? document.body.dataset.spider : "") || ""), n.spmb || (n.spmb = window.location.pathname)
    }, r._reset = function () {
        this._reportData = []
    }, r._send = function () {
        if (!this._reportData || !this._reportData.length)return !1;
        var t = e.online;
        n.env || (t = e.offline);
        var i = this._getData();
        return i ? (this._ajax({
            type: "POST",
            url: t,
            data: "meta=" + encodeURIComponent(JSON.stringify(i)),
            success: function (t) {
            }
        }), void this._reset()) : !1
    }, r._getData = function () {
        if (!(n.spma && n.spmb || (this._setSpm(), n.spma && n.spmb)))return this._reportData = [], alert("没有设置spm值"), !1;
        var t = {
            spma: n.spma,
            spmb: n.spmb,
            version: n.version,
            ua: window.navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer,
            data: this._reportData
        };
        return t
    }, r._ajax = function (t) {
        var e = new window.XMLHttpRequest;
        return e.withCredentials = !0, e.onreadystatechange = function () {
            if (4 == e.readyState) {
                e.onreadystatechange = function () {
                };
                var i, n = !1;
                if (e.status >= 200 && e.status < 300) {
                    i = e.responseText;
                    try {
                        i = JSON.parse(i)
                    } catch (r) {
                        n = r
                    }
                    n || t.success(i, e)
                }
            }
        }, e.open(t.type, t.url, !0), e.setRequestHeader("Accept", "application/json, text/plain, */*"), e.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"), e.send(t.data ? t.data : null), e
    }, "undefined" != typeof module && module.exports && (module.exports = i)
}(this), function (t) {
    var e = "log", i = function (t) {
        return "[object String]" === Object.prototype.toString.call(t)
    }, n = function (t) {
        this._cxt = t, this.init()
    };
    n.prototype.init = function () {
        var e = this;
        this._rewriteXHR(), t.onerror = function (t, i, n, r, o) {
            e.error(JSON.stringify({errorMsg: t, line: n, col: r, info: o ? o.stack || "" : ""}), 401)
        }
    }, n.prototype._rewriteXHR = function () {
        var t = this, e = XMLHttpRequest.prototype.open, i = {};
        XMLHttpRequest.prototype.open = function (n, r, o, a, s) {
            i.url = r, i.method = n;
            var p = setTimeout(function () {
                return t._checkMoleVapPushed(r, "warning") ? (i.status = 0, i.statusText = "请求超时", void t._warning(JSON.stringify(i))) : !1
            }, t._cxt.RT), u = this.onreadystatechange;
            return u ? (this.onreadystatechange = function () {
                if (4 === this.readyState && (clearTimeout(p), 200 !== this.status && 304 !== this.status)) {
                    if (!t._checkMoleVapPushed(r, "fail"))return !1;
                    i.status = this.status, i.statusText = this.statusText, i.statusCode = 404, t._isMoleVap(r) ? t.error(JSON.stringify(i), 420) : t.error(JSON.stringify(i), 404)
                }
                return u.apply(this, arguments)
            }, e.apply(this, arguments)) : !1
        }
    }, n.prototype._checkMoleVapPushed = function (t, e) {
        if (this._isMoleVap(t)) {
            this._MoleVapPushed = this._MoleVapPushed || {};
            var i = encodeURIComponent(t + e);
            return this._MoleVapPushed[i] ? !1 : (this._MoleVapPushed[i] = !0, !0)
        }
        return !0
    }, n.prototype._isMoleVap = function (t) {
        var e = !1, i = this;
        return Object.keys(this._cxt.vap).forEach(function (n) {
            t.indexOf(i._cxt.vap[n]) > -1 && (e = !0)
        }), e
    }, n.prototype.debug = function (t) {
        if (!i(t))return !1;
        var n = {msg: t, level: 1, type: e};
        this._cxt.push(n)
    }, n.prototype.error = function (t, n) {
        if (!i(t))return !1;
        var r = {msg: t, level: n || 410, type: e};
        this._cxt.push(r, !0)
    }, n.prototype._warning = function (t) {
        if (!i(t))return !1;
        var n = {msg: t, level: 2, type: e};
        this._cxt.push(n)
    }, MoleReg(n, "log")
}(this), function (t) {
    var e = {};
    e.timing = !(!window.performance || !window.performance.timing), e.resourceTiming = !(!window.performance || !window.performance.getEntries), e.memory = !(!window.performance || !window.performance.memory);
    var i = function () {
        var t = 0;
        return window.chrome && window.chrome.loadTimes && (t = 1e3 * window.chrome.loadTimes().firstPaintTime, 0 >= t && (t = 0)), t
    }, n = function (t) {
        var e = {};
        for (var i in t)"function" != typeof t[i] && (e[i] = t[i]);
        return e
    }, r = function (t) {
        return JSON.parse(JSON.stringify(t))
    }, o = function (t) {
        this._cxt = t, this.meta = {}, this.init()
    };
    o.prototype.init = function () {
        var t = this;
        window.addEventListener("load", function () {
            setTimeout(function () {
                t._resourceTiming(), t._memory(), t._pageTiming()
            }, 0)
        })
    }, o.prototype._normalizeData = function (t, e) {
        if (!e)return null;
        var i = r(this.meta);
        return i.type = t, i.data = e, i
    }, o.prototype._pageTiming = function () {
        if (e.timing) {
            var t = this, r = window.performance.timing;
            r = n(r), r.firstPaint = i(), r.firstScreenPaint = (new Date).getTime(), r.perfType = "pageTiming", r.type = "performance", this.pageTiming = r, this._firstScreenPaint ? this._push(r) : this._pageTimingTimeout = setTimeout(function () {
                t._push(r)
            }, 1e4)
        }
    }, o.prototype.setfirstPaint = function (t) {
        var e = t || +new Date;
        i = function () {
            return e
        }
    }, o.prototype._resourceTiming = function () {
        var t = this;
        if (e.resourceTiming) {
            var i = window.performance.getEntries({entryType: "resource"});
            i = i.map(function (t) {
                var e = t.name;
                return -1 === e.indexOf("??") && (e = e.replace(/\?.+/, "")), {
                    name: e,
                    initiatorType: t.initiatorType,
                    entryType: t.entryType,
                    startTime: t.startTime,
                    duration: t.duration,
                    perfType: "resourceTiming",
                    type: "performance"
                }
            }), i = i.filter(function (t) {
                return t.startTime <= 0 ? !1 : !(t.duration <= 0)
            }), i.map(function (e) {
                t._push(e)
            })
        }
    };
    var a = {};
    o.prototype.time = function (t) {
        e.timing && (a[t] = +new Date - window.performance.timing.navigationStart)
    }, o.prototype.timeEnd = function (t) {
        if (e.timing && a[t]) {
            var i = a[t], n = +new Date - window.performance.timing.navigationStart, r = n - i, o = {
                name: t,
                entryType: "timeElapsed",
                startTime: i,
                duration: r,
                perfType: "resourceTiming",
                type: "performance"
            };
            this._push(o)
        }
    }, o.prototype.timeStamp = function (t) {
        if (e.timing) {
            var i = +new Date - window.performance.timing.navigationStart, n = {
                entryType: "timeStamp",
                name: t,
                startTime: i,
                duration: 0,
                perfType: "resourceTiming",
                type: "performance"
            };
            this._push(n)
        }
    }, o.prototype._memory = function () {
        if (e.memory) {
            var t = n(window.performance.memory);
            t.perfType = "memory", t.type = "performance", this._push(t)
        }
    }, o.prototype._push = function (t) {
        var e = this;
        return t ? (this._pushData = this._pushData || [], this._pushData.push(t), void("pageTiming" === t.perfType && (clearTimeout(this._pageTimingTimeout), this._pushData.forEach(function (t) {
            e._cxt.push(t)
        })))) : !1
    }, o.prototype.firstScreenTime = function (t) {
        this._firstScreenTimes = this._firstScreenTimes || 0, this._firstScreenTimes++, this._firstScreenTimes >= t && (this._firstScreenPaint = (new Date).getTime(), this.pageTiming && (this.pageTiming.firstScreenPaint = this._firstScreenPaint, this._push(this.pageTiming)))
    }, MoleReg(o, "performance")
}(this);
Mole.init({
    env: '$$_MOLEENVCODE_$$',
    version: '$$_APPVERSION_$$',
    spma: 'fxh5'
});