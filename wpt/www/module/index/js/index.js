$(function () {
    var i = $("#renovationSlide"),
        n = i.find("li"),
        a = n.size(),
        l = 0;
    t();
    $(".silde_area .btn_left").bind("click", function () {
        l--, 0 > l && (l = a - 1), t()
    });
    $(".silde_area .btn_right").bind("click", function () {
        l++, l >= a && (l = 0), t()
    });
    function t() {
        for (var t = 0; 5 > t; t++) {
            switch (t) {
                case 0:
                    var e = l - 2;
                    e = e >= 0 ? e : e + a;
                    n.eq(e).attr("class", "slide_left_out");
                    break;
                case 1:
                    var e = l - 1;
                    e = e >= 0 ? e : e + a, n.eq(e).attr("class", "slide_left");
                    break;
                case 2:
                    n.eq(l).attr("class", "slide_show");
                    break;
                case 3:
                    var e = l + 1;
                    e = a > e ? e : e - a, n.eq(e).attr("class", "slide_right");
                    break;
                case 4:
                    var e = l + 2;
                    e = a > e ? e : e - a, n.eq(e).attr("class", "slide_right_out");
                    break;
            }
        }
        var $renovationSlide = $("#renovationSlide");
        var $this = $renovationSlide.find("li.slide_show");
        var $slideRight = $renovationSlide.find("li.slide_right");
        var $slideLeft = $renovationSlide.find("li.slide_left");
        var pokerClickObj = {};
        var slotsClickObj = {};
        var userInfo = "";
        if ($this.find(".bz").length) {
            $this.siblings().find(".bz").css("display", "none");
            $this.find(".bz").css("display", "block");
        }
        if ($this.find(".bz2").length) {
            $this.siblings().find(".bz2").css("display", "none");
            $this.find(".bz2").css("display", "block");
        }
        pokerClickObj = getClickObj("poker");
        slotsClickObj = getClickObj("slots");
        pokerClickObj.bind("click", function () {
            if (!userInfo) {
                getLoginUserInfo("poker");
            } else {
                handle("poker");
            }
        });
        slotsClickObj.bind("click", function () {
            if (!userInfo) {
                getLoginUserInfo("slots");
            } else {
                handle("slots");
            }
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
            if (res) {
                userInfo = res;
            }
            var userInfoVal = userInfo.Value;
            if (userInfo.State === 1 && userInfoVal && userInfoVal.IsLogined) {
                if (param === "poker") {
                    location.href = PLAY.pokerUrl;
                } else if (param === "slots") {
                    location.href = PLAY.baseUrl + "game_slot.html";
                }
            } else {
                logRegToggle("login", "register", param);
            }
        }

        function getClickObj(param) {
            var currentObj;
            if ($this.find("." + param).length) {
                currentObj = $this;
            }
            if ($slideRight.find("." + param).length) {
                currentObj = $slideRight;
            }
            if ($slideLeft.find("." + param).length) {
                currentObj = $slideLeft;
            }
            return currentObj;
        }
    }
});



