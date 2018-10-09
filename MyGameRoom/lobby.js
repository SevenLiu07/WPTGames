require([
    "text!../../common/widget/header/header.html",    /*头部*/
    "text!../../module/person/account.html",          /*个人中心*/
    "text!../../module/inventory/index.html",         /*背包*/
    "text!../../module/pay/payment.html",             /*支付*/
    "text!../../module/store/index.html",             /*商城*/
    "text!../../module/promotion/index.html",         /*促销*/
    "text!../../module/leaderboard/index.html",         /*排行榜*/
    "text!../../module/lobby/gamehall.html",          /*大厅*/
    "text!../../module/account/register.html",        /*注册*/
    "text!../../module/account/login.html",        /*login*/
    "text!../../module/store/goldStore.html",         /*goldStore*/
    "dialog/avalon.dialog.js",
    "../js/jquery1.10.2",
    "domReady!"],
 function(headerHtml,personHTML,inventoryHTML,payHtml,storeHtml,promotionHtml,leaderBoardHtml,gamehallHtml,registerHtml,loginHtml,goldStore,dialog,J) {
        /*配置模板html*/
        var  sourceHtml  = [
            headerHtml,
            personHTML,
            inventoryHTML,
            payHtml,
            storeHtml,
            promotionHtml,
            leaderBoardHtml,
            gamehallHtml,
            registerHtml,
            loginHtml,
            goldStore
        ];
        avalon.configSource(sourceHtml);
        /*配置对应模板js staging环境：require(["../../../wpt/common/js/common-dufu-staging.js"]);*/
        require(["../../../wpt/common/js/common-dufu-10961c5f98.js"]);
        require(["../../common/js/scrollBar.js"]);
        require(["../../module/index/js/new_index-001.js"]);  /*首页*/
        require(["../../../wpt/module/lobby-dufu/js/gamehall-aa5f30b363.js"]);  /*大厅*/
        require(["../../common/js/account-common.js"]);
        require(["../../../wpt/module/person/js/personal-23ce3f397d.js"]);      /*个人中心*/
        require(["../../../wpt/module/inventory/js/inventory-a71543984a.js"]);  /*背包*/
        require(["../../../wpt/module/pay/js/payment-22161b50fe.js"]);          /*支付*/
        require(["../../../wpt/module/store/js/store-997f63a694.js"]);          /*商城*/
        require(["../../../wpt/module/promotion/js/promotion-1e262e4a7d.js"]);  /*促销*/
        require(["../../../wpt/module/leaderboard/js/lboard-63531528fe.js"]);/*排行榜*/
        require(["../../../wpt/module/store/js/goldStore-4abcc9f496.js"]);          /*金币商城*/
        require(["../../../wpt/module/account/js/account-2d8cbfaf62.js"]);     /*login and register*/
});
