/**
 * Created by shiwz on 17-6-1.
 */
require(["../../model/vote-model", "domReady!"], function (voteModel) {
    var videoVote = avalon.define("videoVote", function (vm) {
        /* 初始化信息*/
        vm.videoID = "";
        vm.groupCode = "G001";
        vm.videoAuthorAvatarURL = "";
        vm.videoAuthorName = "";
        vm.videoDescription = "";
        vm.videoURL = "";
        vm.videoTitle = "";
        vm.sharePicUrl = "";
        vm.currentVoteRank = 0;
        vm.currentVoteCount = "";
        vm.currentVideoIndex = 0;
        vm.currentVoteUrl = "";
        vm.voteVideoData = [];
        vm.voteVideoCookie = "voteSuccess";
        vm.sortBy = 1;
        vm.voteFinished = false;
        vm.hasVote = false;
        vm.showVideoVoteInfo = false;
        vm.showVideoShareInfo = false;
        vm.showVoteEndInfo = false;
        vm.showVoteVideoInfo = true;
        vm.voteBtnText = "VOTE";
        /*获取视频信息*/
        vm.getVideosByGroupCode = function () {
            // vm.chart();
            /*  var param = {"groupCode":videoVote.groupCode,"selectedVideoID":"","sortBy":""};*/
            /* *   值分别为：1、2、3
             分别代表三种排序方式：
             1：随机排序、2：按得票数排序、3：选定的视频放在第一个位置排序。
             如果没有这个参数，那么就按照随机来进行排序
             **/
            if (PLAY.url.getQuery() && PLAY.url.getQuery().videoID) {
                videoVote.videoID = PLAY.url.getQuery().videoID;
                videoVote.sortBy = 3;
            }
            var param = {"groupCode": videoVote.groupCode};
            if (videoVote.videoID) {
                param = {"groupCode": videoVote.groupCode, "selectedVideoID": videoVote.videoID, "sortBy": 3};
            } else {
                /*结束页面默认按最高得票排序*/
                if (location.href.indexOf("vote_end") !== -1) {
                    param = {"groupCode": videoVote.groupCode, "sortBy": 2};
                } else {
                    param = {"groupCode": videoVote.groupCode, "sortBy": videoVote.sortBy};
                }
            }
            voteModel.getVideosByGroupCode(param, function (res) {
                if (res.Value) {
                    res.Value.VoteGroup.IsFinished = true;
                    if (res.Value.VoteGroup && res.Value.VoteGroup.IsFinished) {
                        videoVote.voteFinished = true;
                        videoVote.voteBtnText = "Winner";
                    } else {
                        var voteVideoCookie = PLAY.cookie(vm.voteVideoCookie);
                        if (voteVideoCookie) {
                            videoVote.hasVote = true;
                            videoVote.voteBtnText = "√";
                        }
                    }
                    if (res.Value.Videos) {
                        var videos = res.Value.Videos;
                        videoVote.voteVideoData = videos;
                        vm.swiper();
                        vm.initData();
                    }
                    vm.initLogin();
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /* 赋值*/
        vm.initData = function () {
            var videos = videoVote.voteVideoData;
            for (var i = 0; i < videos.length; i++) {
                if (videoVote.currentVideoIndex === i) {
                    videoVote.videoID = videos[i].VideoID;
                    videoVote.videoAuthorName = videos[i].VideoAuthorName;
                    videoVote.videoDescription = videos[i].VideoDescription;
                    videoVote.videoAuthorAvatarURL = videos[i].VideoAuthorAvatarURL;
                    videoVote.videoTitle = videos[i].VideoTitle;
                    videoVote.sharePicUrl = videos[i].SharePicUrl;
                    videoVote.currentVoteCount = videos[i].VoteCount;
                    videoVote.currentVoteRank = videos[i].Rank;
                    videoVote.currentVoteUrl = videos[i].VideoURL;
                }
            }
            //vm.swiper();
        };
        /*轮播*/
        vm.swiper = function () {
            if ($(".swiper-container").length) {
                videoVote.mySwiper = new Swiper('.swiper-container', {
                    speed: 300,
                    loop: true,
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    effect: 'fade',
                    fade: {
                        crossFade: false
                    },
                    onSlideChangeStart: function () {
                        $(".swiper-slide").find("iframe").fadeOut(10, function () {
                            // $(".swiper-slide").find("iframe").attr("src","");
                            $(".swiper-slide").find("iframe").each(function () {
                                if ($(this).parent().hasClass("swiper-slide-active")) {
                                    $(this).parent().find("iframe").fadeIn();
                                }
                            })
                        });
                    },
                    onSlideChangeEnd: function (swiper) {
                    }
                });
            }
        };
        /*投票操作*/
        vm.addVote = function () {
            var param = {"videoID": videoVote.videoID};
            if (videoVote.voteFinished) {

            } else if (videoVote.hasVote) {
                PLAY.mobile.Dialog({
                    TITLE: '',
                    context: $("#play").html(),
                    afterOpen: function () {
                        $("#playNowBtn").on("click", function () {
                            vm.clickHeader("poker");
                        });
                    }
                });
            } else {
                voteModel.addVote(param, function (res) {
                    if (res.Value) {
                        /*存cookie*/
                        if (PLAY.baseUrl.indexOf(".playwpt.com") !== -1) {
                            PLAY.cookie(vm.voteVideoCookie, 1, {'domain': '.playwpt.com', 'path': '/'});
                        } else {
                            PLAY.cookie(vm.voteVideoCookie, 1, {'domain': location.hostname, 'path': '/'});
                        }
                        localStorage.setItem('isAdd', 1);
                        videoVote.hasVote = true;
                        videoVote.voteBtnText = "√";
                    }
                }, function (res) {
                }, function (res) {
                });
            }
        };
        /* 点击左箭头*/
        vm.swiperClickPrev = function (e) {
            var $index = $(".swiper-pagination").find(".swiper-pagination-bullet-active").index();
            if ($index === 0) {
                $index = 2;
            } else {
                $index = $index - 1;
            }
            videoVote.currentVideoIndex = $index;
            vm.initData();
        };
        /*点击右箭头*/
        vm.swiperClickNext = function (e) {
            var $index = $(".swiper-pagination").find(".swiper-pagination-bullet-active").index();
            if ($index === 2) {
                $index = 0;
            } else {
                $index = $index + 1;
            }
            videoVote.currentVideoIndex = $index;
            vm.initData();
        };
        vm.facebookLoginClick = function (url) {
            if (window.localStorage) {
                var storage = window.localStorage;
                storage.setItem("newH5", location.href);
                location.href = url;
            }
        };
        /* facebook 登陆*/
        vm.facebookLogin = function () {
            var param = {"version": Math.random()};
            voteModel.getFacebookLoginEntranceURL(param, function (res) {
                if (res.Value && res.Value.RedirectUrl) {
                    // $("#facebookLoginBtn").attr("href",res.Value.RedirectUrl);
                    $("#facebookLoginBtn").on("click", function () {
                        vm.facebookLoginClick(res.Value.RedirectUrl);
                    });
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*点击头部*/
        vm.clickHeader = function (param) {
            var u = navigator.userAgent;
            var sUserAgent = navigator.userAgent.toLowerCase();
            var IsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var IsIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var IsMidp = sUserAgent.match(/midp/i) == "midp";
            var IsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var IsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var IsAndroid = sUserAgent.match(/android/i) == "android";
            var IsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var IsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            var IsWinxin = sUserAgent.match(/MicroMessenger/i) == "micromessenger";
            if (IsIpad || IsIOS) {
                window.location.href = "itms-apps://itunes.apple.com/us/app/world-poker-tour-playwpt-texas/id1144458302";
                setTimeout(
                    function () {
                        window.location.href = PLAY.baseUrl + "mobile_ios.html";
                    },
                    5000);
            } else if (IsMidp || IsUc7 || IsUc || IsAndroid || IsCE || IsWM || IsWinxin) {
                setTimeout(function () {
                    window.location.href = "https://play.google.com/store/apps/details?id=com.playwpt.mobile.poker";
                }, 20);
                setTimeout(
                    function () {
                        window.location.href = PLAY.baseUrl + "mobile_android.html";
                    },
                    5000);
            } else {
                if (param) {
                    location.href = PLAY.pokerUrl;
                } else {
                    location.href = PLAY.indexUrl;
                }
            }
        };
        /*判断登录*/
        vm.initLogin = function () {
            if (PLAY.userInfo) {
                vm.userInfoHandle();
            } else {
                voteModel.getLoginUserInfo({}, function (res) {
                    if (res) {
                        PLAY.userInfo = res;
                        vm.userInfoHandle();
                    }
                }, function (res) {
                }, function (res) {
                });
            }
        };
        /*用户信息处理*/
        vm.userInfoHandle = function () {
            var userInfo = PLAY.userInfo;
            if (userInfo) {
                var userInfoVal = userInfo.Value;
                if (userInfo.State === 1 && userInfoVal && userInfoVal.IsLogined) {
                } else {
                    PLAY.mobile.Dialog({
                        TITLE: '',
                        context: $("#facebook-login").html(),
                        afterOpen: function () {
                            vm.facebookLogin();
                        }
                    });
                }
            }
        };
    });
    avalon.scan();
    videoVote.getVideosByGroupCode();
});
