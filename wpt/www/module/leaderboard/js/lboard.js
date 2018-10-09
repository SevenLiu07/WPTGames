/**
 * Created by liuhuan on 2017/7/12.
 */
require(["../../model/leaderboard-model.js"], function (lboard_model) {
    var lboard = avalon.define({
        $id: "leaderboard",
        handswon: true,
        biggest: false,
        mostchips: false,
        tabs: ['handswon', 'biggest', 'mostchips'],
        navindex: "",
        handswonData: [],
        param: {},
        pictrueUrl: "",
        isFriends: 0,//是否仅显示朋友 默认显示全部
        boardType: 2,//排行榜类型默认为赢下的底池数
        column: 1,//排序字段默认按Rank排序
        sortType: 1,//排序方式默认升序
        terms: 0,//期数默认显示当前
        isHistory: 0,//是否为历史排行榜，默认否
        itselfRank: "",
        itselfPlayer: "",
        itselfHandswon: "",
        rank: true,
        player: true,
        hwon: true,
        /*Init*/
        init: function () {
            lboard.tab_switch(0, 'handswon');//default tabs hands won
        },
        /*Friends Only*/
        friendOnly: function () {
            var fdOnly = $("#fdOnly");
            if (fdOnly.hasClass("fd-only-check")) {
                lboard.isFriends = 0;
            } else {
                lboard.isFriends = 1;
            }
            fdOnly.toggleClass("fd-only-check");
            lboard.parame = {"version": Math.random(), "leaderBoardType": lboard.boardType, "isFriendOnly": lboard.isFriends, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
            lboard.rankingData(lboard.parame);
        },
        /*tab切换*/
        tab_switch: function (index, param) {
            var tabsData = lboard.tabs;
            for (var i = 0; i < tabsData.length; i++) {
                lboard[tabsData[i]] = false;
            }
            lboard.navindex = index;
            lboard[param] = true;
            /*tabs click*/
            if (param == 'handswon') {
                lboard.boardType = 2;
                lboard.parame = {"version": Math.random(), "tabs": param, "leaderBoardType": lboard.boardType, "isFriendOnly": 0, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
                lboard.rankingData(lboard.parame);
            } else if (param == 'biggest') {
                lboard.boardType = 1;
                lboard.parame = {"version": Math.random(), "tabs": param, "leaderBoardType": lboard.boardType, "isFriendOnly": 0, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
                lboard.rankingData(lboard.parame);
            } else if (param == 'mostchips') {
                lboard.boardType = 3;
                lboard.parame = {"version": Math.random(), "tabs": param, "leaderBoardType": lboard.boardType, "isFriendOnly": 0, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
                lboard.rankingData(lboard.parame);
            }
        },
        /*data sorting*/
        dataSort: function (param, columns) {
            if (param === "handswon") {
                lboard.boardType = 2;
            } else if (param === "biggest") {
                lboard.boardType = 1;
            } else if (param === "mostchips") {
                lboard.boardType = 3;
            }
            if (lboard.sortType === 0) {
                lboard.sortType = 1;
            } else if (lboard.sortType === 1) {
                lboard.sortType = 0;
            }
            lboard.parame = {"version": Math.random(), "leaderBoardType": lboard.boardType, "isFriendOnly": 0, "sortColumn": columns, "sortType": lboard.sortType, "term": 0, "isHistory": 0};
            lboard.rankingData(lboard.parame);
        },
        /*handswon*/
        rankingData: function (parame) {
            //leaderBoardType（排行榜类型）：2-赢下的底池数，1-赢下的最大底池，3-最多筹码，默认为赢下的底池数
            // isFriendOnly（是否仅显示朋友）：0-显示全部，1-仅显示朋友，默认显示全部
            // sortColumn（排序字段）：1-Rank，2-角色名，3-成就值，默认按Rank排序
            // sortType（排序方式）：0-降序，1-升序，默认升序
            // term（期数）：0-当前，1~20-往期，默认显示当前,isHistory（是否历史）：0-否，1-是，默认否
            var rankdata = [
                {
                    "IsSelf": true,
                    "Rank": 274,
                    "RoleName": "sweethuaner07",
                    "Score": 1000728
                },
                {
                    "IsSelf": false,
                    "Rank": 1,
                    "RoleName": "traneman",
                    "Score": "671513786"
                },
                {
                    "IsSelf": false,
                    "Rank": 2,
                    "RoleName": "Surape",
                    "Score": "531656127"
                },
                {
                    "IsSelf": false,
                    "Rank": 3,
                    "RoleName": "DOUGX",
                    "Score": "323422436"
                },
                {
                    "IsSelf": false,
                    "Rank": 4,
                    "RoleName": "mrb1947",
                    "Score": "286865626"
                },
                {
                    "IsSelf": false,
                    "Rank": 5,
                    "RoleName": "WPTGuest_pbmn8wyx",
                    "Score": "5555555555"
                },
                {
                    "IsSelf": false,
                    "Rank": 8,
                    "RoleName": "7777777777",
                    "Score": "0"
                },
                {
                    "IsSelf": false,
                    "Rank": 22,
                    "RoleName": "888888888",
                    "Score": "0"
                },
                {
                    "IsSelf": false,
                    "Rank": 13,
                    "RoleName": "9999999999",
                    "Score": "0"
                },
                {
                    "IsSelf": false,
                    "Rank": 4,
                    "RoleName": "101010101010",
                    "Score": "0"
                },
                {
                    "IsSelf": false,
                    "Rank": 5,
                    "RoleName": "1111111111111",
                    "Score": "34534534664"
                }
            ];
            lboard_model.getLeaderBoardInfo(parame, function (res) {
                if (res.Value) {
                    var rankdata = res.Value;
                    //var rankdata=rankdata;//测试数据test
                    //提出第一条本人排名数据
                    var itself = rankdata.shift();
                    lboard.itselfRank = itself.Rank;
                    lboard.itselfPlayer = itself.RoleName;
                    lboard.itselfHandswon = PLAY.formatScore(itself.Score);
                    lboard.formatData(rankdata);
                    lboard.handswonData = rankdata;
                    lboard.scrollBar(parame.tabs);//调用滚动条
                }
            }, function (res) {
            }, function (res) {
            })
        },
        /*格式化数据*/
        formatData: function (data) {
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    data[i].Score = PLAY.formatScore(data[i].Score);
                }
            }
        },
        /*有无滚动条样式处理*/
        styleHandle: function ($scrollPane, $li) {
            var param = {
                "handswon": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "0");
                        $li.css("marginRight", "0")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "0");
                        $li.css("marginRight", "0");
                    }
                },
                "biggest": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "0");
                        $li.css("marginRight", "0")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "0");
                        $li.css("marginRight", "0");
                    }
                },
                "mostchips": {
                    "showScroll": function () {
                        $scrollPane.css("paddingLeft", "0");
                        $li.css("marginRight", "0")
                    },
                    "hideScroll": function () {
                        $scrollPane.css("paddingLeft", "0");
                        $li.css("marginRight", "0");
                    }
                }
            };
            return param;
        },
        /*滚动条效果ScrollBar*/
        scrollBar: function (param) {
            if (param) {
                var $param = $('#' + param), $scrollPane = $param.find(".scroll-pane");
                $scrollPane.scrollBar({
                    scrollbarWidth: 37,
                    scrollbarMargin: 0,
                    arrowHeight: 78
                });
                /*有无滚动条样式处理*/
                var $scrollBarTrack = $param.find(".scrollBarTrack");
                var $li = $scrollPane.find("li");
                if ($scrollBarTrack.length) {
                    lboard.styleHandle($scrollPane, $li)[param].showScroll();
                } else {
                    lboard.styleHandle($scrollPane, $li)[param].hideScroll();
                }
            }
        },
        /*弹窗popup*/
        $leaderboard: {
            title: "title_store",
            modal: "store",
            width: "1016px",
            onOpen: function () {
                lboard.init();
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        },
        /*Open Dialog*/
        show: function (id) {
            avalon.vmodels[id].toggle = true;
        }
    });
    avalon.scan();
});
