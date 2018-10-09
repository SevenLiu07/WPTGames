/**
 * Created by liuhuan on 2016/12/20.
 */
require(["../../model/pay-model.js"], function (pay_model) {
    var bkcardnum = "";
    var platformid = "";
    var userid = "";
    var ordercode = "";
    var productid = "";
    var productname = "";
    var productprice = "";
    var paymsgid = '';
    var timestamp_shop = '';
    var timestamp = '';
    var quantity = '';
    var md5sign = '';
    var validnum = '';
    var number = /^\d{16}$/;
    var numbers = /^[0-9]*$/;
    var pay_info = {};//支付信息
    var payModel = avalon.define({
        $id: "payment",
        //初始化支付内容
        pay_option: true,
        billing_info: false,
        complet_order: false,
        error_msg: '',
        error_billing_msg: '',
        notice_msg: '',//错误提示信息
        info_name: '',
        info_address: '',
        info_city: '',
        info_state: '',
        info_postal: '',
        info_country: '',
        product_name: '',
        order_price: '',
        btn_ok: false,
        btn_retry: false,
        btn_success: false,
        timedPromotion: '',
        luckyspin: '',
        //关闭弹窗初始化信息
        init: function () {
            payModel.pay_option = true;
            payModel.billing_info = false;
            payModel.complet_order = false;
            payModel.error_msg = '';
            payModel.error_billing_msg = '';
            payModel.notice_msg = '';
            payModel.info_name = '';
            payModel.info_address = '';
            payModel.info_city = '';
            payModel.info_state = '';
            payModel.info_postal = '';
            payModel.info_country = '';
            payModel.product_name = '';
            payModel.order_price = '';
        },
        //back按钮处理
        backto_card: function () {
            payModel.pay_option = true;
            payModel.billing_info = false;
            payModel.complet_order = false;
        },
        backto_billing: function () {
            payModel.pay_option = false;
            payModel.billing_info = true;
            payModel.complet_order = false;
        },
        /*Payment options*/
        check_payinfo: function () {
            if (!payModel.check_credit()) {
                return false;
            }
            if (pay_info.exp_date.val() == "" || pay_info.exp_date.val() == null) {
                payModel.error_msg = "Please enter a valid expiry date.";
                pay_info.exp_date.focus();
                return false;
            } else if (!payModel.check_expriat()) {
                return false;
            } else if (pay_info.ccv.val() == null || pay_info.ccv.val() == "") {
                payModel.error_msg = "Please input the CVV.";
                pay_info.ccv.focus();
                return false;
            } else if (!numbers.test(pay_info.ccv.val()) || pay_info.ccv.val().length < 3) {
                payModel.error_msg = "CVV2 is a three or four digit value which is printed on the back of your credit card.";
                pay_info.ccv.focus();
                return false;
            } else {
                /*QA GA统计*/
                fbq('track', 'purchase_cc_next_click');//facebook像素统计purchase cc +pay_info.ccv.val()
                ga('send', 'event', 'purchase', 'cc_next_click');
                payModel.error_msg = "";
                payModel.pay_option = false;
                payModel.billing_info = true;
                payModel.complet_order = false;
            }
        },
        check_credit: function () {
            if (pay_info.card_num.val() == null || pay_info.card_num.val() == "") {
                payModel.error_msg = "Please input the Credit Card Number.";
                pay_info.card_num.focus();
                return false;
            } else if (pay_info.card_num.val().indexOf(" ") >= 0) {
                payModel.error_msg = "Sorry,Credit card number cannot consist of space.";
                pay_info.card_num.focus();
                return false;
            } else if (pay_info.is_base_card == 1 && !number.test(pay_info.card_num.val()) || pay_info.card_num.val().length < 16) {
                payModel.error_msg = "Credit card number must be 16 digits value.";
                pay_info.card_num.focus();
                return false;
            }
            return true;
        },
        /*检测信用卡过期时间*/
        check_expriat: function () {
            var myDate = new Date();
            var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
            var montharray = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            var yeararray = ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
            if (month < 10) {
                month = "0" + month;
            }
            var timestamps = year + "" + month;
            var yearNow = timestamps.substr(2, 2);
            var monthNow = timestamps.substr(4, 2);
            var exp_year = pay_info.exp_date.val().substr(2, 2);//截取文本框年份后两位
            var exp_month = pay_info.exp_date.val().substr(0, 2);//截取文本框月份
            var valid = exp_month + '' + exp_year;
            month = valid.substr(0, 2);
            year = valid.substr(2, 2);
            var indexMonth = $.inArray(month, montharray);//判断填写的月份是否存在于月份数组中
            var indexYear = $.inArray(year, yeararray);//判断填写的年份是否存在于年份数组中
            if (valid.length != 4) {
                payModel.error_msg = "The expiry date must be 4 digits.";
                pay_info.exp_date.focus();
                return false;
            }
            if (indexMonth == -1 || indexYear == -1) {
                payModel.error_msg = "Please enter a valid expiry date.";
                pay_info.exp_date.focus();
                return false;
            }
            if (exp_year < yearNow) {
                payModel.error_msg = "Please enter a valid expiry date.";
                pay_info.exp_date.focus();
                return false;
            }
            if (exp_year == yearNow && exp_month < monthNow) {
                payModel.error_msg = "Please enter a valid expiry date.";
                pay_info.exp_date.focus();
                return false;
            } else {
                payModel.error_msg = " ";
            }
            return true;
        },
        /*--------------------------Billing information-------------------*/
        check_billing: function () {
            if (pay_info.firstname.val() == "" || pay_info.firstname.val() == null) {
                payModel.error_billing_msg = "Please enter your first name.";
                pay_info.firstname.focus();
                return false;
            } else if (pay_info.firstname.val().indexOf(" ") >= 0) {
                payModel.error_billing_msg = "Sorry, your first name cannot contain space.";
                pay_info.firstname.focus();
                return false;
            } else if (pay_info.lastname.val() == "" || pay_info.lastname.val() == null) {
                payModel.error_billing_msg = "Please enter your last name.";
                pay_info.lastname.focus();
                return false;
            } else if (pay_info.lastname.val().indexOf(" ") >= 0) {
                payModel.error_billing_msg = "Sorry, your last name cannot contain space.";
                pay_info.lastname.focus();
                return false;
            } else if (pay_info.street.val() == "" || pay_info.street.val() == null) {
                payModel.error_billing_msg = "Please input your street.";
                pay_info.street.focus();
                return false;
            } else if (pay_info.city.val() == "" || pay_info.city.val() == null) {
                payModel.error_billing_msg = "Please enter your city.";
                pay_info.city.focus();
                return false;
            } else if (pay_info.state.val() == "" || pay_info.state.val() == null) {
                payModel.error_billing_msg = "Please enter your state/province.";
                pay_info.state.focus();
                return false;
            } else if (pay_info.state.val().indexOf(" ") >= 0) {
                payModel.error_billing_msg = "Sorry, your state cannot contain space.";
                pay_info.state.focus();
                return false;
            } else if (!payModel.check_pos_code()) {
                console.log('postal code 不通过');
                return false;
            } else {
                /*QA GA统计*/
                fbq('track', 'purchase_address_next_click');//facebook像素统计purchase address +pay_info.street.val()
                ga('send', 'event', 'purchase', 'address_next_click');
                payModel.error_billing_msg = "";
                /*获取用户输入billing信息*/
                payModel.info_name = pay_info.firstname.val() + ' ' + pay_info.middlename.val() + ' ' + pay_info.lastname.val();
                payModel.info_address = pay_info.street.val();
                payModel.info_city = pay_info.city.val();
                payModel.info_state = pay_info.state.val();
                payModel.info_postal = pay_info.pos_input.val();
                //payModel.info_country=$("#country option:selected").val();
                payModel.info_country = $("#country option:selected").text();
                payModel.pay_option = false;
                payModel.billing_info = false;
                payModel.complet_order = true;
            }
        },
        //验证邮编
        check_pos_code: function () {
            if (pay_info.pos_input.val() == "" || pay_info.pos_input.val() == null) {
                payModel.error_billing_msg = "Please input your Postal Code.";
                pay_info.pos_input.focus();
                return false;
            }/* else if (pay_info.pos_input.val().indexOf(" ") >= 0) {
                payModel.error_billing_msg = "Sorry, Postal code cannot contain space.";
                pay_info.pos_input.focus();
                return false;
            } else if (!numbers.test(pay_info.pos_input.val()) || pay_info.pos_input.val().length < 4) {
                payModel.error_billing_msg = "Postal code must be 4-6 digits value.";
                pay_info.pos_input.focus();
                return false;
            }*/
            return true;
        },
        /*获取用户支付详细信息*/
        gPaymentInfo: function () {
            var show_infos = $("#show_infos");
            pay_model.getPaymentInfo({"version": Math.random(), 'paymsgid': paymsgid, 'timestamp': timestamp_shop, 'quantity': quantity, 'md5sign': md5sign}, function (res) {
                //获取订单信息
                timestamp = res.TimeStamp;
                md5sign = res.MD5Sign;
                platformid = res.PlatformPayMessageEO.PlatformId;
                userid = res.PlatformPayMessageEO.UId;
                ordercode = res.PlatformPayMessageEO.PlatformOrderCode;
                productid = res.PlatformPayMessageEO.TbProductId;
                productname = res.PlatformPayMessageEO.TbProductName;
                productprice = res.PlatformPayMessageEO.OrderPrice;
                validnum = res.ValidNum;

                payModel.product_name = res.PlatformPayMessageEO.TbProductName + ' x ' + quantity;
                payModel.order_price = '$' + PLAY.formatScore(res.PlatformPayMessageEO.OrderPrice / 100);//获取订单金额 千分位处理
                //获取信用卡信息
                bkcardnum = res.BankcardModel.BankcardNum;
                if (bkcardnum != null && bkcardnum != "") {
                    var fournum = bkcardnum.substr(bkcardnum.length - 4);
                    pay_info.card_num.val('************' + fournum);
                }
                //pay_info.card_num.val(res.BankcardModel.BankcardNum);
                pay_info.exp_date.val(res.BankcardModel.ExpDate);
                /*------------------------------增减加卡信息------------------------------*/
                if (pay_info.card_num.val() != null && pay_info.card_num.val() != "") {
                    show_infos.show();//如果卡信息不为空，加减卡信息显示区域显示
                    show_infos.removeClass('reduce_info');
                    pay_info.card_num.attr("disabled", true);//添入已拥有卡信息，禁用文本框
                    show_infos.off('click');//清除点击事件
                    show_infos.click(function () {
                        if (pay_info.is_base_card == 0) { // 默认卡
                            pay_info.is_base_card = 1;
                        } else {
                            pay_info.is_base_card = 0;
                        }
                        if (show_infos.hasClass('reduce_info')) {
                            show_infos.toggleClass('reduce_info');
                            //将已拥有卡信息填进去
                            pay_info.card_num.val('************' + fournum);//这里是已支付过的卡信息，添入
                            pay_info.exp_date.val(res.BankcardModel.ExpDate);
                            pay_info.card_num.attr("disabled", true);//添入已拥有卡信息，禁用文本框
                        } else {
                            show_infos.toggleClass('reduce_info');
                            pay_info.card_num.attr("disabled", false);//解用文本框
                            pay_info.card_num.focus();
                            //清空卡信息
                            pay_info.card_num.val("");
                            pay_info.exp_date.val("");
                        }
                    });
                } else {
                    show_infos.hide();//如果卡信息为空，加减卡信息显示区域隐藏
                }
                //获取billing信息
                var contactName = res.BillInfoModel.ContactName;
                if (contactName != null && contactName != "") {
                    var get_nm = contactName.split('-');//分割字符串
                    if (get_nm.length == 2) {
                        pay_info.firstname.val(get_nm[0]);
                        pay_info.lastname.val(get_nm[1]);
                    } else {
                        pay_info.firstname.val(get_nm[0]);
                        pay_info.middlename.val(get_nm[1]);
                        pay_info.lastname.val(get_nm[2]);
                    }
                }
                pay_info.street.val(res.BillInfoModel.AddressLine);
                pay_info.city.val(res.BillInfoModel.City);
                pay_info.state.val(res.BillInfoModel.State);
                pay_info.pos_input.val(res.BillInfoModel.Zip);
                var country = res.BillInfoModel.Country;
                if (country != null && country != "") {
                    $("#country").val(country);//获取已设置country为默认选中项
                }

            }, function (res) {
                payModel.error_msg = res.Message;
            }, function (res) {
                payModel.error_msg = res.Message;
            });
        },
        /*google analytics and facebook Pixel code 支付失败及原因*/
        statistics_pay_fail: function () {
            fbq('track', 'order_confirm_fail', {error: payModel.notice_msg});//facebook像素统计 purchase fail
        },
        /*platforminfo、billinfo、cardinfo数据*/
        comfirmOrder: function () {
            /*billing_info*/
            var first_nm = pay_info.firstname.val();
            var mid_nm = pay_info.middlename.val();
            var last_nm = pay_info.lastname.val();
            var contactname = first_nm + "-" + mid_nm + "-" + last_nm;//name
            var addressline = pay_info.street.val();//street
            var states = pay_info.state.val();//state
            var zip = pay_info.pos_input.val();
            var citys = pay_info.city.val();//city
            var countrys = pay_info.country.val();//country
            /*cardinfo*/
            var cardtype = 1;
            var cardnum = "";
            if (pay_info.is_base_card == 0) {
                cardnum = bkcardnum;
                if (cardnum == "" || cardnum == null) {
                    cardnum = pay_info.card_num.val();
                }
            } else {
                cardnum = pay_info.card_num.val();
            }
            var cardexpdates = pay_info.exp_date.val();//过期时间
            var cardvalidnum = pay_info.ccv.val();//cvv
            /*QA GA统计*/
            fbq('track', 'order_confirm_click');//facebook像素统计 order_confirm_click
            ga('send', 'event', 'purchase', 'order_confirm_click');
            pay_model.confirmOrder(true, {
                "version": Math.random(), 'quantity': quantity, 'platformid': platformid, 'userid': userid, 'ordercode': ordercode,
                'productid': productid, 'productname': productname, 'productprice': productprice, 'paymsgid': paymsgid, 'timestamp': timestamp, 'validnum': validnum, 'md5sign': md5sign,
                'contactname': contactname, 'addressline': addressline, 'state': states, 'zip': zip, 'city': citys, 'country': countrys,
                'cardtype': cardtype, 'cardnum': cardnum, 'cardexpdate': cardexpdates, 'cardvalidnum': cardvalidnum
            }, function (res) {
                var guideData = res.Value;
                /*支付成功信息*/
                payModel.show("show_notice");
                payModel.notice_msg = 'You have successfully purchased ' + productname + ' x ' + quantity + '. Good luck! ';
                payModel.btn_ok = false;
                payModel.btn_retry = false;
                payModel.btn_success = true;//购买成功ok按钮

                /*QA GA统计*/
                fbq('track', 'order_confirm_success');//facebook像素统计 purchase success
                ga('send', 'event', 'purchase', 'order_confirm');
            }, function (res) {
                if (res && res.Message) {
                    if (res == -4) {
                        //处理res==-4 超时处理
                        payModel.show("show_notice");
                        payModel.notice_msg = "You have not acted in time. Payment failed. Please try again later.";
                        payModel.btn_ok = true;
                        payModel.btn_retry = false;
                        payModel.btn_success = false;
                        payModel.statistics_pay_fail();
                    } else {
                        payModel.show("show_notice");
                        payModel.notice_msg = "Payment failed. No charges were made. Please try again later.";
                        payModel.btn_ok = true;
                        payModel.btn_retry = false;
                        payModel.btn_success = false;
                        payModel.statistics_pay_fail();
                    }
                }
            }, function (textStatus, res) {
                if (res && res.Message) {
                    payModel.show("show_notice");
                    payModel.notice_msg = "Payment failed. No charges were made. Please try again later.";//支付失败提示信息
                    payModel.btn_ok = false;
                    payModel.btn_success = false;
                    payModel.btn_retry = true;//显示retry按钮
                    payModel.statistics_pay_fail();
                } else if (textStatus == "timeout") {
                    //timeout过期处理
                    payModel.show("show_notice");
                    payModel.notice_msg = "PlayWPT will process your order as quick as possible. If you does not get feeback after one day, Please contact us at support@playwtp.com Thanks for your patience.";
                    payModel.btn_ok = true;//购买超时ok按钮
                    payModel.btn_retry = false;
                    payModel.btn_success = false;
                    payModel.statistics_pay_fail();
                }
            });
        },
        /*pay successful 回调函数*/
        pay_success: function () {
            avalon.vmodels["show_payment"].paySucCback = 1;
            payModel.hidden('show_payment', 'show_notice');
            if (payModel.luckyspin === "game") {
                payModel.luckyspin = "";
            } else {
                // avalon.vmodels["loginInfo"].getUserInfo();//支付成功后重新加载金币数量
                updateCoinStr();
            }
            try {
                var wpt = window.wpt || "";
                if (wpt) {
                    wpt.play.js.close_shop();
                    wpt.play.js.pay_success();
                }
            } catch (e) {
            }
            if (payModel.timedPromotion) {
                //avalon.vmodels["show_timedPromotion"].toggle = true;
                //avalon.vmodels["show_timedPromotionSuc"].toggle = true;
                showTimedPromotion();
            }
        },
        /*pay fail 回调函数*/
        pay_fail: function () {
            avalon.vmodels["show_payment"].payFailCback = 2;
            payModel.hidden('show_payment', 'show_notice');
            try {
                var wpt = window.wpt || "";
                if (wpt) {
                    wpt.play.js.close_pay();
                }
            } catch (e) {
            }
        },
        /*弹窗popup*/
        $payment: {
            title: "title_payment",
            showClose: true,
            width: "747px",
            smallDialog: true,
            onOpen: function (param_shop) {
                if (param_shop.data.pay_game) {
                    //获取游戏内0.99转盘订单信息
                    paymsgid = param_shop.data.paymsgid;
                    timestamp_shop = param_shop.data.timestamp;
                    quantity = param_shop.data.quantity;
                    md5sign = param_shop.data.md5sign;
                    payModel.luckyspin = param_shop.data.pay_game;//转盘0.99支付
                    payModel.timedPromotion = param_shop.data.timedPromotion;
                    payModel.gPaymentInfo();//获取支付信息
                } else if (param_shop.data.timedPromotion) {
                    //获取商城订单信息
                    paymsgid = param_shop.data.paymsgid;
                    timestamp_shop = param_shop.data.timestamp;
                    quantity = param_shop.data.quantity;
                    md5sign = param_shop.data.md5sign;
                    payModel.timedPromotion = param_shop.data.timedPromotion;
                    payModel.gPaymentInfo();//获取支付信息
                } else {
                    //获取商城订单信息
                    paymsgid = param_shop.data.paymsgid;
                    timestamp_shop = param_shop.data.timestamp;
                    quantity = param_shop.data.quantity;
                    md5sign = param_shop.data.md5sign;
                    payModel.timedPromotion = param_shop.data.timedPromotion;
                    payModel.gPaymentInfo();//获取支付信息
                }
                /*ccv说明*/
                $(".doubt").mouseover(function () {
                    $(".tips").show(200);
                }).mouseout(function () {
                    $(".tips").hide(200);
                });
                /*获取DOM元素*/
                pay_info.is_base_card = 0;
                pay_info.card_num = $("input[name='card_num']");
                pay_info.exp_date = $("input[name='ex_date']");
                pay_info.ccv = $("input[name='ccv']");
                pay_info.firstname = $("input[name='firstname']");
                pay_info.middlename = $("input[name='middlename']");
                pay_info.lastname = $("input[name='lastname']");
                pay_info.street = $("input[name='street']");
                pay_info.city = $("#pay_city");
                pay_info.state = $("#pay_state");
                pay_info.pos_input = $("input[name='postalCode']");
                pay_info.country = $("#country");
                return pay_info;
            },
            onConfirm: function () {
            },
            onClose: function (param_payState) {
                if (param_payState.paySucCback) {
                    avalon.vmodels["show_payment"].paySucCback = "";
                } else {
                    payModel.pay_fail();
                    avalon.vmodels["show_payment"].payFailCback = "";
                }
                bkcardnum = "";
                platformid = "";
                userid = "";
                ordercode = "";
                productid = "";
                productname = "";
                productprice = "";
                paymsgid = '';
                timestamp_shop = '';
                timestamp = '';
                quantity = '';
                md5sign = '';
                validnum = '';
                /*初始化支付信息*/
                pay_info.is_base_card = 0;
                pay_info.card_num.val("");
                pay_info.exp_date.val("");
                pay_info.ccv.val("");
                pay_info.firstname.val("");
                pay_info.middlename.val("");
                pay_info.lastname.val("");
                pay_info.street.val("");
                pay_info.city.val("");
                pay_info.state.val("");
                pay_info.pos_input.val("");
                pay_info.country.val("USA");
                payModel.init();//初始化
            }
        },
        $notice: {
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
        },
        /*显示弹窗*/
        show: function (id, data, pay_style) {
            if (id == "show_payment") {
                avalon.vmodels[id].data = data;
                avalon.vmodels[id].toggle = true;
            } else {
                avalon.vmodels[id].toggle = true;
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
});
