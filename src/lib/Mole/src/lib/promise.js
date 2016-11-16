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