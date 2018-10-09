define(function (require, exports) {
    var storeModel = {
        /* getSubGoodsList 获取换肤信息*/
        getSubGoodsList: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "MallApi/Mall/GetSubGoodsList",
                showLoading: true,
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* queryPrice 选项卡商品询价*/
        queryPrice: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "MallApi/Mall/QueryPrice",
                showLoading: true,
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* createOrder 创建订单*/
        createOrder: function (data, callback, failcallback, errorcallback) {
            storeModel.showLoading();
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "MallApi/Mall/CreateOrder",
                data: data,
                success: function (data, res) {
                    storeModel.hideLoading();
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    storeModel.hideLoading();
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    storeModel.hideLoading();
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* facebook 创建订单*/
        facebookCreateOrder: function (data, callback, failcallback, errorcallback) {
            storeModel.showLoading();
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "mallapi/Mall/FacebookCreateOrder",
                data: data,
                success: function (data, res) {
                    storeModel.hideLoading();
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    storeModel.hideLoading();
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    storeModel.hideLoading();
                    errorcallback && errorcallback(res);
                }
            });
        },
        /*getGoodsListByMenu 获取商品信息*/
        getGoodsListByMenu: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "MallApi/Mall/GetGoodsListByMenu",
                showLoading: true,
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /*getAvatarList 获取头像列表*/
        getAvatarList: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "AvatarApi/UserAvatar/GetPersonalAvatarList",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* getCharmList 获取礼物列表*/
        getCharmList: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/UserInfo/GetCharmList",
                data: data,
                showLoading: true,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            })
        },
        /* getEmojisList 获取表情列表*/
        getEmojisList: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/UserInfo/GetEmojiPacks",
                data: data,
                showLoading: true,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            })
        },
        /*GetLoginUserInfo获取用户登录信息*/
        getLoginUserInfo: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/Passport/GetLoginUserInfo",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /*getUserCoinCount获取用户金币数量*/
        getUserCoinCount: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/Passport/GetUserCoinCount",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* getCharmList 获取礼物列表*/
        getCharmList: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/UserInfo/GetCharmList",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (textStatus, res) {
                    errorcallback && errorcallback(res);
                }
            })
        },
        /*设置幸运物*/
        selectCharm: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/UserInfo/SelectCharm",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (textStatus, res) {
                    errorcallback && errorcallback(res);
                }
            })
        },
        /*设置当前头像*/
        setCurrentAvatar: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/UserAvatar/SetCurrentAvatar",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (textStatus, res) {
                    errorcallback && errorcallback(res);
                }
            })
        },
        showLoading: function () {
            if ($("#loadingBatchBuy").length) {
                $("#loadingBatchBuy").show()
            }
            if ($("#loadingBuy").length) {
                $("#loadingBuy").show()
            }
            if ($("#loadingPromotion").length) {
                $("#loadingPromotion").show()
            }
        },
        hideLoading: function () {
            if ($("#loadingBatchBuy").length) {
                $("#loadingBatchBuy").hide()
            }
            if ($("#loadingBuy").length) {
                $("#loadingBuy").hide()
            }
            if ($("#loadingPromotion").length) {
                $("#loadingPromotion").hide()
            }
        }

    };
    return storeModel;
});
/**
 * Created by shiwz on 16-12-19.
 */
