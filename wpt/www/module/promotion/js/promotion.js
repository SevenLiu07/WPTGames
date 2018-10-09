/**
 * Created by liuhuan on 2017/6/12.
 */
require(["../../model/promotion-model-ec1848e4bd"], function (payModel) {
    var promotionModel = avalon.define("promotion", function (vm) {
        /* 初始化信息 */
        vm.messageOtherInfo = false;
        vm.message = "";
        vm.GoldData = [];
        vm.TicketData = [];
        vm.AwardaData = [];
        vm.ticket = "";
        vm.awards = "";
        /*头像信息*/
        vm.baseData = ["submit_btn", "promotion"];
        vm.paramCommon = {"version": Math.random()};
        vm.goodsCode = "";
        /*您已购买过该促销商品,不能再次购买*/
        vm.timedPromotionMsg = "";
        vm.timedPromotionBtn = "";
        vm.showTimedPromotionPrice = true;
        vm.timedPromotionPrice = "";
        vm.upGame = false;
        vm.oneDaySale = false;
        vm.showTimedPromotionBtn = true;
        vm.buyPicHref = "";
        vm.dOrder = "";
        vm.hideBuyPicHref = false;
        vm.noTimedPromotionMsg = false;
        vm.countHour = "00";
        vm.countMin = "00";
        vm.showTime = false;
        vm.endDate = "";
        vm.currentTime = "";
        vm.getDomain = location.host.split('.')[1]+ '.' +location.host.split('.')[2];
        /*通过连接领取福利，判断用户账号体系状态 (登录并通过邮箱验证)*/
        vm.getPromotStatus = function (param) {
            var userInfo = PLAY.userInfo;//res
            if (userInfo) {
                var guideData = userInfo.Value;
                if (param == true) {
                    if (location.href.indexOf("t=redeem") !== -1) {
                        avalon.scan();
                        if (location.href.indexOf("guide") !== -1) {
                            //#guide存在，则不再弹出获取福利窗口
                        } else {
                            //弹出获取福利窗口
                            avalon.vmodels["promotion"].submit_btn();
                        }
                    }
                } else {
                    //未登录状态处理
                    location.href = PLAY.baseAccountUrl;
                }
            }
        };
        vm.init = function () {
            /*初始化函数*/
            if (location.href.indexOf("t=redeem") !== -1) {
                avalon.scan();
                var rewardUrl = location.href.split("?")[1];
                PLAY.cookie('rewardUrl', rewardUrl, {'domain': vm.getDomain, 'path': '/'});
                //vm.getPromotStatus();
            }
        };
        vm.submit_btn = function () {
            //获取url中de 返回值
            if (location.href.indexOf("t=redeem") !== -1) {
                var get_url = document.location.href;
                var get_id = get_url.split("&");
                var url_id = get_id[1].substring(get_id[1].indexOf("=") + 1);
            } else {
                var url_id = " ";
            }
            var $code_num = $("#code_num").val();
            vm.renderSubmitInfo($code_num, url_id)
        };
        /*判断是哪种方式获取福利*/
        vm.renderSubmitInfo = function ($code_num, url_id) {
            if (url_id == " " || url_id == null) {
                parame = {
                    type: 1,
                    promoCode: $code_num
                }
            } else {
                parame = {
                    type: 0,
                    promoId: url_id
                }
            }
            payModel.getItemCode(parame, function (res) {
                if (res.State == 1) {

                    if (location.href.indexOf("t=redeem") !== -1) {
                    } else {
                        vm.hide("show_promotion");
                    }
                    promotionModel.megsuccessIfo = true;
                    var data = res.Value;
                    var res_data1 = [];
                    var res_data2 = [];
                    var res_data3 = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].AwdId == 1) {
                            data[i].AwardLst[0] = PLAY.formatScore(data[i].AwardLst[0]);//千分位
                            res_data1.push(data[i]);
                        } else if (data[i].AwdId == 2) {
                            res_data2 = data[i].AwardLst;
                            promotionModel.ticket = data[i].Name;
                        } else if (data[i].AwdId == 3) {
                            promotionModel.awards = data[i].Name;
                            res_data3 = data[i].AwardLst;
                        }
                    }
                    promotionModel.GoldData = res_data1;
                    promotionModel.TicketData = res_data2;
                    promotionModel.AwardaData = res_data3;
                    /*奖品弹框 */
                    !function () {
                        var i = 0;
                        var imgWidth = $(".slider-panel").width();
                        var size = $("#show-area").find("li").size();//得到所有li的个数
                        var width_ul = $("#width_ul");
                        var len = width_ul.find("li").length;
                        width_ul.width(imgWidth * len);
                        $(".staic_numb").html("/" + size)
                        $("#coun_number").html(i + 1)
                        $("#button-left").click(function () {
                            if (i == 0) {
                                return
                            }
                            i--;
                            width_ul.animate({marginLeft: -i * imgWidth}, 500);
                        });
                        //右按钮
                        $("#button-right").click(function () {
                            if (len - 1 == i) {
                                return
                            }
                            i++;
                            var index = $("#width_ul").find("li").eq(i).find("#coun_number");
                            if (index) {
                                index.html(i + 1);
                            }
                            width_ul.animate({marginLeft: -i * imgWidth}, 500);
                        });

                    }();
                    avalon.vmodels["show_reddommSuc"].toggle = true;
                }
            }, function (res) {
                //*    接口返回的错误信息*//
                var mesg = res.Message;
                promotionModel.message = mesg;
                avalon.vmodels["show_reddommNotice"].toggle = true;

            }, function (res) {
            });
        };

        /*领取按钮及福利弹窗关闭按钮触发事件*/
        vm.get_award = function () {
            try {
                var wpt = window.wpt || "";
                if (wpt) {
                    wpt.play.js.promo_prize();
                }
            } catch (e) {
            }
            vm.hide("show_reddommSuc");
            avalon.vmodels["loginInfo"].getUserInfo();//成功后重新加载金币数量
        };
        //通过链接发放福利 错误信息提示页面关闭触发
        vm.get_award_link = function () {
            avalon.vmodels["show_reddommNotice"].toggle = false;
            /*if (location.href.indexOf("t=redeem") !== -1) {
                if (location.href.indexOf(PLAY.indexUrl) !== -1) {
                    window.location.href = PLAY.indexUrl;//关闭获得的福利提示窗 重置url
                } else {
                    window.location.href = PLAY.pokerUrl;//关闭获得的福利提示窗 重置url
                }
            }*/
        };
        /*弹出框*/
        vm.openDialog = {
            title: "title_promotion",
            modal: "promotion",
            smallDialog: true,
            width: "747px",
            onOpen: function () {
                if (location.href.indexOf("t=redeem") !== -1) {
                    location.hash = "guide";
                }
            },
            onConfirm: function () {
            },
            onClose: function () {
                PLAY.cookie('rewardUrl', ' ', {'domain': vm.getDomain, 'path': '/'}); // 清空cookie
                $("#code_num").val("");//清空文本框值
            }
        };
        /*限时促销多促销*/
        vm.promotionModel="";
        vm.promotionDataList=[];
        vm.orders='';
        /*弹出限时促销框*/
        vm.openTimedPromotionDialog = {
            title: "title_timed_promotion",
            modal: true,
            smallDialog: true,
            width: "809px",
            onOpen: function () {
                /*初始化*/
                promotionModel.upGame = false;
                promotionModel.showTimedPromotionPrice = false;
                promotionModel.showTimedPromotionBtn = false;
                if (promotionModel.timedPromotionBtn === 'store_blue') {
                    promotionModel.showTimedPromotionBtn = true;
                } else {
                    promotionModel.showTimedPromotionBtn = false;
                    promotionModel.timedPromotionBtn = "";
                }
            },
            onConfirm: function () {
            },
            onClose: function () {
                promotionModel.noTimedPromotionMsg = false;
            }
        };
        /*弹出限时促销成功框*/
        vm.openTimedPromotionSucDialog = {
            title: "title_timed_promotion_suc",
            modal: true,
            smallDialog: true,
            width: "809px",
            onOpen: function () {
                promotionModel.hideBuyPicHref = true;
                promotionModel.showTimedPromotionBtn = true;
                promotionModel.timedPromotionBtn = 'store_blue';
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        };
        /*弹出限时促销升级游戏*/
        vm.openPromotionUpGameDialog = {
            title: "title_timed_promotion_upGame",
            modal: true,
            smallDialog: true,
            width: "809px",
            onOpen: function () {
                promotionModel.hideBuyPicHref = true;
                promotionModel.upGame = true;
                promotionModel.timedPromotionMsg = "<span>Play in high stakes table and get</span><em>WPT Reward Points</em><span>.</span>";
                promotionModel.showTimedPromotionPrice = false;
                if (promotionModel.timedPromotionBtn === 'store_blue') {
                    promotionModel.showTimedPromotionBtn = true;
                } else {
                    promotionModel.showTimedPromotionBtn = false;
                    promotionModel.timedPromotionBtn = "";
                }
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        };
        /*弹出限时促销2框*/
        vm.openTimedPromotion2Dialog = {
            title: "title_timed_promotion",
            modal: true,
            smallDialog: true,
            width: "809px",
            height: "742px",
            onOpen: function (data) {

            },
            onConfirm: function () {
            },
            onClose: function () {
                if(promotionModel.orders < promotionModel.promotionDataList.length){
                    promotionModel.showOrderPromotion(promotionModel.promotionDataList,promotionModel.orders+1);
                }
            }
        };
        /*弹出限时促销3框*/
        vm.openTimedPromotion3Dialog = {
            title: "title_timed_promotion",
            modal: true,
            smallDialog: true,
            width: "1094px",
            height: "827px",
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
                if(promotionModel.orders < promotionModel.promotionDataList.length){
                    promotionModel.showOrderPromotion(promotionModel.promotionDataList,promotionModel.orders+1);
                }
            }
        };
        /*弹出限时促销4框*/
        vm.openTimedPromotion4Dialog = {
            title: "title_timed_promotion",
            modal: true,
            smallDialog: true,
            width: "1073px",
            height: "862px",
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
                if(promotionModel.orders < promotionModel.promotionDataList.length){
                    promotionModel.showOrderPromotion(promotionModel.promotionDataList,promotionModel.orders+1);
                }
            }
        };
        /*弹出限时促销5框*/
        vm.openTimedPromotion5Dialog = {
            title: "title_timed_promotion",
            modal: true,
            smallDialog: true,
            width: "1048px",
            height: "720px",
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
                if(promotionModel.orders < promotionModel.promotionDataList.length){
                    promotionModel.showOrderPromotion(promotionModel.promotionDataList,promotionModel.orders+1);
                }
            }
        };
        /*促销对象*/
        vm.getPromotionItem = function () {
            var allPromotionItem = {
                //"show_reddommNotice": false,
                "show_timedPromotion": false,
                "show_timedPromotion_02": false,
                "show_timedPromotion_03": false,
                "show_timedPromotion_04": false,
                "show_timedPromotion_05": false
            };
            return allPromotionItem;
        };
        /*展示对应促销*/
        vm.showTimedPromotion = function (topicType) {
            var obj = {
                "1": function () {
                    /*鲨鱼促销*/
                    vm.show("show_timedPromotion_03");
                },
                "2": function () {
                    /*夏日男孩促销-西瓜促销-冰棍促销*/
                    vm.show("show_timedPromotion_04");
                },
                "3": function () {
                    /*公狗促销*/
                    vm.show("show_timedPromotion_05");
                }
            };
            for (var i in obj) {
                if (parseInt(i) === topicType) {
                    obj[i]();
                }
            }
        };
        /*获取限时促销列表*/
        vm.promoLimitedTimeGoodsList = function (time) {
            if (time) {
                promotionModel.currentTime = time;
            }
            promotionModel.buyPicHref = "";
            var allPromotionItem = vm.getPromotionItem();
            for (var i in allPromotionItem) {
                if (allPromotionItem[i]) {
                    vm.show(i);
                } else {
                    vm.hide(i);
                }
            }
            payModel.promoLimitedTimeGoodsList("", function (res) {
                /* 表示当前有促销*/
                if (res.Value) {
                    promotionModel.promotionDataList = res.Value;
                    promotionModel.promotionDataList.sort(function (a, b) {
                        return a.DOrder - b.DOrder;
                    });
                    promotionModel.hideBuyPicHref = false;
                    /*多促销-多促销数据处理*/
                    promotionModel.showOrderPromotion(promotionModel.promotionDataList,0,res.Message);
                    /*统计*/
                    if (location.href.indexOf("facebook") !== -1) {
                        fbq('track', 'fb_promo_view', {product_id: promotionModel.goodsCode});
                    } else {
                        fbq('track', 'promo_view', {product_id: promotionModel.goodsCode});
                    }
                }
            }, function (res) {
                promotionModel.hideBuyPicHref = true;
                /*您已购买过该促销商品,不能再次购买*/
                if (res.State === 101) {
                    promotionModel.showTimedPromotionPrice = false;
                    promotionModel.showTimedPromotionBtn = true;
                    promotionModel.timedPromotionMsg = "<span>You have aleady taken this promotion</span>";
                    promotionModel.timedPromotionBtn = 'store_blue';
                    avalon.vmodels["show_timedPromotion"].toggle = true;
                } else if (res.State === 102) {
                    /* 没有促销，显示coming soon*/
                    promotionModel.hideBuyPicHref = false;
                    promotionModel.buyPicHref = res.Value.PicPath;
                    promotionModel.noTimedPromotionMsg = true;
                    avalon.vmodels["show_timedPromotion"].toggle = true;
                } else {
                    promotionModel.message = res.Message;
                    avalon.vmodels["show_timedPromotion"].toggle = false;
                    avalon.vmodels["show_reddommNotice"].toggle = true;
                }
            }, function (res) {
                promotionModel.hideBuyPicHref = true;
                promotionModel.message = res.Message;
                avalon.vmodels["show_timedPromotion"].toggle = false;
                avalon.vmodels["show_reddommNotice"].toggle = true;
            });
        };
        /*多促销数据处理*/
        vm.showOrderPromotion = function (resValue, orders, message){
                if (resValue[orders]) {
                    promotionModel.buyPicHref = resValue[orders].PicPath;
                    promotionModel.goodsCode = resValue[orders].GoodsCode;
                    //promotionModel.dOrder = resValue[orders].DOrder;//促销弹出顺序
                    promotionModel.orders = orders;//0代表第1个促销
                    if (resValue[orders].TopicType === 0) {
                        promotionModel.endDate = resValue[orders].EndDt;
                        promotionModel.message = message;
                        vm.countDown(1);
                        clearInterval(promotionModel.countDownInterval);
                        promotionModel.countDownInterval = setInterval(vm.countDown, 60000);
                        promotionModel.show('show_timedPromotion_02');
                    } else if (resValue[orders].TopicType === 1) {
                        /*鲨鱼促销*/
                        vm.show("show_timedPromotion_03");
                    } else if (resValue[orders].TopicType === 2) {
                        /*夏日男孩促销-西瓜促销-冰棍促销*/
                        vm.show("show_timedPromotion_04");
                    } else if (resValue[orders].TopicType === 3) {
                        /*公狗促销*/
                        vm.show("show_timedPromotion_05");
                    }
                } else {
                    //showDialog('show_goldStore');
                }
        };
        /*倒计时*/
        vm.countDown = function (noFirst) {
            if (!promotionModel.endDate) {
                return;
            }
            if (promotionModel.showTime) {
            } else {
                //获取当前时间
                var date = new Date();
                if (promotionModel.currentTime) {
                    date = new Date(promotionModel.currentTime);
                }
                var now = date.getTime();
                //设置截止时间
                var endDate = new Date(promotionModel.endDate);
                var end = endDate.getTime(endDate);
                //时间差
                var leftTime = end - now;
                //定义变量 d,h,m,s保存倒计时的时间
                if (leftTime >= 0) {
                    promotionModel.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                    promotionModel.h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                    promotionModel.m = Math.floor(leftTime / 1000 / 60 % 60);
                    promotionModel.s = Math.floor(leftTime / 1000 % 60);
                }
                if (promotionModel.d >= 1) {
                    promotionModel.h = promotionModel.h + (promotionModel.d * 24)
                }
            }
            if (!noFirst) {
                if (promotionModel.m > 0) {
                    promotionModel.m--;
                }
                if (promotionModel.m === 0) {
                    if (promotionModel.h >= 1) {
                        promotionModel.h--;
                        promotionModel.m = 60;
                    }
                }
            }
            var hourText = promotionModel.h;
            var minText = promotionModel.m;
            if (hourText < 10) {
                hourText = "0" + hourText;
            }
            if (minText < 10) {
                minText = "0" + minText;
            }
            promotionModel.showTime = true;
            promotionModel.countHour = hourText || "00";
            promotionModel.countMin = minText || "00";
            if (!hourText || (hourText <= 0 && minText <= 0)) {
                setTimeout(function () {
                    clearInterval(promotionModel.countDownInterval);
                    /*时间到提示信息*/
                    promotionModel.hideBuyPicHref = true;
                    promotionModel.message = res.Message;
                    avalon.vmodels["show_timedPromotion_02"].toggle = false;
                    avalon.vmodels["show_reddommNotice"].toggle = true;
                }, 1000)
            }
            /*样式设置*/
            if (promotionModel.countHour.toString().length === 3) {
                $(".time").css("left", "278px");
            } else if (promotionModel.countHour.toString().length === 4) {
                $(".time").css("left", "268px");
            }
        };
        /*购买调创建订单接口*/
        vm.buy = function () {
            if (promotionModel.timedPromotionBtn == 'store_blue') {
                avalon.vmodels["store"].showShopDialog("show_store", "", "gold");
            } else if (promotionModel.noTimedPromotionMsg) {
                return false;
            } else {
                avalon.vmodels["store"].createSingleBuyOrder(promotionModel.goodsCode, true);
            }
        };
        /*点击按钮*/
        vm.hide = function (id) {
            avalon.vmodels[id].toggle = false;
        };
        /*点击按钮*/
        vm.show = function (id) {
            try {
                avalon.vmodels[id].toggle = true;
            } catch (e) {
                avalon.scan();
                avalon.vmodels[id].toggle = true;
            }
        }
    });
    promotionModel.init();
});


