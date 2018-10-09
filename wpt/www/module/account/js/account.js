require(["../../model/account-model.js"], function (accountModel) {
    if (PLAY) {
        var urlParam = PLAY.url.getQuery();
    }
    /*注册模块Regist*/
    var register = avalon.define("register", function (vm) {
        vm.isfbFLogin = "";
        /* 初始化信息 */
        vm.email = "";
        vm.password = "";
        vm.errorMsg = "";
        vm.showErrorMsg = false;
        /*验证码信息Captcha Info*/
        vm.showCaptcha = false;
        vm.captchaSrc = "";
        vm.captchaVal = "";
        vm.captchaToken = "";
        vm.inputUsername = "";
        /*sex默认1 default 1*/
        vm.sex = 1;
        /*验证邮箱*/
        vm.currentEmailClass = "";
        vm.currentEmailHref = "javascript:void(0)";
        vm.time = 120;
        vm.showTime = false;
        //vm.validateEmailMessage = "To get started, please validate your email and we will give you 5,000 Gold to start playing. Validating your email will also unlock your free lucky spin.";
        vm.validateEmailMessage = "Be sure to check your spam or junk folder and add PlayWPT to your safe sender list to ensure tips and free gold offers make it to your inbox.";
        /*公共参数Common Param*/
        var paramCommon = {"version": Math.random(), 'isH5': true};
        /*公共提示信息 Pulblic notice*/
        vm.showPlayGamesBtn = false;
        vm.publicMessageTitle = "";
        vm.publicMessageCon = "";
        vm.facebookRegisterHref = "javascript:void(0)";
        vm.platformId = "";
        /*整个初始化Init Regist*/
        vm.initRegister = function () {
            /*推广链接打开注册弹框*/
            if (location.href.indexOf("signup") !== -1) {
                if (urlParam && urlParam.email) {
                    register.email = urlParam.email;
                }
                vm.show("show_register");
            }
            /*验证邮件初始化*/
            if (urlParam && urlParam.step) {
                var step = urlParam.step;
                /*验证邮件失效，点击重新发送相应邮件并跳转并开始120秒倒计时*/
                if (step == -11) {
                    register.publicMessageCon = "The validation link has already expired. Please validate email right now.";
                    register.publicMessageTitle = "Validate Email Notice";
                    register.showPlayGamesBtn = true;
                    vm.show("show_validateEmailError");
                } else if (step == 0) {
                    /*提示成功*/
                    register.publicMessageTitle = urlParam.title;
                    register.publicMessageCon = urlParam.msg;
                    vm.show("show_validateEmailSuc");
                    avalon.vmodels["loginInfo"].getUserInfo();
                    if (urlParam.msgcode) {
                        if (urlParam.isReg == 1) {//isReg 1 注册 0 登录
                            fbq('track', 'signup_fb_fail', {error: urlParam.msgcode});//facebook像素统计登陆注册失败
                            ga('send', 'event', 'signup', 'fb', 'fail', urlParam.msgcode);
                        } else {
                            fbq('track', 'login_fb_fail', {error: urlParam.msgcode});//facebook像素统计登陆登陆失败
                            ga('send', 'event', 'login', 'fb', 'fail', urlParam.msgcode);
                        }
                    }
                } else if (step == 11) {
                    if (location.href.indexOf("guide") !== -1) {
                        register.isfbFLogin = false;
                    } else {
                        register.isfbFLogin = true;//不弹出促销及商城
                    }
                }
            } else {
                /*首次加载处理用户信息*/
                vm.userInfoHandleFirstLoad();
            }
        };
        /*普通用户验证成功邮件后提示获得25k金币成功窗口 等待牌桌加载后再弹出*/
        vm.goldBouns = function (param) {
            if (urlParam.step == 11 && param == true) {
                if (location.href.indexOf("guide") !== -1) {
                    //#guide存在，则不再弹出首次获得免充窗口
                    avalon.vmodels["fbFirstLogin"].toggle = false;
                } else {
                    //邮件中点击验证邮件链接跳转至poker页面后打开获得免充提示窗口
                    avalon.vmodels["fbFirstLogin"].toggle = true;
                    avalon.vmodels["loginInfo"].getUserInfo();
                }
            } else if (window.location.href.indexOf("getBonus") != -1 && register.platformId === 100) {
                    if (location.href.indexOf("guide") !== -1) {
                        register.isfbFLogin = false;
                        //#guide存在，则不再弹出首次获得免充窗口
                        avalon.vmodels["fbFirstLogin"].toggle = false;
                    } else {
                        register.isfbFLogin = true;//不弹出促销及商城
                        //邮件中点击验证邮件链接跳转至poker页面后打开获得免充提示窗口
                        avalon.vmodels["fbFirstLogin"].toggle = true;
                    }
            }
        };
        /*用户信息处理优化*/
        vm.userInfoHandleFirstLoad = function () {
            var userInfo = PLAY.userInfo;
            if (userInfo) {
                var userInfoVal = userInfo.Value;
                if (userInfo.State === 1 && userInfoVal && userInfoVal.IsLogined) {
                    register.platformId = userInfoVal.PlatformId;//PlatformId值为100表示为facebook用户
                    /*如果未绑定联众账号 则打开创建用户名窗口*/
                    if (!userInfoVal.IsBindLz) {
                        register.isfbFLogin = true;
                        window.location.href = PLAY.baseAccountUrl + '#/username';
                    } else if (!userInfoVal.IsBindAvatar) {
                        register.isfbFLogin = true;
                        /*如果未选择头像 则打开选择头像窗口*/
                        //vm.show("show_selectAvatar");
                        window.location.href = PLAY.baseAccountUrl + '#/avatar';
                    } else if (userInfoVal.UserStatus === 'ToValidate') {
                        register.isfbFLogin = true;
                        /*如果验证邮箱，则打开验证邮箱窗口*/
                        register.validateEmailMessage =register.htmlDecodeByRegExp(userInfoVal.Message);
                        register.email = userInfoVal.Email;
                        register.inputUsername = userInfoVal.LzDisplayName;
                        vm.show("show_validateEmail");
                    }
                }
            } else {
                /*没有获取到用户信息重新请求接口*/
                vm.userInfoHandle();
            }
        };
        vm.htmlDecodeByRegExp = function (str) {
            var s = "";
            if (str.length == 0) {
                return "";
            }
            s = str.replace(/&amp;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            return s;
        };
        /*用户信息处理*/
        vm.userInfoHandle = function () {
            accountModel.getLoginUserInfo({}, function (res) {
                if (res) {
                    PLAY.userInfo = res;
                    vm.userInfoHandleFirstLoad();
                }
            }, function (res) {
            }, function (res) {
            });
        };
        vm.initRegisterDialog = function () {
            vm.showCaptchaWhenRegister();
        };
        /*输入框获取焦点事件*/
        vm.inputFocus = function (str) {
            if (this.getAttribute("placeholder") === str) {
                this.setAttribute("placeholder", "");
            }
        };
        /*验证码失去焦点*/
        vm.captchaBlur = function () {
            if (register.captchaVal.trim() === "") {
                if (this.setAttribute) {
                    this.setAttribute("placeholder", "Captcha");
                }
            }
        };
        /*邮箱失去焦点事件*/
        vm.emailBlur = function () {
            register.email = document.getElementById("registerEmail").value;
            if (register.email.indexOf("") !== -1) {
                register.email = register.email.replace(/[ ]/g, "");//清除空格替换
            }
            var checkEmail = PLAY.checkEmail(register.email.trim(), function (msg) {
                register.errorMsg = msg;
            });
            if (register.email.trim() === "") {
                if (this.setAttribute) {
                    this.setAttribute("placeholder", "Email");
                }
            }
            if (!checkEmail) {
                register.showErrorMsg = true;
                return false;
            } else {
                register.showErrorMsg = false;
            }
            return true;
        };
        /*密码失去焦点事件*/
        vm.passwordBlur = function () {
            var checkEmail = PLAY.checkPassword(register.password.trim(), 6, 16, function (msg) {
                register.errorMsg = msg;
            });
            if (register.password.trim() === "") {
                if (this.setAttribute) {
                    this.setAttribute("placeholder", "Password");
                }
            }
            if (!checkEmail) {
                register.showErrorMsg = true;
                return false;
            } else {
                register.showErrorMsg = false;
            }
            return true;
        };
        /*刷新验证码Reload Captcha*/
        vm.reloadCaptcha = function () {
            accountModel.getCaptchaToken({}, function (res) {
                if (res.Value) {
                    var result = res.Value;
                    if (result) {
                        register.showCaptcha = true;
                        register.captchaToken = result;
                        register.captchaSrc = PLAY.webApiUrl + "WebAPI/page/Captcha/GenerateCaptchaImg?time=" + (new Date()).getTime() + "&token=" + result;
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*判断注册时是否需要验证码*/
        vm.showCaptchaWhenRegister = function () {
            accountModel.showCaptchaWhenRegister({}, function (res) {
                if (res) {
                    var result = res.Value;
                    if (result && result === 1) {
                        register.showCaptcha = true;
                        /*切换验证码*/
                        vm.reloadCaptcha();
                    } else {
                        register.showCaptcha = false;
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        };
        /*给密码加密*/
        vm.rsaEncrypto = function () {
            var result = PLAY.rsaEncrypto(register.password);
            if (result) {
                return result;
            }
        };
        /*提交注册*/
        vm.webRegister = function () {
            /*检测邮箱*/
            var checkEmail = vm.emailBlur();
            if (!checkEmail) {
                return;
            }
            /*检测密码*/
            var checkPassword = vm.passwordBlur();
            if (!checkPassword) {
                return;
            }
            /*密码加密*/
            var pwd = vm.rsaEncrypto();
            if (!pwd) {
                accountModel.getCryptoToken({}, function (res) {
                    if (res) {
                        pwd = vm.rsaEncrypto();
                        vm.webRegister2(pwd);
                    }
                }, function (res) {
                }, function (res) {
                });
            } else {
                vm.webRegister2(pwd);
                fbq('track', 'signup_click');//facebook像素统计点击注册按钮
                ga('send', 'event', 'signup', 'signup_click');
            }
        };
        vm.webRegister2 = function (pwd) {
            var param = {"version": Math.random(), 'email': register.email, 'pwd': pwd, 'promotion': true, "catpchaCode": register.captchaVal, "captchaToken": register.captchaToken};
            accountModel.webRegister(param, function (res) {
                if (res) {
                    avalon.vmodels["loginInfo"].getUserInfo();
                    fbq('track', 'signup_email_success');//facebook像素统计完成注册
                    vm.hide("show_register");
                    vm.show("show_createUsername");
                    //google统计
                    ga('send', 'event', 'signup', 'email', 'success');
                    ga('send', 'event', 'Signup', 'Register', 'E-mail');
                    window.google_trackConversion({google_conversion_id: 864698956, google_conversion_label: conversionLabels.em, google_remarketing_only: false});
                }
            }, function (res) {
                if (res.State == -100) {
                    /*Facebook&email account connection*/
                    logRegToggle('login', 'register');
                    //注册的账号自动填写到email文本框
                    avalon.vmodels["login"].email = register.email;
                    avalon.vmodels["login"].showErrorMsg = true;
                    avalon.vmodels["login"].errorMsg = "An account with your email has already been registered. If you forgot your password, please click on Forgot Password below to reset your password.";
                } else {
                    if (res.State !== 21) {
                        vm.reloadCaptcha();
                        register.captchaVal = "";
                        register.errorMsg = res.Message;
                        register.showErrorMsg = true;
                    }
                    register.errorMsg = res.Message;
                    register.showErrorMsg = true;
                    register.showCaptcha = true;
                }
                ga('send', 'event', 'signup', 'email', 'fail', register.errorMsg);
            }, function (res) {
                register.errorMsg = res.Message;
                register.showErrorMsg = true;
                fbq('track', 'signup_email_fail', {error: register.errorMsg});//facebook像素统计注册失败及失败原因
                ga('send', 'event', 'signup', 'email', 'fail', register.errorMsg);
            });
        };
        /*选择头像事件*/
        vm.selectSex = function (param) {
            register.sex = param;
        };
        /*创建用户名获取焦点*/
        vm.inputUsernameFocus = function () {
            if (this.getAttribute("placeholder") === "Enter username") {
                this.setAttribute("placeholder", "");
                this.style.color = "#fff";
            }
        };
        /*创建用户名失去焦点*/
        vm.inputUsernameBlur = function () {
            if (register.inputUsername === "") {
                this.setAttribute("placeholder", "Enter username");
            }
        };
        /*改变邮箱按钮*/
        vm.changeEmailBtn = function () {
            var emailVal = register.email;
            if (emailVal.indexOf('@gmail.com') !== -1) {
                register.currentEmailClass = "gmail";
                register.currentEmailHref = "https://mail.google.com/";
            } else if (emailVal.indexOf('@outlook.com') !== -1) {
                register.currentEmailClass = "outlook";
                register.currentEmailHref = "https://outlook.com/";
            } else if (emailVal.indexOf('@hotmail.com') !== -1) {
                register.currentEmailClass = "hotmail";
                register.currentEmailHref = "https://hotmail.com/";
            } else if (emailVal.indexOf('@yahoo.com') !== -1) {
                register.currentEmailClass = "yahoo";
                register.currentEmailHref = "https://mail.yahoo.com/";
            } else if (emailVal.indexOf('@qq.com') !== -1) {
                register.currentEmailClass = "qq";
                register.currentEmailHref = "https://mail.qq.com/";
            }
        };
        vm.facebookRegisterClick = function () {
            if (window.localStorage) {
                var storage = window.localStorage;
                storage.setItem("newH5", 1);
            }
            fbq('track', 'signup_fb_click');//facebook像素统计点击facebook注册按钮
            ga('send', 'event', 'signup', 'signup_fb_click');
        };
        /* facebook 注册*/
        vm.facebookRegister = function () {
            var param = {"version": Math.random()};
            accountModel.getFacebookLoginEntranceURL(param, function (res) {
                if (res.Value && res.Value.RedirectUrl) {
                    register.facebookRegisterHref = res.Value.RedirectUrl;
                }
            }, function (res) {
                register.errorMsg = res.Message;
                register.showErrorMsg = true;
            }, function (res) {
                register.errorMsg = res.Message;
                register.showErrorMsg = true;
            });
        };
        /*google analytics and facebook Pixel code*/
        vm.statistics = function () {
            if (location.href.indexOf("facebook") !== -1) {
                fbq('track', 'fb_create_username_fail', {erro: register.errorMsg});//facebook像素统计facebook创建username失败及原因
                ga('send', 'event', 'fb_signup', 'username_create', 'fail', register.errorMsg);
            } else {
                fbq('track', 'create_username_fail', {erro: register.errorMsg});//facebook像素统计创建username失败及原因
                ga('send', 'event', 'signup', 'username_create', 'fail', register.errorMsg);
            }
        };
        /*创建username*/
        vm.selectAvatar = function () {
            //var userNameVal = register.inputUsername;
            var userNameVal = $(".input_username").val();
            var errorMsg = "";
            if (userNameVal === "") {
                errorMsg = "Please input your username";
            } else if (userNameVal.indexOf(" ") >= 0) {
                errorMsg = "Sorry, your Username cannot contain space";
            } else if (userNameVal.replace(/[^\x00-\xff]/g, 'xx').length < 4) {
                errorMsg = "Your username is too short, please input 4-20 characters as your username";
            } else if (userNameVal.replace(/[^\x00-\xff]/g, 'xx').length > 20) {
                errorMsg = "Your username is too long, please input 4-20 characters as your username";
            } else {
                /*绑定账号*/
                var param = {"version": Math.random(), 'roleName': userNameVal, 'isH5': true};
                accountModel.bindLzRoleName(param, function (res) {
                    if (res) {
                        avalon.vmodels["loginInfo"].getUserInfo();
                        /*QA GA统计*/
                        vm.hide("show_createUsername");
                        register.isfbFLogin = true;//首次注册登录
                        vm.show("show_selectAvatar");
                        if (location.href.indexOf("facebook") !== -1) {
                            fbq('track', 'fb_create_username_success');//facebook像素统计facebook完成创建username
                            ga('send', 'event', 'fb_signup', 'username_create');
                        } else {
                            fbq('track', 'create_username_success');//facebook像素统计完成创建username
                            ga('send', 'event', 'signup', 'username_create');
                        }
                        ga('send', 'event', 'Signup', 'Entered', 'Username');
                        window.google_trackConversion({google_conversion_id: 864698956, google_conversion_label: conversionLabels.ue, google_remarketing_only: false});
                        /*fb用户首次登陆弹出获得免充提醒*/
                        if (location.href.indexOf("facebook") !== -1 || location.href.indexOf("poker") !== -1) {
                            try {
                                if (wpt) {
                                    wpt.play.js.againLoginGame();//创建完username后重新连接游戏 connection game
                                }
                            } catch (e) {
                            }
                        }
                    }
                }, function (res) {
                    if (res.State === -101 && res.Value) {
                        $(".input_username").val(res.Value);
                    }
                    register.errorMsg = res.Message;
                    register.showErrorMsg = true;
                    vm.statistics();//google analytics and facebook Pixel
                }, function (res) {
                    register.errorMsg = res.Message;
                    register.showErrorMsg = true;
                    vm.statistics();//google analytics and facebook Pixel
                });
            }
            if (errorMsg) {
                register.errorMsg = errorMsg;
                register.showErrorMsg = true;
            }
        };
        /*倒计时*/
        vm.countDown = function () {
            if (register.time === 1) {
                clearInterval(vm.countDownInterval);
                register.showTime = false;
                register.time = 120;
            } else {
                register.time--;
            }
        };
        /*发送邮件*/
        vm.resendEmail = function () {
            if (!register.showTime) {
                register.showTime = true;
                vm.countDownInterval = setInterval(vm.countDown, 1000);
                accountModel.toValidateEmail(paramCommon, function (res) {
                }, function (res) {
                    console.log(res.Message)
                }, function (res) {
                    console.log(res.Message)
                });
            }
        };
        /*弹出注册框*/
        vm.openRegisterDialog = {
            title: "title_register",
            modal: true,
            width: "968px",
            smallDialog: true,
            onOpen: function () {
                vm.initRegisterDialog();
                vm.facebookRegister();//获取facebook url链接
                fbq('track', 'signup_view');//facebook像素统计打开注册弹窗
                ga('send', 'event', 'signup', 'view');
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        };
        /*弹出选择头像*/
        vm.openSelectAvatarDialog = {
            title: "title_selectAvatar",
            modal: true,
            width: "833px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
                var avatarCode = "";
                if (register.sex === 1) {
                    avatarCode = '1001';
                } else {
                    avatarCode = '2001';
                }
                var param = {"version": Math.random(), 'sex': register.sex, 'avatarCode': avatarCode};
                accountModel.bindAvatar(param, function (res) {
                    if (res) {
                        vm.hide("show_selectAvatar");
                        vm.userInfoHandle();//重新读取接口数据
                        /*fb用户首次登陆弹出获得免充提醒*/
                        if (location.href.indexOf("facebook") !== -1 || location.href.indexOf("poker") !== -1) {
                            try {
                                if (wpt) {
                                    wpt.play.js.toGameUpdateCoin();//创建完头像后重新加载获取金币回调，解锁牌桌
                                }
                            } catch (e) {
                            }
                        }
                        /*facebook内嵌游戏首次登陆注册弹出获得免充提醒*/
                        if (location.href.indexOf("facebook") !== -1 || register.platformId === 100) {
                            avalon.vmodels["fbFirstLogin"].toggle = true;
                        }
                        avalon.vmodels["loginInfo"].getUserInfo();
                        if (register.sex === 1) {//register.sex 1:男 2：女
                            if (location.href.indexOf("facebook") !== -1) {
                                fbq('track', 'fb_gender_male_click');//facebook像素统计facebook完成选择头像
                                ga('send', 'event', 'fb_signup', 'avatar_male_click');
                            } else {
                                fbq('track', 'gender_male_click');//facebook像素统计facebook完成选择头像
                                ga('send', 'event', 'signup', 'avatar_male_click');
                                ga('send', 'event', 'Signup', 'Avatar', 'M');
                            }
                        } else {
                            if (location.href.indexOf("facebook") !== -1) {
                                fbq('track', 'fb_gender_female_click');//facebook像素统计facebook完成选择头像
                                ga('send', 'event', 'fb_signup', 'avatar_female_click');
                            } else {
                                fbq('track', 'gender_female_click');//facebook像素统计facebook完成选择头像
                                ga('send', 'event', 'signup', 'avatar_female_click');
                                ga('send', 'event', 'Signup', 'Avatar', 'F');
                            }
                        }
                        window.google_trackConversion({google_conversion_id: 864698956, google_conversion_label: conversionLabels.as, google_remarketing_only: false});
                    } else {
                        fbq('track', 'Selectavatar');//facebook像素统计完成选择头像
                    }
                }, function (res) {
                    register.errorMsg = res.Message;
                    register.showErrorMsg = true;
                }, function (res) {
                    register.errorMsg = res.Message;
                    register.showErrorMsg = true;
                });
                /*GA统计选择头像按钮点击次数*/
                if (location.href.indexOf("facebook") !== -1) {
                    ga('send', 'event', 'fb_signup', 'signup_finished_click');
                } else {
                    ga('send', 'event', 'signup', 'signup_finished_click');
                }
            },
            onClose: function () {
            }
        };
        /*弹出创建用户名Create Username*/
        vm.openCreateUsernameDialog = {
            title: "title_username",
            modal: true,
            width: "833px",
            smallDialog: true,
            onOpen: function () {
                register.errorMsg = "";
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        };
        /*弹出验证邮箱Validate Email*/
        vm.openValidateEmailDialog = {
            title: "title_validateEmail",
            modal: true,
            width: "903px",
            smallDialog: true,
            onOpen: function () {
                vm.changeEmailBtn();
            },
            onConfirm: function () {
            },
            onClose: function () {
                if (urlParam && urlParam.step) {
                    location.href = PLAY.indexUrl;
                }
            }
        };
        /*弹出验证邮箱成功Validate Email Successfull*/
        vm.openValidateEmailSucDialog = {
            title: "title_validateEmailSuc",
            modal: true,
            width: "833px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
                location.href = PLAY.pokerUrl;
            },
            onClose: function () {
            }
        };
        /*弹出验证邮箱失效Validate Email Timeout*/
        vm.openValidateEmailErrorDialog = {
            title: "title_validateEmailError",
            modal: true,
            width: "833px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        };
        /*创建登录注册公共提示信息Public Message Dialog*/
        vm.openPublicMessageDialog = {
            title: "title_publicMessage",
            modal: true,
            width: "833px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
                location.href = PLAY.pokerUrl;
            },
            onClose: function () {
            }
        };
        /*隐藏弹框Hide Dialog*/
        vm.hide = function (id) {
            avalon.vmodels[id].toggle = false;
        };
        /*显示弹框Open Dialog*/
        vm.show = function (id) {
            avalon.vmodels[id].toggle = true;
        }
    });
    avalon.scan();
    register.initRegister();
    /*登录模块Login*/
    var sub_cg_pwd = 0;
    var game_name = "";
    var login = avalon.define({
        $id: "login",
        email: "",
        pwd: "",
        hasCaptchaImage: false,
        captchaVal: "",
        showCaptcha: false,
        catpchaCode: "",
        captchaToken: "",
        captchaSrc: "",
        errorMsg: "",
        showErrorMsg: false,
        facebookLoginHref: "javascript:void(0)",
        /*forgot pwd*/
        user_email: "",
        showEmailMsg: false,
        showPwdMsg: true,
        errorMsgEmail: "",
        errorMsgPwd: "",

        send_mail: true,
        send_mail_info: false,
        change_pwd: false,
        change_pwd_title: "",
        current_email: "",
        newpwd: "",
        confirm_newpwd: "",
        pwdMsg: "",
        outTimeMsg: "",
        showTime: false,
        time: 120,
        publicMessageTitle: "",
        publicMessageCon: "",
        /*init*/
        initLogin: function () {
            login.remeber_email();
            /*找回密码初始化*/
            var userInfo = PLAY.userInfo;
            if (userInfo) {
                var userInfoVal = userInfo.Value;
                if (userInfo.State === 1 && userInfoVal && userInfoVal.IsLogined) {
                    //club老用户迁移 cookie存在则弹窗提示，后删除cookie
                    var uid = userInfoVal.UId;
                    var get_ck = PLAY.cookie('clubfbGoldTipFlag' + uid);
                    if (get_ck) {
                        register.show("show_publicMessage");
                        register.publicMessageTitle = "Congratulations!";
                        register.publicMessageCon = userInfo.Message;
                    }
                    var clear_ck = 'clubfbGoldTipFlag' + uid;
                    PLAY.cookie(clear_ck, "", {'domain': '.playwpt.com', 'path': '/'});//使用后删除cookie
                    /*fb用户加5000金币*/
                    var get_cok = PLAY.cookie('tooLowGoldPlayerfbGoldTipFlag' + uid);
                    if (get_cok) {
                        register.show("show_publicMessage");
                        register.publicMessageTitle = "Congratulations!";
                        register.publicMessageCon = userInfo.Message;
                    }
                    var clear_cok = 'tooLowGoldPlayerfbGoldTipFlag' + uid;
                    PLAY.cookie(clear_cok, "", {'domain': '.playwpt.com', 'path': '/'});//使用后删除cookie
                }
            }
            if (urlParam && urlParam.step) {
                var step = urlParam.step;
                //step==12 --修改密码内容
                if (step == 12) {
                    //club老用户进入重新修改密码
                    if (urlParam.isOldClubWPTPlayerAndCanExchangeGold == 1) {
                        login.show("show_sendemail");
                        login.send_mail = false;
                        login.send_mail_info = false;
                        login.change_pwd = true;
                        login.change_pwd_title = "Welcome!";
                        login.current_email = "As a loyal ClubWPT member, we have a PlayWPT account waiting for you. Create a password to get started.";
                    } else {
                        //正常用户修改密码逻辑
                        login.show("show_sendemail");
                        login.send_mail = false;
                        login.send_mail_info = false;
                        login.change_pwd = true;
                        login.change_pwd_title = "Change Password";
                        login.current_email = decodeURIComponent(urlParam.email);
                    }
                } else if (step == -12) {
                    //邮件过期重新发送验证邮件
                    login.show("show_resendemail");
                    login.outTimeMsg = 'The password changing link has expired. Please click "Forget Password" button to reset the password';
                }
            } else {
                //账号流程
                avalon.vmodels["register"].userInfoHandleFirstLoad();
            }
        },
        /*邮箱获取焦点事件*/
        emailFocus: function () {
            if (this.getAttribute("placeholder") === "Email") {
                this.setAttribute("placeholder", "");
            }
        },
        /*密码获取焦点事件*/
        passwordFocus: function () {
            if (this.getAttribute("placeholder") === "Password") {
                this.setAttribute("placeholder", "");
            }
        },
        /*验证码获取焦点事件*/
        captchaFocus: function () {
            if (this.getAttribute("placeholder") === "Captcha") {
                this.setAttribute("placeholder", "");
            }
        },
        /*邮箱失去焦点事件*/
        emailBlur: function () {
            login.email = document.getElementById("loginEmail").value;
            if (login.email.indexOf("") !== -1) {
                login.email = login.email.replace(/[ ]/g, "");//清除空格替换
            }
            var checkEmail = PLAY.checkEmail(login.email.trim(), function (msg) {
                login.errorMsg = msg;
            });
            if (!checkEmail) {
                login.showErrorMsg = true;
            } else {
                login.showErrorMsg = false;
            }
            if (login.email.trim() === "") {
                this.setAttribute("placeholder", "Email");
            }
            login.showCaptchaWhenLogin();//判断登陆时是否需要显示和刷新验证码
        },
        /*密码失去焦点事件*/
        passwordBlur: function () {
            if (!(login.pwd)) {
                login.showErrorMsg = true;
                login.errorMsg = "Please enter your password";
            } else {
                login.showErrorMsg = false;
            }
            if (login.pwd.trim() === "") {
                this.setAttribute("placeholder", "Password");
            }
            login.showCaptchaWhenLogin();//判断登陆时是否需要显示和刷新验证码
        },
        /*NEW PASSWORD获取焦点事件*/
        pwdFocus: function (param) {
            if (param == "newpwd") {
                if (this.getAttribute("placeholder") === "New Password") {
                    this.setAttribute("placeholder", "");
                }
            } else if (param == "confirm_newpwd") {
                if (this.getAttribute("placeholder") === "Confirm new password") {
                    this.setAttribute("placeholder", "");
                }
            } else if (param == "useremail") {
                if (this.getAttribute("placeholder") === "Please enter your email") {
                    this.setAttribute("placeholder", "");
                }
            }
        },
        /*NEW PASSWORD失去焦点事件*/
        pwdBlur: function (param) {
            if (param == "newpwd") {
                if (login.newpwd.trim() === "") {
                    this.setAttribute("placeholder", "New Password");
                }
            } else if (param == "confirm_newpwd") {
                if (login.confirm_newpwd.trim() === "") {
                    this.setAttribute("placeholder", "Confirm new password");
                }
            } else if (param == "useremail") {
                if (login.user_email.trim() === "") {
                    this.setAttribute("placeholder", "Please enter your email");
                }
            }
        },
        /*验证码失去焦点事件*/
        catpchaBlur: function () {
            if (!(login.catpchaCode)) {
                login.showErrorMsg = true;
                login.errorMsg = "Please enter your catpchaCode";
            }
            if (login.catpchaCode.trim() === "") {
                this.setAttribute("placeholder", "Captcha");
            }
        },
        /*刷新验证码*/
        reloadCaptcha: function () {
            accountModel.getCaptchaToken({}, function (res) {
                if (res.Value) {
                    var result = res.Value;
                    if (result) {
                        login.hasCaptchaImage = true;
                        login.showCaptcha = true;
                        login.captchaToken = result;
                        login.captchaSrc = PLAY.webApiUrl + "WebAPI/page/Captcha/GenerateCaptchaImg?time=" + (new Date()).getTime() + "&token=" + result;
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        },
        /*判断登陆时是否需要验证码*/
        showCaptchaWhenLogin: function () {
            var emailWhenLong = login.email;
            accountModel.showCaptchaWhenLogin({"email": emailWhenLong}, function (res) {
                if (res) {
                    var result = res.Value;
                    if (result && result === 1) {
                        login.showCaptcha = true;//显示验证码区域
                        if (!login.hasCaptchaImage) {
                            login.reloadCaptcha();//刷新验证码
                        }
                    } else {
                        login.showCaptcha = false;//隐藏验证码区域
                    }
                }
            }, function (res) {
            }, function (res) {
            });
        },
        //------------------------------------rsa加密--------------------------------
        rsaEncrypto: function (raw) {
            setMaxDigits(131);
            var result = null;
            // 格式：   日期:PublicModules:PublicExponent
            var publicKey = PLAY.cookie('cryptowpt');
            if (publicKey && publicKey.split(':').length == 3) {
                var key = new RSAKeyPair(publicKey.split(':')[2], "", publicKey.split(':')[1], 1024);
                result = encryptedString(key, base64encode(strUnicode2Ansi(raw)), RSAAPP.PKCS1Padding);
            } else {
                accountModel.getCryptoToken({}, function (res) {
                    if (res.State) {
                        var data = res.State;
                        if (data) {
                            result = login.rsaEncrypto(raw);
                        }
                    }
                });
            }
            return result;
        },
        /*userLogin*/
        userLogin: function () {
            var get_pwd = login.pwd;
            var user_pwd = login.rsaEncrypto(get_pwd);//password Encryption
            login.showCaptchaWhenLogin();//判断登陆时是否需要显示和刷新验证码
            var checkEmail = PLAY.checkEmail(login.email.trim(), function (msg) {
                login.errorMsg = msg;
            });
            if (!checkEmail) {
                login.showErrorMsg = true;
            } else if (!(login.pwd)) {
                login.showErrorMsg = true;
                login.errorMsg = "Please enter your password";
            } else if (login.showCaptcha == true && !(login.catpchaCode)) {
                login.showErrorMsg = true;
                login.errorMsg = "Please enter your catpchaCode";
            } else {
                login.login(user_pwd);//登陆数据处理
                fbq('track', 'login_click');//facebook像素统计点击登陆按钮
                ga('send', 'event', 'login', 'login_click');
            }
        },
        /*remeber me*/
        remeber_email: function () {
            var get_cookie_email = PLAY.cookie('userEmail');
            if (get_cookie_email != '' && get_cookie_email != null) {
                login.email = get_cookie_email;
            }
        },
        /*Login*/
        login: function (user_pwd) {
            //var password=login.rsaEncrypto("loginpwd");//password Encryption
            accountModel.webLogin({"vision": Math.random(), 'email': login.email, 'pwd': user_pwd, "catpchaCode": login.catpchaCode, "captchaToken": login.captchaToken}, function (res) {
                if (res) {
                    var guideData = res.Value;
                    login.hidden("show_login");//关闭登陆窗口
                    if (game_name == "slots") {
                        location.href = PLAY.gameSlotUrl;//slots game page
                    } else {
                        if (location.href.indexOf("t=redeem") !== -1) {
                            var get_url_id = document.location.href;
                            var get_id = get_url_id.split("&");
                            //location.href = PLAY.baseUrl+"wpt/www/module/poker/index.html?t=redeem&"+get_id[1];//领取奖励url
                            location.href = PLAY.pokerUrlNoVersion + "?t=redeem&" + get_id[1];
                        } else {
                            location.href = PLAY.pokerUrl;//poker game page
                        }
                    }
                    /*QA GA统计*/
                    fbq('track', 'login_email_success');//facebook像素统计完成登陆
                    ga('send', 'event', 'login', 'email', 'success');
                    if (guideData.IsOldClubWPTPlayerAndExchangedGold == true) {//如果是club老用户且注册过play
                        login.hidden("show_login");
                        register.show("show_publicMessage");
                        register.publicMessageTitle = "Congratulations!";
                        register.publicMessageCon = res.Message;
                    } else if (guideData.IsAddedGoldForTooLowGoldPlayer == true) {//金币携带量低的用户登陆后赠送金币
                        login.hidden("show_login");
                        register.show("show_publicMessage");
                        register.publicMessageTitle = "Congratulations!";
                        register.publicMessageCon = res.Message;
                    }
                    /*登陆成功设置cookie*/
                    if ($("#check_rem").prop('checked') == true) {
                        PLAY.cookie('userEmail', login.email);
                    } else {
                        PLAY.cookie('userEmail', '');
                    }
                }
            }, function (res) {
                if (res.State != 21) {
                    login.reloadCaptcha();//刷新验证码
                    login.captchaVal = "";//清空验证码
                }
                //登陆验证邮件过期重新发送验证邮件提醒
                if (res.State == 3) {
                    login.hidden("show_login");
                    login.show("show_publicMessage");
                    login.publicMessageTitle = "Validate Email Notice";
                    login.publicMessageCon = "You need to validate your email before logging in.Note: Please check your spam filter if you have not received the validation email.";
                }
                login.showErrorMsg = true;
                login.errorMsg = res.Message;
            }, function (res) {
                login.showErrorMsg = true;
                login.errorMsg = res.Message;
                /*QA GA统计*/
                fbq('track', 'login_email_fail', {error: login.errorMsg});//facebook像素统计登陆失败及原因
                ga('send', 'event', 'login', 'fail', {error: login.errorMsg});
            })
        },
        facebookLoginClick: function () {
            if (window.localStorage) {
                var storage = window.localStorage;
                storage.setItem("newH5", 1);
            }
            fbq('track', 'login_fb_click');//facebook像素统计点击facebook登陆按钮
            ga('send', 'event', 'login', 'login_fb_click');
        },
        /* facebook 登陆*/
        facebookLogin: function () {
            var param = {"version": Math.random()};
            accountModel.getFacebookLoginEntranceURL(param, function (res) {
                if (res.Value && res.Value.RedirectUrl) {
                    login.facebookLoginHref = res.Value.RedirectUrl;
                }
            }, function (res) {
                login.errorMsg = res.Message;
                login.showErrorMsg = true;
            }, function (res) {
                login.errorMsg = res.Message;
                login.showErrorMsg = true;
            });
        },
        /* 发送邮件Send Email */
        sendEmail: function () {
            login.user_email = document.getElementById("enterEmail").value;
            var checkEmail = PLAY.checkEmail(login.user_email.trim(), function (msg) {
                login.errorMsgEmail = msg;
            });
            if (!checkEmail) {
                login.showEmailMsg = true;
            } else {
                login.showEmailMsg = false;
                login.toForgetPwd();//验证通过后修改密码数据处理
            }
            if (login.user_email.trim() === "") {
                this.setAttribute("placeholder", "Please enter your email");
            }
        },
        toForgetPwd: function () {
            var user_emails = "";
            var mails = "";
            if (urlParam && urlParam.step) {
                var step = urlParam.step;
                if (step == -12) {
                    user_emails = decodeURIComponent(urlParam.email);
                }
            } else {
                user_emails = login.user_email;
            }
            if (user_emails.indexOf('@gmail.com') !== -1) {
                mails = '<a target="_blank" href="https://mail.google.com/">check your inbox</a>';
            } else if (user_emails.indexOf('@outlook.com') !== -1) {
                mails = '<a target="_blank" href="https://outlook.com/">check your inbox</a>';
            } else if (user_emails.indexOf('@hotmail.com') !== -1) {
                mails = '<a target="_blank" href="https://hotmail.com/">check your inbox</a>';
            } else if (user_emails.indexOf('@yahoo.com') !== -1) {
                mails = '<a target="_blank" href="https://mail.yahoo.com/">check your inbox</a>';
            } else {
                mails = 'check your inbox';
            }
            accountModel.toForgetPassword({"vision": Math.random(), 'email': user_emails, 'isH5': true}, function (res) {
                var guideData = res.Value;
                login.hidden("show_resendemail");
                login.show("show_sendemail");
                //send mail success
                login.send_mail = false;
                login.send_mail_info = true;
                login.pwdMsg = "We've sent a link to reset your password. Please " + mails + " . The link will expire in one hour.";
                login.change_pwd = false;
            }, function (res) {
                login.showEmailMsg = true;
                login.errorMsgEmail = res.Message;
            }, function (res) {
                login.showEmailMsg = true;
                login.errorMsgEmail = res.Message;
            })
        },
        //密码校验
        q_checkUPassword: function () {
            //重置密码验证规则
            var checkUPassword = PLAY.checkPassword(login.newpwd.trim(), 6, 16, function (msg) {
                login.errorMsgPwd = msg;
            });
            if (!checkUPassword) {
                login.showPwdMsg = true;
                return false;
            } else {
                if (login.confirm_newpwd != login.newpwd) {
                    login.errorMsgPwd = "The password does not match. Please input again.";
                } else {
                    login.showPwdMsg = false;
                }
            }
            return true;
        },
        // 重复密码校验
        q_checkCPassword: function () {
            //确认密码验证规则
            var checkCPassword = PLAY.checkPassword(login.confirm_newpwd.trim(), 6, 16, function (msg) {
                login.errorMsgPwd = msg;
            });
            if (!checkCPassword) {
                login.showPwdMsg = true;
            } else {
                if (login.newpwd != login.confirm_newpwd) {
                    login.errorMsgPwd = "The password does not match. Please input again.";
                } else {
                    login.showPwdMsg = false;
                }
            }
            return true;
        },
        // 重置密码 Reset Password
        resetPwd: function (rsapwd, rsaconfirm_newpwd) {
            //var rsapwd=login.rsaEncrypto("newpwd");
            //var rsaconfirm_newpwd=login.rsaEncrypto("confirm_newpwd");
            accountModel.resetPassword({"version": Math.random(), 'pwd': rsapwd, 'pwd2': rsaconfirm_newpwd}, function (res) {
                login.errorMsgPwd = res.Message;
                //重置密码成功提示信息
                login.send_mail = false;
                login.send_mail_info = true;
                login.pwdMsg = "Password successfully updated.";
                login.change_pwd = false;
                setTimeout(function () {
                    location.href = PLAY.indexUrl
                }, 5000);
            }, function (res) {
                sub_cg_pwd = 0;
                login.errorMsgPwd = res.Message;
                return false;
            }, function (res) {
                sub_cg_pwd = 0;
                login.errorMsgPwd = res.Message;
                return false;
            });
        },
        cpwd_success: function () {
            login.hidden("show_sendemail");
            location.href = PLAY.indexUrl
        },
        //修改密码 Change Password
        change_email: function () {
            var nmark_pwd = "0";
            var password = login.newpwd;
            var cpassword = login.confirm_newpwd;
            var rsapwd = login.rsaEncrypto(password);//新密码加密处理
            var rsaconfirm_newpwd = login.rsaEncrypto(cpassword);//重复新密码加密处理
            var checkUPassword = PLAY.checkPassword(password, 6, 16, function (msg) {
                login.errorMsgPwd = msg;
            });
            var checkCPassword = PLAY.checkPassword(cpassword, 6, 16, function (msg) {
                login.errorMsgPwd = msg;
            });
            //密码修改已提交，请稍等！
            if (sub_cg_pwd == "1") {
                login.errorMsgPwd = "Submitted. Please wait";
                nmark_pwd = "1";
                return false;
            } else if (password == null || password == "") {
                login.errorMsgPwd = "Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ";
                nmark_pwd = "1";
                return false;
            } else if (!checkUPassword) {
                login.q_checkUPassword();
                nmark_pwd = "1";
                return false;
            } else if (!checkCPassword) {
                login.q_checkCPassword();
                nmark_pwd = "1";
                return false;
            } else if (password != cpassword) {
                login.q_checkUPassword();
                login.q_checkCPassword();
                nmark_pwd = "1";
                return false;
            }
            if (nmark_pwd == "0") {
                sub_cg_pwd = 1;
                login.resetPwd(rsapwd, rsaconfirm_newpwd);//通过验证 调用修改密码
            }
        },
        /*倒计时*/
        countDown: function () {
            if (login.time === 1) {
                clearInterval(login.countDownInterval);
                login.showTime = false;
                login.time = 120;
            } else {
                login.time--;
            }
        },
        /*发送邮件*/
        resendEmail: function () {
            if (!login.showTime) {
                login.showTime = true;
                login.countDownInterval = setInterval(login.countDown, 1000);
                accountModel.toValidateEmail({"version": Math.random(), 'isH5': true}, function (res) {
                }, function (res) {
                    console.log(res.Message)
                }, function (res) {
                    console.log(res.Message)
                });
            }
        },
        /*弹出登陆框*/
        $login: {
            title: "title_register",
            modal: true,
            width: "968px",
            smallDialog: true,
            onOpen: function () {
                login.facebookLogin();//获取获取facebook url链接地址
                fbq('track', 'login_view');//facebook像素统计打开登陆弹窗
                ga('send', 'event', 'login', 'view');
            },
            onConfirm: function () {
            },
            onClose: function () {
                if (location.href.indexOf("poker") !== -1) {
                    window.location.href = PLAY.baseAccountUrl;
                }
            }
        },
        /*弹出找回密码框*/
        $pwd: {
            title: "",
            modal: true,
            width: "903px",
            smallDialog: true,
            onOpen: function () {
                /*init fotgot password*/
                login.send_mail = true;
                login.send_mail_info = false;
                login.change_pwd = false;
                login.errorMsgEmail = "";
            },
            onConfirm: function () {
            },
            onClose: function () {
            }
        },
        /*显示弹窗*/
        show: function (id, gameName) {
            avalon.vmodels[id].toggle = true;
            game_name = gameName;
        },
        /*隐藏弹窗*/
        hidden: function (id, close_id) {
            avalon.vmodels[id].toggle = false;
            if (close_id) {
                avalon.vmodels[close_id].toggle = false;
            }
        }
    });
    avalon.scan();
    login.initLogin();
});


