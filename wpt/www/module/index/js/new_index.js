/**
 * Created by liuhuan on 17-11-14.
 */
$(function () {
    /**
     * 首页点击playnow
     * @method [getLoginUserInfo]
     * @param poker
     * */
    $("#playnow").on("click",function(){
        getLoginUserInfo("poker");
        fbq('track', 'index_poker_click');//facebook像素统计首页点击poker及let's play按钮
        ga('send', 'event', 'index', 'poker_click');
    });
    function getLoginUserInfo(param) {
        /*判断登录*/
        PLAY.ajax.Get({
            url: PLAY.webApiUrl + "WebAPI/Passport/GetLoginUserInfo",
            success: function (data, res) {
                if (res) {
                    handle(param, res);
                }
            },
            fail: function (data, res) {
            },
            error: function (data, res) {
            }
        });
    }

    function handle(param, res) {
        if (res && res.Value) {
            var userInfoVal = res.Value;
            var IEVersion = PLAY.isIE();
            if (res.State === 1 && userInfoVal && userInfoVal.IsLogined) {
                if (param === "poker") {
                    if(IEVersion && IEVersion <= 9){
                        location.href = PLAY.baseUrl + 'poker-flash'; // ie低版本跳转flash版本poker
                    } else {
                        location.href = PLAY.pokerUrl; // poker
                    }
                } else if (param === "slots") {
                    location.href = PLAY.baseUrl + "slots";
                }
            } else {
                // 获取cookie
                if (PLAY.cookie('userEmail')) {
                    window.location.href = PLAY.baseAccountUrl + '#/login?direct'
                } else {
                    window.location.href = PLAY.baseAccountUrl + '#/signup?direct'
                }
            }
        }
    }
});
