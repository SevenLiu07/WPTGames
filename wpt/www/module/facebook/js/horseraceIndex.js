/**
 * Created by shiwz on 17-5-16.
 */
require(["../../model/horserace-model", "domReady!"], function (horseraceModel) {
    var horserace = avalon.define("horseraceIndex", function (vm) {
        /* 初始化信息 */
        vm.baseData = ["1号", "2号", "3号", "4号", "5号", "6号"];
        vm.numIndex = -1;
        vm.inviter = "";
        vm.inviterUserName = "";
        vm.facebookUserName = "";
        vm.numClick = function (index, param) {
            var baseData = vm.baseData;
            for (var i = 0; i < baseData.length; i++) {
                horserace[baseData[i]] = false;
            }
            horserace.numIndex = index;
            horserace[param] = true;
        };
        vm.sendFriends = function (facebookUserId, facebookUserName) {
            horseraceModel.getFaceBookInvitableFriends("", function (res) {
                if (res.Value) {
                    FB.ui({
                            method: 'apprequests',
                            message: 'Come play PlayWPT\'s Texas Holdem Poker with me!',
                            filters: ['app_non_users']
                        },
                        function (response) {
                            if (!response.to) {
                                return;
                            }
                            var param = {
                                "facebookUserId": facebookUserId,
                                "facebookUserName": facebookUserName,
                                "num": "",
                                /* "friendsId":res.Value,*/
                                "to": JSON.stringify(response.to),
                                "request": response.request
                            };
                            if (horserace.numIndex >= 0) {
                                param["num"] = parseInt(horserace.numIndex) + 1;
                            }
                            console.log(param);
                            horseraceModel.shareFriends(param, function (res) {
                                if (res.Value) {
                                }
                            }, function (res) {
                            }, function (res) {
                            });
                        }
                    );
                } else {
                    alert("Sorry, you don't have any friend who can be invited.");
                }
            }, function (res) {
            }, function (res) {
            });
        };
        vm.getInviter = function (share) {
            FB.init({
                appId: '185704731921538',
                xfbml: true,
                version: 'v2.8'
            });
            function onLogin(response) {
                if (response.status == 'connected') {
                    FB.api('/me?fields=name', function (data) {
                        if (data.id) {
                            horserace.inviter = data.id;
                            horserace.facebookUserName = data.name;
                            if (share) {
                                vm.sendFriends(data.id, data.name);
                            } else {
                                /*获取邀请者*/
                                vm.getInviterUserName(horserace.inviter);
                            }
                        }
                    });
                }
            }
            FB.getLoginStatus(function (response) {
                // Check login status on load, and if the user is
                // already logged in, go directly to the welcome message.
                if (response.status == 'connected') {
                    onLogin(response);
                } else {
                    // Otherwise, show Login dialog first.
                    FB.login(function (response) {
                        onLogin(response);
                    }, {scope: 'user_friends, email'});
                }
            });
        };
        vm.share = function () {
            if (horserace.inviter) {
                vm.sendFriends(horserace.inviter, horserace.facebookUserName);
            } else {
                vm.getInviter(true);
            }
        };
        /*获取邀请者*/
        vm.getInviterUserName = function (facebookUserId) {
            var param = {"facebookUserId": facebookUserId};
            horseraceModel.getInviterUserName(param, function (res) {
                if (res.Value) {
                    horserace.inviterUserName = res.Value.inviterUserName;
                }
            }, function (res) {
            }, function (res) {
            });
        };
    });
    avalon.scan();
    horserace.getInviter();
});
