(function(w,d){
    var w = w || window, d = d || document;
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var initScreen = function(){
        if(!(this instanceof arguments.callee)) return new arguments.callee();
        this.init();
    };
    initScreen.prototype = {
        constructor:initScreen,
        init:function(){
            this.config = {
                fontSize:40
            };
            this.adapter();
            this.reSize();
        },
        reSize:function(){
            var that = this;
            window.onload = function(){
                that.adapter(d.body.clientWidth);
                d.body.onresize = function(){
                    that.adapter(d.body.clientWidth);
                };
            };
        },
        adapter:function(width){
            var that = this;
            if(!that.htmlObject){
                var html = d.getElementsByTagName('html');
                if(html && html.length) that.htmlObject = html[0];
            }
            var fz = that.config.fontSize,p_w = (isAndroid?w.innerWidth:(isiOS?w.screen.width:640)), p_h = w.innerHeight;
            if(p_w < 300){
                fz = p_w/16;
            }else if(p_w >= 300 && p_w <= 640){
                fz = p_w/16;
            }else{
                fz = 40;
            }
            that.htmlObject.style.fontSize = fz+'px';
            window.fontSize = fz;
        }
    };
    w.initScreen = new initScreen();
})(window,document);

/*公共对象*/
window.PLAYTMP = {};
var http_type = location.protocol+'//';
var getHost = window.location.host.split('.');
PLAYTMP.webApiUrl = "";
PLAYTMP.baseUrl = "";
PLAYTMP.gamesUrl = "";
if (location.href.indexOf('staging') !== -1) {
    PLAYTMP.webApiUrl = http_type + "staging-napi." + getHost[1] + '.com/';
    PLAYTMP.baseUrl =  http_type + "staging-www." + getHost[1] + '.com/';
    PLAYTMP.gamesUrl =  http_type + "staging-games." + getHost[1] + '.com/';
} else {
    PLAYTMP.webApiUrl = http_type + "napi." + getHost[1] + '.com/';
    PLAYTMP.baseUrl =  http_type + "www." + getHost[1] + '.com/';
    PLAYTMP.gamesUrl =  http_type + "games." + getHost[1] + '.com/';
}
