define(function (require, exports) {
    var accountModel = {
        /* 验证邮件*/
        toValidateEmail: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/Passport/ToValidateEmail",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* 绑定选择头像*/
        bindAvatar: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/Passport/BindAvatar",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* 绑定联众角色名*/
        bindLzRoleName: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/Passport/BindLzRoleName",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* 判断注册时是否需要验证码*/
        showCaptchaWhenRegister: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/page/Captcha/ShowCaptchaWhenRegister",
                data: data,
                timeout: 8000,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* 注册*/
        webRegister: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/Passport/WebRegister",
                showLoading: true,
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* 获取Token */
        getCryptoToken: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/Passport/GetCryptoToken",
                async: false,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /*获取验证码*/
        getCaptchaToken: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/page/Captcha/GetTokenH5",
                data: {},
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            })
        },
        /*获取facebook url*/
        getFacebookLoginEntranceURL: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/page/FacebookLogin/GetFacebookLoginEntranceURL",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            })
        },
        /*Login*/
        webLogin: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/Login/WebLogin",
                showLoading: true,
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /*判断登陆时是否需要验证码*/
        showCaptchaWhenLogin: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/page/Captcha/ShowCaptchaWhenLogin",
                data: data,
                timeout: 8000,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* 发送邮件*/
        toForgetPassword: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/Passport/ToForgetPassword",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        /* 重置密码*/
        resetPassword: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Post({
                url: PLAY.webApiUrl + "WebAPI/Passport/ResetPassword",
                data: data,
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        },
        getLoginUserInfo: function (data, callback, failcallback, errorcallback) {
            PLAY.ajax.Get({
                url: PLAY.webApiUrl + "WebAPI/Passport/GetLoginUserInfo",
                success: function (data, res) {
                    if (res) {
                        callback && callback(res);
                    }
                },
                fail: function (data, res) {
                    if (res) {
                        failcallback && failcallback(res);
                    }
                },
                error: function (data, res) {
                    errorcallback && errorcallback(res);
                }
            });
        }
    };
    return accountModel;
});
