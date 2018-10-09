define(function (require, exports) {
    var promotionModel = {
        /*getItemsList 获取背包道具列表*/
        getItemCode: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "PromoApi/Promotion/ExchangeWelfare",
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
        /*promoLimitedTimeGoodsList */
        promoLimitedTimeGoodsList: function (data, callback, failcallback, errorcallback) {
            var data = {"platform": 200};
            if (location.href.indexOf("facebook") !== -1) {
                data = {"platform": 300};
            }
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "PromoApi/Promotion/PromoLimitedTimeGoodsList",
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
        showLoading: function () {
            if ($("#loadingPromotion").length) {
                $("#loadingPromotion").show()
            }
        },
        hideLoading: function () {
            if ($("#loadingPromotion").length) {
                $("#loadingPromotion").hide()
            }
        }
    };
    return promotionModel;
});
/**
 * Created by shiwz on 16-12-19.
 */
