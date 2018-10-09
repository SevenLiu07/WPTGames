/**
 * Created by liuhuan on 2016/2/19.
 */
var http_type=location.protocol+'//';
var getHost = window.location.host.split('.');
var baseUrl = "";
if (location.href.indexOf('staging') !== -1) {
    baseUrl = http_type + "staging-napi." + getHost[1] + '.com/MallApi/';
} else {
    baseUrl = http_type + "napi." + getHost[1] + '.com/MallApi/';
}
document.domain = getHost[1] + ".com";
//var baseUrl=http_type+"shop.playwpt.com/WebAPI/";//定义baseUrl地址
var gold_list=$("#gold_list");
var icons_list=$("#icons_list");
var gold_pic=$("#gold_pic");
var gold_price=$("#gold_price");
var dialog_gold=$('#dialog');
var show_infos=$('#show_infos');
var gameId=35011;//游戏ID
$("#btn_store").style.display='block';
/*点击confirm关闭弹窗提示*/
$("#btn_confirm").on('click',function(){
  show_infos.close();
});
/*点击btn_buy选项卡自动跳转至gold购买金币选项卡*/
$("#btn_buy").on('click',function(){
  $("#show_pay_info").close();
  $("#panel_shop").activate(0);
});
/*千分位*/
function formatSCORE (num) {
  if(parseInt(num)==num){
   return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }
}
//--------获取用户基础信息--------
function get_user_info(){
  var parametes = {"version":Math.random()};
  var curUrl=baseUrl+"User/GetLoginUserBasicInfo";
    new Request(curUrl, {method: "GET"})
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
            if(guideData.Value.IsLogined==true) {//判断是否已登录
            }else {
              console.log("Please Login.");
            }//else语句结束
          }
        }).send(parametes);
}
/*gold页面效果实现*/
function show_tips(){
//var gold_li=$("#gold").findAll("li");
var gold_tips=$("#gold").findAll(".pro_tips");
var gold_pics=$("#gold").findAll(".pro_img");
  for(var i=0;i<gold_pics.length;i++){
    gold_tips[i].style.display='none';
    gold_pics[i].on('mouseover',function(){
        for(var a=0; a<gold_pics.length; a++){
          gold_tips[a].style.display='none';
          if(gold_pics[a]==this){
          /*如果tips提示为空，则隐藏tips小弹窗*/
          var tips_gold=this.find(".descr");//找到当前tips
          if(tips_gold.innerHTML==""||tips_gold.innerHTML=="null"||tips_gold.innerHTML==null){
              gold_tips[a].style.display='none';
          }else{
            gold_tips[a].style.display='block';
            if((a+1)%3==0){
              gold_tips[a].addClass('pro_tips_left');
            }
            else{gold_tips[a].addClass('pro_tips');}
          }
          }else{
            gold_tips[a].style.display='none';
          }
        }
      });
    //点击每个商品的图片，弹出购买弹窗，调用询价接口
    gold_pics[i].on('click', function () {
      var g_code=this.getData("code");//获取商品编码
      var get_this_pic=this.find(".get_img");//从pannal_gold函数中获取图片
      gold_pic.src=get_this_pic.src;
      var get_this_gold=this.getNextSibling();//从pannal_gold函数中获取金币数量
      /*gold_price.innerHTML=get_this_gold.innerHTML;*/
      queryPrice_gold(g_code);
      });
      gold_pics[i].on('mouseout',function(){
            for(var a=0; a<gold_pics.length; a++){
              gold_tips[a].style.display='none';
      }
      })
  }
}
//-----------------------选项卡gold---------------------
function pannal_gold(){
	  var param_gold = {"version": Math.random(),'gameId':gameId,'menuCode':'menu_gold'};
    var curUrl=baseUrl+"Mall/GetGoodsListByMenu";
	  new Request(curUrl, {method: "POST"})
	      .on('complete', function (e) {
					var guideData = JSON.parse(e.text);
					if (guideData.State == 1) {
            var gold_li='';
            for(var i=0; i<guideData.Value.DataList.length;i++){
              gold_li+='<li>';
              gold_li+='<p class="goods_name">'+guideData.Value.DataList[i].GoodsInfo.Name+'</p>';
              gold_li+='<div class="pro_img" data-code="'+guideData.Value.DataList[i].GoodsInfo.GoodsCode+'">';
              gold_li+='<div class="pro_tips">';
              gold_li+='<div class="tp_tbg"></div>';
              gold_li+='<div class="tp_cbg descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</div>';
              gold_li+='<div class="tp_bbg"></div>';
              gold_li+='</div>';
              gold_li+='<a href="javascript:void(0)"><img class="get_img" src="'+guideData.Value.DataList[i].GoodsInfo.PicPath+'"></a>';
              gold_li+='</div>';
              gold_li+='<div class="price">'+formatSCORE(guideData.Value.DataList[i].GoodsInfo.Price)+'</div>';
              gold_li+='</li>';
            }
            gold_list.innerHTML=gold_li;
            show_tips();//悬停显示详细信息描述
					}else{
						console.log(guideData.Message);
					}
				}).send(param_gold);
}pannal_gold();
//-------选项卡gold商品询价--------------
function queryPrice_gold(g_code){
  var param_qp = {"version": Math.random(),'gameId':gameId,'goodsCode':g_code};
  var curUrl=baseUrl+"Mall/QueryPrice";
  new Request(curUrl, {method: "POST"})
      .on('start',function(){
        //dialog_gold.open();
        $("#loading").open();//显示loading
        gold_price.innerHTML="";//清空价格信息
      })
      .on('complete', function (e) {
				var guideData = JSON.parse(e.text);
				if (guideData.State == 1) {
          $("#loading").close();//隐藏
          gold_price.innerHTML=formatSCORE(guideData.Value.TotalPrice);
          dialog_gold.open();
        $("#order").off('click');
        $("#order").on('click',function(){
          if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
          //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
            dialog_gold.close();
            show_infos.open();
            $("#worn_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            createOrder(g_code);//创建订单
          }
        });
				}else{
          //如果此商品已删除，则提示此商品已下架
          $("#order").on('click',function() {
            dialog_gold.close();
            show_infos.open();
            $("#worn_info").innerHTML =guideData.Message;
          });
					console.log(guideData.Message);
				}
			}).send(param_qp);
}
var frame_pay_slot=window.parent.document.getElementById("frame_pay_slot");//获取iframeID
var slot_shop=window.parent.document.getElementById("slot");//获取slotID
var payment_slot=window.parent.document.getElementById("payment_slot");//获取ID
//-------创建订单-----------------------
function createOrder(g_code){
  var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':g_code};
  var curUrl=baseUrl+"Mall/CreateOrder";
    new Request(curUrl, {method: "POST"})
        //点击下单后加载loading提示窗
        .on('start',function(){
          $("#loading").open();
          frame_pay_slot.src="";
        })
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
            $("#loading").close();
             if(guideData.Value.OrderStatus==10){
              //OrderStatus值为10，则提示购买成功
              dialog_gold.close();
              show_infos.open();
              $("#worn_info").innerHTML=guideData.Value.SuccessMessage;
             }else if(guideData.Value.IsBalancePay==false){
              //url跳转至支付页面
               dialog_gold.close();
               show_infos.open();
               $("#worn_info").innerHTML='Please finish the payment process in the payment page';
               var payUrl_slot=guideData.Value.RechargeUrl;
               frame_pay_slot.src=payUrl_slot;
               slot_shop.close();
               setTimeout(function(){payment_slot.open();},300);//打开支付弹窗
               show_infos.close();//关闭提示小窗口Please finish the payment process in the payment page
             }else if(guideData.Value.IsAfford==false){
              //提示余额不足
              dialog_gold.close();
               show_infos.open();
               $("#worn_info").innerHTML='Sorry,you do not have enough gold';
             }else{
              //提示余额不足
              dialog_gold.close();
              show_infos.open();
              $("#worn_info").innerHTML=guideData.Message;
             }
          }else if(guideData.State == 21){
                      //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
                      dialog_gold.close();
                      show_infos.open();
                      $("#worn_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            $("#loading").close();
              //state!=1提示错误信息
              dialog_gold.close();
              show_infos.open();
              $("#worn_info").innerHTML=guideData.Message;
          }
        }).send(parametes);
}
//-----------------------选项卡---------------------------------coins---------------------------------------------
function pannal_coins(){
    var param_coins = {"version": Math.random(),'gameId':gameId,'menuCode':'menu_slot_coins','hasField':1};
    var curUrl=baseUrl+"Mall/GetGoodsListByMenu";
	  new Request(curUrl, {method: "POST"})
	      .on('complete', function (e) {
					var guideData = JSON.parse(e.text);
					if (guideData.State == 1) {
            var coins_li='';
            for(var i=0; i<guideData.Value.DataList.length;i++){
              coins_li+='<li>';
              coins_li+='<p class="goods_name">'+guideData.Value.DataList[i].GoodsInfo.Name+'</p>';
              coins_li+='<div class="pro_img" data-codemaster="'+guideData.Value.DataList[i].GoodsInfo.GoodsCode+'">';
              coins_li+='<div class="pro_tips">';
              coins_li+='<div class="tp_tbg"></div>';
              coins_li+='<div class="tp_cbg descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</div>';
              coins_li+='<div class="tp_bbg"></div>';
              coins_li+='</div>';
              coins_li+='<a href="javascript:void(0)"><img class="get_img_master" src="'+guideData.Value.DataList[i].GoodsInfo.PicPath+'"></a>';
              if(guideData.Value.DataList[i].GoodsInfo.LabelType==1){
                coins_li+='<div class="lable_mp"></div>';
              }else if(guideData.Value.DataList[i].GoodsInfo.LabelType==2){
                coins_li+='<div class="lable_mv"></div>';
              }else{
                coins_li+='';
              }
              coins_li+='</div>';
              coins_li+='<div class="charm">'+formatSCORE(guideData.Value.DataList[i].GoodsInfo.Price)+'</div>';
             		var desc_first;
             		var desc_cent;
             		var desc_last;
                guideData.Value.DataList[i].DescriptionList.forEach(function(descr){
             			if(descr.FieldName == 'CoinsQuantity'){
                    desc_first = descr.FieldValue;
             			}else if(descr.FieldName == 'PlusCoinsRate'){
                    desc_cent = descr.FieldValue;
             			}else if(descr.FieldName == 'ActualCoinsQuantity'){
                    desc_last = descr.FieldValue;
             			}
             		});
              var desc_info="";
             		if(desc_first && desc_cent && desc_last){
                  desc_info=desc_first+'+'+desc_cent+'='+desc_last;
             		}
              coins_li+='<div style="display: none;" class="desc">'+desc_info+'</div>';
              coins_li+='</li>';
            }
            icons_list.innerHTML=coins_li;
            show_tips_coins();
					}else{
						console.log(guideData.Message);
					}
				}).send(param_coins);
}pannal_coins();
/*COINS页面效果实现*/
function show_tips_coins(){
  var coin_tips=$("#icons").findAll(".pro_tips");
  var coin_pics=$("#icons").findAll(".pro_img");
  for(var i=0;i<coin_pics.length;i++){
    coin_tips[i].style.display='none';
    coin_pics[i].on('mouseover',function(){
        for(var a=0; a<coin_pics.length; a++){
          coin_tips[a].style.display='none';
          if(coin_pics[a]==this){
          /*如果tips提示为空，则隐藏tips小弹窗*/
          var tips_master=this.find(".descr");//找到当前tips
          if(tips_master.innerHTML==""||tips_master.innerHTML=="null"||tips_master.innerHTML==null){
            coin_tips[a].style.display='none';
          }else{
            coin_tips[a].style.display = 'block';
            if ((a + 1) % 3 == 0) {
              coin_tips[a].addClass('pro_tips_left');
            }
            else {
              coin_tips[a].addClass('pro_tips');
            }
          }
          }
        }
      });
    coin_pics[i].on('click', function () {
      var g_codecoin=this.getData("codemaster");//获取商品编码
      var coinTit=this.getPreviousSibling();//获取商品名称
      $("#coins_tit").innerHTML=coinTit.innerHTML;
      var get_coin_dis=this.getParent().find('.desc');//获取商品转换比列信息
      $("#ratio").innerHTML=get_coin_dis.innerHTML;
      var get_coin_pic=this.find(".get_img_master");//获取商品图片元素
      $("#coin_pic").src=get_coin_pic.src;//将获取到的商品图片路径赋给弹窗中图片
      queryPrice_coin(g_codecoin);
      });
    coin_pics[i].on('mouseout',function(){
            for(var a=0; a<coin_pics.length; a++){
              coin_tips[a].style.display='none';
            }
      })
  }
}
//-------选项卡COINS商品询价-------
function queryPrice_coin(g_codecoin){
  var param_qp = {"version": Math.random(),'gameId':gameId,'goodsCode':g_codecoin};
  var curUrl=baseUrl+"Mall/QueryPrice";
  new Request(curUrl, {method: "POST"})
      .on('start',function(){
        //$('#dialog_icons').open();
        $("#loading").open();//显示loading
        $("#ex_coins").innerHTML="";//清空价格信息
      })
      .on('complete', function (e) {
				var guideData = JSON.parse(e.text);
				if (guideData.State == 1) {
          $("#loading").close();//隐藏
          if(guideData.Value.IsBalancePay==true){
          //如果用户使用余额支付,则显示用户余额
            //$("#ex_coins").innerHTML='G '+guideData.Value.TotalPrice;
            $("#ex_coins").innerHTML=formatSCORE(guideData.Value.TotalPrice);
            //$("#ex_coins").addClass('charms');
            $("#ex_coins").className='gold_icon';
          }else{//如果用户金币数量不足以支付,则自动将金额转换成美元
            //$("#ex_coins").innerHTML='$ '+guideData.Value.TotalPrice;
            $("#ex_coins").innerHTML=guideData.Value.TotalPrice;
            //$("#ex_coins").removeClass('charms');
            $("#ex_coins").className='prices';
          }
          $('#dialog_icons').open();
          //清除按钮绑定事件
          $("#order_coins").off('click');
          //点击按钮确认下单
          $("#order_coins").on('click',function(){
            createOrderCoin(g_codecoin);//创建订单
          });
				}else{
          //如果此商品已删除，则提示此商品已下架
          $("#order_coins").on('click',function() {
            $('#dialog_icons').close();
            show_infos.open();
            $("#worn_info").innerHTML =guideData.Message;
          });
					console.log(guideData.Message);
				}
			}).send(param_qp);
}
//-------创建订单COINS------------
function createOrderCoin(g_codecoin){
  var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':g_codecoin};
  var curUrl=baseUrl+"Mall/CreateOrder";
    new Request(curUrl, {method: "POST"})
        //点击下单后加载loading提示窗
        .on('start',function(){
          $("#loading").open();
          frame_pay_slot.src="";
        })
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
            $("#loading").close();
             if(guideData.Value.OrderStatus==10){
              //OrderStatus值为10，则提示购买成功
               $('#dialog_icons').close();
               $("#show_infos").open();
              $("#worn_info").innerHTML=guideData.Value.SuccessMessage;
             }else if(guideData.Value.IsBalancePay==false){
                           //url跳转至支付页面
                            dialog_gold.close();
                            show_infos.open();
                            $("#worn_info").innerHTML='Please finish the payment process in the payment page';
                            var payUrl_slot=guideData.Value.RechargeUrl;
                            frame_pay_slot.src=payUrl_slot;
                            slot_shop.close();
                            setTimeout(function(){payment_slot.open();},300);//打开支付弹窗
                            show_infos.close();//关闭提示小窗口
                            $('#dialog_icons').close();
                          }else if(guideData.Value.IsAfford==false){
                           //提示余额不足
                           dialog_gold.close();
                            show_infos.open();
                            $("#worn_info").innerHTML='Sorry,you do not have enough gold';
                          }else{
                           //提示余额不足
                           dialog_gold.close();
                           show_infos.open();
                           $("#worn_info").innerHTML=guideData.Message;
                          }
                       }else if(guideData.State == 21){
                                   //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
                                   dialog_gold.close();
                                   show_infos.open();
                                   $("#worn_info").innerHTML='Sorry,you do not have enough gold';
                       }else{
                         $("#loading").close();
                           //state!=1提示错误信息
                           dialog_gold.close();
                           show_infos.open();
                           $("#worn_info").innerHTML=guideData.Message;
                       }
        }).send(parametes);
}
//-----------------------选项卡Avatar------------------
function pannal_avatar() {
  var param_avatar = {"version": Math.random(), 'gameId': gameId, 'menuCode': 'menu_avatars'};
  var curUrl=baseUrl+"Mall/GetGoodsListByMenu";
  new Request(curUrl, {method: "POST"})
      .on('complete', function (e) {
        var guideData = JSON.parse(e.text);
        if(guideData.State==1){
          var avatar_li='';
          for(var i=0;i<guideData.Value.DataList.length;i++){
            avatar_li+='<li>';
            avatar_li+='<div class="avat_img" data-codeavatar="'+guideData.Value.DataList[i].GoodsInfo.GoodsCode+'">';
            avatar_li+='<div class="charm_tips">';
            avatar_li+='<div class="tp_tbg_s"></div>';
            avatar_li+='<div class="tp_cbg_s descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</div>';
            avatar_li+='<div class="tp_bbg_s"></div>';
            avatar_li+='</div>';
            avatar_li+='<a href="javascript:void(0)"><img class="get_img_master" src="'+guideData.Value.DataList[i].GoodsInfo.PicPath+'"></a>';
            avatar_li+='</div>';
            avatar_li+='<div class="charm">'+formatSCORE(guideData.Value.DataList[i].GoodsInfo.Price)+'</div>';
            avatar_li+='</li>';
          }
          $("#avatar_list").innerHTML=avatar_li;
          show_avatar();
        }
      }).send(param_avatar);
}pannal_avatar();
//-------选项卡Avatar商品询价---------
function queryPrice_avatar(g_codeavatar){
  var param_qp = {"version": Math.random(),'gameId':gameId,'goodsCode':g_codeavatar};
  var curUrl=baseUrl+"Mall/QueryPrice";
  new Request(curUrl, {method: "POST"})
      .on('start',function(){
        //$('#dialog_avat').open();
        $("#loading").open();//显示loading
        $("#avatar_price").innerHTML="";//清空价格信息
      })
      .on('complete', function (e) {
				var guideData = JSON.parse(e.text);
				if (guideData.State == 1) {
          $("#loading").close();//隐藏
          $("#avatar_price").innerHTML=formatSCORE(guideData.Value.TotalPrice);
          $('#dialog_avat').open();
          $("#order_avatar").off('click');
        $("#order_avatar").on('click',function(){
          if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
          //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
            $('#dialog_avat').close();
            $("#show_pay_info").open();
            $("#links").style.display='none';
            $("#btn_store").style.display='block';
            $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            createOrderAva(g_codeavatar);//创建订单
          }
        });
				}else{
          //如果此商品已删除，则提示此商品已下架
          $("#order_avatar").on('click',function() {
            $('#dialog_avat').close();
            show_infos.open();
            $("#worn_info").innerHTML =guideData.Message;
          });
					console.log(guideData.Message);
				}
			}).send(param_qp);
}
/*avatars页面效果实现*/
function show_avatar(){
  var avat_li=$("#avatar").findAll("li");
  var avat_tips=$("#avatar").findAll(".charm_tips");
  var avat_pics=$("#avatar").findAll(".avat_img");
  for(var i=0;i<avat_pics.length;i++){
    avat_tips[i].style.display='none';
    avat_pics[i].on('mouseover',function(){
        for(var a=0; a<avat_pics.length; a++){
          avat_tips[a].style.display='none';
          if(avat_pics[a]==this){
            avat_tips[a].style.display='block';
          /*如果tips提示为空，则隐藏tips小弹窗*/
          var tips_avat=this.find(".descr");//找到当前tips
          if(tips_avat.innerHTML==""||tips_avat.innerHTML=="null"||tips_avat.innerHTML==null){
            avat_tips[a].style.display='none';
          }else{
            if ((a + 1) % 4 == 0) {
              avat_tips[a].addClass('charm_tips_left');
            }
            else {
              avat_tips[a].addClass('charm_tips');
            }
          }
          }
        }
      });
    avat_pics[i].on('click', function () {
      var g_codeavatar=this.getData("codeavatar");
      var get_pic_avatar=this.find(".get_img_master");
      var get_price_avatar=this.getNextSibling();
      $("#avatar_pic").src=get_pic_avatar.src;
      /*$("#avatar_price").innerHTML=get_price_avatar.innerHTML;*/
      queryPrice_avatar(g_codeavatar);
      });
    avat_pics[i].on('mouseout',function(){
            for(var a=0; a<avat_pics.length; a++){
              avat_tips[a].style.display='none';
            }
      })
  }
}
//-------创建订单Avatar--------
function createOrderAva(g_codeavatar){
  var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':g_codeavatar};
  var curUrl=baseUrl+"Mall/CreateOrder";
    new Request(curUrl, {method: "POST"})
        //点击下单后加载loading提示窗
        .on('start',function(){
          $("#loading").open();
        })
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
            $("#loading").close();
             if(guideData.Value.OrderStatus==10){
              //OrderStatus值为10，则提示购买成功
               $('#dialog_avat').close();
               $("#show_pay_info").open();
               $("#links").style.display='block';
               $("#btn_store").style.display='none';
               $("#worn_pay_info").innerHTML='You Purchase it successfully,please check it in your wpt_poker personal center';/*wpt_poker*/
               //$("#links").innerHTML='<a href="javascript:void(0)" id="ps_center">Personal Center</a>';
               $("#links").innerHTML='';
             }else if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
              //提示余额不足转至支付页面
               $('#dialog_avat').close();
               $("#show_pay_info").open();
               $("#links").style.display='none';
               $("#btn_store").style.display='block';
               $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
             }else{
              //提示余额不足
               $('#dialog_avat').close();
              show_infos.open();
              $("#worn_info").innerHTML=guideData.Message;
             }
          }else if(guideData.State == 21){
              //提示余额不足转至支付页面
               $('#dialog_avat').close();
               $("#show_pay_info").open();
               $("#links").style.display='none';
               $("#btn_store").style.display='block';
               $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            $("#loading").close();
            $('#dialog_avat').close();
            show_infos.open();
            $("#worn_info").innerHTML=guideData.Message;
          }
        }).send(parametes);
}
window.onload= function () {
  get_user_info();//获取用户基础信息
};
/*点击小商城关闭按钮时 再次打开时将打开状态的小的详情弹窗关闭*/
function close_slot_shop(){
$("#dialog").close();
$("#dialog_icons").close();
$("#dialog_avat").close();
$("#show_infos").close();
$("#show_pay_info").close();
}
var slot_close=window.parent.$("#close_slot");
if (slot_close.addEventListener) {
  slot_close.addEventListener("click", close_slot_shop, false);
}else if (slot_close.attachEvent) {
  slot_close.attachEvent( "onclick", close_slot_shop );
}
