/**
 * Created by shiwz on 16-10-25.
 */

// 模板
// @param str {string} 模板选择器ID
// @param data {object} 传入模板的数据对象


import $ from 'jquery';
window.PLAY = {};
PLAY.baseUrl =  location.protocol + '//' + location.host + '/';
PLAY.staticUrl =  location.protocol+"//static.playwpt.com/";

PLAY.indexUrl  = "https://www.playwpt.com/";
PLAY.pokerUrl  = "https://www.playwpt.com/wpt/www/module/poker/index.html";

// AJAX-request
// @param options object 参数对象
// @param options.url string 请求路径
// @param options.data object 传入请求的参数对象
// @param options.async boolean 异步或同步，缺省为true（异步）
// @param options.noStatusCheck boolean 是否识别返回状态
// @param options.success function 正常返回成功处理器
// @param options.fail function 正常返回失败处理器
// @param options.error function 未正常返回处理器
// @param options.sucTip string 返回成功提示，未填则不提示
// @param options.failTip boolean/string 返回失败提示，false时不提示，为true或空时只提示后端返回的失败提示，赋值时则作为备选提示
// @param options.errTip string 未返回提示，未填则不提示
PLAY.ajax = {};
PLAY.ajax.request = function(method, options){
    var url = options.url,
        contentType = options.contentType || 'application/x-www-form-urlencoded', // 传递JSON时为：'application/json'
        data = contentType == 'application/json' ? JSON.stringify(options.data) : options.data,
        async = options.async === false ? false : true,
        cache = options.cache || false,
        timeout = options.timeout || 30000,
        dataType = options.dataType || 'text',
        noStatusCheck = options.noStatusCheck,
        has = options.has,
        hasnot = options.hasnot,
        sucTip = options.sucTip,
        failTip = options.failTip,
        errTip = options. errTip,
        success = options.success,
        fail = options.fail,
        error = options.error,
        showLoading = options.showLoading || false,
        $loading = options.$loading || $("#loading");
        if(showLoading && $loading.length){
           $loading.show();
        }
       return $.ajax({
        url: url,
        data: data,
        async: async,
        type: method,
        timeout: timeout,
        cache: cache,
        traditional: true,
        contentType: contentType,
        dataType: dataType,
        success: function(res, textStatus, jqXHR){
            if($loading.length){
                $loading.hide();
            }
            if(typeof res === "string"){
                res = JSON.parse(res);
            }
            if(res && res.State === 1){
                success && success.call(this, data, res);
            }else{
                fail && fail.call(this, data, res);
            }
        },
        error: function(jqXHR, textStatus, errThrown) {
            if($loading.length){
                $loading.hide();
            }
            error && error.call(this, textStatus,errThrown);
        }
    });
};

// AJAX-GET方法
PLAY.ajax.Get = function(options) {
    return PLAY.ajax.request('GET', options);
};

// AJAX-POST方法
PLAY.ajax.Post = function(options) {
    return PLAY.ajax.request('POST', options);
};

PLAY.url  = {};
PLAY.url.getQuery = function(){
    var i, paramsArr = window.location.search.substr(1).split('&'), params = {}, aParam;
    for (i = 0; i<paramsArr.length; i++){
        aParamArr = paramsArr[i].split('=');
        if (aParamArr[0].length) {
            params[aParamArr[0]] = decodeURIComponent(aParamArr[1]);
        }
    }
    return params;
};


PLAY.parseDate = function(dateString) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z\s*$/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateString);
    if(parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);//设置年份月份及日
        date.setHours(parts[4],parts[5],parts[6]);//设置时分秒
        if(month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
};



// Cookie操作方法
PLAY.cookie = function(name, value, options){
    if (typeof value != 'undefined') {
        options || (options = {});
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/*数字保留两位小数*/
PLAY.toDecimal = function(x){
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    f = Math.round(x*100)/100;
    return f;
};

/*数字强制保留两位小数*/
PLAY.toDecimal2 = function (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
};

/*转千分位格式,保留两位小数*/
PLAY.thousandsFormat = function (input) {
    var n =  parseFloat(input).toFixed(2);
    var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;
    return n.replace(re, "$1,");
};

/*数量转千分位，不保留小数*/
PLAY.formatScore = function (num) {
    var f = parseInt(num);
    if (isNaN(f)) {
        return false;
    }
    if(parseInt(num)==num){
        return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }else{
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
};
/*密码加密*/
PLAY.rsaEncrypto = function(raw) {
    if(!raw) return false;
    /*加密前*/
    setMaxDigits(131);
    var result = null;
    // 格式：   日期:PublicModules:PublicExponent
    var publicKey = PLAY.cookie('cryptowpt');
     if (publicKey && publicKey.split(':').length == 3) {
        var key = new RSAKeyPair(publicKey.split(':')[2], "", publicKey.split(':')[1], 1024);
        result = encryptedString(key, base64encode(strUnicode2Ansi(raw)), RSAAPP.PKCS1Padding);
    }
    return result;
};

/*检测邮箱*/
PLAY.checkEmail = function(param,callback){
    // 检查是否为空
    if(!param){
        callback("Please enter your email account");
        return false;
    }
    // 校验长度 您的邮箱账号过短，请输入正确的邮箱账号
    if(param.length<6){
        callback("Your email account is too short, please input the correct email");
        return false;
    }
    // 检测非法字符
    var str="abcdefghijklmnopqrstuvwxyz1234567890_ABCDEFGHIJKLMNOPQRSTUVWXYZ.-@";
    for(var i=0;i<param.length;i++){
       /* // 检查字符 您输入的内容不能包含_.-@以外的其他符号
        if(param.charAt(i)==" "){
            callback("Sorry, emailbox cannot consist of space");
        }*/
        if(str.indexOf(param.charAt(i))==-1){
            callback("Sorry, email account cannot consist of symbols except _.-@");
            return false;
        }
        // 检查开头 不能以_.-@作为开头或结尾
        if(i==0){
            var first = param.charAt(i);
            if(first=="_" || first=="." || first=="-" || first=="@"){
                callback("Sorry，email account cannot start or end with marks like _ . - @");
                return false;
            }
        }
        // 检查结尾 不能以_.-@作为开头或结尾
        if(i==param.length-1){
            var last = param.charAt(i);
            if(last=="_" || last=="." || last=="-" || last=="@"){
                callback("Sorry，email account cannot start or end with marks like _ . - @");
                return false;
            }
        }
    }
    // 不支持两个以上@ 请补全您的邮箱账号信息
    var arr = param.split("@");
    if(arr.length>2){
        callback("Please input a correct email address");
        return false;
    }
    // 必须含有@ 请补全您的邮箱账号信息
    if(param.indexOf("@")==-1){
        callback("Please input a correct email address");
        return false;
    }
    // 必须含有.请补全您的邮箱账号信息
    if(param.indexOf(".")==-1){
        callback("Please input a correct email address");
        return false;
    }
    return true;
};


/*检测密码*/
PLAY.checkPassword = function(password,minLen,maxLen,callback){
    var str=",'\"“”‘ ;";
    // 判断为空 您可以输入8-15位英文和数字组合的密码，不能使用，；‘等特殊符号
    if(!password){
        callback("Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
        return false;
    }
    //您的密码过短，您可以输入6-16位英文和数字组合的密码，不能使用，；‘特殊符号
    if(password.length<minLen){
        callback("Your password is too short. Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
        return false;
    }
    if(PLAY.hasFullshape(password)){
        callback("Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
        return false;
    }
    for(var i=0;i<password.length;i++)
        if(str.indexOf(password.charAt(i))!=-1){
            callback("Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
            return false;
        }
    return true;
};

/* 是否包含全角字符 true-包含 false-不包含*/
PLAY.hasFullshape = function(password){
    if(!password) {
        return true;
    }
    var pattern=/[^\x00-\xff]/g;
    for(var i=0;i<password.length;i++) {
        if(pattern.test(password.charAt(i))){
            return true;
        }
    }
    return false;
};


/*首字母大写*/
PLAY.initiaToLowerCase = function(str){
    str = str.toLowerCase();
    var reg = /\b(\w)|\s(\w)/g;
    return str.replace(reg,function(m){
        return m.toUpperCase()
    });
};

/*计算两个时间相差小时数*/
PLAY.getDiffHour = function(startDate,endDate){
    if(!startDate || !endDate){
       return false;
    }
    var s1 = new Date(startDate).getTime(),s2 =  new Date(endDate).getTime();
    var total = parseInt(s2 - s1)/1000;
    var day = parseInt(total / (24*60*60));//计算整数天数
    var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
    var hour = parseInt(afterDay/(60*60));//计算整数小时数
    if( day>=1 ){
        hour = hour+(day*24)
    }
    return hour;
};


/*计算两个时间相差分钟数*/
PLAY.getDiffMin = function(startDate,endDate){
    if(!startDate || !endDate){
        return false;
    }
    var date1= new Date(startDate);  //开始时间
    var date2= new Date(endDate);    //结束时间
    var date3=date2.getTime()-date1.getTime();
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));
    //计算出小时数
    var leave1 = date3 % (24*3600*1000);
    var hours = Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600*1000);
    var minutes = Math.floor(leave2/(60*1000));
    //计算相差秒数
    var leave3 = leave2 %(60*1000);
    var seconds = Math.round(leave3/1000);
    return minutes;
};