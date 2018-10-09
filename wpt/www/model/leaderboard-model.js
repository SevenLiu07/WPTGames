/**
 * Created by liuhuan on 2017/7/12.
 */
define(function (require, exports) {
    var _leaderboard = {
        getLeaderBoardInfo: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.leaderBoardUrl + "PokerLeaderboard/WebAPI/LeaderBoard/GetLeaderBoardList",
                data: data,
                dataType: "json",
                /*jsonp: "callback",*/
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                error: function (textStatus, res) {
                    errorcallback && errorcallback(textStatus, res);
                }
            });

        }
    };
    return _leaderboard;
});
