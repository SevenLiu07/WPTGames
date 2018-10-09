/**
 * Created by shiwz on 17-6-26.
 */
require([
    "text!../../common/widget/header/header.html",    /*头部*/
    "text!../../module/person/account.html",          /*个人中心*/
    "text!../../module/inventory/index.html",         /*背包*/
    "text!../../module/pay/payment.html",             /*支付*/
    "text!../../module/store/index.html",             /*商城*/
    "text!../../module/promotion/index.html",         /*促销*/
    "text!../../module/lobby/gamehall.html",          /*大厅*/
    "text!../../module/account/register.html",        /*注册*/
    "text!../../module/account/login.html",        /*login*/
    "dialog/avalon.dialog.js",
    "../js/jquery1.10.2",
    "domReady!"],
    function(headerHtml,personHTML,inventoryHTML,payHtml,storeHtml,promotionHtml,gamehallHtml,registerHtml,loginHtml,dialog,J) {
        /*配置模板html*/
        var  sourceHtml  = [
            headerHtml,
            personHTML,
            inventoryHTML,
            payHtml,
            storeHtml,
            promotionHtml,
            gamehallHtml,
            registerHtml,
            loginHtml
        ];
        avalon.configSource(sourceHtml);
        /*配置对应模板js*/
        require(["../../common/js/common.js"]);
        require(["../../common/js/scrollBar.js"]);
        require(["../../module/lobby/js/lobby-min.js"]);
        /*  require(["../../module/lobby/js/gamehall.js"]);  *//*大厅*//*
         require(["../../common/js/account-common.js"]);
         require(["../../module/person/js/personal.js"]);      *//*个人中心*//*
         require(["../../module/inventory/js/inventory.js"]);  *//*背包*//*
         require(["../../module/pay/js/payment.js"]);          *//*支付*//*
         require(["../../module/store/js/store.js"]);          *//*商城*//*
         require(["../../module/promotion/js/promotion.js"]);  *//*促销*//*
         require(["../../module/account/js/account.js"]);     *//*login and register*/
    });

/**
 * Created by shiwz on 17-7-7.
 */
