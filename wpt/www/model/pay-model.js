/**
 * Created by liuhuan on 2016/12/22.
 */
define(function (require, exports) {
    var _payment = {
        /*获取用户支付详情信息*/
        getPaymentInfo: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "pay/payment/GetUserPaymentMessage",
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
                    errorcallback && errorcallback(textStatus, res);
                }
            })
        },
        /*提交支付*/
        confirmOrder: function (loading, data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                $loading: $("#pay_loading"),
                showLoading: true,
                url: PLAY.webApiUrl + "pay/payment/preauth",
                data: data,
                timeout: "60000",
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
                    errorcallback && errorcallback(textStatus, res);
                }
            })
        }
    };
    return _payment;
});
