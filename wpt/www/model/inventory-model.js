define(function (require, exports) {
    var inventoryModel = {
        /*getItemsList 获取背包道具列表*/
        getItemList: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/UserInfo/GetItemsList",
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
                error: function (textStatus, res) {
                    errorcallback && errorcallback(res);
                }

            });
        },
        /* getTicketList 获取门票列表*/
        getTicketList: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/UserInfo/GetTicketList",
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
        }
    };
    return inventoryModel;
});
/**
 * Created by shiwz on 16-12-2.
 */
