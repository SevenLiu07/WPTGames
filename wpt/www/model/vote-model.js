/**
 * Created by shiwz on 17-3-8.
 */
define(function (require, exports) {
    var voteModel = {
        /*投票操作 */
        addVote: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "VideoVoteApi/VideoVote/AddVote",
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
        /*获取视频信息*/
        getVideosByGroupCode: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "VideoVoteApi/VideoVote/SelectVideosByGroupCode",
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
        /*获取facebook url*/
        getFacebookLoginEntranceURL: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/page/FacebookLogin/GetFacebookLoginEntranceURL",
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
            })
        },
        getLoginUserInfo: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/Passport/GetLoginUserInfo",
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
        showLoading: function () {
            //if($("#loadingHorseraceModel").length){$("#loadingHorseraceModel").show()}
        },
        hideLoading: function () {
            // if($("#loadingHorseraceModel").length){$("#loadingHorseraceModel").hide()}
        }
    };
    return voteModel;
});
