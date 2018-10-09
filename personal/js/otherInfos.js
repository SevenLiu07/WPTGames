/**
 * Created by liuhuan on 2016/3/14.
 */
var http_type = location.protocol + '//';
var getHost = window.location.host.split('.');
var baseUrl = "";
if (location.href.indexOf('staging') !== -1) {
    baseUrl = http_type + "staging-napi." + getHost[1] + '.com/WebAPI/';
} else {
    baseUrl = http_type + "napi." + getHost[1] + '.com/WebAPI/';
}
var baseUrls = http_type + "napi." + getHost[1] + '.com/';
var payUrl = http_type + "pay." + getHost[1] + '.com/';
document.domain = getHost[1] + ".com";
var cardid = "";//定义cardid
//---------------------------------------billing 页面效果--------------------------------
var number = /^[0-9]*$/;
var info_b_ul = $("#info_billing").findAll(".open_ul");
var edits_b = $("#info_billing").findAll(".edit");
var discard_b = $("#info_billing").findAll(".discard");
var clear_iput_b = document.getElementById("info_billing").findAll("input");
var msg_billing = $("#info_billing").findAll(".error_Msg p");//错误提示信息
//点击adit弹出修改信息框系列效果
function show_info_b() {
    for (var i = 0; i < edits_b.length; i++) {
        edits_b[i].getParent().addClass('info');
        info_b_ul[i].style.display = 'none';
        edits_b[i].on('click', function () {
            for (var a = 0; a < info_b_ul.length; a++) {
                info_b_ul[a].style.display = 'none';
                info_b_ul[a].getPreviousSibling().removeClass('infos');
                this.getParent().addClass('infos');
                this.getParent().getNextSibling().style.display = 'block';
                edits_b[a].style.display = 'block';
                this.style.display = 'none';
                msg_billing[a].innerHTML = "";//点击edit时清空错误提示信息
                discard_b[a].on('click', function () {
                    for (var b = 0; b < discard_b.length; b++) {
                        edits_b[b].style.display = 'block';
                        info_b_ul[b].style.display = 'none';
                        info_b_ul[b].getPreviousSibling().removeClass('infos');
                        error_card.innerHTML = "";
                    }
                })
            }
            for (var c = 0; c < clear_iput_b.length; c++) {
                clear_iput_b[c].value = "";
            }
        });
    }
}
show_info_b();
//-------------------------------------获取信用卡信息----------------------------------------
$("#tab2").on('click', function () {
    get_billingInfo();
});
function get_billingInfo() {
    var param_bil = {"version": Math.random()};
    new Request(payUrl + 'LZPay/GetUserCardinfo.html', {mode: "jsonp"})
        .on('complete', function (e) {
            var guideData = e.data;
            if (guideData.State == 1) {
                var cardNum = guideData.CardNum;
                if (guideData.CardNum == "" || guideData.CardNum == null) {
                    $("#card_num").innerHTML = '';//卡信息替换null为空
                } else {
                    $("#card_num").innerHTML = '**********' + cardNum;//卡信息
                }
                if (guideData.ExpireDate == "" || guideData.ExpireDate == null) {
                    $("#ex_val").innerHTML = '';//过期时间替换null为空
                } else {
                    $("#ex_val").innerHTML = guideData.ExpireDate;//过期时间
                }
                cardid = guideData.UserBankcardID;
            } else {
                console.log(guideData.Message);
            }
        }).send(param_bil);
}
//-------------------------------------修改信用卡信息----------------------------------------
function set_billingInfo(card_number) {
    var param_set_bil = {"version": Math.random(), 'cardid': cardid, 'cardnum': card_number};
    new Request(payUrl + 'LZPay/SetUserCardinfo.html', {mode: "jsonp"})
        .on('complete', function (e) {
            var guideData = e.data;
            if (guideData.State == 1) {
                var four_num = card_number.substr(card_number.length - 4);
                card_num.innerHTML = '**********' + four_num;
                close_num.style.display = 'none';
                edit_number.style.display = 'block';
                error_card.innerHTML = "";
            } else {
                error_card.innerHTML = guideData.Message;
            }
        }).send(param_set_bil);
}
//credit card number
var error_card = document.getElementById("error_card");
var card_num = document.getElementById("card_num");
var close_num = document.getElementById("close_num");
var edit_number = document.getElementById("edit_number");
$("#cg_card_num").on('click', function () {
    var card = document.getElementById("card");
    var card_number = card.value;
    if (card.value == null || card.value == "") {
        error_card.innerHTML = "Please input your Credit Card";
    } else if (card.value.indexOf(" ") >= 0) {
        error_card.innerHTML = "Sorry, Credit Card cannot consist of space";
    } else if (!number.test(card.value) || card.value.length < 16) {
        error_card.innerHTML = "Credit Card must be 16 digits number";
    } else {
        set_billingInfo(card_number);
    }
});
//-------------------------------------修改信用卡过期时间----------------------------------------
function set_ex_date(month, exp_year) {
    var param_exp = {"version": Math.random(), 'cardid': cardid, 'expdate': month + '' + exp_year};
    new Request(payUrl + 'LZPay/SetUserCardinfo.html', {mode: "jsonp"})
        .on('complete', function (e) {
            var guideData = e.data;
            if (guideData.State == 1) {
                exp_val.innerHTML = month + '' + exp_year;
                close_ex.style.display = 'none';
                edit_exp.style.display = 'block';
                error_ex.innerHTML = "";
            } else {
                error_ex.innerHTML = guideData.Message;
            }
        }).send(param_exp);
}
//信用卡过期时间
var exp_val = $("#ex_val");
var years = $("#years");
var error_ex = $("#error_ex");
var months = $("#months");
var close_ex = $("#close_ex");
var edit_exp = $("#edit_exp");
var year_num = "";
var month_num = "";
$("#cg_ex").on('click', function () {
    year_num = years.value;
    month_num = months.value;
    check_person_expriat();//过期时间验证
});
/*过期时间验证*/
function check_person_expriat() {
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var date = myDate.getDate(); //获取当前日(1-31)
    var montharray = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var yeararray = ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
    if (month < 10) {
        month = "0" + month;
    }
    var timestamp = year + "" + month + "" + date;
    //alert(timestamp);
    var yearNow = timestamp.substr(2, 2);
    var monthNow = timestamp.substr(4, 2);

    var exp_year = year_num.substr(year_num.length - 2);//截取下拉框所选取年份后两位
    if (month_num < 10) {
        month_num = "0" + month_num;//截取下拉框月份所选值，如果月份小于10月则在月份前面增加0
    }
    var valid = month_num + '' + exp_year;
    if (valid.length != 4) {
        $("#error_ex").innerHTML = "Expration date must be larger than current date.";
        return false;
    }
    var month = valid.substr(0, 2);
    var year = valid.substr(2, 2);
    var indexMonth = montharray.contains(month);
    var indexYear = yeararray.contains(year);

    if (!indexMonth) {
        $("#error_ex").innerHTML = "Expration date must be larger than current date.";
        return false;
    }
    if (!indexYear) {
        $("#error_ex").innerHTML = "Expration date must be larger than current date.";
        return false;
    }

    if (year < yearNow) {
        $("#error_ex").innerHTML = "Expration date must be larger than current date.";
        return false;
    }
    if (year == yearNow && month < monthNow) {
        $("#error_ex").innerHTML = "Expration date must be larger than current date.";
        return false;
    } else {
        set_ex_date(month_num, exp_year);//调用修改信用卡过期时间函数，传参年份及月份
        $("#error_ex").innerHTML = "";
    }
    return true;
}
//-------------------------------------获取已拥有头像列表----------------------------------------
function get_avatar_list() {
    var param_ava = {"version": Math.random()};
    //new Request('https://avatar.playwpt.com/WebAPI/UserAvatar/GetPersonalAvatarList',{mode:"jsonp"})
    new Request(baseUrls + 'AvatarApi/UserAvatar/GetPersonalAvatarList', {method: "GET"})
        .on('complete', function (e) {
            //var guideData = e.data;
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                var avatar_list = "";
                var ava_pic_list = "";
                var ava_val = guideData.Value;
                if (ava_val != null && ava_val != "") {
                    for (var i = 0; i < ava_val.length; i++) {
                        //获取小头像列表
                        if (guideData.Value[i].IsCurrentAvatar == true) {
                            avatar_list += '<li data-code="' + guideData.Value[i].AvatarCode + '" class="ava_active"><a href="javascript:void(0);"><img src="' + guideData.Value[i].SmallAvatarUrl + '"> </a> </li>';
                            ava_pic_list += '<li style="display: block;"><img src="' + guideData.Value[i].BigAvatarUrl + '"></li>';
                        } else {
                            avatar_list += '<li data-code="' + guideData.Value[i].AvatarCode + '"><a href="javascript:void(0);"><img src="' + guideData.Value[i].SmallAvatarUrl + '"> </a> </li>';
                            //获取小头像所对应大图像
                            ava_pic_list += '<li><img src="' + guideData.Value[i].BigAvatarUrl + '"></li>';
                        }
                    }
                }
                $("#ava_list").innerHTML = avatar_list;
                $("#ava_pic").innerHTML = ava_pic_list;
                show_avatar();
            } else {
                console.log(guideData.Message);
            }
        }).send(param_ava);
}
get_avatar_list();
//设置当前使用头像
var m_info = document.getElementById("m_info");
function setCurrentAva(ava_code) {
    var param_avaCode = {"version": Math.random(), 'avatarCode': ava_code};
    var curUrl = baseUrl + "UserAvatar/SetCurrentAvatar";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                $('#dialog').open();
                $("#show_title").innerHTML = '<div class="notice_title"></div>';
                $("#ben_vali").style.display = 'none';
                $("#btn_ok").style.display = 'block';
                m_info.innerHTML = guideData.Message;
            } else {
                $('#dialog').open();
                $("#show_title").innerHTML = '<div class="notice_title"></div>';
                $("#ben_vali").style.display = 'none';
                $("#btn_ok").style.display = 'block';
                m_info.innerHTML = guideData.Message;
            }
        }).send(param_avaCode);
}
function show_avatar() {
    var ava_list = $("#ava_list").findAll("li");
    var ava_pic = $("#ava_pic").findAll("li");
    for (var i = 0; i < ava_list.length; i++) {
        ava_list[i].on('click', function () {
            var ava_code = this.getData("code");//获取当前头像编码
            for (var y = 0; y < ava_pic.length; y++) {
                ava_pic[y].style.display = 'none';
                if (this == ava_list[y]) {
                    ava_pic[y].style.display = 'block';//显示当前大头像
                    $("#btn_curAvatar").off('click');//清除按钮绑定的事件
                    $("#btn_curAvatar").on('click', function () {
                        setCurrentAva(ava_code);//设置头像，传当前选中头像编码
                    });
                    ava_list[y].addClass('ava_active');
                } else {
                    ava_list[y].removeClass('ava_active');
                }
            }
        });
    }
}
//-------------------------------------获取已拥有幸运物----------------------------------------
function get_charms_list() {
    var param_ava = {"version": Math.random()};
    var curUrl = baseUrl + "UserInfo/GetCharmList";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                var charms_list = "";
                var cm_list = '9';//重新定义数组名称数字9
                var guideValue = JSON.parse(guideData.Value);//Value为字符串，将Value转换为对象
                if (guideValue[cm_list]) {//列表部位空时
                    for (var i = 0; i < guideValue[cm_list].length; i++) {
                        //var date_cm=new Date(guideValue[cm_list][i].validTime);//.format("MM.dd.yyyy")
                        var date_cm = parseDate(guideValue[cm_list][i].validTime);//.format("MM.dd.yyyy")
                        var ex_time_cm = date_cm.format("MM.dd.yyyy");//将 Date 转化为指定格式的String
                        if (guideValue[cm_list][i].selected == true) {//默认携带幸运物选中状态展示
                            charms_list += '<li style="position: relative;"><a href="javascript:void(0);" class="gift_pic gift_pic_hov" data-charms="' + guideValue[cm_list][i].itemId + '"><div class="tips"><p>' + ex_time_cm + '</p></div><img src="' + guideValue[cm_list][i].largeUrl + '"></a><p>' + guideValue[cm_list][i].name + '</p></li>';
                        } else {
                            charms_list += '<li style="position: relative;"><a href="javascript:void(0);" class="gift_pic" data-charms="' + guideValue[cm_list][i].itemId + '"><div class="tips"><p>' + ex_time_cm + '</p></div><img src="' + guideValue[cm_list][i].largeUrl + '"></a><p>' + guideValue[cm_list][i].name + '</p></li>';
                        }
                    }
                }
                $("#charms").innerHTML = charms_list;
                charmsList();
            } else {
                console.log(guideData.Message);
            }
        }).send(param_ava);
}
get_charms_list();
//-------------------------------------设置幸运物----------------------------------------
function setCurrentCharms(charm_code, state) {
    var param_charmsCode = {"version": Math.random(), 'itemID': charm_code, 'isSelect': state};
    var curUrl = baseUrl + "UserInfo/SelectCharm";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                $('#dialog').open();
                $("#show_title").innerHTML = '<div class="notice_title"></div>';
                $("#ben_vali").style.display = 'none';
                $("#btn_ok").style.display = 'block';
                m_info.innerHTML = guideData.Message;
            } else {
                $('#dialog').open();
                $("#show_title").innerHTML = '<div class="notice_title"></div>';
                $("#ben_vali").style.display = 'none';
                $("#btn_ok").style.display = 'block';
                m_info.innerHTML = guideData.Message;
            }
        }).send(param_charmsCode);
}
//-------charms------------
var charm_active = "";
function charmsList() {
    var charms = $("#charms").findAll(".gift_pic");
    var cm_tips = $("#charms").findAll(".tips");//找到所有tips
    for (var i = 0; i < charms.length; i++) {
        charms[i].on('click', function () {
            var charm_code = this.getData("charms");//获取当前礼物编码
            var state = "";
            if (this.hasClass('gift_pic_hov')) {
                state = "false";
            } else {
                state = "true";
            }
            for (var a = 0; a < charms.length; a++) {
                charms[a].removeClass('gift_pic_hov');
                //charm_active=this.id;
            }
            this.toggleClass('gift_pic_hov');
            if (state == "true") {
                this.addClass('gift_pic_hov');
            } else {
                this.removeClass('gift_pic_hov');
            }
            setCurrentCharms(charm_code, state);//调用setCurrentCharms
        });
        cm_tips[i].style.display = 'none';
        charms[i].on('mouseover', function () {//charms增加鼠标悬停出现过期时间tips效果
            for (var a = 0; a < charms.length; a++) {
                cm_tips[a].style.display = 'none';
                if (charms[a] == this) {
                    /*如果tips提示为空，则隐藏tips小弹窗*/
                    var tips_info = this.find(".tips p");//找到所有tips
                    if (tips_info.innerHTML == "" || tips_info.innerHTML == "null" || tips_info.innerHTML == null) {
                        cm_tips[a].style.display = 'none';
                    } else {
                        cm_tips[a].style.display = 'block';
                    }
                } else {
                    cm_tips[a].style.display = 'none';
                }
            }
        });
        charms[i].on('mouseout', function () {
            for (var a = 0; a < charms.length; a++) {
                cm_tips[a].style.display = 'none';
            }
        })
    }
}
//------------------------------------点击TICKETS选项卡加载门票列表----------------------------------------
$("#tab5").on('click', function () {
    get_ticket_list();
});
//-------------------------------------获取门票列表----------------------------------------
function parseDate(dateString) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z\s*$/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateString);
    if (parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);//设置年份月份及日
        date.setHours(parts[4], parts[5], parts[6]);//设置时分秒
        if (month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
}
function get_ticket_list() {
    var param_ticket = {"version": Math.random()};
    var curUrl = baseUrl + "UserInfo/GetTicketList";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                var ticket_list = "";
                var tk_list = '4';//重新定义数组名称数字4
                var guideValue = JSON.parse(guideData.Value);//Value为字符串，将Value转换为对象
                if (guideValue[tk_list]) {
                    for (var i = 0; i < guideValue[tk_list].length; i++) {
                        //var date=new Date(guideValue[tk_list][i].validTime);//.format("MM.dd.yyyy")
                        var date = parseDate(guideValue[tk_list][i].validTime);
                        //var time_zone=(new Date().getTimezoneOffset()/60)*(-1);//获取时区
                        //date.setHours(date.getHours()+time_zone);//将后台获取到时间增加 time_zone 个小时差 然后使用date.setHours() 设置小时
                        //date已经是local time
                        var month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];//建立月份英文简称数组
                        //var time=date.format("MM.dd.yyyy hh:mm:ss");//将 Date 转化为指定格式的String
                        var time = date.format("MM.dd.yyyy");//将 Date 转化为指定格式的String
                        var get_month = month_array[date.getMonth()];//获取数组中对应元素值
                        var jq_month = time.substring(0, 2);//获取字符串前两位
                        var want_time = time.replace(jq_month, get_month);//替换jq_month获取到得字符串前两位
                        //date.setMonth(month_array[date.getMonth()]);
                        //date.getMonth();
                        ticket_list += '<Li><a href="javascript:void (0)"><span class="ticket_name">' + guideValue[tk_list][i].name + '</span><span class="ticket_ex">' + guideValue[tk_list][i].number + '</span><span class="ticket_ex">' + want_time + '</span></a> </Li>';
                    }
                }
                $("#tk_list").innerHTML = ticket_list;
                //ticket();
            } else {
                console.log(guideData.Message);
            }
        }).send(param_ticket);
}

/*点击个人中心关闭按钮时 再次打开时将打开状态的详情弹窗关闭*/
function close_id_pop() {
    $("#dialog").close();
}
var close = window.parent.document.getElementById("close_pers");
if (close.addEventListener) {
    close.addEventListener("click", close_id_pop, false);
} else if (close.attachEvent) {
    close.attachEvent("onclick", close_id_pop);
}
//my tickets
/*function ticket(){
 var tk_list=$("#tk_list").findAll("li");
 for(var i=0; i<tk_list.length; i++){
 tk_list[i].on('click',function(){
 $("#open_tourney").open();
 tourney();
 });
 }
 }*/
/*function tourney(){
 var tour_list=$("#tour_list").findAll("a");
 for(var i=0;i<tour_list.length;i++){
 tour_list[i].on('click',function(){
 for(var t=0;t<tour_list.length;t++){
 tour_list[t].removeClass('active_tour');
 this.addClass('active_tour');
 }
 });
 }
 }*/

