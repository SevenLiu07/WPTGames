/**
 * Created by liuhuan on 2016/11/16.
 */
require(["../../model/personal-model.js"], function (per_model) {
    var dialog;
    var data = "dialog";
    var cardid = "";//定义cardid
    var number = /^[0-9]*$/;
    var get_freeGold = "";
    var personModel = avalon.define({
        $id: 'personal',
        validate: true,//validate 按钮
        info_validate: '',//验证邮件提示信息
        show_validate: true,//验证邮件内容
        show_changepwd: false,//修改密码内容
        changepwd: true,
        show_name: true,//name
        txt_name: false,//name修改文本框
        erro_name: '',
        show_addr: true,//address
        txt_addr: false,//address修改文本框
        erro_addr: '',
        show_country: true,//country
        txt_country: false,//country修改文本框
        sel_country: false,//country下拉框
        erro_country: '',
        show_city: true,//city
        txt_city: false,//city修改文本框
        erro_city: '',
        show_state: true,//state
        txt_state: false,//state修改文本框
        erro_state: '',
        show_postal: true,//postal
        txt_postal: false,//postal修改文本框
        erro_postal: '',
        /*credit card info*/
        show_cardnum: true,//credit card
        txt_cardnum: false,//credit card修改文本框
        erro_cardnum: '',
        /*expiration date info*/
        show_date: true,//expiration date
        txt_date: false,//expiration date修改文本框
        erro_date: '',
        nick_name: '',
        name: '',
        email: '',
        address: '',
        country: '',
        city: '',
        state: '',
        postal: '',
        creditNum: '',
        expirationDate: '',
        /*弹窗popup*/
        $ssOpts: {
            title: "title_account",
            modal: data,
            width: "1016px",
            onOpen: function () {
                personModel.show_edit();
                personModel.show_name = true;//name
                personModel.txt_name = false;//name修改文本框
                personModel.erro_name = '';
                personModel.show_addr = true;//address
                personModel.txt_addr = false;//address修改文本框
                personModel.erro_addr = '';
                personModel.show_country = true;//country
                personModel.txt_country = false;//country修改文本框
                personModel.sel_country = false;//country下拉框
                personModel.erro_country = '';
                personModel.show_city = true;//city
                personModel.txt_city = false;//city修改文本框
                personModel.erro_city = '';
                personModel.show_state = true;//state
                personModel.txt_state = false;//state修改文本框
                personModel.erro_state = '';
                personModel.show_postal = true;//postal
                personModel.txt_postal = false;//postal修改文本框
                personModel.erro_postal = '';
                /*credit card info*/
                personModel.show_cardnum = true;//credit card
                personModel.txt_cardnum = false;//credit card修改文本框
                personModel.erro_cardnum = '';
                /*expiration date info*/
                personModel.show_date = true;//expiration date
                personModel.txt_date = false;//expiration date修改文本框
                personModel.erro_date = '';
                personModel.nick_name = '';
                personModel.name = '';
                personModel.email = '';
                personModel.address = '';
                personModel.country = '';
                personModel.city = '';
                personModel.state = '';
                personModel.postal = '';
                personModel.creditNum = '';
                personModel.expirationDate = '';
                setMaxDigits(131);//修改密码加密
                personModel.getLoginInfo();//获取用户登录信息
                /*缩放*/
                PLAY.scaleDialog();
            },
            onConfirm: function () {
            },
            onClose: function () {
                //personModel.init();
                /*缩放还原*/
                PLAY.resetScaleDialog();
            }
        },
        $ggOpts: {
            title: "title_validate",
            showClose: true,
            width: "747px",
            smallDialog: true,
            onOpen: function () {
            },
            onConfirm: function () {
            },
            onClose: function () {
                //关闭修改密码弹窗 清空文本框及错误提示信息
                $("#change_pwd input").each(function () {
                    $(this).val("");
                    pwdModel.erro_pwd = "";
                })
            }
        },
        /*点击按钮*/
        show: function (id) {
            avalon.vmodels[id].toggle = true;
        },
        /*弹窗popup end*/
        /*设置用户信息*/
        set_info: function (param) {
            if (param == 'name') {
                personModel.set_name();
            } else if (param == 'addr') {
                personModel.set_address();
            } else if (param == 'country') {
                personModel.set_country();
            } else if (param == 'city') {
                personModel.set_city();
            } else if (param == 'state') {
                personModel.set_state();
            } else if (param == 'postal') {
                personModel.set_postal();
            } else if (param == 'credit') {
                personModel.set_credit();
            } else if (param == 'date') {
                personModel.set_date();
            }
        },
        //-------------------获取登录信息----------------------
        getLoginInfo: function () {
                per_model.getLoginInfo({"version": Math.random()}, function (res) {
                    var guideData = res.Value;
                    if (guideData) {
                        if (guideData && guideData.IsLogined == true) {
                            personModel.email = guideData.Email;//获取用户email地址
                            personModel.nick_name = (guideData.LzDisplayName || guideData.DefaultDisplayName || " ");//获取用户lz昵称
                            if (guideData.UserStatus == 'ToValidate') {
                                personModel.validate = true;
                            } else {
                                personModel.validate = false;
                            }
                            personModel.gUserInfo();//如果登录成功则调用获取用户信息
                            personModel.gCreditInfo();//如果登录成功则调用获取信用卡信息
                        } else {
                        }
                    }
                })
        },
        init: function () {
            $(".show_infos ul li .infos").show();
            personModel.show_edit();
            $("#sel_country").hide();
            $(".show_infos ul li input").hide();
            $(".show_infos ul li .erro").html("");
        },
        show_edit: function () {
            $("#each_edit ul li a").show();//显示所有edit按钮
            personModel.changepwd = true;
        },
        hide_edit: function () {
            $("#each_edit ul li a").hide();//隐藏所有edit按钮
            personModel.changepwd = false;
        },
        show_change: function (param) {
            personModel.hide_edit();//点击任意edit，隐藏所有edit按钮
            if (param == 'txtname') {
                personModel.show_name = false;//隐藏name
                personModel.txt_name = true;//显示修改name文本框
                $("#txt_name").focus();
            } else if (param == 'txtaddr') {
                personModel.show_addr = false;//隐藏addr
                personModel.txt_addr = true;//显示修改addr文本框
                $("#txt_addr").focus();
            } else if (param == 'selcountry') {
                personModel.show_country = false;//隐藏coutry
                personModel.sel_country = true;//显示修改coutry文本框
                $("#txt_country").focus();
            } else if (param == 'txtcity') {
                personModel.show_city = false;//隐藏city
                personModel.txt_city = true;//显示修改city文本框
                $("#txt_city").focus();
            } else if (param == 'txtstate') {
                personModel.show_state = false;//隐藏state
                personModel.txt_state = true;//显示修改state文本框
                $("#txt_state").focus();
            } else if (param == 'txtpostal') {
                personModel.show_postal = false;//隐藏postal
                personModel.txt_postal = true;//显示修改postal文本框
                $("#txt_postal").focus();
            } else if (param == 'txtcardnum') {
                personModel.show_cardnum = false;//隐藏cardnum
                personModel.txt_cardnum = true;//显示修改cardnum文本框
                $("#txt_cardnum").focus();
            } else if (param == 'txtdate') {
                personModel.show_date = false;//隐藏expiration date
                personModel.txt_date = true;//显示修改expiration date文本框
                $("#txt_date").focus();
            }
        },
        //-------------------获取用户信息----------------------
        gUserInfo: function () {
            per_model.getUserInfo({"version": Math.random()}, function (res) {
                var guideData = res;
                if (guideData.ContactName == "" || guideData.ContactName == null) {
                    personModel.name = '';
                } else {
                    personModel.name = guideData.ContactName;
                }
                var shwo_addr = guideData.AddressLine;
                if (shwo_addr != "" && shwo_addr != null) {
                    shwo_addr = personModel.htmlDecodeByRegExp(shwo_addr);//地址解码
                    if (shwo_addr.length > 30) {
                        shwo_addr = shwo_addr.substring(0, 30) + "...";
                        personModel.address = personModel.htmlEncodeByRegExp(shwo_addr);
                    } else {
                        personModel.address = personModel.htmlEncodeByRegExp(shwo_addr);
                    }
                } else {
                    personModel.address = '';
                }
                if (guideData.Country == "" || guideData.Country == null) {
                    personModel.country = '';
                } else {
                    personModel.country = guideData.Country;
                }
                if (guideData.City == "" || guideData.City == null) {
                    personModel.city = '';
                } else {
                    personModel.city = guideData.City;
                }
                if (guideData.States == "" || guideData.States == null) {
                    personModel.state = '';
                } else {
                    personModel.state = guideData.States;
                }
                if (guideData.ZIP == "" || guideData.ZIP == null) {
                    personModel.postal = '';
                } else {
                    personModel.postal = guideData.ZIP;
                }
            })
        },
        //-------------------获取信用卡信息信息-----------------
        gCreditInfo: function () {
            per_model.getCreditInfo({"version": Math.random()}, function (res) {
                //var guideData =res.Value;
                if (res.CardNum == "" || res.CardNum == null) {
                    personModel.creditNum = '';//卡信息替换null为空
                } else {
                    personModel.creditNum = '**********' + res.CardNum;//卡号
                }
                if (res.ExpireDate == "" || res.ExpireDate == null) {
                    personModel.expirationDate = '';//过期时间替换null为空
                } else {
                    personModel.expirationDate = res.ExpireDate;//过期时间
                }
                cardid = res.UserBankcardID;//UserBankcardID卡ID
            })
        },
        //-------------------发送验证邮件-----------------
        btnValidate: function () {
            personModel.show('show_validate');
            $("#popup_titles").removeClass("title_pwd");
            $("#popup_titles").addClass('title_validate');
            personModel.show_validate = true;//显示验证邮件内容
            personModel.show_changepwd = false;//隐藏修改密码内容
            personModel.valiEmail();//发送邮件
            //personModel.info_validate='An activation email has been sent to you. Please activate your email, and you will get 5,000 free Gold.';
        },
        valiEmail: function () {
            per_model.validateEmail({"version": Math.random(), 'isH5': true}, function (res) {
                get_freeGold = res.Message;
                personModel.info_validate = get_freeGold;
            }, function (res) {
                personModel.info_validate = res.Message;
            }, function (res) {
                personModel.info_validate = res.Message;
            });
        },
        //-------------------重置密码数据处理-----------------
        btnChangepwd: function () {
            personModel.show('show_validate');
            $("#popup_titles").removeClass("title_validate");
            $("#popup_titles").addClass('title_pwd');
            personModel.show_validate = false;//隐藏验证邮件内容
            personModel.show_changepwd = true;//显示修改密码内容
        },
        //-------------------设置信用卡信息信息-----------------
        set_credit: function () {
            var card = $("#txt_cardnum");
            var cardnum = card.val();
            if (cardnum == null || cardnum == "") {
                personModel.erro_cardnum = 'Please input your Credit Card.';
                $("#txt_cardnum").focus();
            } else if (cardnum.indexOf(" ") >= 0) {
                personModel.erro_cardnum = "Sorry, Credit Card cannot consist of space.";
            } else if (!number.test(cardnum) || cardnum.length < 16) {
                personModel.erro_cardnum = "Credit Card must be 16 digits number.";
            } else {
                personModel.erro_cardnum = ' ';
                personModel.sCreditInfo(cardnum);
            }
        },
        sCreditInfo: function (cardnum) {
            per_model.modifyCreditInfo({"version": Math.random(), 'cardid': cardid, 'cardnum': cardnum}, function (res) {
                personModel.show_cardnum = true;//显示卡信息
                personModel.txt_cardnum = false;//隐藏修改文本框
                personModel.show_edit();//完成修改，显示所有edit按钮
                var four_num = cardnum.substr(cardnum.length - 4);
                personModel.creditNum = '**********' + four_num;
            }, function (res) {
                personModel.erro_cardnum = res.Message;
            }, function (res) {
                personModel.erro_cardnum = res.Message;
            });
        },
        //-------------------设置信用卡过期时间-----------------
        set_date: function () {
            var dates = $("#txt_date").val();
            if (dates == null || dates == "") {
                personModel.erro_date = "Please enter a valid expiry date.";
                $("#txt_date").focus();
            } else {
                personModel.erro_date = ' ';
                personModel.check_expriat();//检测信用卡过期时间
            }
        },
        editDate: function (exp_month, exp_year) {
            per_model.modifyCreditInfo({"version": Math.random(), 'cardid': cardid, 'expdate': exp_month + '' + exp_year}, function (res) {
                personModel.show_date = true;//显示过期时间
                personModel.txt_date = false;//隐藏修改文本框
                personModel.show_edit();//完成修改，显示所有edit按钮
                personModel.expirationDate = personModel.htmlEncodeByRegExp(exp_month + '' + exp_year);
            }, function (res) {
                personModel.erro_date = res.Message;
            }, function (res) {
                personModel.erro_date = res.Message;
            });
        },
        /*检测信用卡过期时间*/
        check_expriat: function () {
            var txt_date = $("#txt_date").val();
            var myDate = new Date();
            var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
            var montharray = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            var yeararray = ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
            if (month < 10) {
                month = "0" + month;
            }
            var timestamp = year + "" + month;
            var yearNow = timestamp.substr(2, 2);
            var monthNow = timestamp.substr(4, 2);
            var exp_year = txt_date.substr(2, 2);//截取文本框年份后两位
            var exp_month = txt_date.substr(0, 2);//截取文本框月份
            /*      if(exp_month<10){
             exp_month="0"+exp_month;//截取下拉框月份所选值，如果月份小于10月则在月份前面增加0
             }*/
            var valid = exp_month + '' + exp_year;
            if (valid.length != 4) {
                personModel.erro_date = "Expration date must be larger than current date.";
                return false;
            }
            month = valid.substr(0, 2);
            year = valid.substr(2, 2);
            var indexMonth = $.inArray(month, montharray);//判断填写的月份是否存在于月份数组中
            var indexYear = $.inArray(year, yeararray);//判断填写的年份是否存在于年份数组中
            if (valid.length != 4) {
                personModel.erro_date = "The expiry date must be 4 digits.";
                return false;
            }
            if (indexMonth == -1 || indexYear == -1) {
                personModel.erro_date = "Please enter a valid expiry date.";
                return false;
            }
            if (exp_year < yearNow) {
                personModel.erro_date = "Please enter a valid expiry date.";
                return false;
            }
            if (exp_year == yearNow && exp_month < monthNow) {
                personModel.erro_date = "Please enter a valid expiry date.";
                return false;
            } else {
                personModel.editDate(exp_month, exp_year);//调用修改信用卡过期时间函数，传参年份及月份
                personModel.erro_date = " ";
            }
            return true;
        },
        //-------------------修改name----------------------
        set_name: function () {
            var names = "";
            if (names.indexOf("") !== -1) {
                names = $("#txt_name").val().replace(/[ ]/g, "-");//清除空格替换为-
            } else {
                names = $("#txt_name").val();
            }
            if (names == null || names == "") {
                personModel.erro_name = 'Please input your Name.';
                $("#txt_name").focus();
            } else {
                personModel.erro_name = ' ';
                personModel.editPostName(names);
            }
        },
        editPostName: function (names) {
            per_model.modifyUserInfo({"version": Math.random(), 'name': names}, function (res) {
                var guideData = res.Value;
                personModel.show_name = true;//显示个人信息
                personModel.txt_name = false;//隐藏修改文本框
                personModel.show_edit();//完成修改，显示所有edit按钮
                personModel.name = personModel.htmlEncodeByRegExp(names);
            }, function (res) {
                personModel.erro_name = res.Message;
            }, function (res) {
                personModel.erro_name = res.Message;
            });
        },
        //-------------------修改address----------------------
        set_address: function () {
            var address = $("#txt_addr").val();
            if (address == null || address == "") {
                personModel.erro_addr = 'Please input your Address.';
                $("#txt_addr").focus();
            } else {
                personModel.erro_addr = ' ';
                personModel.editPostAddr(address);
            }
        },
        editPostAddr: function (address) {
            per_model.modifyUserInfo({"version": Math.random(), 'address': address}, function (res) {
                var guideData = res.Value;
                personModel.show_addr = true;//显示个人信息
                personModel.txt_addr = false;//隐藏修改文本框
                personModel.show_edit();//完成修改，显示所有edit按钮
                var addr = address;
                var addr_value;
                if (addr.length > 30) {
                    addr_value = addr.substring(0, 30) + "...";
                    personModel.address = personModel.htmlEncodeByRegExp(addr_value);
                } else {
                    personModel.address = personModel.htmlEncodeByRegExp(address);
                }
            }, function (res) {
                personModel.erro_addr = res.Message;
            }, function (res) {
                personModel.erro_addr = res.Message;
            });
        },
        //-------------------修改country----------------------
        set_country: function () {
            var country = $("#txt_country").val();
            if ($("#sel_country").val() == 0) {
                if (country == "" || country == null) {
                    personModel.erro_country = "Please input your Country.";
                } else {
                    personModel.erro_country = ' ';
                    personModel.editCountry(country);
                }
            } else {
                personModel.erro_country = ' ';
                personModel.editCountry($("#sel_country").val());
            }
        },
        /*选择other 出现可输入框*/
        show_textbox: function () {
            personModel.txt_country = false;
            if ($("#sel_country").val() == 0) {
                personModel.txt_country = true;//显示修改文本框
                $("#txt_country").focus();
            } else {
                personModel.erro_country = ' ';
            }
        },
        editCountry: function (country) {
            per_model.modifyUserInfo({"version": Math.random(), 'country': country}, function (res) {
                var guideData = res.Value;
                var country_nm = "";
                personModel.show_country = true;//显示个人信息
                personModel.txt_country = false;//隐藏修改文本框
                personModel.sel_country = false;//隐藏选择框
                personModel.show_edit();//完成修改，显示所有edit按钮
                if ($("#sel_country").val() == 0) {
                    country_nm = $("#txt_country").val();
                } else {
                    country_nm = $("#sel_country").find("option:selected").text();
                }
                personModel.country = personModel.htmlEncodeByRegExp(country_nm);
                $("#txt_country").val("");
            }, function (res) {
                personModel.erro_country = res.Message;
            }, function (res) {
                personModel.erro_country = res.Message;
            });
        },
        //-------------------修改city----------------------
        set_city: function () {
            var city = $("#txt_city").val();
            if (city == null || city == "") {
                personModel.erro_city = 'Please input your City.';
                $("#txt_city").focus();
            } else {
                personModel.erro_city = ' ';
                personModel.editPostCity(city);
            }
        },
        editPostCity: function (city) {
            per_model.modifyUserInfo({"version": Math.random(), 'city': city}, function (res) {
                var guideData = res.Value;
                personModel.show_city = true;//显示个人信息
                personModel.txt_city = false;//隐藏修改文本框
                personModel.show_edit();//完成修改，显示所有edit按钮
                personModel.city = personModel.htmlEncodeByRegExp(city);
            }, function (res) {
                personModel.erro_city = res.Message;
            }, function (res) {
                personModel.erro_city = res.Message;
            });
        },
        //-------------------修改state----------------------
        set_state: function () {
            var state = $("#txt_state").val();
            if (state == null || state == "") {
                personModel.erro_state = 'Please input your State.';
                $("#txt_state").focus();
            } else {
                personModel.erro_state = ' ';
                personModel.editPostState(state);
            }
        },
        editPostState: function (state) {
            per_model.modifyUserInfo({"version": Math.random(), 'state': state}, function (res) {
                var guideData = res.Value;
                personModel.show_state = true;//显示个人信息
                personModel.txt_state = false;//隐藏修改文本框
                personModel.show_edit();//完成修改，显示所有edit按钮
                personModel.state = personModel.htmlEncodeByRegExp(state);
            }, function (res) {
                personModel.erro_state = res.Message;
            }, function (res) {
                personModel.erro_state = res.Message;
            });
        },
        //-------------------修改postal----------------------
        set_postal: function () {
            var postal = $("#txt_postal").val();
            if (postal == null || postal == "") {
                personModel.erro_postal = 'Please input your Postal Code.';
                $("#txt_postal").focus();
            } else {
                personModel.erro_postal = ' ';
                personModel.editPostPostal(postal);
            }
        },
        editPostPostal: function (postal) {
            per_model.modifyUserInfo({"version": Math.random(), 'zip': postal}, function (res) {
                var guideData = res.Value;
                personModel.show_postal = true;//显示个人信息
                personModel.txt_postal = false;//隐藏修改文本框
                personModel.show_edit();//完成修改，显示所有edit按钮
                personModel.postal = personModel.htmlEncodeByRegExp(postal);
            }, function (res) {
                personModel.erro_postal = res.Message;
            }, function (res) {
                personModel.erro_postal = res.Message;
            });
        },

        /*1.用正则表达式实现html转码*/
        htmlEncodeByRegExp: function (str) {
            var s = "";
            if (str.length == 0) {
                return "";
            }
            s = str.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            return s;
        },
        /*2.用正则表达式实现html解码*/
        htmlDecodeByRegExp: function (str) {
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
        }

    });
    /*修改密码*/
    var sub_cg_pwd = 0;
    var pwdModel = avalon.define({
        $id: 'pwd',
        erro_pwd: '',//修改密码错误提示信息
        // 校验密码
        q_checkUPassword: function () {
            var password = $("#password").val();
            var cpassword = $("#cpassword").val();
            //密码验证规则
            var checkUPassword = PLAY.checkPassword(password, 6, 16, function (msg) {
                pwdModel.erro_pwd = msg;
            });
            if (!checkUPassword) {
                return false;
            } else {
                if (password != cpassword) {
                    pwdModel.erro_pwd = "The password does not match. Please input again.";
                } else {
                    pwdModel.erro_pwd = "";
                }
            }
            return true;
        },
        // 重复密码校验
        q_checkCPassword: function () {
            var password = $("#password").val();
            var cp = $("#cpassword").val();
            //重复密码验证规则
            var checkCPassword = PLAY.checkPassword(cp, 6, 16, function (msg) {
                pwdModel.erro_pwd = msg;
            });
            if (!checkCPassword) {
                return false;
            } else {
                if (cp != password) {
                    pwdModel.erro_pwd = "The password does not match. Please input again.";
                } else {
                    pwdModel.erro_pwd = "";
                }
            }
            return true;
        },
        // 是否包含全角字符 true-包含 false-不包含
        hasFullshape: function (password) {
            if (password == null || password == "") {
                return true;
            }
            var pattern = /[^\x00-\xff]/g;
            for (var i = 0; i < password.length; i++) {
                if (pattern.test(password.charAt(i))) {
                    return true;
                }
            }
            return false;
        },
        //-----------------------rsa加密------------------
        rsaEncrypto: function (raw) {
            var result = null;
            // 格式：   日期:PublicModules:PublicExponent
            var publicKey = PLAY.cookie('cryptowpt');
            if (publicKey && publicKey.split(':').length == 3) {
                var key = new RSAKeyPair(publicKey.split(':')[2], "", publicKey.split(':')[1], 1024);
                result = encryptedString(key, base64encode(strUnicode2Ansi(raw)), RSAAPP.PKCS1Padding);
            } else {
            }
            return result;
        },
        //--------------------重置密码-------------------
        resetPwd: function () {
            var jm_pwd = $("#password").val();
            var jm_cpwd = $("#cpassword").val();
            var oldpwd = $("#oldpwd").val();
            var pwd = pwdModel.rsaEncrypto(jm_pwd);//给密码框值进行加密处理
            var pwd2 = pwdModel.rsaEncrypto(jm_cpwd);//给密码框值进行加密处理
            var oldpwds = pwdModel.rsaEncrypto(oldpwd);//给密码框值进行加密处理
            per_model.modifyPwd({"version": Math.random(), 'oldpwd': oldpwds, 'pwd': pwd, 'pwd2': pwd2}, function (res) {
                pwdModel.erro_pwd = res.Message;
                //关闭修改密码弹窗
                pwdModel.hidden("show_validate");

                avalon.vmodels["gamehall"].show("public_notice");
                avalon.vmodels["gamehall"].loginMsg = res.Message;
                sub_cg_pwd = 0;
            }, function (res) {
                sub_cg_pwd = 0;
                pwdModel.erro_pwd = res.Message;
                return false;
            }, function (res) {
                sub_cg_pwd = 0;
                pwdModel.erro_pwd = res.Message;
                return false;
            });
        },
        //修改密码
        change_onsubmit_email: function () {
            var nmark_pwd = "0";
            var oldpwd = $("#oldpwd").val();
            var password = $("#password").val();
            var cpassword = $("#cpassword").val();
            var checkUPassword = PLAY.checkPassword(password, 6, 16, function (msg) {
                pwdModel.erro_pwd = msg;
            });
            var checkCPassword = PLAY.checkPassword(cpassword, 6, 16, function (msg) {
                pwdModel.erro_pwd = msg;
            });
            //密码修改已提交，请稍等！
            if (sub_cg_pwd == "1") {
                pwdModel.erro_pwd = "Submitted. Please wait";
                nmark_pwd = "1";
                return false;
            } else if (oldpwd == null || oldpwd == "") {
                pwdModel.erro_pwd = "Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ";
                nmark_pwd = "1";
                return false;
            } else if (password == null || password == "") {
                pwdModel.erro_pwd = "Your password must be 6-16 characters long. You can use numbers, letters, or symbols excluding ,;' ";
                nmark_pwd = "1";
                return false;
            } else if (!checkUPassword) {
                pwdModel.q_checkUPassword();
                nmark_pwd = "1";
                return false;
            } else if (!checkCPassword) {
                pwdModel.q_checkCPassword();
                nmark_pwd = "1";
                return false;
            } else if (password != cpassword) {
                pwdModel.q_checkUPassword();
                pwdModel.q_checkCPassword();
                nmark_pwd = "1";
                return false;
            }
            if (nmark_pwd == "0") {
                sub_cg_pwd = 1;
                pwdModel.resetPwd();//通过验证 调用修改密码
            }
        },
        /*隐藏弹窗*/
        hidden: function (id, close_id) {
            avalon.vmodels[id].toggle = false;
            if (close_id) {
                avalon.vmodels[close_id].toggle = false;
            }
        }
    });
    //avalon.scan();//含有两个可选参数，1：扫描的起点元素 2：VM对象
});
