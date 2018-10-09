/**
 * Created by liuhuan on 2017/1/3.
 */
var wpt = window.wpt || "";
require(["../../model/lobby-model.js"],function(lobby_model){
    /*避免应用界面内容被划选*/
    $("body").on('selectstart', function () {
        return false;
    });
    var urlParam = PLAY.url.getQuery();
    var nav_list = $(".nav_list");
    $(".nav_dropdown").hide();
    nav_list.click(function () {
        $(this).parent().find(".nav_dropdown").slideDown(300);
        $(this).parent().hover(function () {
        }, function () {
            $(this).parent().find(".nav_dropdown").slideUp(300);
        })
    });
    $(".login").click(function () {
       window.location.href = PLAY.baseAccountUrl + '#/login?direct'
    });
    $(".sign").click(function () {
       window.location.href = PLAY.baseAccountUrl + '#/signup?direct'
    });
    /*video css兼容*/
    function videoCss(videoLobby, bottom3, scale) {
        if ($(window).width() > 1920) {
            videoLobby.css({
                "bottom": bottom3 - 23,
                "transform": "scale(" + scale + ")",
                "right": parseFloat(14 * scale) + "%"
            });
        } else if ($(window).width() > 1650 && $(window).width() < 1920) {
            videoLobby.css({
                "bottom": bottom3 - 23,
                "transform": "scale(" + scale + ")",
                "right": parseFloat(11 * scale) + "%"
            });
        } else if ($(window).width() < 1400 && $(window).width() > 1150) {
            videoLobby.css({
                "bottom": bottom3 + 23,
                "transform": "scale(" + scale + ")"
            });
        } else if ($(window).width() < 1150) {
            videoLobby.css({
                "bottom": bottom3 + 23,
                "transform": "scale(" + scale + ")",
                "right": 0
            });
        }
    }
    /*video 定位*/
    function videoPosition(videoLobby) {
        var canTop = parseInt($("canvas").css("top"));
        var canHeight = $("canvas").height();
        var bottom = parseInt(parseFloat(canHeight / 1080) * 970) + canTop;
        bottom = $(window).height() - bottom;
        var height3 = parseInt(329 * parseFloat(canHeight / 1080));
        var scale = parseFloat(canHeight / 1080);
        var bottom3 = parseInt(bottom - parseInt((329 - height3) * scale)) + 47;
        videoLobby.css({
            "bottom": bottom3,
            "transform": "scale(" + scale + ")"
        });
        videoCss(videoLobby, bottom3, scale);
    }

    /*video 动画效果*/
    function video_animate() {
        var iframeVideo = $("#iframe_video");
        var videoBroadcast = $("#videoBroadcast");
        var videoLobby = $(".video_lobby");
        /*iframeVideo不存在 此判断无效*/
        if (iframeVideo.length) {
            iframeVideo.on("mouseover", function (e) {
                iframeVideo.stop().animate({width: 739, height: 417}, 500);
                videoLobby.stop().animate({width: 739, height: 417}, 500, function () {
                });
            });
            videoLobby.on("mouseout", function () {
                iframeVideo.stop().animate({width: 290, height: 200}, 500);
                videoLobby.stop().animate({width: 290, height: 200}, 500, function () {
                });
            });
        }
        /*id videoBroadcast 为视频自动生成*/
        if (videoBroadcast.length) {
            /*视频定位*/
            videoPosition(videoLobby);
            $(window).resize(function () {
                var canHeight = $("canvas").height();
                videoPosition(videoLobby);
                setTimeout(function () {
                    var canHeight2 = $("canvas").height();
                    var canTop2 = parseInt($("canvas").css("top"));
                    if (canHeight !== canHeight2) {
                        var scale = parseFloat(canHeight2 / 1080);
                        var bottom2 = parseInt(scale * 970) + canTop2;
                        bottom2 = $(window).height() - bottom2;
                        var height3 = parseInt(329 * scale);
                        var bottom3 = parseInt(bottom2 - parseInt((329 - height3) * scale)) + 47;
                        videoLobby.css({
                            "bottom": bottom3,
                            "transform": "scale(" + scale + ")",
                            "right": parseFloat(5 * scale) + "%"
                        });

                        videoCss(videoLobby, bottom3, scale);
                    }
                }, 1000)
            });
            videoLobby.css({"background-image": "url(" + PLAY.baseUrl + "wpt/www/module/lobby/images/vd_bg_03.png) no-repeat"});
            videoLobby.css('background-size', 'cover');
            videoLobby.on("mouseover", function (e) {
                $(".vjs-tech").css({
                    "top": "12%",
                    "width": "93%",
                    "right": "5%"
                });
                videoLobby.stop().animate({width: 687, height: 494}, 500, function () {
                    $(".vjs-control-bar").css({"width": "94%", "bottom": "11%"});
                });
            });
            videoLobby.on("mouseout", function () {
                $(".vjs-tech").css({
                    "top": "12%",
                    "height": "80%"
                });
                videoLobby.stop().animate({width: 458, height: 329}, 500, function () {
                    $(".vjs-control-bar").css({"width": "94%", "bottom": "10%"});
                });
            });
            $(".video_btn").on("click", function () {
/*                videoLobby.hide();
                var player = window.player || "";
                if (player) {
                    player.pause();
                }
                var wpt = window.wpt || "";
                if (wpt) {
                    wpt.play.js.close_videoCallback();
                }*/
                videoLobby.hide();
                $(".open_video").show(500);
                window.player.player_.muted(true);
            });
            $(".open_video").on("click", function () {
                videoLobby.show();
                $(".open_video").hide();
                window.player.player_.muted(false);
            })
        }
    }
    video_animate();
    var lobbyModel = avalon.define({
        $id: "gamehall",
        userName: "",
        loginMsg: "",
        rechargeUrl: "",//充值引导 广告url
        rechargeTitle: "",
        goodsCode: "",
        goldsName: "",
        goldsPrice: "",
        promotype: "",//promotionType 重置引导创建订单类型 1:输光带入金币不足，2：解锁牌桌，3：进牌桌金币不足，4：小游戏下一游戏金币不足
        getGoldNum: "",//获得免充金额

        init: function () {
            lobbyModel.loginMsg = "";
        },
        //获取登录信息
        getLoginUserInfo: function () {
            var userInfo = PLAY.userInfo;//res
            if (userInfo) {
                var guideData = userInfo.Value;
                if (userInfo.State === 1 && guideData && guideData.IsLogined == true) {
                    lobbyModel.email = guideData.Email;//获取用户email地址
                    lobbyModel.userName = (guideData.LzDisplayName || guideData.DefaultDisplayName) || " ";//获取用户lz昵称
                } else {
                }
            }
        },
        //---------------充值引导 2017-5-16----------------
        rechargeBoot: function (conditionId, buyinNum) {
            var param = {"version": Math.random(), "conditionid": conditionId, "buyinnum": buyinNum};
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "mallapi/mall/GetTriggerGoodsDetail",
                data: param,
                success: function (data, res) {
                    if (res.Value) {
                        lobbyModel.rechargeTitle = conditionId;//根据游戏数据判断重置类型样式显示
                        lobbyModel.goodsCode = res.Value.GoodsInfo.GoodsCode;
                        lobbyModel.goldsName = res.Value.GoodsInfo.Name;
                        lobbyModel.goldsPrice = res.Value.GoodsInfo.Price;
                        avalon.vmodels["gamehall"].show("show_rechargeBoot");//显示充值引导弹窗
                        /*1:输光带入金币不足，2：解锁牌桌，3：进牌桌金币不足，4：小游戏下一游戏金币不足*/
                        if (conditionId == 1) {//facebook像素统计输光带入金币不足
                            if (location.href.indexOf("facebook") !== -1) {
                                fbq('track', 'fb_charge_guide_loseall_view', {product_id: lobbyModel.goodsCode});
                            } else {
                                fbq('track', 'charge_guide_loseall_view', {product_id: lobbyModel.goodsCode});
                            }
                        } else if (conditionId == 2) {//facebook像素统计解锁牌桌
                            if (location.href.indexOf("facebook") !== -1) {
                                fbq('track', 'fb_charge_guide_unlock_view', {product_id: lobbyModel.goodsCode});
                            } else {
                                fbq('track', 'charge_guide_unlock_view', {product_id: lobbyModel.goodsCode});
                            }
                        } else if (conditionId == 3) {//facebook像素统计带入不足
                            if (location.href.indexOf("facebook") !== -1) {
                                fbq('track', 'fb_charge_guide_buyin_view', {product_id: lobbyModel.goodsCode});
                            } else {
                                fbq('track', 'charge_guide_buyin_view', {product_id: lobbyModel.goodsCode});
                            }
                        }
                    }
                },
                fail: function (data, res) {
                }
            });
            lobbyModel.promotype = conditionId;//游戏前端传来触发条件ID
        },
        //创建订单
        advert_recharge: function () {
            avalon.vmodels["store"].createSingleBuyOrder(lobbyModel.goodsCode, false, lobbyModel.promotype);
            avalon.vmodels["gamehall"].hidden("show_rechargeBoot");//创建订单后关闭充值引导窗口
        },
        pay_promotion: function () {
            avalon.vmodels["store"].createSingleBuyOrder('fb_promotion_code'); // goldcode:fb_promotion_code为fb 0美元促销
        },
        /*fb用户首次登陆注册选择完成头像后弹出获得免充提醒---playnow 按钮*/
        playNow: function () {
            lobbyModel.hidden("fbFirstLogin");
            try {
                if (wpt) {
                    wpt.play.js.playNow();
                }
            } catch (e) {
            }
        },
        /*充值引导弹出产品广告*/
        $recharge: {
            title: "",
            modal: true,
            width: "809px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
                avalon.vmodels["loginInfo"].getUserInfo();//支付成功后重新加载金币数量
                var goldNumber = avalon.vmodels["loginInfo"].goldCoin;
                try {
                    if (wpt) {
                        wpt.play.js.closeToBuyGold(goldNumber);
                    }
                } catch (e) {
                }
            }
        },
        /*fb用户首次登陆弹出获得免充提醒*/
        $fbFirstLogin: {
            title: "",
            modal: true,
            width: "809px",
            smallDialog: true,
            onOpen: function () {
                lobbyModel.getGoldNum = avalon.vmodels["loginInfo"].getGoldNum;
                if (urlParam && urlParam.step) {
                    if (urlParam.step == 11) {
                        location.hash = "guide";
                    }
                } else {
                    location.hash = "guide";
                }
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        },
        $notice: {
            title: "title_notice",
            showClose: true,
            modal: true,
            width: "530px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
                updateCoinStr();
                try {
                    if (wpt) {
                        wpt.play.js.close_shop(); //转盘券购买成功回调
                    }
                } catch (e) {
                }
            }
        },
        $onlineNotice: {
            title: "title_online_notice",
            showClose: true,
            modal: true,
            width: "1060px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {

            }
        },
        $fbPromot: {
            title: "title_fbPromot",
            showClose: true,
            modal: true,
            width: "1020px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {

            }
        },
        /*显示弹窗*/
        show: function (id) {
            avalon.vmodels[id].toggle = true;
        },
        /*隐藏弹窗*/
        hidden: function (id) {
            avalon.vmodels[id].toggle = false;
        }
    });
    lobbyModel.init();
    /*千分位*/
    function formatSCORE(num) {
        if (parseInt(num) == num) {
            return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        } else {
            return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }
    }

    //用户登录信息处理（登录前后状态）
    var loginInfo = avalon.define({
        $id: 'loginInfo',
        defaultName: "",
        goldCoin: "",
        rewards: "",
        rewardspoint: false,
        getGoldNum: "",
        userAvatar: "",
        loginBefore: true,
        loginAfter: false,
        showNav: true,
        showLogOut: true,
        settings: false,
        /*getFirstUserInfo*/
        getFirstUserInfo: function () {
            var getUserInfo = PLAY.userInfo;
            if (getUserInfo) {
                var guideData = PLAY.userInfo.Value;
                if (guideData && guideData.IsLogined === true) {
                    loginInfo.loginBefore = false;
                    loginInfo.loginAfter = true;
                    loginInfo.defaultName = (guideData.LzDisplayName || guideData.DefaultDisplayName) || " ";//获取用户lz昵称
                    loginInfo.goldCoin = formatSCORE(guideData.GoldCoin);//获取用户金币携带量
                    loginInfo.rewards = formatSCORE(guideData.MasterPoints);//获取用户大师分携带量
                    if (guideData.IsBindAvatar === true) {
                        loginInfo.userAvatar = guideData.AvatarSmlUrl;//获取用户当前头像
                    }
                    loginInfo.getGoldNum = guideData.ValidateEmailAward;//获取免充金额
                } else {
                    if (location.href.indexOf("poker") !== -1) {
                        window.location.href = PLAY.baseAccountUrl;
                    }
                    loginInfo.loginBefore = true;
                    loginInfo.loginAfter = false;
                }
            }
            /*隐藏按钮*/
            if (location.href.indexOf("facebook") !== -1) {
                loginInfo.showNav = false;//不使用网页头部
                loginInfo.showLogOut = false;
                loginInfo.rewardspoint = true;
            } else if (location.href.indexOf("poker") !== -1) {
                loginInfo.showNav = false;//不使用网页头部
                loginInfo.rewardspoint = true;
                loginInfo.settings = true;
            }
        },
        //获取登录信息   updateCoinStr(value:string)
        getUserInfo: function () {
            lobby_model.getLoginUserInfo({"version": Math.random()}, function (res) {
                avalon.scan();
                var guideData = res.Value;
                if (guideData) {
                    if (guideData && guideData.IsLogined == true) {
                        loginInfo.loginBefore = false;
                        loginInfo.loginAfter = true;
                        loginInfo.defaultName = (guideData.LzDisplayName || guideData.DefaultDisplayName) || " ";//获取用户lz昵称
                        loginInfo.goldCoin = formatSCORE(guideData.GoldCoin);//获取用户金币携带量
                        loginInfo.rewards = formatSCORE(guideData.MasterPoints);//获取用户大师分携带量
                        if (guideData.IsBindAvatar === true) {
                            loginInfo.userAvatar = guideData.AvatarSmlUrl;//获取用户当前头像
                        }
                        loginInfo.getGoldNum = guideData.ValidateEmailAward;//获取免充金额
                    } else {
                        loginInfo.loginBefore = true;
                        loginInfo.loginAfter = false;
                    }
                }
            }, function (res) {
            }, function (res) {
            })
        },
        //退出登录状态
        logOut: function () {
            if (window.localStorage) {
                var storage = window.localStorage;
                storage.removeItem("newH5");
            }
            lobby_model.webLogout({"version": Math.random()}, function (res) {
                window.location.href = PLAY.baseAccountUrl;
            }, function (res) {
            }, function (res) {
            })
        }
    });
    loginInfo.getFirstUserInfo();//获取首次加载登陆信息
});
