/**
 * Created by liuhuan on 2016/1/27.
 */
cookie.setItem('timezone', (new Date().getTimezoneOffset() / 60) * (-1));
var http_type = location.protocol + '//';
var lHost = window.location.host;
var getHost = window.location.host.split('.');
var baseUrl = "";
if (location.href.indexOf('staging') !== -1) {
    baseUrl = http_type + "staging-napi." + getHost[1] + '.com/WebAPI/';
} else {
    baseUrl = http_type + "napi." + getHost[1] + '.com/WebAPI/';
}
document.domain = getHost[1] + ".com";
//var baseUrl = http_type + "id.playwpt.com/WebAPI/";
var info_ul = $("#infos").findAll(".open_ul");
var edits = $("#infos").findAll(".edit");
var msg_info = $("#infos").findAll(".error_Msg p");//错误提示信息
var discard = $("#infos").findAll(".discard");
var clear_iput = document.getElementById("infos").findAll("input");
var e_vali = $("#e_vali");
var mail_val = document.getElementById("mail_val");
var name_state = $("#name");
var pwd_time = $("#pwd_time");
/*billing选项卡*/
var info_b_ul = $("#info_billing").findAll(".open_ul");
var edits_b = $("#info_billing").findAll(".edit");
/*关闭个人中心弹窗时关闭personal选项卡中展开项*/
//var close_pers=window.parent.$('#close_pers');
var close_pers = window.parent.document.getElementById("close_pers");
if (close_pers) {
    close_pers.on('click', function () {
        info_display();
    });
}
function info_display() {
    for (var c = 0; c < info_ul.length; c++) {
        info_ul[c].style.display = 'none';
        edits[c].style.display = 'block';
        info_ul[c].getPreviousSibling().removeClass('infos');
    }
    /*billing选项卡*/
    for (var b = 0; b < info_b_ul.length; b++) {
        info_b_ul[b].style.display = 'none';
        edits_b[b].style.display = 'block';
        info_b_ul[b].getPreviousSibling().removeClass('infos');
    }
}
//点击adit弹出修改信息框系列效果
function show_info() {
    for (var i = 0; i < edits.length; i++) {
        edits[i].getParent().addClass('info');
        info_ul[i].style.display = 'none';
        edits[i].on('click', function () {
            for (var a = 0; a < info_ul.length; a++) {
                info_ul[a].style.display = 'none';
                info_ul[a].getPreviousSibling().removeClass('infos');
                this.getParent().addClass('infos');
                this.getParent().getNextSibling().style.display = 'block';
                edits[a].style.display = 'block';
                this.style.display = 'none';
                msg_info[a].innerHTML = "";//点击edit时清空错误提示信息
                discard[a].on('click', function () {
                    for (var b = 0; b < discard.length; b++) {
                        edits[b].style.display = 'block';
                        info_ul[b].style.display = 'none';
                        info_ul[b].getPreviousSibling().removeClass('infos');
                        msg_info[b].innerHTML = "";//点击discard时清空错误提示信息
                    }
                });
            }
            if (this.id == "edit_ph") {
                $("#scroll-1").scrollTop = 100;
            } else if (this.id == "edit_bd") {
                $("#scroll-1").scrollTop = 100;
            } else {
                $("#scroll-1").scrollTop = 0;
            }
            for (var c = 0; c < clear_iput.length; c++) {
                clear_iput[c].value = "";
            }
            //nm_state();
        });
    }
}
show_info();
//点击validate弹出验证窗口
var dialoga = $('#dialog');
e_vali.on('click', function () {
    for (var a = 0; a < info_ul.length; a++) {
        info_ul[a].style.display = 'none';
        info_ul[a].getPreviousSibling().removeClass('infos');
        edits[a].style.display = 'block';
    }
    valiEmail();
    dialoga.open();
    $("#show_title").innerHTML = '<div class="vali_title"></div>';
    $("#ben_vali").style.display = 'block';
    $("#btn_ok").style.display = 'none';
    var tips = "";
    tips += 'An activation email has been sent to you. Please activate your email, and you will get 5,000 free Gold.';
    var m_info = document.getElementById("m_info");
    m_info.innerHTML = tips;
});
$("#ben_vali").on('click', function () {
    dialoga.close();
});
$("#btn_ok").on('click', function () {
    dialoga.close();
});
window.onload = function () {
    cookie.setItem('timezone', (new Date().getTimezoneOffset() / 60) * (-1));//时区
    // 避免应用界面内容被无意划选。
    var body_select = $("body");
    body_select.onselectstart = function () {
        return false;
    };
    login_user_info();
};
//-------------------------------------获取用户登陆信息----------------------------------------
function login_user_info() {
    var parametes = {"version": Math.random()};
    var curUrl = baseUrl + "Passport/GetLoginUserInfo";
    new Request(curUrl, {method: "GET"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                if (guideData.Value.IsLogined == true) {//判断是否已登录
                    mail_val.innerHTML = guideData.Value.Email;
                    var type_m = guideData.Value.Email;
                    getInfo();
                    if (guideData.Value.UserStatus == 'ToValidate') {
                        e_vali.disabled = false;
                        e_vali.addClass("validate");
                        e_vali.removeClass("validated");
                    } else {
                        e_vali.style.display = 'none';
                    }
                    if (guideData.Value.PlatformId > 0) {
                        $("#edit_pwd").innerHTML = '';
                    } else {
                        $("#edit_pwd").innerHTML = 'Edit';
                    }
                } else {
                    console.log("Please Login.");
                }//else语句结束
            }
        }).send(parametes);
}
//-------------------------------------获取用户信息----------------------------------------
function getInfo() {
    var param_info = {"version": Math.random()};
    var curUrl = baseUrl + "UserInfo/SelectUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                if (guideData.Value.FullName == "" || guideData.Value.FullName == null) {
                    user_name.innerHTML = '';//获取Name
                } else {
                    user_name.innerHTML = guideData.Value.FullName;
                }
                var shwo_addr = guideData.Value.AddrDetail;
                if (shwo_addr != null && shwo_addr != "") {
                    shwo_addr = HtmlUtil.htmlDecodeByRegExp(shwo_addr);
                }
                if (guideData.Value.AddrDetail == "" || guideData.Value.AddrDetail == null) {
                    //shwo_addr.innerHTML='';
                } else {
                    if (shwo_addr.length > 30) {
                        shwo_addr = shwo_addr.substring(0, 30) + "...";
                        addr_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(shwo_addr);
                    } else {
                        addr_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(shwo_addr);
                    }
                }
                if (guideData.Value.AddrCity == "" || guideData.Value.AddrCity == null) {
                    city_val.innerHTML = '';
                } else {
                    city_val.innerHTML = guideData.Value.AddrCity;//获取City
                }
                if (guideData.Value.AddrState == "" || guideData.Value.AddrState == null) {
                    state_val.innerHTML = '';
                } else {
                    state_val.innerHTML = guideData.Value.AddrState;//获取State
                }
                if (guideData.Value.AddrPostCode == "" || guideData.Value.AddrPostCode == null) {
                    pc_val.innerHTML = '';
                } else {
                    pc_val.innerHTML = guideData.Value.AddrPostCode;//获取Postal Code
                }
                if (guideData.Value.AddrCountry == "" || guideData.Value.AddrCountry == null) {
                    coun_val.innerHTML = '';
                } else {
                    coun_val.innerHTML = guideData.Value.AddrCountry;//获取Country
                }
                if (guideData.Value.UPhone == "" || guideData.Value.UPhone == null) {
                    phone_val.innerHTML = '';
                } else {
                    phone_val.innerHTML = guideData.Value.UPhone;
                }
                if (guideData.Value.UBirth == "" || guideData.Value.UBirth == null) {
                    birth_val.innerHTML = '';
                } else {
                    birth_val.innerHTML = new Date(guideData.Value.UBirth.replace(/-/g, "/")).format("MM-dd-yyyy");
                }
            } else {
            }
        }).send(param_info);
}
var HtmlUtil = {
    /*1.用正则表达式实现html转码*/
    htmlEncodeByRegExp: function (str) {
        var s = "";
        if (str.length == 0) {
            return "";
        }
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    },
    /*2.用正则表达式实现html解码*/
    htmlDecodeByRegExp: function (str) {
        var s = "";
        if (str.length == 0) {
            return "";
        }
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        return s;
    }
};
//-------------------------------------Name----------------------------------------
function setName(name) {
    var param_name = {"version": Math.random(), 'fullName': name};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                close_nm.style.display = 'none';
                user_name.innerHTML = HtmlUtil.htmlEncodeByRegExp(name);
                edit_nm.style.display = 'block';
                error_name.innerHTML = "";
            } else {
                error_name.innerHTML = guideData.Message;
            }
        }).send(param_name);
}
//验证name文本框输入
var edit_nm = $("#edit_nm");
var names = document.getElementById("name");
var close_nm = document.getElementById("close_name");
var error_name = document.getElementById("error_name");
var user_name = document.getElementById("user_name");
function check_nm() {
    var name = $("#name").value;
    if (name == null || name == "") {
        error_name.innerHTML = "Please input your Name";
    } else {
        setName(name);
    }
}
//---------------------------------------------------验证邮件----------------------------------------------
function valiEmail() {
    var param_vali = {"version": Math.random()};
    var curUrl = baseUrl + "Passport/ToValidateEmail";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var valData = JSON.parse(e.text);
            if (valData.State == 1) {/*
             var tips="";
             tips+='An activation email has been sent to you. Please activate your email, and you will get 500 free chips.';
             var m_info=document.getElementById("m_info");
             m_info.innerHTML=tips;*/
            } else {
                console.log(valData.Message);
            }
        }).send(param_vali);
}
//-------------------------------------获取最后修改密码时间----------------------------------------
function get_pwd_time() {
    var param_time = {"version": Math.random()};
    var curUrl = baseUrl + "Passport/GetPwdLastModifiedDate";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                if (pwd_time) {
                    var get_time = guideData.Value;
                    if (get_time != null || get_time != "") {
                        pwd_time.innerHTML = 'Updated on ' + new Date(get_time.replace(/-/g, "/")).format("MM-dd-yyyy");
                    }
                }
            } else {
                error_addr.innerHTML = guideData.Message;
            }
        }).send(param_time);
}
//-------------------------------------Address----------------------------------------
function setAddr(address) {
    var param_name = {"version": Math.random(), 'addrDetail': address};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                var addr = address;
                var addr_value;
                if (addr.length > 30) {
                    addr_value = addr.substring(0, 30) + "...";
                    addr_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(addr_value);
                } else {
                    addr_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(addr);
                }
                close_addr.style.display = 'none';
                edit_addr.style.display = 'block';
                error_addr.innerHTML = "";
            } else {
                error_addr.innerHTML = guideData.Message;
            }
        }).send(param_name);
}
var close_addr = document.getElementById("close_addr");
var edit_addr = document.getElementById("edit_addr");
var addr_val = document.getElementById("addr_val");
var error_addr = document.getElementById("error_addr");
//验证地址
$("#cg_addr").on('click', function () {
    var addr = document.getElementById("addr");
    var address = addr.value;
    if (addr.value == "") {
        error_addr.innerHTML = "Please input your Address.";
    } else {
        setAddr(address);
    }
});
//-------------------------------------City----------------------------------------
var error_city = document.getElementById("error_city");
function setCity(city) {
    var param_name = {"version": Math.random(), 'addrCity': city};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                city_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(city);
                close_city.style.display = 'none';
                edit_city.style.display = 'block';
                error_city.innerHTML = "";
            } else {
                error_city.innerHTML = guideData.Message;
            }
        }).send(param_name);
}
var city_val = document.getElementById("city_val");
var close_city = document.getElementById("close_city");
var edit_city = document.getElementById("edit_city");
//验证地址
$("#cg_city").on('click', function () {
    var citys = document.getElementById("city");
    var city = citys.value;
    if (citys.value == "") {
        error_city.innerHTML = "Please input your City.";
    } else {
        setCity(city);
    }
});
//-------------------------------------State----------------------------------------
var error_state = document.getElementById("error_state");
function setState(state) {
    var param_name = {"version": Math.random(), 'addrState': state};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                state_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(state);
                close_state.style.display = 'none';
                edit_state.style.display = 'block';
                error_state.innerHTML = "";
            } else {
                error_state.innerHTML = guideData.Message;
            }
        }).send(param_name);
}
var state_val = document.getElementById("state_val");
var close_state = document.getElementById("close_state");
var edit_state = document.getElementById("edit_state");
//验证地址
$("#cg_state").on('click', function () {
    var states = document.getElementById("state");
    var state = states.value;
    if (states.value == "") {
        error_state.innerHTML = "Please input your State.";
    } else {
        setState(state);
    }
});
//-------------------------------------Postal Code----------------------------------------
var error_pos = document.getElementById("error_pos");
var pc_val = document.getElementById("pc_val");
var close_pc = document.getElementById("close_pc");
var edit_pc = document.getElementById("edit_pc");
function setPc(code) {
    var param_name = {"version": Math.random(), 'addrPostCode': code};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                pc_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(code);
                close_pc.style.display = 'none';
                edit_pc.style.display = 'block';
                error_pos.innerHTML = "";
            } else {
                error_pos.innerHTML = guideData.Message;
            }
        }).send(param_name);
}
//验证邮编
var number = /^[0-9]*$/;
$("#pos_code").on('click', function () {
    var pos_input = document.getElementById("pos_input");
    var code = pos_input.value;
    if (pos_input.value == "") {
        error_pos.innerHTML = "Please input your Postal Code.";
    } else if (pos_input.value.indexOf(" ") >= 0) {
        //error_pos.innerHTML="Sorry, your Postal Code cannot contain space.";
        error_pos.innerHTML = "Postal code can not cotain space.";
    } else if (!number.test(pos_input.value) || pos_input.value.length < 4) {
        //error_pos.innerHTML="Postal code can only be numbers, 4-6 characters long.";
        error_pos.innerHTML = "Postal code must be 4-6 digits.";
    } else if (!number.test(pos_input.value) || pos_input.value.length > 6) {
        //error_pos.innerHTML="Your Postal Code is too lang, please input 4-6 characters as your Postal Code.";
        error_pos.innerHTML = "Postal code must be 4-6 digits.";
    } else {
        setPc(code);
    }
});
//-------------------------------------Country----------------------------------------
function setCountry(country) {
    var param_name = {"version": Math.random(), 'addrCountry': country};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                error_count.innerHTML = "";
                coun_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(country);
                close_coun.style.display = 'none';
                edit_coun.style.display = 'block';
            } else {
                error_count.innerHTML = guideData.Message;
            }
        }).send(param_name);
}
//country如果选择other则出现输入框
var country = $("#country");
var coun_val = $("#coun_val");
var edit_coun = $("#edit_coun");
var other_coun = document.getElementById("other_coun");
var close_coun = document.getElementById("close_coun");
var error_count = document.getElementById("error_count");
other_coun.style.display = "none";
country.onchange = function () {
    other_coun.style.display = "none";
    if (country.value == 0) {
        other_coun.style.display = "block";
    }
};
$("#cg_country").on('click', function () {
    if (country.value == 0) {
        if (other_coun.value == "") {
            error_count.innerHTML = "Please input your Country.";
        }/*else if(other_coun.value.indexOf(" ") >=0){
         error_count.innerHTML="Sorry, your Country cannot contain space.";
         }*/ else {
            setCountry(other_coun.value);
        }
    } else {
        setCountry(country.value);
    }
});
//-------------------------------------phone----------------------------------------
function setPhone(phones, countryCode) {
    var param_phone = {"version": Math.random(), 'uPhone': phones, 'countryCode': countryCode};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                error_ph.innerHTML = "";
                if (phone.value == 0) {
                    phone_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(countryCode + '-' + phones);
                } else {
                    phone_val.innerHTML = HtmlUtil.htmlEncodeByRegExp(countryCode + '-' + phones);
                }
                close_ph.style.display = 'none';
                edit_ph.style.display = 'block';
            } else {
                error_ph.innerHTML = guideData.Message;
            }
        }).send(param_phone);
}
//telephone如果选择other则出现输入框
var phone = $("#phone");
var phone_val = $("#phone_val");
var edit_ph = $("#edit_ph");
var close_ph = document.getElementById("close_ph");
var other_phone = document.getElementById("other_phone");
var phone_num = document.getElementById("phone_num");
var error_ph = document.getElementById("error_ph");
other_phone.style.display = "none";
phone.onchange = function () {
    other_phone.style.display = "none";
    error_ph.innerHTML = '';
    if (phone.value == 0) {
        other_phone.style.display = "block";
    }
};
$("#cg_phone").on('click', function () {
    if (phone.value == 0) {
        if (other_phone.value == "") {
            error_ph.innerHTML = "Please input your country code.";
        } else if (other_phone.value.indexOf(" ") >= 0) {
            //error_ph.innerHTML="Sorry, your Phone cannot contain space.";
            error_ph.innerHTML = "Country code must be 1-3 digits.";
        } else if (!number.test(other_phone.value) || other_phone.value.length < 1 || other_phone.value.length > 3) {
            //error_ph.innerHTML="Your Phone is too short, please input 1-3 characters as your Phone number.";
            error_ph.innerHTML = "Country code must be 1-3 digits.";
        } else if (phone_num.value == "") {
            error_ph.innerHTML = "Please input your phone number.";
        } else if (phone_num.value.indexOf(" ") >= 0) {
            error_ph.innerHTML = "Phone number must be 5-11 digits.";
        } else if (!number.test(phone_num.value) || phone_num.value.length < 5) {
            //error_ph.innerHTML="Telephone Number can only be numbers, 5-11 characters long.";
            error_ph.innerHTML = "Phone number must be 5-11 digits.";
        } else {
            setPhone(phone_num.value, other_phone.value);
        }
    } else if (phone.value != 0) {
        if (phone_num.value == "") {
            error_ph.innerHTML = "Please input your phone number.";
        } else if (phone_num.value.indexOf(" ") >= 0) {
            error_ph.innerHTML = "Phone number must be 5-11 digits.";
        } else if (!number.test(phone_num.value) || phone_num.value.length < 5) {
            //error_ph.innerHTML="Telephone Number can only be numbers, 5-11 characters long.";
            error_ph.innerHTML = "Phone number must be 5-11 digits.";
        } else {
            setPhone(phone_num.value, phone.value);
        }
    }
});
//-------------------------------------Birthday----------------------------------------
function setBirth(birth) {
    var param_birth = {"version": Math.random(), 'uBirth': birth};
    var curUrl = baseUrl + "UserInfo/ModifyUserInfo";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                error_birth.innerHTML = "";
                birth_val.innerHTML = new Date(birth.replace(/-/g, "/")).format("MM-dd-yyyy");
                close_bd.style.display = 'none';
                edit_bd.style.display = 'block';
            } else {
                error_birth.innerHTML = guideData.Message;
            }
        }).send(param_birth);
}
//生日
var birth_val = $("#birth_val");
var year = $("#year");
var error_birth = $("#error_birth");
var month = $("#month");
var day = $("#day");
var close_bd = $("#close_bd");
var edit_bd = $("#edit_bd");
$("#cg_birth").on('click', function () {
    setBirth(month.value + '-' + day.value + '-' + year.value);
});

