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
        /*配置对应模板js*/
        require(["../../common/js/common-dufu.js"]);
        require(["../../common/js/scrollBar.js"]);
        require(["../../module/index/js/new_index.js"]);  /*首页*/
        require(["../../module/lobby-dufu/js/gamehall.js"]);  /*大厅*/
        require(["../../common/js/account-common.js"]);
        require(["../../module/person/js/personal.js"]);      /*个人中心*/
        require(["../../module/inventory/js/inventory.js"]);  /*背包*/
        require(["../../module/pay/js/payment.js"]);          /*支付*/
        require(["../../module/store/js/store.js"]);          /*商城*/
        require(["../../module/promotion/js/promotion.js"]);  /*促销*/
        require(["../../module/leaderboard/js/lboard.js"]);/*排行榜*/
        require(["../../module/store/js/goldStore.js"]);          /*金币商城*/
        require(["../../module/account/js/account.js"]);     /*login and register*/
});

