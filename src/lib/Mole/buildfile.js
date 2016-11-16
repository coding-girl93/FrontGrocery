/**
 * Created by mebx on 16/4/10
 */
"use strict";

var spawn = require('child_process').spawn;
var gulp = require('gulp');


var build = {
    "test": function () {
        var fs = require('fs');

        var files = ["./src/lib/avertError.js","./src/layout/header.txt","./src/lib/promise.js","./src/mole.js", "./src/performance.firstscreen.js","./src/performance.js","./src/layout/end.txt"];
        var filesContent = files.map(function(file){
            return fs.readFileSync(file).toString();
        }).join('\n');


        fs.writeFileSync('./build/static/index.debug.js', filesContent);
        fs.writeFileSync('./dist/index.debug.js', filesContent);


        var UglifyJS = require("uglify-js");
        var result = UglifyJS.minify(['./build/static/index.debug.js']);

        fs.writeFileSync('./build/static/index.js', result.code);
        fs.writeFileSync('./dist/index.js', result.code);
    },
    "start": function () {
        var nodestatic = require('node-static');

        var file = new nodestatic.Server('./');

        require('http').createServer(function (request, response) {
            request.url = request.url.replace(/^\/webstatic\//,'');

            request.addListener('end', function () {
                file.serve(request, response);
            }).resume();
        }).listen(8080);



    },

    std:function(child,slient){
        return new Promise(function(resolve){
            child.stderr.on('data',function(err){
                console.log(err.toString());
                if(!slient){
                    throw err;
                }
            });

            child.stdout.on('data',function(data){
                console.log(data.toString());
            });

            child.on('close',function(status){
                if(status){
                    if(!slient){
                        throw 'close error';
                    }else{
                        resolve(false);
                    }
                }else{
                    resolve(true);
                }
            });
        });
    },

    "testhijack":function *(){
        var child = spawn('kitty',['hosts','-a','127.0.0.1','wd.geilicdn.com']);
        yield this.std(child);
    },

    "dev":function*(){
        var self = this;
        self.test();
        gulp.watch(['./src/**'],function(){
            self.test();
        })
    }
};



(function(){
    var argv = process.argv[2];

    if(!argv || !build[argv]){
        return false;
    }

    var co = require('co');
    co(function *(){
        yield build[argv](process.argv[3]);
    }).catch(function(err){
        throw err.stack;
    });
}());



