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
        vm.voteVideoData = [];
        vm.voteVideoCookie = "voteSuccess";
        vm.sortBy = 1;
        vm.voteFinished = false;
        vm.showVideoVoteInfo = false;
        vm.showVideoShareInfo = false;
        vm.showVoteEndInfo = false;
        vm.showVoteVideoInfo = true;
        vm.urlParam = {
            "vote": "wpt/www/module/facebook/vote.html",
            "voteSuccess": "wpt/www/module/facebook/voteSuccess.html",
            "voteEnd": "wpt/www/module/facebook/voteEnd.html"
        };
        vm.shareInfo = {
            "name": "Who is the winner",
            "description": "Let’s see who is winner.",
            "picture": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493376598374&di=cc1d43fabc5116138e82146164ab1ab0&imgtype=0&src=http%3A%2F%2Ffile.taihe.gov.cn%2F20170320%2F20170320084355571_XlJvFvCn.jpg"
        };
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
            PLAY.Router({
                initialize: function () {
                    voteModel.getVideosByGroupCode(param, function (res) {
                        if (res.Value) {
                            /*状态判断*/
                            //res.Value.VoteGroup.IsFinished = true;
                            if (res.Value.VoteGroup && res.Value.VoteGroup.IsFinished) {
                                videoVote.voteFinished = true;
                                location.hash = "voteEnd";
                            } else {
                                if (location.href.indexOf(vm.urlParam.voteSuccess) !== -1) {
                                } else {
                                    /* var voteVideoCookie = PLAY.cookie(vm.voteVideoCookie,{'domain':'.playwpt.com','path':'/'});*/
                                    var voteVideoCookie = PLAY.cookie(vm.voteVideoCookie);
                                    if (voteVideoCookie) {
                                        location.hash = "videoShare";
                                    } else {
                                        location.hash = "videoVote";
                                    }
                                }
                            }
                            if (res.Value.Videos) {
                                var videos = res.Value.Videos;
                                videoVote.voteVideoData = videos;
                                vm.swiper();
                                vm.initData();
                            }
                        }
                    }, function (res) {
                    }, function (res) {
                    });
                },
                routes: {
                    'videoVote': 'getVideoVote',
                    'videoShare': 'getVideoShare',
                    'voteEnd': 'getVoteEnd'
                },
                getVideoVote: function () {
                    videoVote.showVideoShareInfo = false;
                    videoVote.showVideoVoteInfo = true;
                    $(".content").removeClass("video_share").removeClass("video_vote").addClass("video_vote");
                },
                getVideoShare: function () {
                    videoVote.showVideoVoteInfo = false;
                    videoVote.showVideoShareInfo = true;
                    $(".content").removeClass("video_vote").removeClass("video_share").addClass("video_share");
                },
                getVoteEnd: function () {
                    videoVote.showVoteVideoInfo = false;
                    videoVote.showVoteEndInfo = true;
                    $(".content").removeClass("video_share").removeClass("video_vote").removeClass("vote_end");
                    $("body").removeClass("video_share").removeClass("video_vote").removeClass("vote_end").addClass("vote_end");
                }
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
                }
            }
            if (location.hash.indexOf("voteEnd") !== -1 || location.href.indexOf(vm.urlParam.voteSuccess) !== -1) {
                vm.chart();
            }
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
        /*轮播*/
        vm.swiper = function () {
            if ($(".swiper-container").length) {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    parallax: true,
                    speed: 600,
                    noSwiping: true,
                    onClick: function (swiper) {
                        // var $index = $(".swiper-pagination").find(".swiper-pagination-bullet-active").index();
                        videoVote.currentVideoIndex = swiper.activeIndex;
                        vm.initData();
                    },
                    onSlideChangeEnd: function (swiper) {
                        var $index = $(".swiper-pagination").find(".swiper-pagination-bullet-active").index();
                        videoVote.currentVideoIndex = $index;
                        vm.initData();
                        vm.pauseVideo();
                    }
                });
                var iframe = document.querySelector('#iframeVideo');
                iframe.onload = function () {
                    vm.pauseVideo();
                }
            }
        };
        /*暂定视频*/
        vm.pauseVideo = function () {
            var $slide = $(".swiper-slide");
            if ($slide.find(".iframe").eq(0).contents().find("video")) {
                $slide.find(".iframe").eq(0).contents().find("video").get(0).pause();
                $slide.find(".iframe").eq(1).contents().find("video").get(0).pause();
                $slide.find(".iframe").eq(2).contents().find("video").get(0).pause();
            }
        };
        /*投票操作*/
        vm.addVote = function () {
            var param = {"videoID": videoVote.videoID};
            voteModel.addVote(param, function (res) {
                if (res.Value) {
                    /*存cookie*/
                    if (PLAY.baseUrl.indexOf(".playwpt.com") !== -1) {
                        PLAY.cookie(vm.voteVideoCookie, 1, {'domain': '.playwpt.com', 'path': '/'});
                    } else {
                        PLAY.cookie(vm.voteVideoCookie, 1, {'domain': location.hostname, 'path': '/'});
                    }
                    if (PLAY.url.getQuery() && PLAY.url.getQuery().videoID) {
                        location.href = PLAY.baseUrl + vm.urlParam.voteSuccess + "?videoID=" + PLAY.url.getQuery().videoID;
                    } else {
                        location.href = PLAY.baseUrl + vm.urlParam.voteSuccess + "?videoID=" + videoVote.videoID;
                    }
                    localStorage.setItem('isAdd', 1);
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /* 点击左箭头*/
        vm.swiperClickPrev = function (e) {
            if ($(e.target).hasClass("swiper-button-disabled")) {
                return false;
            }
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
            if ($(e.target).hasClass("swiper-button-disabled")) {
                return false;
            }
            var $index = $(".swiper-pagination").find(".swiper-pagination-bullet-active").index();
            if ($index === 2) {
                $index = 0;
            } else {
                $index = $index + 1;
            }
            videoVote.currentVideoIndex = $index;
            vm.initData();
        };
        /*跳转至成功或者结束页面*/
        vm.result = function () {
            if (videoVote.voteFinished) {
                var link = PLAY.baseUrl + vm.urlParam.vote + "?videoID=" + videoVote.videoID;
                location.href = link + "#voteEnd";
            } else {
                location.href = PLAY.baseUrl + vm.urlParam.voteSuccess + "?videoID=" + videoVote.videoID;
            }
        };
        /* 视频分享*/
        vm.share = function () {
            var link = location.href;
            if (location.hash.indexOf("voteEnd") !== -1) {
            } else {
                vm.shareInfo.name = videoVote.videoTitle;
                vm.shareInfo.description = videoVote.videoDescription;
                vm.shareInfo.picture = videoVote.sharePicUrl;
                var voteVideoCookie = PLAY.cookie(vm.voteVideoCookie);
                link = PLAY.baseUrl + vm.urlParam.vote + "?videoID=" + videoVote.videoID;
                if (voteVideoCookie) {
                    link = link + "#videoShare";
                } else {
                    link = link + "#videoVote";
                }
            }
            FB.init({
                appId: '122212108221118',
                xfbml: true,
                version: 'v2.8'
            });
            FB.ui({
                method: 'feed',
                name: vm.shareInfo.name,
                caption: 'PLAYWPT',
                description: vm.shareInfo.description,
                link: link,
                picture: vm.shareInfo.picture,
                actions: [
                    {name: 'playwpt', link: 'http://www.playwpt.com/'}
                ]
            }, function (response) {
                if (response) {
                    alert("Shared Successfully!");
                }
            });
        };
        vm.chart = function () {
            var newData = [
                {
                    name: '<span class="person_img"><img src="https://www.playwpt.com/wpt/www/module/facebook/images/1.png"></span><span  class="person_text">1</span>',
                    y: 0,
                    drilldown: '',
                    color: "#c46f1c"
                },
                {
                    name: '<span class="person_img"><img  src="https://www.playwpt.com/wpt/www/module/lobby/images/select_avatar.png"></span><span  class="person_text">2</span>',
                    y: 0,
                    drilldown: '',
                    color: "#c46f1c"
                },
                {
                    name: '<span class="person_img"><img src="https://www.playwpt.com/wpt/www/module/facebook/images/1.png"></span><span  class="person_text">3</span>',
                    y: 0,
                    drilldown: '',
                    color: "#c46f1c"
                }
            ];
            var videos = videoVote.voteVideoData;
            var max = videos[0].VoteCount;
            var min = videos[0].VoteCount;
            for (var i = 0; i < videos.length; i++) {
                newData[i].name = '<span class="person_img"><img  src="' + videos[i].VideoAuthorAvatarURL + '"></span><span  class="person_text">' + videos[i].VideoAuthorName + '</span>';
                newData[i].y = videos[i].VoteCount;
                newData[i].drilldown = videos[i].VideoAuthorName;
                if (max < videos[i].VoteCount) {
                    max = videos[i].VoteCount
                }
                if (min > videos[i].VoteCount) {
                    min = videos[i].VoteCount
                }
            }
            for (var j = 0; j < newData.length; j++) {
                if (max === newData[j].y) {
                    newData[j].color = "#c41c21";
                }
                if (min === newData[j].y) {
                    newData[j].color = "#306def";
                }
            }
            $("#container").attr("max", max);
            $("#container").attr("min", min);
            Highcharts.chart('container', {
                chart: {
                    type: 'column',
                    style: {
                        fontSize: "18px",
                        color: '#fff',
                        fontFamily: "arial"
                    },
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 1,
                            y2: 1
                        },
                        stops: [
                            [0, '#132164'],
                            [1, '#3e3e40']
                        ]
                    },
                    events: {
                        // 图表加载完毕后执行的回调函数
                        load: function () {
                            /*+1动画效果*/
                            function niceIn(prop) {
                                prop.find('i').addClass('niceIn');
                                setTimeout(function () {
                                    prop.find('i').removeClass('niceIn');
                                }, 1000);
                            }

                            if (location.href.indexOf(vm.urlParam.voteSuccess) !== -1) {

                                if (PLAY.url.getQuery() && PLAY.url.getQuery().videoID && localStorage.getItem('isAdd')) {
                                    setTimeout(function () {
                                        $.tipsBox({
                                            obj: $(".highcharts-data-label-color-0"),
                                            str: "+1",
                                            callback: function () {
                                                localStorage.removeItem('isAdd');
                                            }
                                        });
                                        niceIn($(this));
                                    }, 1000);
                                }
                            }
                        }
                    },
                    plotBorderColor: '#606063'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'category',
                    lineColor: '#192f7d',
                    gridLineColor: "#192f7d",
                    gridLineDashStyle: "Dash",
                    labels: {
                        x: -10,
                        style: {
                            color: '#fff',
                            fontSize: "18px"
                        }

                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    tickColor: "#192f7d",
                    gridLineColor: "#192f7d",
                    gridLineDashStyle: "Dash",
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize: "18px"
                        },
                        formatter: function () {
                            return this.value
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },
                series: [{
                    pointWidth: 50,
                    name: '',
                    colorByPoint: true,
                    color: '#fff',
                    dataLabels: {
                        style: {
                            fontSize: '14px',
                            fontWeight: 'normal',
                            color: '#fff',
                            textOutline: '1px contrast'
                        }
                    },
                    data: newData
                }]
            });

        }
    });
    avalon.scan();
    videoVote.getVideosByGroupCode();
});
