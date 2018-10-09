/**
 * Created by liuhuan on 17-10-10.
 */
$(function () {
    var $renovationSlide = $("#renovationSlide");
    var $games = $("#renovationSlide ul li");
    var $playbtn = $("#renovationSlide ul li span");
    $playbtn.eq(0).css("display", "block");
    $games.mouseover(function () {
        $(this).find("span").css("display", "block").parent().siblings().find("span").css("display", "none");
    });
    $renovationSlide.find(".slide_right").bind("click", function () {
        getLoginUserInfo("slots");
        fbq('track', 'index_slots_click');//facebook像素统计首页点击slots及let's play按钮
        ga('send', 'event', 'index', 'slots_click');
    });
    $renovationSlide.find(".slide_left").bind("click", function () {
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
            if (res.State === 1 && userInfoVal && userInfoVal.IsLogined) {
                if (param === "poker") {
                    location.href = PLAY.pokerUrl;
                } else if (param === "slots") {
                    location.href = PLAY.baseUrl + "slots";
                }
            } else {
                // 获取cookie
                if (PLAY.cookie('userEmail')) {
                    logRegToggle("login", "register", param)
                } else {
                    logRegToggle("register", "login", param)
                }
                // logRegToggle("register", "login", param);
            }
        }
    }
});
