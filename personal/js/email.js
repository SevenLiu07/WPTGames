/**
 * Created by liuhuan on 2016/1/8.
 */
subbutton = 0;// 用于控制提交按钮是否可点
// 校验密码
function q_checkUPassword() {
    var password = document.getElementById("password");
    if (!checkPassword(password.value, "password", 6, 16)) {
    } else {
        var cpassword = document.getElementById("cpassword").value;
        if (cpassword == null || cpassword == "") {
            show_error_msg("");
        } else {
            if (password.value != cpassword) {
                //show_error_msg("The password does not match. Please input again..");
                show_error_msg("Passwords do not match");
            } else {
                show_error_msg("");
            }
        }
    }
}
// 重复密码校验
function q_checkCpassword() {
    var cp = document.getElementById("cpassword");
    if (!checkPassword(cp.value, "cpassword", 6, 16)) {
    } else {
        var password = document.getElementById("password").value;
        if (password == null || password == "") {
            //show_error_msg("Ther password must contain numbers letters or  symbols excluding ,;' 6-16 characters long");
            show_error_msg("Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;'");
            document.getElementById("password").focus()
        } else {
            if (cp.value != password) {
                //show_error_msg("The password does not match. Please input again..");
                show_error_msg("Passwords do not match");
            } else {
                show_error_msg("");
            }
        }
    }
}
function show_error_msg(message) {
    var error_mess_cg = document.getElementById("error_mess_cg");
    error_mess_cg.innerText = message;
    return false
}
function show_error_email(message) {
    var error_mess_email = document.getElementById("error_mess_email");
    error_mess_email.innerText = message;
    return false;
}
function checkPassword(password, object, minLen, maxLen) {
    var str = ",'\"“”‘ ;";
    // 判断为空 您可以输入6-16位英文和数字组合的密码，不能使用，；‘等特殊符号
    if (password == null || password == "") {
        show_error_msg("Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ");
        return false;
    }
    //您的密码过短，您可以输入6-16位英文和数字组合的密码，不能使用，；‘特殊符号
    if (password.length < minLen) {
        show_error_msg("Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ");
        return false;
    }
    if (hasFullshape(password)) {
        show_error_msg("Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ");
        return false;
    }
    for (var i = 0; i < password.length; i++) {
        if (str.indexOf(password.charAt(i)) != -1) {
            show_error_msg("Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ");
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
        //new Request('https://id.playwpt.com/WebAPI/Passport/GetCryptoToken', {method: "POST", maxTime: 8000, sync: true}).on('complete', function (e) {
        var curUrl = baseUrl + "Passport/GetCryptoToken";
        new Request(curUrl, {method: "POST", maxTime: 8000, sync: true}).on('complete', function (e) {
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
function resetPwd() {
    /*	var pwd=password.value;
     var pwd2=cpassword.value;*/
    var jm_pwd = document.getElementById("password");
    var jm_cpwd = document.getElementById("cpassword");
    var oldpwd = document.getElementById("oldpwd");
    var pwd_val = document.getElementById("pwd_val");
    var close_pwd = document.getElementById("close_pwd");
    var edit_pwd = document.getElementById("edit_pwd");

    var pwd = rsaEncrypto(jm_pwd.value);//给密码框值进行加密处理
    var pwd2 = rsaEncrypto(jm_cpwd.value);//给密码框值进行加密处理
    var oldpwds = rsaEncrypto(oldpwd.value);//给密码框值进行加密处理
    var param_pwd = {"version": Math.random(), 'oldpwd': oldpwds, 'pwd': pwd, 'pwd2': pwd2};
    //new Request('https://id.playwpt.com/WebAPI/UserInfo/ModifyPassword', {method: "POST"})
    var curUrl = baseUrl + "UserInfo/ModifyPassword";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var pwdData = JSON.parse(e.text);
            if (pwdData.State == 1) {
                get_pwd_time();//window.parent.更新修改密码时间
                //pwd_val.innerHTML=jm_cpwd.value;
                close_pwd.style.display = 'none';
                edit_pwd.style.display = 'block';
                $('#dialog').open();
                $("#show_title").innerHTML = '<div class="notice_title"></div>';
                $("#ben_vali").style.display = 'none';
                $("#btn_ok").style.display = 'block';
                var tips = "";
                tips += 'Your new password has been updated.';
                var m_info = document.getElementById("m_info");
                m_info.innerHTML = tips;
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
    var oldpwd = document.getElementById("oldpwd");
    var password = window.document.change_pwd.password.value;
    var cpassword = window.document.change_pwd.cpassword.value;
    //密码修改已提交，请稍等！
    if (window.document.change_pwd.sub_cg_pwd.value == "1") {
        show_error_msg("Submitted. Please wait");
        nmark_pwd = "1";
        return false;
    }
    else if (oldpwd.value == null || oldpwd.value == "") {
        show_error_msg("Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ");
        nmark_pwd = "1";
        return false;
    }
    else if (password == null || password == "") {
        show_error_msg("Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ");
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

