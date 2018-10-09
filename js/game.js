/**
 * Created by liuhuan on 2016/3/1.
 */
var baseUrl = "";
var staticUrl = "";
var baseAccountUrl = "";
var http_type = location.protocol + '//';
var baseUrls = http_type + location.host + '/';
var getHost = window.location.host.split('.');
if (location.href.indexOf('staging') !== -1) {
    baseUrl = http_type + "staging-napi." + getHost[1] + '.com/WebAPI/';
    staticUrl = http_type + "staging-static.play-wpt.com/";//poker及slots资源引用目录play-wpt
    baseAccountUrl = http_type + "staging-accounts." + getHost[1] + ".com/";
} else {
    baseUrl = http_type + "napi." + getHost[1] + '.com/WebAPI/';
    staticUrl = http_type + "static.play-wpt.com/";//poker及slots资源引用目录play-wpt
    baseAccountUrl = http_type + "accounts." + getHost[1] + ".com/";
}
document.domain = getHost[1] + ".com";
var gamesUrl = http_type + "static.play-wpt.com/";//poker及slots资源引用目录play-wpt
var leaderBoardUrl = http_type + "webapps." + getHost[1] + ".com/";
var btn_retry = $("#btn_retry");
//打开弹窗
function open_shop(element, panel_shop) {
    var get_panel = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("panel_shop");
    get_panel.activate(panel_shop);
    document.getElementById(element).open();
    /*点击GO TO PERSONAL打开个人中心头像页面*/
    var ps_center = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("open_ps_center");//Go To Personal Center按钮
    var pop_avatar = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("show_pay_info");//show_pay_charms提示弹窗
    var pop_master = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("open_flv_master");//show_pay_charms提示弹窗
    ps_center.onclick = function () {
        try {
            document.getElementById("gameSwf").close_shop();//close_shop方法回调
        } catch (e) {
        }
        $("#poker").close();//关闭小商城
        pop_avatar.close();//关闭提示窗
        open_personal('personal', 2);
    };
    /*点击GO TO PERSONAL打开个人中心幸运物页面*/
    var ps_charms = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("open_ps_charm");//Go To Personal Center按钮
    var pop_charms = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("show_pay_charms");//show_pay_charms提示弹窗
    ps_charms.onclick = function () {
        $("#poker").close();//关闭小商城
        pop_charms.close();//关闭提示窗
        open_personal('personal', 3);
        try {
            document.getElementById("gameSwf").close_shop();//close_shop方法回调
        } catch (e) {
        }
    };
    /*点击 打开大师分flash弹窗*/
    var open_dsf = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("flv_master");//How to get more WPT reward points?按钮
    open_dsf.onclick = function () {
        try {
            document.getElementById("gameSwf").open_master();//open_dsf打开大师分flash弹窗
        } catch (e) {
        }
        $("#poker").close();//关闭小商城
        pop_master.close();//关闭大师分提示窗
    };
// poker小商城 点击“关闭按钮”，回调close_shop函数。
    $("#close").off('click');
    $("#close").on('click', function () {
        //$("#frame_shop").src='';
        try {
            document.getElementById("gameSwf").close_shop();
        } catch (e) {
        }
    });
}
//打开个人中心弹窗
function open_personal(element, panel_personal) {
    window.frames[1].get_avatar_list();//打开个人中心时重新调用获取头像函数
    window.frames[1].get_charms_list();//打开个人中心时重新调用获取礼物函数
    window.frames[1].get_pwd_time();//获取最后修改密码的时间
    /*点击获取头像按钮打开个商城购买头像选项卡*/
    var ava_center = document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("btn_getAva");
    ava_center.onclick = function () {
        $("#personal").close();//关闭小商城
        open_shop('poker', 1);//打开小商城的avatar选项卡
    };
    /*点击获取幸运物按钮打开个商城购买幸运物选项卡*/
    var charm_center = document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("btn_gift");
    charm_center.onclick = function () {
        $("#personal").close();//关闭小商城
        open_shop('poker', 2);//打开小商城的charms选项卡
    };
// poker个人中心 更换头像后，回调updateHead函数。
    var btn_curAvatar = document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("btn_ok");
    btn_curAvatar.on('click', function () {
        try {
            document.getElementById("gameSwf").updateHead();
        } catch (e) {
        }
    });
    document.getElementById(element).open();
    var get_panel = document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("panel_personal");
    get_panel.activate(panel_personal);
}
/*打开支付页面*/
function open_pay_web(pay_url) {
    $("#frame_pay").src = pay_url + '&' + "version=" + Math.random();//定义框架url地址
    $("#loading").open();
    setTimeout(function () {
            $("#payment").open();
            $("#loading").close();
        },
        3000);//打开payment
}
/*支付完成后点击ok按钮关闭支付系统弹窗*/
var frame_pay = $("#frame_pay");
if (frame_pay) {
    frame_pay.onload = function () {
        var close_pay_flash = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("qd_ok");
        var btn_retry = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("btn_retry");
        var pay_option = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("pay_option");
        var billing_info = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("billing_info");
        var complete = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("complete");
        var complet_order = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("complet_order");
        var pay_cancle = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("btn_cancle");
        close_pay_flash.on('click', function () {
            $("#payment").close();
            try {
                document.getElementById("gameSwf").pay_success();
            } catch (e) {
            }
        });
        pay_cancle.on('click', function () {
            try {
                document.getElementById("gameSwf").close_pay();
            } catch (e) {
            }
        });
        //点击retry关闭支付页面，打开商城页面
        btn_retry.on('click', function () {
            //$("#payment").close();
            complete.close();//关闭retry弹窗
            pay_option.style.display = 'block';//点击retry按钮，打开Payment options选项卡
            billing_info.style.display = 'none';
            complet_order.style.display = 'none';
            //open_shop('poker',0);
        })
    };
}
// 关闭payment支付系统，回调close_pay函数。
$("#close_pay").off('click');
$("#close_pay").on('click', function () {
    var payment_slot = $("#payment_slot");
    try {
        var complete = document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("complete");
        if (complete.isOpen == true) {
            document.getElementById("gameSwf").pay_success();//弹窗id存在，支付成功的状态下点击支付的关闭X 回调pay_success
        } else {
            document.getElementById("gameSwf").close_pay();//点击支付的关闭X poker回调
        }
    } catch (e) {
    }
    if (payment_slot) {//slot点击关闭 需要做的处理
        if (payment_slot.isOpen == true) {
            try {
                document.getElementById("gameSwf_slot").close_slot_shop();//点击支付的关闭X slot回调
            } catch (e) {
            }
        }
    }
});
/*打开排行榜*/
function open_leaderboard() {
    $("#leaderboard").open();
    //$("#frame_lb").src = leaderBoardUrl + 'PokerLeaderboard/leaderboard.html';
    $("#frame_lb").src =baseUrls + 'leaderboard/leaderboard.html';
}
//关闭弹窗
function close_shop(element) {
    document.getElementById(element).close();
}
// slot小商城点击“关闭按钮”，回调close_shop函数。
var close_slot = $("#close_slot");
if (close_slot) {
    close_slot.off('click');
    close_slot.on('click', function () {
        try {
            document.getElementById("gameSwf_slot").close_slot_shop();
        } catch (e) {
        }
    });
}
function get_userinfo() {
    var parametes = {"version": Math.random()};
    var curUrl = baseUrl + "Passport/GetLoginUserInfo";
    new Request(curUrl, {method: "GET"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                if (guideData.Value.IsLogined == true) {//判断是否已登录
                    $("#u_nm").innerHTML = (guideData.Value.LzDisplayName || guideData.Value.DefaultDisplayName || localStorage.getItem('emial_user') || " ");
                }
            }
        }).send(parametes)
}
get_userinfo();
//------------------------------------------------------退出登录状态-------------------------------------------------
function logout() {
    if (window.localStorage) {
        var storage = window.localStorage;
        storage.removeItem("newH5");
    }
    var param_logout = {"version": Math.random()};
    var curUrl = baseUrl + "Login/WebLogout";
    new Request(curUrl, {method: "GET"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                window.location.href = baseAccountUrl;
            }
        }).send(param_logout);
}
$("#log_out_gm").on('click', function () {
    logout();
});
/*flash检测*/
var playerVersion = swfobject.getFlashPlayerVersion();
var majorVersion = playerVersion.major;
if (majorVersion > 0) {
} else {
    //alert("Flash player plugin is required for PlayWPT games.");
    /* 发送日志信息*/
    function sendWriteLog() {
        var parametes = {"logMsg": ""};
        parametes.logMsg = "Flash player plugin is required for PlayWPT games.";
        var curUrl = baseUrl + "Utility/WriteLog";
        new Request(curUrl, {method: "POST"})
            .on('complete', function (e) {
            }).send(parametes);
    }

    sendWriteLog();
}
function game_poker() {
    var parametes = {};
    var curUrl = baseUrl + "PlayGame/GetFlashVars_Poker";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                $("#dialog_flv").close();
                var _flashVarsssss = guideData.Value;
                openFlash(_flashVarsssss);
            } else {
                $("#dialog_flv").open();
                $("#flv_info").innerHTML = guideData.Message;
            }

        }).send(parametes);
}
if (btn_retry) {
    btn_retry.on('click', function () {
        game_poker();
    });
}
function game_slot() {
    var parametes = {};
    var curUrl = baseUrl + "PlayGame/GetFlashVars_Slot";
    new Request(curUrl, {method: "POST"})
        //new Request('http://www.playwpt.com/WebAPI/PlayGame/GetFlashVars_Slot', { method: "POST" })
        .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
                var _flashVarsssss = guideData.Value;
                openFlash_slot(_flashVarsssss);
            } else {
                alert(guideData.Message);
                //window.location.href =baseUrls+"game-flash.html";
                window.location.href = baseUrls;
            }
        }).send(parametes);
}

// =======加载游戏 Flash=======
var isOpen = false;
var isOpen_slot = false;
function openFlash(_flashVars) {
    if (!isOpen) {
        var flashvars = {};
        var params = {};
        params.quality = 'high';
        params.wmode = 'Opaque';
        params.menu = 'false';
        params.id = 'Template';
        params.allowScriptAccess = 'always';
        params.allowFullScreen = 'true';
        params.name = 'Template';
        params.base = '.';
        params.FlashVars = _flashVars;
        var attributes = {};
        //swfobject.embedSWF('http://static.playwpt.com/poker/client/Common.swf?dt=' + (new Date()).valueOf(), 'gameSwf', '100%', '100%', '7', '', flashvars, params, attributes);
        swfobject.embedSWF(staticUrl + 'poker/client/Common.swf?dt=' + (new Date()).valueOf(), 'gameSwf', '100%', '100%', '7', '', flashvars, params, attributes);
        isOpen = true;
    }
}
// =======加载游戏 Flash=======
function openFlash_slot(_flashVars) {
    if (!isOpen_slot) {
        var flashvars = {};
        var params = {};
        params.quality = 'high';
        params.wmode = 'Opaque';
        params.menu = 'false';
        params.id = 'Template';
        params.allowScriptAccess = 'always';
        params.allowFullScreen = 'true';
        params.name = 'Template';
        params.base = '.';
        params.FlashVars = _flashVars;
        var attributes = {};
        swfobject.embedSWF(staticUrl + 'timeslot/client/SlotStart.swf?dt=' + (new Date()).valueOf(), 'gameSwf_slot', '100%', '100%', '7', '', flashvars, params, attributes);
        isOpen_slot = true;
    }

}
//---------------------------------------------------验证邮件----------------------------------------------
function validateGame() {
    var param_vali = {"version": Math.random()};
    var curUrl = baseUrl + "Passport/ToValidateEmail";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
            var valData = JSON.parse(e.text);
            if (valData.State == 1) {
            } else {
                console.log(valData.Message);
            }
        }).send(param_vali);

}
/*2017-5-22 统计h5及flash游戏用户占比 ver 0:flash 1:h5*/
function statistics_hfive() {
    var param_s = {"version": Math.random(), 'ver': 1};
    var curUrl = baseUrl + "Utility/StatisticsUserVersion";
    new Request(curUrl, {method: "GET"})
        .on('complete', function (e) {
            var valData = JSON.parse(e.text);
            if (valData.State == 1) {
            }
        }).send(param_s);
}
var newLobby = $("#newLobby");
if (newLobby) {
    newLobby.on('click', function () {
        statistics_hfive();//点击new html5按钮统计h5
    })
}
