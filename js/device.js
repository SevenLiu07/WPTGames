/*公共对象*/
window.PLAYTMP = {};
var http_type = location.protocol+'//';
var getHost = window.location.host.split('.');
PLAYTMP.gamesUrl = "";
if (location.href.indexOf('staging') !== -1) {
    PLAYTMP.gamesUrl =  http_type + "staging-games." + getHost[1] + '.com/';
} else {
    PLAYTMP.gamesUrl =  http_type + "games." + getHost[1] + '.com/';
}

function browserRedirect() {
    var u =  navigator.userAgent;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var IsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var IsIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var IsMidp = sUserAgent.match(/midp/i) == "midp";
    var IsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var IsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var IsAndroid = sUserAgent.match(/android/i) == "android";
    var IsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var IsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    var IsWinxin = sUserAgent.match(/MicroMessenger/i) == "micromessenger";
    if (IsIpad || IsIOS || IsMidp || IsUc7 || IsUc || IsAndroid || IsCE || IsWM || IsWinxin){
        window.location.href = PLAYTMP.gamesUrl + "mobile-compatible.html";
    }else{
        function IE() {
            if (window.VBArray) {
                var mode = document.documentMode
                return mode ? mode : window.XMLHttpRequest ? 7 : 6
            } else {
                return NaN
            }
        }
        var IEVersion = IE();
        if(IEVersion && IEVersion <= 9){
            window.location.href = PLAYTMP.gamesUrl +  "poker-flash/";
        }
    }
}
browserRedirect();

