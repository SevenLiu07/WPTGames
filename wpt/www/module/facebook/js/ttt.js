/**
 * Created by shiwz on 17-5-31.
 */
var res = {
    "Value": {
        "Videos": [
            {
                "VideoID": 1,
                "VideoAuthorName": "Tan Hongxing",
                "VideoAuthorAvatarURL": "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%A4%B4%E5%83%8F&step_word=&hs=0&pn=5&spn=0&di=187820014360&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=3693293090%2C1723315653&os=3741974285%2C3553940003&simid=4040900570%2C50959331",
                "VideoDescription": "网名：我愿用十年盛夏 | 换你无受无忧",
                /* "VideoURL": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FWorldPokerTour%2Fvideos%2F10156242909564129%2F&show_text=0",*/
                "VideoURL": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FPlayWPTGame%2Fvideos%2F420919664957890%2F&show_text=false",
                "VoteCount": 15,
                "VideoTitle": "Tan Hongxing",
                "CreatedTime": "2014-04-05 00:00:00",
                "Rank": 1,
                "VoteGroupID": 1
            },
            {
                "VideoID": 2,
                "VideoAuthorName": "Shi Wanzhou",
                "VideoAuthorAvatarURL": "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%A4%B4%E5%83%8F&step_word=&hs=0&pn=58&spn=0&di=155315612210&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=2100171423%2C3506013212&os=2458837389%2C972488852&simid=4232549013%2C51152849",
                "VideoDescription": "阳光型卡通男生头像",
                "VideoURL": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FWorldPokerTour%2Fvideos%2F10156242909564129%2F&show_text=0",
                "VideoTitle": "Wanzhou",
                "VoteCount": 1,
                "Rank": 2,
                "CreatedTime": "2018-04-06 00:00:00",
                "VoteGroupID": 1
            },
            {
                "VideoID": 3,
                "VideoAuthorName": "Liu Huan",
                "VideoAuthorAvatarURL": "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%A4%B4%E5%83%8F&step_word=&hs=0&pn=5&spn=0&di=187820014360&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=3693293090%2C1723315653&os=3741974285%2C3553940003&simid=4040900570%2C50959331",
                "VideoDescription": "伤心男生头像 一个人难过是两个人的过错",
                "VideoURL": "http://www.zhangxinxu.com/study/media/cat.mp4",
                "VoteCount": 2,
                "VideoTitle": "Huan",
                "Rank": 3,
                "CreatedTime": "2014-03-07 00:00:00",
                "VoteGroupID": 1
            }
        ],
        "VoteGroup": {
            "IsFinished": true,
            "VoteGroupID": 1,
            "VoteGroupCode": "G001",
            "StartTime": "2015-10-11 00:00:00",
            "EndTime": "2019-10-15 00:00:00",
            "CreatedTime": null
        }
    },
    "State": 1,
    "Message": null
};

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
        vm.currentVideoURL = "";
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
                if (location.hash.indexOf("voteEnd") !== -1) {
                    param = {"groupCode": videoVote.groupCode, "sortBy": 2};
                } else {
                    param = {"groupCode": videoVote.groupCode, "sortBy": videoVote.sortBy};
                }
            }
            /*voteModel.getVideosByGroupCode(param,function(res){
             if(res.Value){
             if(res.Value.VoteGroup && res.Value.VoteGroup.IsFinished){
             videoVote.voteFinished = true;
             }else{
             var voteVideoCookie = PLAY.cookie(vm.voteVideoCookie);
             if(voteVideoCookie){
             videoVote.hasVote = true;
             videoVote.voteBtnText = "√";
             }
             }
             if(res.Value.Videos){
             var videos = res.Value.Videos;
             videoVote.voteVideoData = videos;
             vm.swiper();
             vm.initData();
             }
             }
             },function(res){
             },function(res){
             });*/
            if (res.Value) {
                if (res.Value.VoteGroup && res.Value.VoteGroup.IsFinished) {
                    videoVote.voteFinished = true;
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
                    vm.initData();
                    vm.swiper();
                }
            }
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
                    videoVote.currentVideoURL = videos[i].VideoURL;
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
                        /*  //$(".swiper-slide").find("iframe").attr("src","");
                         $(".swiper-slide").find("iframe").each(function(){
                         if($(this).parent().hasClass("swiper-slide-active")){
                         */
                        /*$(this).parent().find("iframe").fadeIn(200,function(){
                         $(this).parent().find("iframe").attr("src",videoVote.currentVideoURL);
                         });*/
                        /*
                         $(this).parent().find("iframe").attr("src",videoVote.currentVideoURL);
                         }
                         })*/
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
                        //  console.log(videoVote.currentVideoURL)
                        /* $(".swiper-slide").find("iframe").fadeOut(500,function(){
                         // $(".swiper-slide").find("iframe").attr("src","");
                         $(".swiper-slide").find("iframe").each(function(){
                         if($(this).parent().hasClass("swiper-slide-active")){
                         $(this).parent().find("iframe").fadeIn();
                         }
                         })
                         });*/
                    }
                });
            }
        };
        /*投票操作*/
        vm.addVote = function () {
            var param = {"videoID": videoVote.videoID};
            if (videoVote.voteFinished) {

            } else if (videoVote.hasVote) {

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
        vm.facebookLoginClick = function () {
            if (window.localStorage) {
                var storage = window.localStorage;
                storage.setItem("newH5", 1);
            }
        };
        /* facebook 登陆*/
        vm.facebookLogin = function () {
            var param = {"version": Math.random()};
            videoVote.getFacebookLoginEntranceURL(param, function (res) {
                if (res.Value && res.Value.RedirectUrl) {
                    //login.facebookLoginHref = res.Value.RedirectUrl;

                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*点击头部*/
        vm.clickHeader = function () {
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
                        window.location.href = "https://www.playwpt.com/mobile_ios.html";
                    },
                    5000);
            } else if (IsMidp || IsUc7 || IsUc || IsAndroid || IsCE || IsWM || IsWinxin) {
                setTimeout(function () {
                    window.location.href = "https://play.google.com/store/apps/details?id=com.playwpt.mobile.poker";
                }, 20);
                setTimeout(
                    function () {
                        window.location.href = "https://www.playwpt.com/mobile_android.html";
                    },
                    5000);
            } else {
                location.href = PLAY.indexUrl;
            }
        };
        /*判断登录*/
        vm.init = function () {
            /* PLAY.ajax.Get({
             url: PLAY.baseUrl + "WebAPI/Passport/GetLoginUserInfo",
             success: function (data, res) {
             if (res) {
             PLAY.userInfo = res;
             var userInfo = PLAY.userInfo;
             if (userInfo) {
             var userInfoVal = userInfo.Value;
             if (userInfo.State === 1 && userInfoVal && userInfoVal.IsLogined) {
             vm.getVideosByGroupCode();
             } else {
             console.log("please login");
             PLAY.mobile.Dialog({
             TITLE:'',
             //context:$("#select-avatar").html(),
             context:$("#facebook-login").html(),
             //context:$("#play").html(),
             afterOpen:function(){
             vm.facebookLogin();
             }
             });
             }
             }
             }
             },
             fail: function (data, res) {
             },
             error: function (data, res) {
             }
             });*/
            vm.getVideosByGroupCode();
            /*PLAY.mobile.Dialog({
             TITLE:'',
             context:$("#facebook-login").html(),
             afterOpen:function(){
             var _this = this;
             $(".close").on("click",function(){
             _this.close();
             });
             }
             });*/
        };
    });
    avalon.scan();
    videoVote.init();
});

