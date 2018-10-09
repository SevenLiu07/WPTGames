/**
 * Created by liuhuan on 2017/1/10.
 */
/*大厅交互处理*/
var sourceUrl = "";//转盘全局变量
var wpt = window.wpt || "";
var videoUrl = "";
var stagingVideoUrl = "";
var userId = "";
var accessToken = "";
var videoUrlLobby = "";
var videoUrlGame = "";
var getFirstVideoUrl = true;
var checkGameStatus = true;
var pokerModle = avalon.define({
    showTimedPromotion: function (time) {
        avalon.vmodels["promotion"].promoLimitedTimeGoodsList(time);
    },
    enterKeyEvent: function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            if (avalon.vmodels['show_login'].toggle == true) {
                avalon.vmodels['login'].userLogin();
                return false;
            } else if (avalon.vmodels['show_register'].toggle == true) {
                avalon.vmodels['register'].webRegister();
                return false;
            }
        }
    },
    /*显示弹窗*/
    show: function (id, subsetTabs, tabs, ticketParam) {
        avalon.scan();
        if (id == "show_store") {
            avalon.vmodels["store"].showShopDialog(id, subsetTabs, tabs, ticketParam);
        } else if (id == "show_login") {
            window.location.href = PLAY.baseAccountUrl;
        } else if (id === "show_inventory") {
            avalon.vmodels["inventory"].show(id, subsetTabs);
        } else if (id === "show_leaderboard") {
            avalon.vmodels["leaderboard"].show(id);
        } else if (id === "show_goldStore") {
            avalon.vmodels["goldStore"].show(id);
        } else {
            avalon.vmodels[id].toggle = true;
        }
    },
    /*登陆注册弹窗切换*/
    loginRegistToggle: function (open_id, close_id, gameName) {
        var showWidgetId = "show_" + open_id;
        var hideWidgetId = "show_" + close_id;
        if (open_id === "login") {
            avalon.vmodels[close_id].hide(hideWidgetId);
        } else if (open_id === "register") {
            avalon.vmodels[close_id].hidden(hideWidgetId);
        }
        avalon.vmodels[open_id].show(showWidgetId, gameName);
    },
    /*update coin number*/
    updateCoinStr: function (str) {
        if (str) {
            //avalon.vmodels["loginInfo"].goldCoin = str;
        } else {
            avalon.vmodels["store"].updateCoinStr();
        }
    },
    /*update rewards*/
    updateRewards: function (str) {
        if (str) {
            avalon.vmodels["loginInfo"].rewards = str;
        }
    },
    /*判断转盘支付方式：0:facebook支付系统 1：web端支付系统*/
    paymentStyle: function () {
        var getUrl = window.location.href;
        if (getUrl.indexOf("facebook") != -1) {
            sourceUrl = 0;
            /*0:facebook支付系统*/
        } else if (getUrl.indexOf("facebook") === -1 && window.top !== window.self) {
            sourceUrl = 2;
            /*2：legendshill支付系统*/
        } else {
            sourceUrl = 1;
            /*1：web端支付系统*/
        }
        return sourceUrl;
    },
    /*open payment*/
    openPayWeb: function (pay_url) {
        //var payUrl="https://pay.playwpt.com/Payment/PaymentIndex?paymsgid=1864&timestamp=1485073160&md5sign=3CEFEF64343F30F667620652D19960B8";
        if (sourceUrl != null || sourceUrl != "") {
            if (sourceUrl == 0) {
                var url_split = pay_url.split("=");//字符串切割为["https://shop.playwpt.com/webapi/page/Home/SpinProductDesc?payID", "32位订单号"]
                var pay_id = url_split[1];//取url_split[1]
                var orderinfo = {
                    "url": pay_url,
                    "pid": pay_id
                };
                var luckySpinParam = {
                    "version": Math.random(),
                    "gameId": 25011,
                    "spinOrderCode": pay_id
                };
                /*pokerModle.FacebookCreditsOrder(orderinfo,2);//调用父页面FacebookCreditsOrder方法*/
                /*转盘支付修改*/
                PLAY.ajax.Post({
                    url: PLAY.webApiUrl + "MallApi/Mall/LuckySpinCreateOrder",
                    data: luckySpinParam,
                    success: function (data, res) {
                        pokerModle.FacebookCreditsOrder(orderinfo, 2);//调用父页面FacebookCreditsOrder方法
                    },
                    fail: function (data, res) {
                        avalon.vmodels["gamehall"].show("public_notice");
                        avalon.vmodels["gamehall"].loginMsg = 'Payment failed. No charges were made. Please try again later.';
                    },
                    error: function (data, res) {
                        avalon.vmodels["gamehall"].show("public_notice");
                        avalon.vmodels["gamehall"].loginMsg = 'Payment failed. No charges were made. Please try again later. ';
                    }
                });
            } else {
                var getparam = pay_url.split("&");
                var PayMsgID = getparam[0].substring(getparam[0].indexOf("=") + 1);
                var TimeStamp = getparam[1].substring(getparam[1].indexOf("=") + 1);
                var MD5Sign = getparam[2].substring(getparam[2].indexOf("=") + 1);
                var quantity = 1;
                if (pay_url.indexOf("quantity") != -1) {
                    quantity = getparam[4].substring(getparam[4].indexOf("=") + 1);
                }
                var payParam = {
                    "pay_game": 'game',
                    "quantity": quantity,
                    "paymsgid": PayMsgID,
                    "timestamp": TimeStamp,
                    "md5sign": MD5Sign
                };
                if (payParam) {
                    avalon.vmodels["payment"].show('show_payment', payParam);
                }
            }
        }
    },
    /*创建订单 小商城打开fb支付参数pay_info：1*/
    FacebookCreditsOrder: function (order_info, pay_info, goods_nm, quantity, goldscode) {
        var GoodsName = goods_nm;//获取小商城存储的商品名称
        var getQuantity = quantity;//获取购买数量
        var obj = {};
        // goldscode == "fb_promotion_code" fb 0美元促销
        if (goldscode == "fb_promotion_code") {
            obj = {
                method: 'payer_promotion',
                action: 'payer_promotion',
                product: order_info.url,
                request_id: order_info.pid
                //quantity: 1
            };
        } else {
            obj = {
                method: 'pay',
                action: 'purchaseitem',
                product: order_info.url,
                request_id: order_info.pid
            };
        }
        FB.ui(obj, function (data) {
            if (data) {
                var parameter = {
                    "amount": data.amount,
                    "currency": data.currency,
                    "payment_id": data.payment_id,
                    "quantity": data.quantity,
                    "request_id": data.request_id,
                    "signed_request": data.signed_request,
                    "status": data.status
                };
                if (data.status == 'completed') {
                    PLAY.ajax.Get({
                        url: PLAY.webApiUrl + "mallapi/page/Home/FacebookCallBackHandler",
                        data: data,
                        dataType: "jsonp",
                        crossDomain: true,
                        success: function (data, res) {
                            try {
                                if (wpt) {
                                    wpt.play.js.pay_success();
                                }
                            } catch (e) {
                            }
                            /*支付成功提示信息弹窗 小商城打开fb支付参数pay_info：1*/
                            if (pay_info == 1) {
                                avalon.vmodels["gamehall"].show("public_notice");
                                avalon.vmodels["gamehall"].loginMsg = 'You have successfully purchased ' + GoodsName + ' x ' + getQuantity + '. Good luck! ';
                            }
                            fbq('track', 'fb_order_confirm_success');//facebook像素统计 facebook purchase success
                        },
                        fail: function (data, res) {
                            try {
                                if (wpt) {
                                    wpt.play.js.close_pay();
                                }
                            } catch (e) {
                            }
                            fbq('track', 'fb_order_confirm_fail', {error: res.Message});//facebook像素统计facebook purchase fail及失败原因
                        },
                        error: function (textStatus, res) {
                            try {
                                if (wpt) {
                                    wpt.play.js.close_pay();
                                }
                            } catch (e) {
                            }
                            fbq('track', 'fb_order_confirm_fail', {error: res.Message});//facebook像素统计facebook purchase fail及失败原因
                        }
                    });
                } else {
                    try {
                        if (wpt) {
                            wpt.play.js.close_pay();
                        }
                    } catch (e) {
                    }
                }
            }
        });
    },
    setGameVersion: function (version, param2) {
        var data = {
            "version": version
        };
        PLAY.ajax.Post({
            url: PLAY.webApiUrl + "webapi/Utility/SetGameVersion",
            data: data,
            success: function (data, res) {
                if (param2 === "fb") {
                    location.href = PLAY.baseUrl + "facebook/game_poker.html";
                } else {
                    location.href = PLAY.baseUrl + "game.html";
                }
            },
            fail: function (data, res) {
            },
            error: function (textStatus, res) {
            }
        });
    },
    validateEmail: function () {
        var paramCommon = {"version": Math.random(), 'isH5': true};
        PLAY.ajax.Post({
            url: PLAY.webApiUrl + "WebAPI/Passport/ToValidateEmail",
            data: paramCommon,
            success: function (data, res) {
            },
            fail: function (data, res) {
            },
            error: function (data, res) {
            }
        });
    },
    /*获取视频url type：0-大厅  type：1-牌桌内*/
    getVideoUrl: function (type) {
        var param = {"version": Math.random(), type: type};
        PLAY.ajax.Get({
            url: PLAY.webApiUrl + "PromoApi/Utility/GetVideo",
            data: param,
            success: function (data, res) {
                var guideData = res.Value;
                videoUrl = guideData.Video_Url;
                if (type === 0) {
                    videoUrlLobby =  guideData.Video_Url; //获取大厅video url
                } else if (type === 1) {
                    videoUrlGame =  guideData.Video_Url; //获取牌桌video url
                }
                if (getFirstVideoUrl) {
                    checkGame(checkGameStatus);
                    getFirstVideoUrl = false;
                } else {
                    return;
                }
            },
            fail: function (data, res) {
            },
            error: function (data, res) {
            }
        });
    }
});
function getVideoUrl (type) {
    pokerModle.getVideoUrl(type);
}
function showDialog(id, subsetTabs, tabs, ticketParam) {
    pokerModle.show(id, subsetTabs, tabs, ticketParam);//打开弹窗方法
    /*facebook像素统计打开登录注册弹窗*/
    if (id === "show_login") {
        fbq('track', 'index_login_click');
        ga('send', 'event', 'index', 'login_click');
    } else if (id === "show_register") {
        fbq('track', 'index_signup_click');
        ga('send', 'event', 'index', 'signup_click');
    }
}

function showGoldStore() {
    avalon.scan();
    avalon.vmodels["goldStore"].showGoldStore();
}
/*登陆注册弹出窗切换*/
function logRegToggle(open_id, close_id, gameName) {
    pokerModle.loginRegistToggle(open_id, close_id, gameName);
    /*facebook像素统计切换登录注册窗口*/
    if (open_id === "register") {
        fbq('track', 'login_signup_click');
        ga('send', 'event', 'login', 'signup_click');
    } else if (open_id === "login") {
        fbq('track', 'signup_login_click');
        ga('send', 'event', 'signup', 'login_click');
    }
}
/* update coin number*/
function updateCoinStr(str) {
    pokerModle.updateCoinStr(str);
}
/* update master point*/
function updateRewards(str) {
    pokerModle.updateRewards(str);
}
/*open payment*/
function openPay(pay_url) {
    pokerModle.openPayWeb(pay_url);
}
/*游戏大厅中订单方法*/
function creatOrder (goodsCode, quantity) {
    avalon.vmodels["store"].createBatchBuyOrder(goodsCode, quantity);
}
/*validateEmail*/
function validateEmail() {
    pokerModle.validateEmail();
}
/*setGameVersion*/
function setGameVersion() {
    if (document.getElementById("oldLobby")) {
        document.getElementById("oldLobby").addEventListener("click", function () {
            pokerModle.setGameVersion(2);
        });
    }
}
/*showTimedPromotion*/
function showTimedPromotion(time) {
    pokerModle.showTimedPromotion(time);
}
/*2017-5-22 统计h5及flash游戏用户占比 ver 0:flash 1:h5*/
function statistics() {
    var param = {'version': Math.random(), 'ver': 0};
    PLAY.ajax.Get({
        url: PLAY.webApiUrl + "WebAPI/Utility/StatisticsUserVersion",
        data: param,
        success: function (data, res) {
        }
    });
}
/*setGameVersion();*/
/*是否在牌桌游戏内*/
function checkGame(param) {
    checkGameStatus = param;
    if (param == true) {
        //当前是show状态
        if (window.top !== window.self) {
            if (location.href.indexOf("facebook") === -1) {
                $(".video_lobby").hide();//affiliate iframe内-隐藏视频
            } else {
                $(".video_lobby").show();
            }
        } else {
            $(".video_lobby").show();
        }
        $(".lobby_bg").addClass("games_bgs");
        if (videoUrlGame) {
            changeVideoSrc(videoUrlGame);
        }
    } else {
        var video_lobby = $(".video_lobby");
        //大厅增加lobby背景图片
        $(".lobby_bg").addClass("lobby_bg").removeClass("games_bgs");
        if (video_lobby) {
            video_lobby.hide();//不在牌桌内-隐藏视频
        }
        if (videoUrlLobby) {
            changeVideoSrc(videoUrlLobby);
        }
    }
}
/*1:普通用户验证成功邮件后提示获得25k金币成功窗口---大厅加载成功后在弹出 param: true--游戏加载完毕
* 2:大厅加载完成后再弹出获得福利窗口*/
function showGoldBonus(param) {
    if (avalon.vmodels["register"]) {
       avalon.vmodels["register"].goldBouns(param);
    }
    if (avalon.vmodels["promotion"]) {
       avalon.vmodels["promotion"].getPromotStatus(param);
    }
}
/*检测是否是tourmode*/
function isTourMode(param) {
    var homepage = document.getElementById("homepage");
    if (param === true) {
        if (homepage) {
            homepage.style.display = "none";
        }
    }
}
/*打开 video*/
function openVideo() {
    if ($(".video_lobby").length) {
        $(".video_lobby").show();
        //当前是show状态
        pokerModle.getVideoUrl();
    }
}
/*关闭 video*/
function closeVideo() {
    if ($(".video_lobby").length) {
        $(".video_lobby").hide();
        var player = window.player || "";
        if (player) {
            player.pause();
        }
    }
    if ($("#iframe_video").length) {
        $("#iframe_video").attr("src", "about:blank");//关闭视频时-清空视频url
    }
}
/*打开tournaments*/
function openTourney() {
    try {
        if (wpt) {
            wpt.play.js.req_func(1);
        }
    } catch (e) {
    }
}
/*打开tourmode*/
function tourMode() {
    try {
        if (wpt) {
            wpt.play.js.req_func(4);
        }
    } catch (e) {
    }
}
/*打开大师分*/
function openRewards() {
    try {
        if (wpt) {
            wpt.play.js.req_func(2);
        }
    } catch (e) {
    }
}
/*打开声音设置*/
function openSettings() {
    try {
        if (wpt) {
            wpt.play.js.req_func(3);
        }
    } catch (e) {
    }
}
/*处理回车事件*/
document.onkeydown = function (e) {
    pokerModle.enterKeyEvent(e);
};
/*facebook内嵌游戏处理*/
if (location.href.indexOf("facebook") !== -1) {
    var appid = "";
    if (location.href.indexOf('staging') !== -1) {
        appid = '303740520120867'; //仿真app_id321384088321148
    } else {
        appid = '122212108221118'; //线上app_id 内网：370652456705003
    }
    //FB sdk
    window.fbAsyncInit = function () {
        FB.init({
            appId: appid,
            xfbml: true,
            version: 'v2.7'
        });
        FB.getLoginStatus(function (response) {
            if (response.status == 'connected') {
                //avalon.vmodels["loginInfo"].getUserInfo();//更新顶部导航状态
                //获取uid及token
                userId = response.authResponse.userID;
                accessToken = response.authResponse.accessToken;
            } else {
                FB.login(function (response) {
                }, {scope: 'user_friends, email'});
            }
        });
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    //付费推广对话框
    payerPromotion = function () {
        var data = {
            "version": Math.random()
        };
        PLAY.ajax.Get({
            url: "https://graph.facebook.com/"+userId+"?fields=is_eligible_promo&access_token="+accessToken,
            data: data,
            dataType: "jsonp",
            crossDomain: true,
            success: function (data, res) {
                //值1表示玩家有资格 如果玩家没有资格则为0 支付测试人员的值总是返回1
                if(res.is_eligible_promo == 1){
                    //打开自定义弹窗
                    avalon.vmodels["gamehall"].show("fb_promotion");//显示0美元弹窗
                    console.log("有0美元促销")
                } else {
                    console.log("没有0美元促销")
                }
            },
            fail: function (data, res) {
            },
            error: function (data, res) {
            }
        });
    }
}
/*facebook创建订单方法*/
function fbCreditsOrder(order_info, pay_info, goods_nm, quantity, goodscode) {
    pokerModle.FacebookCreditsOrder(order_info, pay_info, goods_nm, quantity, goodscode);
}
/*判断打开支付类型facebook||web*/
function stylePay() {
    pokerModle.paymentStyle();
    return pokerModle.paymentStyle();
}
/*Facebook Pixel像素统计方法 游戏牌桌用*/
function fbPixel(lable, category) {
    if (location.href.indexOf("facebook") !== -1) {
        fbq('track', 'fb' + lable);
        ga('send', 'event', 'fb' + category, lable);
    } else {
        fbq('track', lable);
        ga('send', 'event', category, lable);
    }
}
/*充值引导 游戏牌桌用*/
function showRecharge(conditionId, buyinNum) {
    avalon.vmodels["gamehall"].rechargeBoot(conditionId, buyinNum);
}
/*facebook内嵌游戏：首次登陆注册不自动弹出商城窗口*/
function isFBFirstLogin() {
    var fbFirstLogin = false;
    if (avalon.vmodels["register"]) {
        fbFirstLogin = avalon.vmodels["register"].isfbFLogin;
    }
    if (location.href.indexOf("t=redeem") !== -1) {
        fbFirstLogin = true;//领取福利不弹出促销及商城
    }
    return fbFirstLogin;
}
/*logout*/
function logOut() {
    avalon.vmodels["loginInfo"].logOut();
}
/*提供给游戏调用接口*/
function HTTP_GET(url, props, data, sucCallback, failCallback, errorCallback) {
    PLAY.ajax.Get({
        url: url,
        data: data,
        dataType: "json",
        xhrFields: {
            withCredentials: props.xhrFields.withCredentials || false
        },
        crossDomain: props.crossDomain || false,
        success: function (data, res) {
            if (res) {
                res._url = url;
                sucCallback && sucCallback(res);
            }
        },
        fail: function (data, res) {
            if (res) {
                res._url = url;
                failCallback && failCallback(res);
            }
        },
        error: function (textStatus, res) {
            res._url = url;
            errorCallback && errorCallback(textStatus, res);
        }
    });
}
function HTTP_POST(url, props, data, sucCallback, failCallback, errorCallback) {
    PLAY.ajax.Post({
        url: url,
        data: data,
        dataType: "json",
        xhrFields: {
            withCredentials: props.xhrFields.withCredentials || false
        },
        crossDomain: props.crossDomain || false,
        success: function (data, res) {
            if (res) {
                res._url = url;
                sucCallback && sucCallback(res);
            }
        },
        fail: function (data, res) {
            if (res) {
                res._url = url;
                failCallback && failCallback(res);
            }
        },
        error: function (textStatus, res) {
            res._url = url;
            errorCallback && errorCallback(textStatus, res);
        }
    });
}
