/*商城模块*/
require(["../../model/store-model.js"], function (storeModel) {
    /*公共组件*/
    var common = avalon.define("storeCommon", function (vm) {
        vm.gameId = 25011;
        /*格式化数据*/
        vm.formatData = function (data, toFixed2) {
            if (data.DataList && data.DataList.length) {
                for (var i = 0; i < data.DataList.length; i++) {
                    if (toFixed2) {
                        data.DataList[i].GoodsInfo.Price = PLAY.thousandsFormat(data.DataList[i].GoodsInfo.Price);
                    } else {
                        data.DataList[i].GoodsInfo.Price = PLAY.formatScore(data.DataList[i].GoodsInfo.Price);
                    }
                }
            }
        };
    });
    /*滚动条组件*/
    var scrollBar = avalon.define("scrollBar", function (vm) {
        /*横滚动条效果*/
        vm.scrollBar = function (param, ticketParam) {
            if (param) {
                var $param = $("#store_" + param);
                $param.scrollBar({
                    showArrows: true,
                    horizontalBar: true
                });
                /*处理幸运物小弹框*/
                $param.find(".jspArrow").on("click", function () {
                    avalon.vmodels["store"].closeStoreCharmsDialog();
                });
                /*hover 效果*/
                if ($param.find(".item").find(".hover_bg").length) {
                    $param.find(".item").hover(function () {
                        $(this).find(".hover_bg").show();
                    }, function () {
                        $(this).find(".hover_bg").hide();
                    });
                }
                /*定位到最后一个*/
                if(ticketParam){
                    vm.positionLastItem();
                }
            }
        };
        vm.scrollBar2 = function(param,scrollbarOnLeftAdjust){
            if(param){
                var $param = $('.'+param),$scrollPane = $param.find(".scroll-pane");
                $scrollPane.scrollBar({
                    scrollbarWidth: 37,
                    scrollbarMargin:0,
                    arrowHeight: 78,
                    scrollbarOnLeftAdjust:scrollbarOnLeftAdjust
                });
                /*有无滚动条样式处理*/
                var $scrollBarTrack = $param.find(".scrollBarTrack");
                var $li = $scrollPane.find("li");
                if($scrollBarTrack.length){
                    vm.styleHandle($scrollPane,$li)[param].showScroll();
                }else{
                    vm.styleHandle($scrollPane,$li)[param].hideScroll();
                }
            }
        };
        /*定位到滚动条最后一个*/
        vm.positionLastItem = function () {
            var $drag = $(".jspDrag"),
                $track = $(".jspTrack"),
                $arrowRight = $(".jspArrowRight"),
                $pane = $(".jspPane");
            $drag.css("left", ($track.width() - $drag.width()));
            $pane.css("left", -parseInt($(".store_gold").find(".column_con").width() - 900));
            $arrowRight.addClass("jspDisabled");
        };
        /*有无滚动条样式处理*/
        vm.styleHandle = function ($scrollPane, $li) {
            var param = {
                "store_show_emojis": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "33px");
                        $li.css("marginRight", "32px")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "36px");
                        $li.css("marginRight", "37px");
                    }
                },
                "store_show_changeClothes": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "33px");
                        $li.css("marginRight", "22px")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "47px");
                        $li.css("marginRight", "28px");
                    }
                }
            };
            return param;
        };
    });
    /*items栏目*/
    var items = avalon.define("items", function (vm) {
        /*头像信息*/
        vm.avatarsData = [];
        /*表情信息*/
        vm.emojisData = [];
        /*礼物信息*/
        vm.charmsData = [];
        vm.showChangeClothesBtn = false;
        vm.showChangeClothesfonts = false;
        /*渲染 avatars 信息*/
        vm.renderAvatarsInfo = function (goodsCode) {
            var paramAvatar = {"version": Math.random(), 'gameId': common.gameId, 'menuCode': 'menu_avatars','hasField': 1};
            storeModel.getGoodsListByMenu(paramAvatar, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    common.formatData(data);
                    /*判断bonus图标显示哪种类型*/
                    for (var i = 0; i < data.DataList.length; i++) {
                        for (var y = 0; y < data.DataList[i].DescriptionList.length; y++) {
                            if (data.DataList[i].DescriptionList[y].FieldName) {
                                if (data.DataList[i].DescriptionList[y].FieldName === "showDialog") {
                                    data.DataList[i].showChangeClothesBtn = true;
                                    data.DataList[i].showChangeClothesfonts = true;
                                }
                            }
                        }
                    }
                    items.avatarsData = data.DataList;
                    /*横向滚动条*/
                    scrollBar.scrollBar("avatars");
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染 charms 信息*/
        vm.renderCharmsInfo = function () {
            var paramCharms = {"version": Math.random(), 'gameId': common.gameId, 'menuCode': 'menu_poker_charms'};
            storeModel.getGoodsListByMenu(paramCharms, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    common.formatData(data);
                    if (data.DataList && data.DataList.length) {
                        items.charmsData = data.DataList;
                        scrollBar.scrollBar("charms");
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染 emojis 信息*/
        vm.renderEmojisInfo = function (goodsCode) {
            var paramEmojis = {"version": Math.random(), 'gameId': common.gameId, 'menuCode': 'menu_emoji', 'hasField': 1};
            storeModel.getGoodsListByMenu(paramEmojis, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    common.formatData(data);
                    if (data.DataList && data.DataList.length) {
                        items.emojisData = data.DataList;
                        scrollBar.scrollBar("emojis");
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
    });
    /*商城总体*/
    var store = avalon.define("store", function (vm) {
        /* 初始化信息 */
        vm.baseData = ["items"];
        vm.baseData2 = ["avatars", "charms", "emojis"];
        vm.gold = false;
        vm.silver = false;
        vm.masterPoint = false;
        vm.items = true;
        vm.avatars = true;
        vm.charms = false;
        vm.emojis = false;
        vm.other = false;
        vm.smallNavIndex = 0;
        vm.bigNavIndex = "";
        vm.currentEmojisClass = 'emojis_01';
        vm.bestValue = false;
        vm.mPopular = false;
        /*头像信息*/
        vm.bigAvatarUrl = "";
        /*礼物信息*/
        vm.smallCharmUrl = "";
        vm.currentSmallCharmUrl = "";
        vm.storeCharmsDialog = false;
        vm.storeCharmsDialogIndex = 0;
        vm.curSmallCharmGoodsCode = "";
        /*表情信息*/
        vm.smallEmojisData = [];
        vm.emojisDataSatus = 99998;
        /* other信息*/
        vm.bigEmojisUrl = "";
        /* changeClothes信息 */
        vm.changeClothesData = [];
        vm.changeClothesDataIndex = 0;
        vm.clothesGoodsInfo="";
        vm.currentClothes = "";
        vm.currentClothesPrice = "";
        vm.clothesIsBuy = false;
        /* change clothes */
        vm.smallClothesUrl = "";
        /*小导航切换商品信息*/
        vm.itemData = [];
        /*当前商品信息*/
        vm.currentItemData = {
            "PicPath": "",
            "Name": "",
            "Descr": "",
            "Price": "",
            "GoodsCode": "",
            "IsBuy": false
        };
        vm.currentItemType = "";
        /*单个购买提示信息*/
        vm.messageInfo = "";
        vm.createOrderSucHref = "";
        vm.messageOtherInfo = false;
        vm.showStoreBtn = false;
        /*批量购买信息*/
        vm.batchBuyNumber = 1;
        vm.batchBuyTotalPrice = 0.00;
        /*询价后的数据*/
        vm.queryPriceData = {};
        vm.showTitle = true;
        /*公共参数*/
        var paramCommon = {"version": Math.random()};
        vm.init = function () {
            vm.smallTabClick(vm.baseData2.indexOf("avatars"), "avatars");
            scrollBar.scrollBar("avatars");
        };
        /*渲染 avatars 信息*/
        vm.renderAvatarsInfo = function (goodsCode) {
            items.renderAvatarsInfo();
        };
        /*渲染 charms 信息*/
        vm.renderCharmsInfo = function () {
            items.renderCharmsInfo();
        };
        /*渲染 emojis 信息*/
        vm.renderEmojisInfo = function (goodsCode) {
            items.renderEmojisInfo();
        };
        /*重新更新当前数据*/
        vm.updateData = function (goodsCode) {
            var itemData = store.currentItemType + "Data";
            if (items[itemData].length > 0) {
                for (var i = 0; i < items[itemData].length; i++) {
                    /*赋值*/
                    if (items[itemData][i].GoodsInfo.GoodsCode === goodsCode) {
                        items[itemData][i].GoodsInfo.IsBuy = true;
                    }
                }
            }
        };
        /*切换小导航*/
        vm.smallTabClick = function (index, param) {
            if ($("#loading").length) {
                $("#loading").css("top", "54px");
            }
            vm.closeStoreCharmsDialog();
            var baseData = vm.baseData2;
            for (var i = 0; i < baseData.length; i++) {
                store[baseData[i]] = false;
            }
            store.smallNavIndex = index;
            var itemName = PLAY.initiaToLowerCase(param);
            var itemData = param + "Data";
            if (items[itemData].length <= 0) {
                /*渲染对应小选项卡*/
                vm["render" + itemName + "Info"]();
            }
            store[param] = true;
            scrollBar.scrollBar(param);
        };
        /*点击表情设置表情*/
        vm.clickEmojis = function (index) {
            var data = store.smallEmojisData;
            for (var i = 0; i < data.length; i++) {
                if (i === index) {
                    store.bigEmojisUrl = data[i].BigEmojisUrl;
                    if (vm.timeEmojis) {
                        clearTimeout(vm.timeEmojis)
                    }
                    vm.timeEmojis = setTimeout(function () {
                        store.bigEmojisUrl = "";
                    }, 5000);
                }
            }
        };
        /*渲染弹框里面头像信息*/
        vm.renderSmallDialogAvatars = function () {
            storeModel.getAvatarList(paramCommon, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    if (data && data.length) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsCurrentAvatar) {
                                store.bigAvatarUrl = data[i].BigAvatarUrl;
                            }
                        }
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染弹框里面礼物信息*/
        vm.renderSmallDialogCharms = function () {
            storeModel.getCharmList(paramCommon, function (res) {
                if (res.Value) {
                    var data = JSON.parse(res.Value)["9"];
                    if (data && data.length) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].selected) {
                                store.smallCharmUrl = data[i].url;
                            }
                        }
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染小弹框表情信息*/
        vm.renderSmallEmojisInfo = function () {
            var data = [
                {
                    "EmojisCode": "face_1",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/daxiao.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/daxiao.gif"
                },
                {
                    "EmojisCode": "face_2",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/jingya.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/jingya.gif"
                },
                {
                    "EmojisCode": "face_3",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/bishi.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/bishi.gif"
                },
                {
                    "EmojisCode": "face_4",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/han.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/han.gif"
                },
                {
                    "EmojisCode": "face_5",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/aishang.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/aishang.gif"
                },
                {
                    "EmojisCode": "face_6",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/jiayou2.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/jiayou2.gif"
                },
                {
                    "EmojisCode": "face_7",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/jiayou.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/jiayou.gif"
                },
                {
                    "EmojisCode": "face_8",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/jidubishi.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/jidubishi.gif"
                },
                {
                    "EmojisCode": "face_9",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/danu.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/danu.gif"
                },
                {
                    "EmojisCode": "face_10",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/zouta.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/zouta.gif"
                },
                {
                    "EmojisCode": "face_11",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/daku.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/daku.gif"
                },
                {
                    "EmojisCode": "face_12",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/cuicu.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/cuicu.gif"
                },
                {
                    "EmojisCode": "face_13",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/bishixiaoqi.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/bishixiaoqi.gif"
                },
                {
                    "EmojisCode": "face_14",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/jianxiao.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/jianxiao.gif"
                },
                {
                    "EmojisCode": "face_15",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/anfu.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/anfu.gif"
                },
                {
                    "EmojisCode": "face_16",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/touxiang.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/touxiang.gif"
                },
                {
                    "EmojisCode": "face_17",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/baonu.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/baonu.gif"
                },
                {
                    "EmojisCode": "face_18",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/wenhao.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/wenhao.gif"
                }
            ];
            var data2 = [
                {
                    "EmojisCode": "sf_face_1",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/kexueguairen.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/kexueguairen.gif"
                },
                {
                    "EmojisCode": "sf_face_2",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/dajiaoguai.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/dajiaoguai.gif"
                },
                {
                    "EmojisCode": "sf_face_3",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/langren.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/langren.gif"
                },
                {
                    "EmojisCode": "sf_face_4",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/xixuegui.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/xixuegui.gif"
                },
                {
                    "EmojisCode": "sf_face_5",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/munaiyi.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/munaiyi.gif"
                },
                {
                    "EmojisCode": "sf_face_6",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/wushi.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/wushi.gif"
                },
                {
                    "EmojisCode": "sf_face_7",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/xiaochou.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/xiaochou.gif"
                },
                {
                    "EmojisCode": "sf_face_8",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/heimao.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/heimao.gif"
                },
                {
                    "EmojisCode": "sf_face_9",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/jiangshi.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/jiangshi.gif"
                },
                {
                    "EmojisCode": "sf_face_10",
                    "SmallEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/youling.gif",
                    "BigEmojisUrl": PLAY.staticUrl + "webH5/images/halloween/youling.gif"
                }
            ];
            if (parseInt(store.emojisDataSatus) === 3001) {
                store.smallEmojisData = data2;
            } else {
                store.smallEmojisData = data;
            }
            scrollBar.scrollBar2("store_show_emojis", true);
        };
        /*显示换装弹窗*/
        vm.showChangeClothes = function (id,goodsInfo) {
            avalon.vmodels[id].data = goodsInfo;
            avalon.vmodels[id].toggle = true;
        };
        /*渲染弹框里面装备信息*/
        vm.renderSmallDialogClothes = function (param) {
            store.clothesGoodsInfo = param;//获取当前选中橄榄球衣的GoodsInfo
            var param = {"version": Math.random(), 'gameId': common.gameId,'goodsCode':param.GoodsCode, 'fieldName': 'AvatarSystem', 'hasField': 1};
            storeModel.getSubGoodsList(param, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    if (data.DataList && data.DataList.length) {
                        for ( var i = 0; i< data.DataList.length; i++){
                            store.currentClothes = data.DataList[0].GoodsInfo.PicPath;//默认显示第一件球衣形象
                            store.currentClothesPrice = PLAY.formatScore(data.DataList[0].GoodsInfo.Price);//默认显示第一个球衣价格
                            store.clothesIsBuy = data.DataList[0].GoodsInfo.IsBuy;
                            store.changeClothesDataIndex = 0;
                            for ( var y = 0; y < data.DataList[i].DescriptionList.length; y++){
                                if (data.DataList[i].DescriptionList[y].FieldName == "UniformImage" || data.DataList[i].DescriptionList[y].FieldName === "showDialog") {
                                    data.DataList[i].smallClothesUrl = data.DataList[i].DescriptionList[y].FieldValue;//获取橄榄球衣url
                                }else{
                                    data.DataList[i].smallClothesUrl = "";//获取橄榄球衣url
                                }
                            }
                        }
                        store.changeClothesData = data.DataList;
                        scrollBar.scrollBar2("store_show_changeClothes", true);
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*点击当前装备换装*/
        vm.clickChangeClothes = function (index) {
            store.changeClothesDataIndex = index;
            //vm.setCurrentAvatar(goodsCode);
            var data = store.changeClothesData;//获取数据
            for (var i = 0; i < data.length; i++) {
                if (i == index) {
                    store.clothesGoodsInfo = data[i].GoodsInfo;//获取当前选中橄榄球衣的GoodsInfo
                    store.currentClothes = data[i].GoodsInfo.PicPath;
                    store.currentClothesPrice =  PLAY.formatScore(data[i].GoodsInfo.Price);
                    store.clothesIsBuy = data[i].GoodsInfo.IsBuy;
                }
            }
        };
        vm.setFirstClothes = function () {

        };
        /*vm.getChangeClothesData = function () {
            var footballUrl = PLAY.staticUrl + "webH5/images/football/";
            var data = [];
            for (var i = 0; i < 32; i++) {
                var num = "clothes_0"+parseInt(i+1);
                if (parseInt(i+1) >= 10) {
                    num = "clothes_"+parseInt(i);
                }
                var obj =  {"url":footballUrl+num+".png"};
                data.push(obj);
            }
            return data;
        };*/
        /*弹出换装小框*/
        vm.openChangeClothesDialog = {
            title: "title_changeClothes",
            modal: "store",
            width: "747px",
            smallDialog: true,
            onOpen: function (param) {
                if(param && param.data){
                    /*渲染弹框里面装备信息*/
                    vm.renderSmallDialogClothes(param.data);
                }
            },
            onConfirm: function () {
            },
            onClose: function () {
                store.currentClothes = store.changeClothesData[0].GoodsInfo.PicPath;//默认显示第一件球衣形象
                store.currentClothesPrice = PLAY.formatScore(store.changeClothesData[0].GoodsInfo.Price);//默认显示第一个球衣价格
                store.clothesIsBuy = store.changeClothesData[0].GoodsInfo.IsBuy;
                store.changeClothesDataIndex = 0;
            }
        };
        /*弹出商城大框*/
        vm.openDialog = {
            title: "title_store",
            modal: "store",
            width: "1016px",
            onOpen: function () {
                vm.init();
                //facebook像素统计打开商城弹出窗口
                if (location.href.indexOf("facebook") !== -1) {
                    fbq('track', 'fb_store_view');
                    ga('send', 'event', 'fb_store', 'view');
                } else {
                    fbq('track', 'store_view');
                    ga('send', 'event', 'store', 'view');
                }
                /*缩放*/
                //PLAY.scaleDialog();
            },
            onConfirm: function () {
            },
            onClose: function () {
                if ($("#loading").length) {
                    $("#loading").css("top", "0");
                }
                /*与游戏交互*/
                var wpt = window.wpt || "";
                if (wpt) {
                    wpt.play.js.close_shop();
                }
                /*关闭限时促销*/
                avalon.vmodels["show_timedPromotion"].toggle = false;
                avalon.vmodels["show_timedPromotionSuc"].toggle = false;
                /*缩放还原*/
                //PLAY.resetScaleDialog();
                if (location.href.indexOf("facebook") !== -1) {
                    //facebook付费推广对话框
                    payerPromotion();
                }
            }
        };
        /*弹出表情小框*/
        vm.openEmojisDialog = {
            title: "title_emojis",
            modal: false,
            width: "747px",
            smallDialog: true,
            onOpen: function () {
                if (!store.smallCharmUrl) {
                    /*渲染小弹框礼物信息*/
                    vm.renderSmallDialogCharms();
                }
                if (store.smallEmojisData.length <= 0) {
                    /*渲染小表情信息*/
                    vm.renderSmallEmojisInfo();
                }
                if (!store.bigAvatarUrl) {
                    /*渲染小弹框头像信息*/
                    vm.renderSmallDialogAvatars();
                }
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        };
        /*弹出幸运物小框*/
        vm.openCharmsDialog = function (e, currentPicUrl, goodsCode) {
            if (!store.bigAvatarUrl) {
                /*渲染小弹框头像信息*/
                vm.renderSmallDialogAvatars();
            }
            var widthBody = parseInt($("body").width() / 2);
            var widthX = parseInt(widthBody + $(e.target).closest(".item").width());
            if (e.clientX < widthBody) {
                store.storeCharmsDialogIndex = 0;
            } else if (e.clientX > widthBody && e.clientX < widthX) {
                store.storeCharmsDialogIndex = 1;
            } else if (e.clientX > widthX) {
                store.storeCharmsDialogIndex = 2;
            }
            /*试戴幸运物*/
            store.currentSmallCharmUrl = currentPicUrl;
            store.curSmallCharmGoodsCode = goodsCode;
            store.storeCharmsDialog = true;
        };
        /*关闭幸运物小框*/
        vm.closeStoreCharmsDialog = function () {
            store.storeCharmsDialog = false;
        };
        /*单个购买框*/
        vm.openSingleBuyDialog = {
            title: "title_single_buy",
            modal: true,
            width: "530px",
            smallDialog: true,
            onOpen: function () {
                store.queryPriceData.TotalPrice = "";
            },
            onConfirm: function () {
            },
            onClose: function () {
                store.currentItemData.PicPath = null;
                store.currentItemData.IsBuy = false;
                store.showTitle = true;
            }
        };
        /* 弹出购买框*/
        vm.showBuy = function (id, goodsInfo, type, isCustomize, changeClothesAvatar) {
            /*owned 不可点击*/
            if (goodsInfo.IsBuy && !isCustomize) {
                return;
            }
            /*换装显示Customize 点击打开换装弹窗*/
            if (isCustomize) {
                //打开换装窗口
                store.showChangeClothes("show_changeClothes",changeClothesAvatar);
                return;
            }
            /*赋值*/
            vm.setCurrentItemData(id, goodsInfo, type);
            /*购买询价*/
            var param = {"version": Math.random(), 'gameId': common.gameId, 'goodsCode': goodsInfo.GoodsCode};
            storeModel.queryPrice(param, function (res) {
                if (res.Value) {
                    if (store.currentItemType === "other") {
                        res.Value.TotalPrice = PLAY.thousandsFormat(res.Value.TotalPrice);
                    } else {
                        res.Value.TotalPrice = PLAY.formatScore(res.Value.TotalPrice);
                    }
                    store.queryPriceData = res.Value;

                }
            }, function (res) {
                if (res && res.Message) {
                    store.messageInfo = res.Message;
                    avalon.vmodels["show_info"].toggle = true;
                }
            }, function (res) {
                if (res && res.Message) {
                    store.messageInfo = res.Message;
                    avalon.vmodels["show_info"].toggle = true;
                }
            });
            //facebook像素统计点击商城中具体某个商品
            if (location.href.indexOf("facebook") !== -1) {
                fbq('track', 'fb_product_click', {product_id: goodsInfo.GoodsCode});
                ga('send', 'event', 'fb_store', 'product_click', 'product_id', goodsInfo.GoodsCode);
            } else {
                fbq('track', 'product_click', {product_id: goodsInfo.GoodsCode});
                ga('send', 'event', 'store', 'product_click', 'product_id', goodsInfo.GoodsCode);
            }
        };
        /*给购买小弹框赋对应值并打开弹框*/
        vm.setCurrentItemData = function (id, goodsInfo, type) {
            store.currentItemType = type;
            if (store.currentItemType === "avatars") {
                store.showTitle = false;
            }
            /*给购买小弹框赋对应值*/
            if (goodsInfo) {
                store.currentItemData.GoodsCode = goodsInfo.GoodsCode;
                store.currentItemData.PicPath = goodsInfo.PicPath;
                store.currentItemData.Name = goodsInfo.Name;
                store.currentItemData.Descr = goodsInfo.Descr;
                store.currentItemData.Price = goodsInfo.Price;
                store.batchBuyTotalPrice = PLAY.toDecimal2(goodsInfo.Price);
                if (goodsInfo.IsBuy) {
                    store.currentItemData.IsBuy = goodsInfo.IsBuy;
                }
            }
            avalon.vmodels[id].toggle = true;
        };
        /*批量购买框*/
        vm.openBatchBuyDialog = {
            title: "title_batch_buy",
            modal: true,
            width: "530px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
                /*还原初始化*/
                store.batchBuyNumber = 1;
                store.currentItemData.PicPath = null;
            }
        };
        /*公共提示信息框*/
        vm.openPublicShowInfo = {
            title: "title_showInfo",
            modal: true,
            width: "530px",
            smallDialog: true,
            onOpen: function () {
                store.showStoreBtn = false;
                if (store.messageInfo == "Sorry,you do not have enough gold") {
                    store.showStoreBtn = true;
                }
            },
            onConfirm: function () {
                //提示余额不足转至GOLD支付页面
                if (store.messageInfo == "Sorry,you do not have enough gold") {
                    avalon.vmodels["show_single_buy"].toggle = false;
                    avalon.vmodels["show_batch_buy"].toggle = false;
                    avalon.vmodels["show_changeClothes"].toggle = false;
                    /*对应打开GOLD选项卡*/
                    try {
                        if (wpt) {
                            wpt.play.js.askOpenGoldStore(); //打开金币商城
                        }
                    } catch (e) {
                    }
                }else if (store.messageOtherInfo === true) {
                    avalon.vmodels["show_single_buy"].toggle = false;
                }
            },
            onClose: function () {
                store.messageOtherInfo = false;
            }
        };
        /* 单个购买框确认按钮*/
        vm.confirmSingleBuy = function (goodsCode) {
            var data = store.queryPriceData;
            //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
            if (data.IsBalancePay && !data.IsAfford) {
                store.messageInfo = "Sorry,you do not have enough gold";
                avalon.vmodels["show_info"].toggle = true;
            } else {
                //创建单个购买订单
                vm.createSingleBuyOrder(goodsCode);
            }
        };
        /*批量购买数量减*/
        vm.batchBuyMinus = function () {
            if (store.batchBuyNumber >= 2) {
                store.batchBuyNumber--;
                if (store.currentItemData && (store.currentItemData.Price)) {
                    store.batchBuyTotalPrice = PLAY.toDecimal2(parseFloat(store.currentItemData.Price * store.batchBuyNumber));
                }
            }
        };
        /*批量购买输入框输入事件*/
        vm.batchBuyInput = function () {
            if (store.batchBuyNumber === 0) {
                store.batchBuyNumber = 1;
            } else if (store.batchBuyNumber > 10) {
                store.batchBuyNumber = parseInt(store.batchBuyNumber.toString().substring(0, 1));
            }
            if (store.currentItemData && (store.currentItemData.Price)) {
                store.batchBuyTotalPrice = PLAY.toDecimal2(parseFloat(store.currentItemData.Price * store.batchBuyNumber));
            }
        };
        /*批量购买输入框失去焦点*/
        vm.batchBuyBlur = function () {
            if (store.batchBuyNumber === 0 || !store.batchBuyNumber) {
                store.batchBuyNumber = 1;
            }
            if (store.currentItemData && (store.currentItemData.Price)) {
                store.batchBuyTotalPrice = PLAY.toDecimal2(parseFloat(store.currentItemData.Price * store.batchBuyNumber));
            }
        };
        /*批量购买数量加*/
        vm.batchBuyAdd = function () {
            store.batchBuyNumber++;
            if (store.batchBuyNumber > 10) {
                store.batchBuyNumber = 10;
            }
            if (store.currentItemData && (store.currentItemData.Price)) {
                store.batchBuyTotalPrice = PLAY.toDecimal2(parseFloat(store.currentItemData.Price * store.batchBuyNumber));
            }
        };
        /* 批量购买框确认按钮*/
        vm.confirmBatchBuy = function (goodsCode) {
            var data = store.queryPriceData;
            //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
            if (data.IsBalancePay && !data.IsAfford) {
                store.messageInfo = "Sorry,you do not have enough gold";
                avalon.vmodels["show_info"].toggle = true;
            } else {
                //创建批量订单
                vm.createBatchBuyOrder(goodsCode);
            }
            /*QA GA统计*/
            if (location.href.indexOf("facebook") !== -1) {
                fbq('track', 'fb_product_confirm_click');//facebook像素统计facebook点击confirm确认购买
                ga('send', 'event', 'fb_store', 'product_confirm_click');
            } else {
                fbq('track', 'product_confirm_click');//facebook像素统计点击confirm确认购买
                ga('send', 'event', 'store', 'product_confirm_click');
            }
        };
        /*打开支付页面*/
        vm.showPayment = function (data, timedPromotion) {
            var payParam = {
                //"quantity": store.batchBuyNumber,
                "quantity": data.GoodsCount,
                "paymsgid": data.PayMsgID || "",
                "timestamp": data.TimeStamp || "",
                "md5sign": data.MD5Sign || "",
                "timedPromotion": timedPromotion
            };
            if (payParam) {
                avalon.vmodels["show_payment"].data = payParam;
                //avalon.vmodels["show_batch_buy"].toggle = false;
                //avalon.vmodels["show_single_buy"].toggle = false;
                avalon.vmodels["show_payment"].toggle = true;
            }
        };
        /*创建批量购买订单*/
        vm.createBatchBuyOrder = function (goodsCode, quantity) {
            var getQuantity = 1;
            if (quantity) {
                getQuantity = quantity;
            } else {
                getQuantity = store.batchBuyNumber;
            }
            var param = {"version": Math.random(), 'gameId': common.gameId, 'goodsCode': goodsCode, 'quantity': getQuantity};
            /*facebook 创建订单*/
            if (location.href.indexOf("facebook") !== -1) {
                vm.facebookCreateOrder(goodsCode, getQuantity);
            } else {
                /*普通用户 创建订单*/
                storeModel.createOrder(param, function (res) {
                    if (res.Value) {
                        var data = res.Value;
                        //OrderStatus值为10，则提示购买成功
                        if (data.OrderStatus === 10) {
                            store.messageInfo = data.SuccessMessage;
                            avalon.vmodels["show_info"].toggle = true;
                            /*updateCoin number*/
                            vm.updateCoinStr();
                        } else if (!data.IsBalancePay) {
                            //打开支付页面
                            //store.messageInfo = "Please finish the payment process in the payment page";
                            vm.showPayment(data);
                            /*QA GA统计*/
                            fbq('track', 'product_confirm_success');//facebook像素统计点击confirm成功
                            if (location.href.indexOf("facebook") !== -1) {
                                ga('send', 'event', 'fb_store', 'product_confirm', 'success');
                            } else {
                                ga('send', 'event', 'store', 'product_confirm', 'success');
                            }
                        } else if (!data.IsAfford) {
                            //提示余额不足
                            store.messageInfo = "Sorry,you do not have enough gold";
                            avalon.vmodels["show_info"].toggle = true;
                        } else {
                            //其他后台返回提示
                            store.messageInfo = res.Message;
                            avalon.vmodels["show_info"].toggle = true;
                        }
                    }
                }, function (res) {
                    if (res.State === 21) {
                        //提示余额不足转至GOLD支付页面
                        store.messageInfo = "Sorry,you do not have enough gold";
                    } else {
                        if (res.Message) {
                            store.messageInfo = res.Message;
                        }
                    }
                    avalon.vmodels["show_info"].toggle = true;
                    /*QA GA统计*/
                    fbq('track', 'product_confirm_fail', {error: store.messageInfo});//facebook像素统计点击confirm失败及失败原因
                    if (location.href.indexOf("facebook") !== -1) {
                        ga('send', 'event', 'fb_store', 'product_confirm', 'fail', store.messageInfo);
                    } else {
                        ga('send', 'event', 'store', 'product_confirm', 'fail', store.messageInfo);
                    }
                }, function (res) {
                    if (res && res.Message) {
                        store.messageInfo = res.Message;
                        avalon.vmodels["show_info"].toggle = true;
                    }
                    /*QA GA统计*/
                    fbq('track', 'product_confirm_fail', {error: store.messageInfo});//facebook像素统计点击confirm失败及失败原因
                    if (location.href.indexOf("facebook") !== -1) {
                        ga('send', 'event', 'fb_store', 'product_confirm', 'fail', store.messageInfo);
                    } else {
                        ga('send', 'event', 'store', 'product_confirm', 'fail', store.messageInfo);
                    }
                });
            }
        };
        /*自动设置当前charm*/
        vm.setCurrentCharm = function (goodsCode) {
            storeModel.getCharmList(paramCommon, function (res) {
                if (res.Value) {
                    var data = JSON.parse(res.Value)["9"];
                    if (data && data.length) {
                        var paramCharmsCode = {"version": Math.random(), 'itemID': "", 'isSelect': true};
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].code === goodsCode.replace(/^(\w+\_)(\d+)$/, '$2')) {
                                paramCharmsCode.itemID = data[i].itemId;
                                /*调用设置当前charm 接口*/
                                storeModel.selectCharm(paramCharmsCode, function (res) {
                                }, function (res) {
                                }, function (res) {
                                });
                            }
                        }
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*自动设置当前avatar*/
        vm.setCurrentAvatar = function (goodsCode) {
            var paramAvaCode = {"version": Math.random(), "avatarCode": ""};
            paramAvaCode.avatarCode = goodsCode.replace(/^(\w+\_)(\d+)$/, '$2');
            storeModel.setCurrentAvatar(paramAvaCode, function (res) {
                avalon.vmodels["loginInfo"].getUserInfo();
                /*与游戏交互*/
                var wpt = window.wpt || "";
                if (wpt) {
                    wpt.play.js.revUpdateHead();
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*创建不同单个购买订单*/
        vm.createSingleBuyOrder = function (goodsCode, timedPromotion, promoType) {
            var param = {"version": Math.random(), 'gameId': common.gameId, 'goodsCode': goodsCode, 'promotionType': promoType};
            /*facebook 创建订单*/
            if (location.href.indexOf("facebook") !== -1) {
                vm.facebookCreateOrder(goodsCode, 1);
            } else {
                /*普通用户 创建订单*/
                storeModel.createOrder(param, function (res) {
                    if (res.Value) {
                        var data = res.Value;
                        if (data && data.RechargeUrl) {
                            /*跳到支付页面*/
                            vm.showPayment(data, timedPromotion);
                        } else {
                            //OrderStatus值为10，则提示购买成功,显示跳转链接可跳到对应背包选项卡
                            if (data.OrderStatus === 10) {
                                store.messageInfo = "Purchase successful.";
                                if (store.currentItemType !== "masterPoint") {
                                    store.messageOtherInfo = true;
                                }
                                /*updateCoin number*/
                                vm.updateCoinStr();
                                /*更新列表信息*/
                                if (store.currentItemType === "avatars" || store.currentItemType === "emojis") {
                                    vm.updateData(goodsCode);
                                }
                                /*自动设置当前avatar*/
                                if (store.currentItemType === "avatars") {
                                    vm.setCurrentAvatar(goodsCode);
                                }
                                /*自动设置当前charm*/
                                if (store.currentItemType === "charms") {
                                    vm.setCurrentCharm(goodsCode);
                                }
                            } else if (data.IsBalancePay && !data.IsAfford) {
                                //提示余额不足转至GOLD支付页面
                                store.messageInfo = "Sorry,you do not have enough gold";
                            } else {
                                //其他后台返回提示
                                store.messageInfo = res.Message;
                            }
                            avalon.vmodels["show_info"].toggle = true;
                        }
                    }
                }, function (res) {
                    if (res.State === 21) {
                        //提示余额不足转至GOLD支付页面
                        store.messageInfo = "Sorry,you do not have enough gold";
                    } else {
                        if (res.Message) {
                            store.messageInfo = res.Message;
                        }
                    }
                    avalon.vmodels["show_info"].toggle = true;
                }, function (res) {
                    if (res && res.Message) {
                        store.messageInfo = res.Message;
                        avalon.vmodels["show_info"].toggle = true;
                    }
                });
            }
        };
        /* facebook 创建订单 */
        vm.facebookCreateOrder = function (goodsCode, quantity) {
            var param = {"version": Math.random(), 'gameId': common.gameId, 'goodsCode': goodsCode, 'quantity': quantity};
            storeModel.facebookCreateOrder(param, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    if (!data.IsBalancePay) {
                        /*facebook 支付*/
                        var orderInfo = {
                            "url": data.ProductUrl,
                            "pid": data.OrderId
                        };
                        /*调用fbCreditsOrder*/
                        fbCreditsOrder(orderInfo, 1, data.GoodsName, quantity, goodsCode);
                        fbq('track', 'fb_product_confirm_success');//facebook像素统计点击confirm成功
                    } else {
                        //OrderStatus值为10，则提示购买成功,显示跳转链接可跳到对应背包选项卡
                        if (data.OrderStatus === 10) {
                            store.messageInfo = "Purchase successful.";
                            if (store.currentItemType !== "masterPoint") {
                                store.messageOtherInfo = true;
                            }
                            /*updateCoin number*/
                            vm.updateCoinStr();
                            /*更新列表信息*/
                            if (store.currentItemType === "avatars" || store.currentItemType === "emojis") {
                                vm.updateData(goodsCode);
                            }
                            /*自动设置当前avatar*/
                            if (store.currentItemType === "avatars") {
                                vm.setCurrentAvatar(goodsCode);
                            }
                            /*自动设置当前charm*/
                            if (store.currentItemType === "charms") {
                                vm.setCurrentCharm(goodsCode);
                            }
                        } else if (data.IsBalancePay && !data.IsAfford) {
                            //提示余额不足转至GOLD支付页面
                            store.messageInfo = "Sorry,you do not have enough gold";
                        } else {
                            //其他后台返回提示
                            store.messageInfo = res.Message;
                        }
                        avalon.vmodels["show_info"].toggle = true;
                    }
                }
            }, function (res) {
                if (res.State === 21) {
                    //提示余额不足转至GOLD支付页面
                    store.messageInfo = "Sorry,you do not have enough gold";
                } else {
                    if (res.Message) {
                        store.messageInfo = res.Message;
                    }
                }
                avalon.vmodels["show_info"].toggle = true;
                fbq('track', 'fb_product_confirm_fail', {error: store.messageInfo});//facebook像素统计点击confirm失败及失败原因
            }, function (res) {
                if (res && res.Message) {
                    store.messageInfo = res.Message;
                    avalon.vmodels["show_info"].toggle = true;
                }
                fbq('track', 'fb_product_confirm_fail', {error: store.messageInfo});//facebook像素统计点击confirm失败及失败原因
            });
        };
        /*更新金币数量*/
        vm.updateCoinStr = function () {
            /*与游戏交互*/
            var wpt = window.wpt || "";
            if (wpt) {
                wpt.play.js.toGameUpdateCoin();
            }
            storeModel.getUserCoinCount(paramCommon, function (res) {
                var guideData = res.Value;
                if (guideData) {
                    if (store.currentItemType !== "masterPoint") {
                        updateCoinStr(PLAY.formatScore(guideData.GoldBalance));
                    } else {
                        updateRewards(PLAY.formatScore(guideData.MasterPoints));
                        updateCoinStr(PLAY.formatScore(guideData.GoldBalance));
                    }
                }
            }, function (res) {
            }, function (res) {
            })
        };
        /*点击对应打开商城中选项卡*/
        vm.showShopDialog = function (id, smallType, bigType, ticketParam) {
            avalon.vmodels[id].toggle = true;
            /*对应打开大选项卡*/
            //vm.bigTabClick(vm.baseData.indexOf(bigType), bigType, ticketParam);
            /*对应打开小选项卡*/
            if (smallType) {
                vm.smallTabClick(vm.baseData2.indexOf(smallType), smallType);
            }
        };
        /*点击打开背包*/
        vm.showInventory = function (id) {
            /*与游戏交互*/
            var wpt = window.wpt || "";
            if (wpt) {
                wpt.play.js.close_shop();
            }
            avalon.vmodels["inventory"].show(id, store.currentItemType);
        };
        /*点击打开表情包*/
        vm.showEmojis = function (id, status) {
            store.emojisDataSatus = status;
            avalon.vmodels[id].toggle = true;
        };
        /*通用打开弹框*/
        vm.show = function (id) {
            avalon.vmodels[id].toggle = true;
        }
    });
    /*处理和游戏兼容补丁*/
    if (location.href.indexOf("module/poker/index.html") !== -1) {
        avalon.scan();
    }
});

