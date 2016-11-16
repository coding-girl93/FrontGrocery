/**
 * Created by mebx on 16/6/15.
 */


var fs = require('fs');
var readfile = fs.readFile;

var thunk = function(cb){
    return function(){
        var self = this;
        var args = [];
        for(var i=0;i<arguments.length;i++){
            args.push(arguments[i]);
        }

        return function(done){
            args.push(function(){
                done.apply(null,arguments);
            })

            cb.apply(self,args);

        }
    }
};

var readfile = thunk(fs.readFile);

var gen = function* (){
    var a = yield readfile('./test.html');
    var b = yield readfile('./test.js');
};

var g = gen();

var r1 = g.next();
r1.value(function(err,data){
    var r2 = g.next(data);
    r2.value(function(err,data){
        var r3 = g.next(data);

    })
})

var promise = new Promise(function(resolve,reject){
    fs.readFile('./test.js',function(err,data){
        resolve(data.toString())
    })
});
