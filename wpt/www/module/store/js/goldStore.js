/**
 * Created by shiwz on 17-8-3.
 */
require(["../../model/store-model.js"], function (storeModel) {
    var goldStore = avalon.define("goldStore", function (vm) {
        /* 初始化信息 */
        vm.gold = false;
        /*金币信息*/
        vm.goldData = [];
        vm.bonusType = "";
        vm.gameId = 25011;
        vm.showMostPopular = false;
        vm.showBestValue = false;
        /*公共参数*/
        var paramCommon = {"version": Math.random()};
        vm.init = function () {
            vm.renderGoldInfo();
        };
        /*渲染 gold 信息*/
        vm.renderGoldInfo = function () {
            var paramGold = {"version": Math.random(), 'gameId': vm.gameId, 'menuCode': 'menu_store', 'hasField': 1};
            storeModel.getGoodsListByMenu(paramGold, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    if (data.DataList && data.DataList.length) {
                        //*判断bonus图标显示d哪种类型*//*
                        for (var i = 0; i < data.DataList.length; i++) {
                            var curDataList = data.DataList[i];
                            var descriptionList = curDataList.DescriptionList;
                            if(curDataList.GoodsInfo.GoodsCode.indexOf("LuckySpin") !== -1){
                                curDataList.showItem = false;
                            } else {
                                curDataList.showItem = true;
                            }
                            curDataList.GoodsInfo.salesGoldName = curDataList.GoodsInfo.Name;
                            curDataList.GoodsInfo.bonusPercent = 100;
                            curDataList.GoodsInfo.colorClass = "color_0" + parseInt(i + 1);
                            if (curDataList.GoodsInfo.LabelType === 1) {
                                curDataList.showMostPopular = true;
                            } else if (curDataList.GoodsInfo.LabelType === 2) {
                                curDataList.showBestValue = true;
                            } else {
                                curDataList.showMostPopular = false;
                                curDataList.showBestValue = false;
                            }
                            for (var y = 0; y < descriptionList.length; y++) {
                                var curDescriptionList = descriptionList[y];
                                if (curDescriptionList.FieldName) {
                                    if (curDescriptionList.FieldName == "BonusImage") {
                                        goldStore.bonusType = curDescriptionList.FieldValue;
                                        curDataList.GoodsInfo.bonusType = goldStore.bonusType;
                                    } else if (curDescriptionList.FieldName == "GoldBase") {
                                        curDataList.GoodsInfo.redRole = true;
                                        curDataList.GoodsInfo.salesGoldName = curDescriptionList.FieldValue;
                                    } else if (curDescriptionList.FieldName == "BonusPercentForGoldStore") {
                                        curDataList.GoodsInfo.bonusPercent = curDescriptionList.FieldValue;
                                    }
                                }
                            }
                        }
                        goldStore.goldData = data.DataList;
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*打开批量购买框*/
        vm.showBatchBuy = function (goodsInfo) {
            avalon.vmodels["store"].showBuy('show_batch_buy', goodsInfo, 'gold');
        };
        /*弹出金币商城大框*/
        vm.openDialog = {
            title: "title_store",
            modal: "store",
            width: "1016px",
            onOpen: function () {
                /*缩放*/
                PLAY.scaleDialog();
                vm.init();
                //facebook像素统计打开金币商城弹出窗口
                if (location.href.indexOf("facebook") !== -1) {
                    fbq('track', 'fb_gold_store_view');
                    ga('send', 'event', 'fb_gold_store', 'view');
                } else {
                    fbq('track', 'gold_store_view');
                    ga('send', 'event', 'gold_store', 'view');
                }
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
                PLAY.resetScaleDialog();
            }
        };
        /*通用打开弹框*/
        vm.show = function (id) {
            avalon.vmodels[id].toggle = true;
        };
        vm.showGoldStore = function () {
            if(PLAY.userInfo){
                var userInfoVal = PLAY.userInfo.Value;
                if(userInfoVal.IsReg){
                    showDialog('show_store','','gold');
                } else {
                    showDialog("show_goldStore");
                }
            }
        };
    });

});


