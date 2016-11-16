/**
 * Created by fudongguang on 16/7/05.
 */
(function(root){
    var type = 'hijack';
    var urls = [
        //'//assets.geilicdn.com/v-components/cdn/0.0.5/4321a144c715095a1d5e984c6ada52d9.png'
        //'//wd.geilicdn.com/4321a144c715095a1d5e984c6ada52d9.png'
    ];


    var hijack = function (cxt) {
        this._cxt = cxt;
        //this.init();
    };

    var prototype = hijack.prototype;

    prototype.init = function(){
        var self = this;
        urls.forEach(function(url){
            self.checkImage(url);
        })
    };

    /**
     * 认证图片
     */
    prototype.checkImage = function(url){
        var size = parseInt(Math.random()*10)+10;


        var img = new Image();
        img.onload = function(){
            if(!this.width || (this.width!==size && this.width!==112)){
                setTimeout(function(){
                    Mole.log.error(window.location.protocol+url+' is error\\onload');
                },1)
            }
        };

        img.onerror = function(){
            var args = arguments;
           setTimeout(function(){
               try {
                   var src = args[0].path[0].nodeName;
                   if(src && src==='IMG'){
                       //图片被劫持并且有返回(返回的类型不是图片)
                       Mole.log.error(window.location.protocol+url+' is error\\onerror');
                   }else{
                       //图片地址404
                       Mole.log.error(window.location.protocol+url+' 404');
                   }
               }catch (e){
                   Mole.log.error(window.location.protocol+url+' 404');
               }

           },1)
        };

        img.src= url+'?w='+size+'&h='+size+'&cp=1';
    };



    MoleReg(hijack,type);

}(this));

