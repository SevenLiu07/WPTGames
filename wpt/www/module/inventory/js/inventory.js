/*背包模块*/
require(["../../model/inventory-model.js"], function (inventoryModel) {
    var inventory = avalon.define("inventory", function (vm) {
        /* 初始化信息 */
        vm.baseData = ["avatars", "charms", "emojis", "tickets"];
        vm.items = false;
        vm.tickets = false;
        vm.charms = false;
        vm.emojis = false;
        vm.avatars = true;
        vm.charmDataIndex = "";
        vm.navIndex = "";
        vm.currentEmojisClass = 'emojis_01';
        vm.showEmojis01 = true;
        vm.showEmojis02 = false;
        vm.showEmojisBtn02 = false;
        /*头像信息*/
        vm.avatarsData = [];
        vm.bigAvatarUrl = "";
        vm.currentAvatars = false;
        /*礼物信息*/
        vm.charmsData = [];
        vm.smallCharmUrl = "";
        vm.currentCharms = false;
        vm.curSmallCharmGoodsCode = "";
        /*表情信息*/
        vm.emojisData01 = [];
        vm.emojisData02 = [];
        vm.bigEmojisUrl = "";
        /*道具信息*/
        vm.itemsData = [];
        /*门票信息*/
        vm.ticketsData = [];
        /*公共参数*/
        var paramCommon = {"version": Math.random()};
        vm.init = function () {
            /*切换导航*/
            vm.tabClick();
            /*渲染头像信息*/
            vm.renderAvatarsInfo();
            /*渲染礼物信息*/
            vm.renderCharmsInfo();
            /*渲染门票信息*/
            vm.renderTicketsInfo();
            /*渲染表情信息*/
            vm.renderEmojisInfo();
            /*渲染道具信息*/
            /* vm.renderItemsInfo()*/
        };
        /*渲染头像信息*/
        vm.renderAvatarsInfo = function () {
            inventoryModel.getAvatarList(paramCommon, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    if (data && data.length) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsCurrentAvatar) {
                                data[i].currentAvatars = true;
                                inventory.bigAvatarUrl = data[i].BigAvatarUrl;
                            } else {
                                data[i].currentAvatars = false;
                            }
                        }
                        inventory.avatarsData = data;
                        vm.scrollBar("avatars");
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染礼物信息*/
        vm.renderCharmsInfo = function () {
            inventoryModel.getCharmList(paramCommon, function (res) {
                if (res.Value) {
                    var data = JSON.parse(res.Value)["9"];
                    if (data && data.length) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].selected) {
                                inventory.charmDataIndex = i;
                                inventory.smallCharmUrl = data[i].url;
                                inventory.curSmallCharmGoodsCode = data[i].code;
                                data[i].currentCharms = true;
                            } else {
                                data[i].currentCharms = false;
                            }
                        }
                        inventory.charmsData = data
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染门票信息*/
        vm.renderTicketsInfo = function () {
            inventoryModel.getTicketList(paramCommon, function (res) {
                if (res.Value) {
                    var data = JSON.parse(res.Value)["4"];
                    /* 建立月份英文简称数组*/
                    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    if (data && data.length) {
                        for (var i = 0; i < data.length; i++) {
                            var date = PLAY.parseDate(data[i].validTime);
                            var month = monthArray[date.getMonth()];
                            var year = date.getFullYear();
                            var day = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
                            data[i].validTime = month + " " + day + "," + " " + year;
                        }
                        inventory.ticketsData = data;
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染道具信息*/
        vm.renderItemsInfo = function () {
            inventoryModel.getItemList(paramCommon, function (res) {
                if (res.Value) {
                    var data = JSON.parse(res.Value)["8"];
                    if (data && data.length) {
                        inventory.itemsData = data;
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*渲染表情信息*/
        vm.renderEmojisInfo = function () {
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
                }, {
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
                }, {
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
            inventoryModel.getEmojisList(paramCommon, function (res) {
                if (res.Value) {
                    var data = res.Value;
                    if (data.indexOf("3001") !== -1) {
                        inventory.showEmojisBtn02 = true;
                        inventory.emojisData02 = data2;
                    }
                }
            }, function (res) {
            }, function (res) {
            });
            inventory.emojisData01 = data;
        };
        /*点击头像设置当前头像*/
        vm.clickAvatars = function (index) {
            var paramAvaCode = {"version": Math.random(), "avatarCode": ""};
            var data = inventory.avatarsData;
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (i === index) {
                        data[i].currentAvatars = true;
                        inventory.bigAvatarUrl = data[i].BigAvatarUrl;
                        paramAvaCode.avatarCode = data[i].AvatarCode;
                        inventoryModel.setCurrentAvatar(paramAvaCode, function (res) {
                            avalon.vmodels["loginInfo"].getUserInfo();
                            /*与游戏交互*/
                            var wpt = window.wpt || "";
                            if (wpt) {
                                wpt.play.js.revUpdateHead();
                            }
                        }, function (res) {
                        }, function (res) {
                        });
                    } else {
                        data[i].currentAvatars = false;
                    }
                }
            }
        };
        /*点击礼物设置当前礼物*/
        vm.clickCharm = function (index) {
            vm.charmDataIndex = index;
            var data = inventory.charmsData;
            var paramCharmsCode = {"version": Math.random(), 'itemID': "", 'isSelect': true};
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (i === index) {
                        data[i].currentCharms = true;
                        inventory.smallCharmUrl = data[i].url;
                        inventory.curSmallCharmGoodsCode = data[i].code;
                        paramCharmsCode.itemID = data[i].itemId;
                        inventoryModel.selectCharm(paramCharmsCode, function (res) {
                        }, function (res) {
                        }, function (res) {
                        });
                    } else {
                        data[i].currentCharms = false;
                    }
                }
            }
        };
        /*点击切换表情库*/
        vm.tabEmojis = function (param) {
            inventory.showEmojis01 = false;
            inventory.showEmojis02 = false;
            vm.currentEmojisClass = param;
            param === "emojis_01" ? inventory.showEmojis01 = true : inventory.showEmojis02 = true;
            vm.scrollBar("emojis");
        };
        /*点击表情设置表情01*/
        vm.clickEmojis01 = function (index) {
            var data = inventory.emojisData01;
            for (var i = 0; i < data.length; i++) {
                if (i === index) {
                    inventory.bigEmojisUrl = data[i].BigEmojisUrl;
                    if (vm.timeEmojis) {
                        clearTimeout(vm.timeEmojis)
                    }
                    vm.timeEmojis = setTimeout(function () {
                        inventory.bigEmojisUrl = "";
                    }, 5000);
                }
            }
        };
        /*点击表情设置表情02*/
        vm.clickEmojis02 = function (index) {
            var data2 = inventory.emojisData02;
            for (var j = 0; j < data2.length; j++) {
                if (j === index) {
                    inventory.bigEmojisUrl = data2[j].BigEmojisUrl;
                    if (vm.timeEmojis) {
                        clearTimeout(vm.timeEmojis)
                    }
                    vm.timeEmojis = setTimeout(function () {
                        inventory.bigEmojisUrl = "";
                    }, 5000);
                }
            }
        };
        /*切换导航*/
        vm.tabClick = function (index, param) {
            var baseData = vm.baseData;
            for (var i = 0; i < baseData.length; i++) {
                vm[baseData[i]] = false;
            }
            vm.navIndex = index;
            vm[param] = true;
            vm.scrollBar(param);
        };
        /*有无滚动条样式处理*/
        vm.styleHandle = function ($scrollPane, $li) {
            var param = {
                "emojis": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "33px");
                        $li.css("marginRight", "35px")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "50px");
                        $li.css("marginRight", "35px");
                    }
                },
                "charms": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "20px");
                        $li.css("marginRight", "12px")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "25px");
                        $li.css("marginRight", "4%");
                    }
                },
                "avatars": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "20px");
                        $li.css("marginRight", "12px")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "25px");
                        $li.css("marginRight", "4%");
                    }
                },
                "items": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "16px");
                        $li.css("marginRight", "45px");
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "17px");
                        $li.css("marginRight", "56px");
                    }
                },
                "tickets": {
                    "showScroll": function () {
                        return false;
                    },
                    "hideScroll": function () {
                        return false;
                    }
                }
            };
            return param;
        };
        /*滚动条效果*/
        vm.scrollBar = function (param) {
            if (param) {
                var $param = $('#' + param), $scrollPane = $param.find(".scroll-pane");
                $scrollPane.scrollBar({
                    scrollbarWidth: 37,
                    scrollbarMargin: 0,
                    arrowHeight: 78
                });
                /*有无滚动条样式处理*/
                var $scrollBarTrack = $param.find(".scrollBarTrack");
                var $li = $scrollPane.find("li");
                if ($scrollBarTrack.length) {
                    vm.styleHandle($scrollPane, $li)[param].showScroll();
                } else {
                    vm.styleHandle($scrollPane, $li)[param].hideScroll();
                }
            }
        };
        /*玩家转至锦标赛列表页*/
        vm.tournaments = function () {
            avalon.vmodels["show_inventory"].toggle = false;
            openTourney();
        };
        /*玩家转至tourMode*/
        vm.tourmode = function () {
            avalon.vmodels["show_inventory"].toggle = false;
            tourMode();
        };
        /*打开商城*/
        vm.showStore = function (param) {
            avalon.vmodels["show_inventory"].toggle = false;
            avalon.vmodels["store"].showShopDialog("show_store", param, "items");
        };
        /*弹出框*/
        vm.openDialog = {
            title: "title_inventory",
            modal: "inventory",
            width: "1016px",
            onOpen: function () {
                vm.init();
                /*缩放*/
                PLAY.scaleDialog();
            },
            onConfirm: function () {
            },
            onClose: function () {
                inventory.bigEmojisUrl = "";
                /*缩放还原*/
                PLAY.resetScaleDialog();
            }
        };
        /*点击按钮*/
        vm.show = function (id, type) {
            avalon.vmodels[id].toggle = true;
            if (type) {
                /*关闭shop中其他弹框*/
                avalon.vmodels["show_store"].toggle = false;
                avalon.vmodels["show_changeClothes"].toggle = false;
                avalon.vmodels["show_single_buy"].toggle = false;
                avalon.vmodels["show_info"].toggle = false;
                /*对应打开选项卡*/
                vm.tabClick(vm.baseData.indexOf(type), type);
            }
        }
    });
});


