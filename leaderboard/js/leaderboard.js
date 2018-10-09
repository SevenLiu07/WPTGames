var http_type = location.protocol + '//';
var getHost = window.location.host.split('.');
var baseUrl = "";
if (location.href.indexOf('staging') !== -1) {
    leaderBoardUrl = http_type + "staging-napi." + getHost[1] + '.com/';
} else {
    leaderBoardUrl = http_type + "napi." + getHost[1] + '.com/';
}
// 获取tab对应数据
var tab1 = $("#tab1");
var tab2 = $("#tab2");
var tab3 = $("#tab3");
var checkbox = $("#checkbox");
var check_btn = $("#check_btn");
var panel_personal = $("#panel_personal");
var changeRankData = panel_personal.findAll(".changeRankData");
var boardType = 2;//排行榜类型默认为赢下的底池数
var isFriend = 0;//是否仅显示朋友默认显示全部
var Column = 1;//排序字段默认按Rank排序
var sorttype = 1;//排序方式默认升序
var term = 0;//期数默认显示当前
var isHistory = 0;//是否历史，默认否
var para = {"leaderBoardType": 2, "isFriendOnly": 0, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
window.onload = function () {
    getRankData(para);
};
tab1.onclick = function () {
    boardType = this.getData("boardtype");
    sorttype = 1;
    Column = 1;
    term = 0;
    isHistory = 0;
    for (var k = 0; k < changeRankData.length; k++) {
        if (changeRankData[k].getData("column") == 1) {
            changeRankData[k].setData("sorttype", 1)
        } else {
            changeRankData[k].setData("sorttype", 0)
        }
    }
    para = {"leaderBoardType": boardType, "isFriendOnly": isFriend, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
    getRankData(para);
};
tab2.onclick = function () {
    boardType = this.getData("boardtype");
    sorttype = 1;
    Column = 1;
    term = 0;
    isHistory = 0;
    for (var k = 0; k < changeRankData.length; k++) {
        if (changeRankData[k].getData("column") == 1) {
            changeRankData[k].setData("sorttype", 1)
        } else {
            changeRankData[k].setData("sorttype", 0)
        }
    }
    para = {"leaderBoardType": boardType, "isFriendOnly": isFriend, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
    getRankData(para);
};

tab3.onclick = function () {
    boardType = this.getData("boardtype");
    sorttype = 1;
    Column = 1;
    term = 0;
    isHistory = 0;
    for (var k = 0; k < changeRankData.length; k++) {
        if (changeRankData[k].getData("column") == 1) {
            changeRankData[k].setData("sorttype", 1)
        } else {
            changeRankData[k].setData("sorttype", 0)
        }
    }
    para = {"leaderBoardType": boardType, "isFriendOnly": isFriend, "sortColumn": 1, "sortType": 1, "term": 0, "isHistory": 0};
    getRankData(para);
};

checkbox.onclick = function () {
    if (check_btn.hasClass("onlyFriend")) {
        isFriend = 0;
    } else {
        isFriend = 1;
    }
    check_btn.toggleClass("onlyFriend");
    para = {"leaderBoardType": boardType, "isFriendOnly": isFriend, "sortColumn": Column, "sortType": sorttype, "term": term, "isHistory": isHistory};
    getRankData(para)
};

for (var i = 0; i < changeRankData.length; i++) {
    changeRankData[i].onclick = function () {
        Column = this.getData("column");
        sorttype = this.getData("sorttype");
        for (var k = 0; k < changeRankData.length; k++) {
            changeRankData[k].setData("sorttype", 0)
        }
        if (sorttype == 0) {
            this.setData("sorttype", 1);
            boardType = this.getData("boardtype");
            sorttype = 1;
            term = 0;
            isHistory = 0;
            para = {"leaderBoardType": boardType, "isFriendOnly": isFriend, "sortColumn": Column, "sortType": 1, "term": 0, "isHistory": 0};
            getRankData(para);
        } else if (sorttype == 1) {
            this.setData("sorttype", 0);
            boardType = this.getData("boardtype");
            sorttype = 1;
            term = 0;
            isHistory = 0;
            para = {"leaderBoardType": boardType, "isFriendOnly": isFriend, "sortColumn": Column, "sortType": 0, "term": 0, "isHistory": 0};
            getRankData(para);
        }
    }
}
function formatSCORE(num) {
    return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
function getRankData(para) {
//leaderBoardType（排行榜类型）：2-赢下的底池数，1-赢下的最大底池，3-最多筹码，默认为赢下的底池数,isFriendOnly（是否仅显示朋友）：0-显示全部，1-仅显示朋友，默认显示全部,sortColumn（排序字段）：1-Rank，2-角色名，3-成就值，默认按Rank排序,sortType（排序方式）：0-降序，1-升序，默认升序,term（期数）：0-当前，1~20-往期，默认显示当前,isHistory（是否历史）：0-否，1-是，默认否。
//var para={"leaderBoardType":leaderBoardType,"isFriendOnly":isFriendOnly,"sortColumn":sortColumn,"sortType":sortType,"term":term,"isHistory":isHistory};
    //new Request("https://webapps.playwpt.com/PokerLeaderboard/WebAPI/LeaderBoard/GetLeaderBoardList",{method:"POST"}).on("start",function(){
    new Request(leaderBoardUrl + "PokerLeaderboard/WebAPI/LeaderBoard/GetLeaderBoardList", {method: "POST"}).on("start", function () {
        $("#scroll-" + para.leaderBoardType).innerHTML = '';
    }).on("complete", function (e) {
        var content = JSON.parse(e.text);
        if (content.State == 1) {
            var str = '';
            if (content.Value && content.Value.length > 0) {
                for (var i = 0; i < content.Value.length; i++) {
                    if (content.Value[i].IsSelf == true) {
                        if (content.Value[i].Rank >= 10000) {
                            str += '<li class="clear"><span class="tit_rank">9999+</span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        } else if (content.Value[i].Rank == 1) {
                            str += '<li class="clear"><span class="tit_rank"><img src="image/rank_one.png"></span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        } else if (content.Value[i].Rank == 2) {
                            str += '<li class="clear"><span class="tit_rank"><img src="image/rank_two.png"></span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        } else if (content.Value[i].Rank == 3) {
                            str += '<li class="clear"><span class="tit_rank"><img src="image/rank_three.png"></span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        } else {
                            str += '<li class="clear"><span class="tit_rank">' + content.Value[i].Rank + '</span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        }
                    } else {
                        if (content.Value[i].Rank == 1) {
                            str += '<li class="clear"><span class="tit_rank"><img src="image/rank_one.png"></span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        } else if (content.Value[i].Rank == 2) {
                            str += '<li class="clear"><span class="tit_rank"><img src="image/rank_two.png"></span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        } else if (content.Value[i].Rank == 3) {
                            str += '<li class="clear"><span class="tit_rank"><img src="image/rank_three.png"></span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        } else {
                            str += '<li class="clear"><span class="tit_rank">' + content.Value[i].Rank + '</span><a class="tit_player tit_player1" title="' + content.Value[i].RoleName + '">' + content.Value[i].RoleName + '</a><span class="tit_num">' + formatSCORE(content.Value[i].Score) + '</span></li>';
                        }
                    }
                }
                $("#scroll-" + para.leaderBoardType).innerHTML = str;
            } else {
                $("#scroll-" + para.leaderBoardType).innerHTML = content.Message;
            }
        } else {
            $("#scroll-" + para.leaderBoardType).innerHTML = content.Message;
        }
    }).send(para);
}
