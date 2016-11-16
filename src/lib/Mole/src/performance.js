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