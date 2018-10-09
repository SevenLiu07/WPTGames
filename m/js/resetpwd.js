/**
 * Created by liuhuan on 2016/1/8.
 */
var http_type = location.protocol + '//';
//var dialog_info=window.parent.$("#dialog_info");
var dialog_info = $('#dialog_info');
// 校验密码
function q_checkUPassword() {
    var password = document.getElementById("password");
    var div_p = document.getElementById("div_password");
    var div_cp = document.getElementById("div_cpassword");
    if (!checkPassword(password.value, "password", 6, 16)) {
        div_p.className = "rMainDecide ie6png rMainDecide_err";
        div_p.style.visibility = "visible";
    } else {
        var cpassword = document.getElementById("cpassword").value;
        if (cpassword == null || cpassword == "") {
            show_error_msg("");
            div_p.className = "rMainDecide ie6png rMainDecide_right";
            div_p.style.visibility = "visible";
        } else {
            if (password.value != cpassword) {
                div_p.className = "rMainDecide ie6png rMainDecide_err";
                div_cp.className = "rMainDecide ie6png rMainDecide_err";
                div_cp.style.visibility = "visible";
                div_p.style.visibility = "visible";
                show_error_msg("The password does not match. Please input again..");
            } else {
                show_error_msg("");
                div_p.className = "rMainDecide ie6png rMainDecide_right";
                div_cp.className = "rMainDecide ie6png rMainDecide_right";
                div_cp.style.visibility = "visible";
                div_p.style.visibility = "visible";
            }
        }
    }
}
// 重复密码校验
function q_checkCpassword() {
    var cp = document.getElementById("cpassword");
    var div_p = document.getElementById("div_password");
    var div_cp = document.getElementById("div_cpassword");
    if (!checkPassword(cp.value, "cpassword", 6, 16)) {
        div_cp.className = "rMainDecide ie6png rMainDecide_err";
        div_cp.style.visibility = "visible";
    } else {
        var password = document.getElementById("password").value;
        if (password == null || password == "") {
            show_error_msg("6-16 letter/digit/characters, without comma, semicolon or quotation mark");
            div_cp.className = "rMainDecide ie6png rMainDecide_err";
            div_cp.style.visibility = "visible";
            document.getElementById("password").focus()
        } else {
            if (cp.value != password) {
                div_p.className = "rMainDecide ie6png rMainDecide_err";
                div_cp.className = "rMainDecide ie6png rMainDecide_err";
                div_cp.style.visibility = "visible";
                div_p.style.visibility = "visible";
                show_error_msg("The password does not match. Please input again..");
            } else {
                show_error_msg("");
                div_p.className = "rMainDecide ie6png rMainDecide_right";
                div_cp.className = "rMainDecide ie6png rMainDecide_right";
                div_cp.style.visibility = "visible";
                div_p.style.visibility = "visible";
            }
        }
    }
}
function show_error_msg(message) {
    var error_mess_cg = document.getElementById("error_mess_cg");
    error_mess_cg.innerText = message;
    return false
}
function checkPassword(password, object, minLen, maxLen) {
    var str = ",'\"“”‘ ;";
    // 判断为空 您可以输入8-15位英文和数字组合的密码，不能使用，；‘等特殊符号
    if (password == null || password == "") {
        show_error_msg("Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
        return false;
    }
    //您的密码过短，您可以输入6-16位英文和数字组合的密码，不能使用，；‘特殊符号
    if (password.length < minLen) {
        show_error_msg("Your password is too short. Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
        return false;
    }
    if (hasFullshape(password)) {
        show_error_msg("Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
        return false;
    }
	for (var i = 0; i < password.length; i++) {
		if (str.indexOf(password.charAt(i)) != -1) {
			show_error_msg("Please input 6-16 characters which can be letters, numbers, symbols excluding ,;'");
			//document.getElementById(object).value="";
			return false;
		}
	}
    return true;
}
function hasFullshape(password) {  // 是否包含全角字符 true-包含 false-不包含
    if (password == null || password == "") {
        return true;
    }
    var pattern = /[^\x00-\xff]/g;
    for (var i = 0; i < password.length; i++) {
        if (pattern.test(password.charAt(i))) {
            return true;
        }
    }
    return false;
}
var users_mail = $("#users_mail");
users_mail.innerHTML = 'Current Email' + '<br>' + decodeURIComponent(location.parameters.email);
//------------------------------------rsa加密--------------------------------
setMaxDigits(131);
function rsaEncrypto(raw) {
    var result = null;
    // 格式：   日期:PublicModules:PublicExponent
    var publicKey = cookie.getItem('cryptowpt');
    if (publicKey && publicKey.split(':').length == 3) {
        var key = new RSAKeyPair(publicKey.split(':')[2], "", publicKey.split(':')[1], 1024);
        result = encryptedString(key, base64encode(strUnicode2Ansi(raw)), RSAAPP.PKCS1Padding);
    } else {
        new Request(PLAYTMP.webApiUrl + 'WebAPI/Passport/GetCryptoToken', {method: "GET", maxTime: 8000, sync: true}).on('complete', function (e) {
            if (e.status == 200) {
                var ret = JSON.parse(e.text);
                if (ret.State == 1) {
                    result = rsaEncrypto(raw);
                }
            }
        }).send();
    }
    return result;
}
//---------------------------------------------------重置密码---------------------------------------------------------
function browserRedirect() {
    var u = navigator.userAgent;
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
    if (IsIpad || IsIOS) {
        window.location.href = "itms-apps://itunes.apple.com/us/app/world-poker-tour-playwpt-texas/id1144458302";
        setTimeout(
            function () {
                window.location.href = PLAYTMP.gamesUrl + "mobile_ios.html";
            },
            5000);
    } else if (IsMidp || IsUc7 || IsUc || IsAndroid || IsCE || IsWM || IsWinxin) {
        setTimeout(function () {
            window.location.href = "https://play.google.com/store/apps/details?id=com.playwpt.mobile.poker";
        }, 20);
        setTimeout(
            function () {
                window.location.href = PLAYTMP.gamesUrl + "mobile_android.html";
            },
            5000);
    } else {
        window.location = PLAYTMP.gamesUrl;
    }
}
function resetPwd() {
    var dialog_info = $("#dialog_info");
    var info_tips = $("#info_tips");

    var jm_pwd = $("#password");
    var jm_cpwd = $("#cpassword");
    var pwd = rsaEncrypto(jm_pwd.value);//给密码框值进行加密处理
    var pwd2 = rsaEncrypto(jm_cpwd.value);//给密码框值进行加密处理
    var param_pwd = {"version": Math.random(), 'pwd': pwd, 'pwd2': pwd2};
    var curUrl = PLAYTMP.webApiUrl + "WebAPI/Passport/ResetPassword";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var pwdData = JSON.parse(e.text);
            if (pwdData.State == 1) {
                $("#reset_pwd").style.display = 'none';
                $("#reset_success").style.display = 'block';
                /*点击ok按钮事件*/
                $("#change_suc").on("click", function () {
                    browserRedirect();
                })
            } else {
                window.document.change_pwd.sub_cg_pwd.value = 0;
                document.getElementById("error_mess_cg").innerHTML = pwdData.Message;
            }
        }).send(param_pwd);
}
//修改密码
function change_onsubmit_email() {
    var nmark_pwd = "0";
    var d = new Date();
    var theyear = d.getFullYear();
    var div_p = document.getElementById("div_password");
    var div_cp = document.getElementById("div_cpassword");
    var password = window.document.change_pwd.password.value;
    var cpassword = window.document.change_pwd.cpassword.value;
    //密码修改已提交，请稍等！
    if (window.document.change_pwd.sub_cg_pwd.value == "1") {
        show_error_msg("Submitted. Please wait");
        nmark_pwd = "1";
        return false;
    }

    else if (password == null || password == "" || password == "Please enter your Password") {
        div_p.className = "rMainDecide ie6png rMainDecide_err";
        div_p.style.visibility = "visible";
        show_error_msg("Please enter your Password");
        nmark_pwd = "1";
        return false;
    }
    else if (password == null || password == "" || password == "" || password == "Please input your password") {
        div_p.className = "rMainDecide ie6png rMainDecide_err";
        div_p.style.visibility = "visible";
        show_error_msg("6-15 letter/digit/characters, without comma, semicolon or quotation mark");
        nmark_pwd = "1";
        return false;
    }

    else if (!checkPassword(password, "password", 6, 16)) {
        q_checkUPassword();
        nmark_pwd = "1";
        return false;
    }
    else if (!checkPassword(cpassword, "cpassword", 6, 16)) {
        q_checkCpassword();
        nmark_pwd = "1";
        return false;
    }
    //您两次输入的密码不同，请重新输入
    else if (password != cpassword) {
        q_checkUPassword();
        q_checkCpassword();
        nmark_pwd = "1";
        return false;
    }
    if (nmark_pwd == "0") {
        window.document.change_pwd.sub_cg_pwd.value = 1;
        resetPwd();
    }
}
