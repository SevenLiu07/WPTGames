require([
        "text!../../module/index/publicMsg.html", /*背包*/
        "dialog/avalon.dialog.js",
        "../js/jquery1.10.2",
        "domReady!"],
    function (publicMsg, dialog, J) {
        /*配置模板html*/
        var sourceHtml = [
            publicMsg
        ];
        avalon.configSource(sourceHtml);
        /*配置对应模板js*/
        require(["../../common/js/common.js"]);
        require(["../../module/index/js/publicMsg.js"]);
        require(["../../common/js/scrollBar.js"]);
        require(["../../common/js/account-common.js"]);
        require(["../../model/account-model"], function (accountModel) {
            /*注册模块*/
            var register = avalon.define("landingPage", function (vm) {
                vm.isfbFLogin = "";
                /* 初始化信息 */
                vm.email = "";
                vm.password = "";
                vm.showErrorEmailMsg = false;
                vm.showErrorPasswordMsg = false;
                vm.errorEmailMsg = "";
                vm.errorPasswordMsg = "";
                vm.publicMsg = "";
                vm.showErrorMsg = false;
                /*验证码信息*/
                vm.showCaptcha = false;
                vm.captchaSrc = "";
                vm.captchaVal = "";
                vm.captchaToken = "";
                /*公共参数*/
                var paramCommon = {"version": Math.random(), 'isH5': true};
                /*公共提示信息*/
                vm.facebookRegisterHref = "javascript:void(0)";
                /*整个初始化*/
                vm.initRegister = function () {
                    vm.initRegisterDialog();
                    vm.facebookRegister();//获取facebook url链接
                    //  fbq('track', 'signup_view');//facebook像素统计打开注册弹窗
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
                        register.errorEmailMsg = msg;
                    });
                    if (register.email.trim() === "") {
                        if (this.setAttribute) {
                            this.setAttribute("placeholder", "Email");
                        }
                    }
                    if (!checkEmail) {
                        register.showErrorEmailMsg = true;
                        return false;
                    } else {
                        register.showErrorEmailMsg = false;
                    }
                    return true;
                };
                /*密码失去焦点事件*/
                vm.passwordBlur = function () {
                    var checkEmail = PLAY.checkPassword(register.password.trim(), 6, 16, function (msg) {
                        register.errorPasswordMsg = msg;
                    });
                    if (register.password.trim() === "") {
                        if (this.setAttribute) {
                            this.setAttribute("placeholder", "Password");
                        }
                    }
                    if (!checkEmail) {
                        register.showErrorPasswordMsg = true;
                        return false;
                    } else {
                        register.showErrorPasswordMsg = false;
                    }
                    return true;
                };
                /*刷新验证码*/
                vm.reloadCaptcha = function () {
                    accountModel.getCaptchaToken({}, function (res) {
                        if (res.Value) {
                            var result = res.Value;
                            if (result) {
                                register.showCaptcha = true;
                                register.captchaToken = result;
                                register.captchaSrc = PLAY.baseUrl + "WebAPI/page/Captcha/GenerateCaptchaImg?time=" + (new Date()).getTime() + "&token=" + result;
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
                        //fbq('track', 'signup_click');//facebook像素统计点击注册按钮
                    }
                };
                vm.webRegister2 = function (pwd) {
                    var param = {"version": Math.random(), 'email': register.email, 'pwd': pwd, 'promotion': true, "catpchaCode": register.captchaVal, "captchaToken": register.captchaToken};
                    accountModel.webRegister(param, function (res) {
                        if (res) {
                            //fbq('track', 'signup_email_success');//facebook像素统计完成注册
                            location.href = PLAY.pokerUrl;
                            //google统计
                            //  ga('send','event','Signup','Register','E-mail');
                            // window.google_trackConversion({google_conversion_id: 864698956,google_conversion_label: conversionLabels.em,google_remarketing_only: false});
                        }
                    }, function (res) {
                        if (res.State == -100) {
                            /*Facebook&email account connection*/
                            logReg_change('login', 'register');
                            //注册的账号自动填写到email文本框
                            avalon.vmodels["login"].email = register.email;
                            avalon.vmodels["login"].showErrorMsg = true;
                            avalon.vmodels["login"].errorMsg = "An account with your email has already been registered. If you forgot your password, please click on Forgot Password below to reset your password.";
                        } else {
                            if (res.State !== 21) {
                                vm.reloadCaptcha();
                                register.captchaVal = "";
                            } else {
                                register.showCaptcha = true;
                            }
                            vm.showMsg(res.Message);
                        }
                    }, function (res) {
                        vm.showMsg(res.Message);
                        fbq('track', 'signup_email_fail', {error: register.errorMsg});//facebook像素统计注册失败及失败原因
                    });
                };
                vm.facebookRegisterClick = function () {
                    if (window.localStorage) {
                        var storage = window.localStorage;
                        storage.setItem("newH5", 1);
                    }
                    fbq('track', 'signup_fb_click');//facebook像素统计点击facebook注册按钮
                };
                /* facebook 注册*/
                vm.facebookRegister = function () {
                    var param = {"version": Math.random()};
                    accountModel.getFacebookLoginEntranceURL(param, function (res) {
                        if (res.Value && res.Value.RedirectUrl) {
                            register.facebookRegisterHref = res.Value.RedirectUrl;
                        }
                    }, function (res) {
                        register.showErrorMsg = true;
                        vm.showMsg(res.Message);
                    }, function (res) {
                        register.showErrorMsg = true;
                        vm.showMsg(res.Message);
                    });
                };
                vm.showMsg = function (param) {
                    if (param) {
                        avalon.vmodels["new_publicNotice"].publicMsg = param;
                        avalon.vmodels["new_publicNotice"].toggle = true;
                    }
                };
                vm.$notice = {
                    title: "title_notice",
                    showClose: true,
                    modal: true,
                    width: "530px",
                    smallDialog: true,
                    onOpen: function () {
                    },
                    onConfirm: function () {
                    },
                    onClose: function () {
                    }
                };
                /*隐藏弹框*/
                vm.hide = function (id) {
                    avalon.vmodels[id].toggle = false;
                };
                /*显示弹框*/
                vm.show = function (id) {
                    avalon.vmodels[id].toggle = true;
                }
            });
            avalon.scan();
            register.initRegister();
        });
    });
