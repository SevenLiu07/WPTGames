/**
 * Created by liuhuan on 2016/2/19.
 */
cookie.setItem('timezone', (new Date().getTimezoneOffset()/60)*(-1));
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
var emojis_list=$("#emojis_list");
var master_list=$("#master_list");
var gold_pic=$("#gold_pic");
var gold_price=$("#gold_price");
var gold_li='';
var emoji_li='';
var dialog_gold=$('#dialog');
var show_infos=$('#show_infos');
var gameId=25011;//游戏ID
var getUrl=$("#getUrl");
var goods_nm="";//存储商品名称
var numbers=/^[0-2]*$/;//0-2位数字
var nums=/^(0|[1-9][0-9]*)$/; //零和非零开头的数字
var init_num="";

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
      /*获取商品名称*/
      var gold_name=this.getPreviousSibling();
      $("#gold_nm").innerHTML=gold_name.innerHTML;
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
//-------选项卡gold商品询价--------------;
function queryPrice_gold(g_code){
  var param_qp = {"version": Math.random(),'gameId':gameId,'goodsCode':g_code};
  var curUrl=baseUrl+"Mall/QueryPrice";
  new Request(curUrl, {method: "POST"})
      .on('start',function(){
        //dialog_gold.open();
        $("#loading").open();//显示loading
        gold_price.innerHTML="";//清空价格信息
        $("#gold_num").value="1";//清空购买金币数量
        init_num=$("#gold_num").value;//赋值
      })
      .on('complete', function (e) {
				var guideData = JSON.parse(e.text);
				if (guideData.State == 1) {
        $("#loading").close();//隐藏
        gold_price.innerHTML=formatSCORE(guideData.Value.TotalPrice);
        /*--------------金币批量购买-------------------*/
          $("#gold_num").on('blur',function(){
            if(this.value==""||this.value==null||this.value==0){
              $("#gold_num").value=1;
              init_num=$("#gold_num").value;
            }else if(!nums.test(this.value)){//零和非零开头的数字
              init_num=this.value.replace("0","");
              $("#gold_num").value=init_num;
            }else{
              init_num=$("#gold_num").value;
            }
          });
          $("#add_btn").off('click');//数量增加btn
          $("#add_btn").on('click',function(){
            init_num=$("#gold_num").value;
            init_num++;
            if(init_num>=9){
              $("#gold_num").value=9;
              init_num=$("#gold_num").value;
            }else{
              $("#gold_num").value=init_num;
            }
          });
          $("#mul_btn").off('click');//数量减少btn
          $("#mul_btn").on('click',function(){
            init_num=$("#gold_num").value;
            init_num--;
            if(init_num<=1){
              $("#gold_num").value=1;
              init_num=$("#gold_num").value;
            }else{
              $("#gold_num").value=init_num;
            }
          });
          /*--------------end金币批量购买-------------------*/
        dialog_gold.open();//弹出详情小窗口
        $("#order").off('click');
        $("#order").on('click',function(){
          if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
          //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
            dialog_gold.close();
            show_infos.open();
            $("#worn_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            createOrder(g_code,init_num);//创建订单
          }
        });
				}else{
          //如果此商品已删除，则提示此商品已下架
            $("#loading").close();//隐藏
          //$("#order").on('click',function() {
            dialog_gold.close();
            show_infos.open();
            $("#worn_info").innerHTML =guideData.Message;
          //});
					console.log(guideData.Message);
				}
			}).send(param_qp);
}
var frame_pay=window.parent.document.getElementById("frame_pay");//获取iframeID
var poker_shop=window.parent.document.getElementById("poker");//获取shopID
var payment=window.parent.document.getElementById("payment");//获取ID
//-------创建订单-----------------------
var pay_shop="";
function createOrder(g_code,init_num){
  var host=window.parent.location.href;
if(host.indexOf("facebook")!=-1){
  pay_shop=1;
  createOrderFb(g_code,init_num);//facebook创建订单
}else{
  pay_shop=2;
  createOrderWeb(g_code,init_num);//web创建订单
}
}
var HtmlUtil = {
    /*1.用正则表达式实现html转码*/
    htmlEncodeByRegExp:function (str){
         var s = "";
         if(str.length == 0) return "";
         s = str.replace(/&/g,"&amp;");
         s = s.replace(/</g,"&lt;");
         s = s.replace(/>/g,"&gt;");
         s = s.replace(/ /g,"&nbsp;");
         s = s.replace(/\'/g,"&#39;");
         s = s.replace(/\"/g,"&quot;");
         return s;
   },
   /*2.用正则表达式实现html解码*/
   htmlDecodeByRegExp:function (str){
         var s = "";
         if(str.length == 0) return "";
         s = str.replace(/&amp;/g,"&");
         s = s.replace(/&lt;/g,"<");
         s = s.replace(/&gt;/g,">");
         s = s.replace(/&nbsp;/g," ");
         s = s.replace(/&#39;/g,"\'");
         s = s.replace(/&quot;/g,"\"");
         return s;
   }
};
//-------playwpt创建订单-------
function createOrderWeb(g_code,init_num){
  var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':g_code,'quantity':init_num};
  var curUrl=baseUrl+"Mall/CreateOrder";
    new Request(curUrl, {method: "POST"})
        .on('start',function(){
          $("#loading").open();
          frame_pay.src="";
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
               var payUrl=HtmlUtil.htmlDecodeByRegExp(guideData.Value.RechargeUrl+'&quantity='+init_num);
               frame_pay.src=payUrl;//支付地址
               poker_shop.close();
               setTimeout(function(){payment.open();},300);//打开支付弹窗
               show_infos.close();//关闭提示小窗口
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
//-------facebook创建订单-------
function createOrderFb(g_code,init_num){
  var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':g_code,'quantity':init_num};
  var curUrl=baseUrl+"Mall/FacebookCreateOrder";
    new Request(curUrl, {method: "POST"})
        .on('start',function(){
          $("#loading").open();
        })
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
             goods_nm=guideData.Value.GoodsName;//GoodsName供facebook支付完成后提示使用
             $("#loading").close();
             if(guideData.Value.OrderStatus==10){
              //OrderStatus值为10，则提示购买成功
              dialog_gold.close();
              show_infos.open();
              $("#worn_info").innerHTML=guideData.Value.SuccessMessage;
             }else if(guideData.Value.IsBalancePay==false){
              //url跳转至支付页面
               dialog_gold.close();
               /*show_infos.open();//提示小窗口
               $("#worn_info").innerHTML='Please finish the payment process in the payment page';*/
               /*fb支付需要的商品url以及订单id*/
               var orderinfo = {
                   "url": guideData.Value.ProductUrl,
                   "pid":guideData.Value.OrderId
               };
               console.log(parent);
               parent.FacebookCreditsOrder(orderinfo,pay_shop);//调用父页面FacebookCreditsOrder方法
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
/*---------------------------万圣节emojis页面效果实现--------------------------*/
function show_emojis(){
var emoj_tips=$("#emojis").findAll(".pro_tips");
var emoj_pics=$("#emojis").findAll(".pro_img");
  for(var i=0;i<emoj_tips.length;i++){
    emoj_tips[i].style.display='none';
    emoj_pics[i].on('mouseover',function(){
        for(var a=0; a<emoj_pics.length; a++){
          emoj_tips[a].style.display='none';
          if(emoj_pics[a]==this){
          /*如果tips提示为空，则隐藏tips小弹窗*/
          var tips_emoj=this.find(".descr");//找到当前tips
          if(tips_emoj.innerHTML==""||tips_emoj.innerHTML=="null"||tips_emoj.innerHTML==null){
            emoj_tips[a].style.display='none';
          }else{
            emoj_tips[a].style.display='block';
            if((a+1)%3==0){
              emoj_tips[a].addClass('pro_tips_left');
            }
            else{emoj_tips[a].addClass('pro_tips');}
          }
          }else{
            emoj_tips[a].style.display='none';
          }
        }
      });
    //点击每个商品的图片，弹出购买弹窗，调用询价接口
    emoj_pics[i].on('click', function () {
      var emoj_code=this.getData("codemoji");//获取商品编码
      var get_this_pic=this.find(".get_img");//从pannal_gold函数中获取图片
      $("#emoj_pic").src=get_this_pic.src;
      /*获取商品名称*/
      var emoj_name=this.getPreviousSibling();
      $("#emoj_nm").innerHTML=emoj_name.innerHTML;
      queryPrice_emojis(emoj_code);
      });
      emoj_pics[i].on('mouseout',function(){
            for(var a=0; a<emoj_pics.length; a++){
              emoj_tips[a].style.display='none';
      }
      })
  }
}
//-----------------------万圣节emojis---------------------
function pannal_emojis(){
	  var param_emoj = {"version": Math.random(),'gameId':gameId,'menuCode':'menu_emoji'};
    var curUrl=baseUrl+"Mall/GetGoodsListByMenu";
	  new Request(curUrl, {method: "POST"})
	      .on('complete', function (e) {
					var guideData = JSON.parse(e.text);
					if (guideData.State == 1) {
            for(var i=0; i<guideData.Value.DataList.length;i++){
              emoji_li+='<li>';
              emoji_li+='<p class="goods_name">'+guideData.Value.DataList[i].GoodsInfo.Name+'</p>';
              emoji_li+='<div class="pro_img" data-codemoji="'+guideData.Value.DataList[i].GoodsInfo.GoodsCode+'">';
              emoji_li+='<div class="pro_tips">';
              emoji_li+='<div class="tp_tbg"></div>';
              emoji_li+='<div class="tp_cbg descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</div>';
              emoji_li+='<div class="tp_bbg"></div>';
              emoji_li+='</div>';
              emoji_li+='<a href="javascript:void(0)"><img class="get_img" src="'+guideData.Value.DataList[i].GoodsInfo.PicPath+'"></a>';
              emoji_li+='</div>';
              emoji_li+='<div class="charm">'+formatSCORE(guideData.Value.DataList[i].GoodsInfo.Price)+'</div>';
              emoji_li+='</li>';
            }
            emojis_list.innerHTML=emoji_li;
            show_emojis();//悬停显示详细信息描述
					}else{
						console.log(guideData.Message);
					}
				}).send(param_emoj);
}pannal_emojis();
//-------选项卡万圣节emojis商品询价--------------
function queryPrice_emojis(emoj_code){
  var param_qp = {"version": Math.random(),'gameId':gameId,'goodsCode':emoj_code};
  var curUrl=baseUrl+"Mall/QueryPrice";
  new Request(curUrl, {method: "POST"})
      .on('start',function(){
        $("#loading").open();//显示loading
        $("#emoj_price").innerHTML="";//清空价格信息
      })
      .on('complete', function (e) {
				var guideData = JSON.parse(e.text);
				if (guideData.State == 1) {
          $("#loading").close();//隐藏
          $("#emoj_price").innerHTML=formatSCORE(guideData.Value.TotalPrice);
          $('#dialog_emojis').open();
          $("#order_emoj").off('click');
        $("#order_emoj").on('click',function(){
          if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
          //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
            $('#dialog_emojis').close();
            $("#show_pay_info").open();
            $("#links").style.display='none';
            $("#btn_store").style.display='block';
            $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            createOrderEmoj(emoj_code);//创建订单
          }
        });
				}else{
          //如果此商品已删除，则提示此商品已下架
            $("#loading").close();//隐藏
          //$("#order_emoj").on('click',function() {
            $('#dialog_emojis').close();
            show_infos.open();
            $("#worn_info").innerHTML =guideData.Message;
          //});
				}
			}).send(param_qp);
}
//-------playwpt创建订单-------
function createOrderEmoj(emoj_code){
    var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':emoj_code};
    var curUrl=baseUrl+"Mall/CreateOrder";
      new Request(curUrl, {method: "POST"})
          .on('start',function(){
            $("#loading").open();
          })
          .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
              $("#loading").close();
               if(guideData.Value.OrderStatus==10){
                //OrderStatus值为10，则提示购买成功
                 $('#dialog_emojis').close();
                 $("#show_pay_charms").open();
                 $("#btn_store").style.display='none';
                 $("#worn_pay_chram").innerHTML='Purchase successful.';
                 $("#open_ps_charm").innerHTML=' ';
               }else if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
                //提示余额不足转至GOLD支付页面
                 $('#dialog_emojis').close();
                 $("#show_pay_info").open();
                 $("#links").style.display='none';
                 $("#btn_store").style.display='block';
                 $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
               }else{
                //提示余额不足
                 $('#dialog_emojis').close();
                show_infos.open();
                $("#worn_info").innerHTML=guideData.Message;
               }
            }else if(guideData.State == 21){
                //提示余额不足转至GOLD支付页面
                 $('#dialog_emojis').close();
                 $("#show_pay_info").open();
                 $("#links").style.display='none';
                 $("#btn_store").style.display='block';
                 $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
            }else{
              $("#loading").close();
              //state!=1提示错误信息
              $('#dialog_emojis').close();
             show_infos.open();
             $("#worn_info").innerHTML=guideData.Message;
            }
          }).send(parametes);
  }


//-----------------------选项卡Master Points------------
function pannal_master(){
	  var param_master = {"version": Math.random(),'gameId':gameId,'menuCode':'menu_poker_master_points'};
    var curUrl=baseUrl+"Mall/GetGoodsListByMenu";
	  new Request(curUrl, {method: "POST"})
	      .on('complete', function (e) {
					var guideData = JSON.parse(e.text);
					if (guideData.State == 1) {
            var master_li='';
            for(var i=0; i<guideData.Value.DataList.length;i++){
              master_li+='<li>';
              master_li+='<p class="goods_name">'+guideData.Value.DataList[i].GoodsInfo.Name+'</p>';
              master_li+='<div class="pro_img" data-codemaster="'+guideData.Value.DataList[i].GoodsInfo.GoodsCode+'">';
              master_li+='<div class="pro_tips">';
              master_li+='<div class="tp_tbg"></div>';
              //master_li+='<div class="tp_cbg"><p class="descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</p></div>';
              master_li+='<div class="tp_cbg descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</div>';
              master_li+='<div class="tp_bbg"></div>';
              master_li+='</div>';
              master_li+='<a href="javascript:void(0)"><img class="get_img_master" src="'+guideData.Value.DataList[i].GoodsInfo.PicPath+'"></a>';
              master_li+='</div>';
              master_li+='<div class="master">'+formatSCORE(guideData.Value.DataList[i].GoodsInfo.Price)+'</div>';
              master_li+='</li>';
            }
            master_list.innerHTML=master_li;
            show_tips_master();
					}else{
						console.log(guideData.Message);
					}
				}).send(param_master);
}pannal_master();
/*master页面效果实现*/
function show_tips_master(){
  var master_li=$("#master").findAll("li");
  var master_tips=$("#master").findAll(".pro_tips");
  var master_pics=$("#master").findAll(".pro_img");
  for(var i=0;i<master_pics.length;i++){
    master_tips[i].style.display='none';
    master_pics[i].on('mouseover',function(){
        for(var a=0; a<master_pics.length; a++){
          master_tips[a].style.display='none';
          if(master_pics[a]==this){
          /*如果tips提示为空，则隐藏tips小弹窗*/
          var tips_master=this.find(".descr");//找到当前tips
          if(tips_master.innerHTML==""||tips_master.innerHTML=="null"||tips_master.innerHTML==null){
            master_tips[a].style.display='none';
          }else{
            master_tips[a].style.display = 'block';
            if ((a + 1) % 3 == 0) {
              master_tips[a].addClass('pro_tips_left');
            }
            else {
              master_tips[a].addClass('pro_tips');
            }
          }
          }
        }
      });
    master_pics[i].on('click', function () {
      var g_codemaster=this.getData("codemaster");//获取商品编码
      var get_master_pic=this.find(".get_img_master");
      $("#master_pic").src=get_master_pic.src;
      /*获取商品名称*/
      var master_name=this.getPreviousSibling();
      $("#master_nm").innerHTML=master_name.innerHTML;
      queryPrice_master(g_codemaster);
      });
    master_pics[i].on('mouseout',function(){
            for(var a=0; a<master_pics.length; a++){
              master_tips[a].style.display='none';
            }
      })
  }
}
//-------选项卡master points商品询价-------
function queryPrice_master(g_codemaster){
  var param_qp = {"version": Math.random(),'gameId':gameId,'goodsCode':g_codemaster};
  var curUrl=baseUrl+"Mall/QueryPrice";
  new Request(curUrl, {method: "POST"})
      .on('start',function(){
        //$('#dialog_master').open();
        $("#loading").open();//显示loading
        $("#master_price").innerHTML="";//清空价格信息
      })
      .on('complete', function (e) {
				var guideData = JSON.parse(e.text);
				if (guideData.State == 1) {
          $("#loading").close();//隐藏
          $("#master_price").innerHTML=formatSCORE(guideData.Value.TotalPrice);
          $('#dialog_master').open();
          $("#order_master").off('click');
          $("#order_master").on('click',function(){
          if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
          //提示如何获取大师分
            $('#dialog_master').close();
            $("#open_flv_master").open();
            /*$("#worn_ms_info").innerHTML='Sorry,you do not hava enough WPT reward points';*/
            $("#worn_ms_info").innerHTML='You have not earned enough WPT Reward Points.';
            $("#flv_master").innerHTML='<a href="javascript:void(0);">How to get more WPT reward points?</a>';
          }else{
            createOrderMas(g_codemaster);//创建订单
          }
        });
				}else{
          //如果此商品已删除，则提示此商品已下架
          $("#loading").close();//隐藏
          $('#dialog_master').close();
          show_infos.open();
          $("#worn_info").innerHTML =guideData.Message;
				}
			}).send(param_qp);
}
//-------创建订单Master Points------------
function createOrderMas(g_codemaster){
  var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':g_codemaster};
  var curUrl=baseUrl+"Mall/CreateOrder";
    new Request(curUrl, {method: "POST"})
        .on('start',function(){
          $("#loading").open();
        })
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
             $("#loading").close();
             if(guideData.Value.OrderStatus==10){
              //OrderStatus值为10，则提示购买成功
               $('#dialog_master').close();
               $("#show_infos").open();
              //$("#worn_info").innerHTML=guideData.Value.SuccessMessage;
              $("#worn_info").innerHTML='Purchase successful.';
             }else if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
              //提示如何获取大师分
               $('#dialog_master').close();
               $("#open_flv_master").open();
               $("#worn_ms_info").innerHTML='You have not earned enough WPT Reward Points.';
               $("#flv_master").innerHTML='<a href="javascript:void(0);">How to get more WPT reward points?</a>';
             }else{
              //获取后台提示信息
               $('#dialog_master').close();
              show_infos.open();
              $("#worn_info").innerHTML=guideData.Message;
             }
          }else if(guideData.State == 21){
          //提示如何获取大师分
            $('#dialog_master').close();
            $("#open_flv_master").open();
            $("#worn_ms_info").innerHTML='You have not earned enough WPT Reward Points.';
            $("#flv_master").innerHTML='<a href="javascript:void(0);">How to get more WPT reward points?</a>';
          }else{
            $("#loading").close();
             //state!=1提示错误信息
             $('#dialog_master').close();
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
            //avatar_li+='<div class="tp_cbg_s"><p class="descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</p></div>';
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
            $("#loading").close();//隐藏
          //$("#order_avatar").on('click',function() {
            $('#dialog_avat').close();
            show_infos.open();
            $("#worn_info").innerHTML =guideData.Message;
          //});
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
               $("#worn_pay_info").innerHTML='Purchase successful.';
               $("#open_ps_center").innerHTML='Go To Personal Center';
             }else if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
              //提示余额不足转至GOLD支付页面
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
              //提示余额不足转至GOLD支付页面
               $('#dialog_avat').close();
               $("#show_pay_info").open();
               $("#links").style.display='none';
               $("#btn_store").style.display='block';
               $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            $("#loading").close();
            //state!=1提示错误信息
            $('#dialog_avat').close();
            show_infos.open();
            $("#worn_info").innerHTML=guideData.Message;
          }
        }).send(parametes);
}
//-----------------------选项卡Chrams------------------
function pannal_charm() {
  var param_charms = {"version": Math.random(), 'gameId': gameId, 'menuCode': 'menu_poker_charms'};
  var curUrl=baseUrl+"Mall/GetGoodsListByMenu";
  new Request(curUrl, {method: "POST"})
      .on('complete', function (e) {
        var guideData = JSON.parse(e.text);
        if(guideData.State==1){
          var charm_li='';
          for(var i=0;i<guideData.Value.DataList.length;i++){
            charm_li+='<li>';
            charm_li+='<div class="charm_img" data-codecharm="'+guideData.Value.DataList[i].GoodsInfo.GoodsCode+'">';
            charm_li+='<div class="charm_tips">';
            charm_li+='<div class="tp_tbg_s"></div>';
            //charm_li+='<div class="tp_cbg_s"><p class="descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</p></div>';
            charm_li+='<div class="tp_cbg_s descr">'+guideData.Value.DataList[i].GoodsInfo.Descr+'</div>';
            charm_li+='<div class="tp_bbg_s"></div>';
            charm_li+='</div>';
            charm_li+='<a href="javascript:void(0)"><img class="get_img_master" src="'+guideData.Value.DataList[i].GoodsInfo.PicPath+'"></a>';
            charm_li+='</div>';
            charm_li+='<div class="charm_dis">'+guideData.Value.DataList[i].GoodsInfo.Name+'</div>';
            charm_li+='<div class="charm">'+formatSCORE(guideData.Value.DataList[i].GoodsInfo.Price)+'</div>';
            charm_li+='</li>';
          }
          $("#charm_list").innerHTML=charm_li;
          show_tips_charm();
        }
      }).send(param_charms);
}pannal_charm();
//-------选项卡Charms商品询价---------
function queryPrice_charms(g_codecharm){
  var param_qp = {"version": Math.random(),'gameId':gameId,'goodsCode':g_codecharm};
  var curUrl=baseUrl+"Mall/QueryPrice";
  new Request(curUrl, {method: "POST"})
      .on('start',function(){
        //$('#dialog_charm').open();
        $("#loading").open();//显示loading
        $("#charm_price").innerHTML="";//清空价格信息
      })
      .on('complete', function (e) {
				var guideData = JSON.parse(e.text);
				if (guideData.State == 1) {
          $("#loading").close();//隐藏
          $("#charm_price").innerHTML=formatSCORE(guideData.Value.TotalPrice);
          $('#dialog_charm').open();
          $("#order_charm").off('click');
        $("#order_charm").on('click',function(){
          if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
          //如果用户使用余额支付，并且余额不足，支付不起，则提示用户去充值
            $('#dialog_charm').close();
            $("#show_pay_info").open();
            $("#links").style.display='none';
            $("#btn_store").style.display='block';
            $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            createOrderCharm(g_codecharm);//创建订单
          }
        });
				}else{
          //如果此商品已删除，则提示此商品已下架
            $("#loading").close();//隐藏
          //$("#order_charm").on('click',function() {
            $('#dialog_charm').close();
            show_infos.open();
            $("#worn_info").innerHTML =guideData.Message;
          //});
				}
			}).send(param_qp);
}
/*charms页面效果实现*/
function show_tips_charm(){
  var charm_li=$("#charm").findAll("li");
  var charm_tips=$("#charm").findAll(".charm_tips");
  var charm_pics=$("#charm").findAll(".charm_img");
  for(var i=0;i<charm_pics.length;i++){
    charm_tips[i].style.display='none';
    charm_pics[i].on('mouseover',function(){
        for(var a=0; a<charm_pics.length; a++){
          charm_tips[a].style.display='none';
          if(charm_pics[a]==this){
          /*如果tips提示为空，则隐藏tips小弹窗*/
          var tips_charm=this.find(".descr");//找到当前tips
          if(tips_charm.innerHTML==""||tips_charm.innerHTML=="null"||tips_charm.innerHTML==null){
            charm_tips[a].style.display='none';
          }else {
            charm_tips[a].style.display = 'block';
            if ((a + 1) % 4 == 0) {
              charm_tips[a].addClass('charm_tips_left');
            }
            else {
              charm_tips[a].addClass('charm_tips');
            }
          }
          }
        }
      });
    charm_pics[i].on('click', function () {
          var g_codecharm=this.getData("codecharm");//获取商品编码
          var get_charm_des=this.find(".descr");//获取tips描述信息
          $("#descr").innerHTML=get_charm_des.innerHTML;//获取tips描述信息
          var get_charm_pic=this.find(".get_img_master");
          $("#charm_pic").src=get_charm_pic.src;
          var charm_name=this.getNextSibling();
          $("#charm_nm").innerHTML=charm_name.innerHTML;
          queryPrice_charms(g_codecharm);
          });
    charm_pics[i].on('mouseout',function(){
            for(var a=0; a<charm_pics.length; a++){
              charm_tips[a].style.display='none';
            }
      })
  }
}
//-------创建订单Charms--------
function createOrderCharm(g_codecharm){
  var parametes = {"version":Math.random(),'gameId':gameId,'goodsCode':g_codecharm};
  var curUrl=baseUrl+"Mall/CreateOrder";
    new Request(curUrl, {method: "POST"})
        .on('start',function(){
          $("#loading").open();
        })
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
            $("#loading").close();
             if(guideData.Value.OrderStatus==10){
              //OrderStatus值为10，则提示购买成功
               $('#dialog_charm').close();
              /*show_infos.open();
              $("#worn_info").innerHTML=guideData.Value.SuccessMessage;//购买幸运物成功*/
               $("#show_pay_charms").open();
               $("#btn_store").style.display='none';
               /*$("#worn_pay_chram").innerHTML='You purchase it successfully,&nbsp;please check it in your personal center';*/
               $("#worn_pay_chram").innerHTML='Purchase successful.';
               $("#open_ps_charm").innerHTML='Go To Personal Center';
             }else if(guideData.Value.IsBalancePay==true&&guideData.Value.IsAfford==false){
              //提示余额不足转至GOLD支付页面
               $('#dialog_charm').close();
               $("#show_pay_info").open();
               $("#links").style.display='none';
               $("#btn_store").style.display='block';
               $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
             }else{
              //提示余额不足
               $('#dialog_charm').close();
              show_infos.open();
              $("#worn_info").innerHTML=guideData.Message;
             }
          }else if(guideData.State == 21){
              //提示余额不足转至GOLD支付页面
               $('#dialog_charm').close();
               $("#show_pay_info").open();
               $("#links").style.display='none';
               $("#btn_store").style.display='block';
               $("#worn_pay_info").innerHTML='Sorry,you do not have enough gold';
          }else{
            $("#loading").close();
            //state!=1提示错误信息
            $('#dialog_charm').close();
           show_infos.open();
           $("#worn_info").innerHTML=guideData.Message;
          }
        }).send(parametes);
}
window.onload= function () {
  get_user_info();//获取用户基础信息
};
/*点击小商城关闭按钮时 再次打开时将打开状态的小的详情弹窗关闭*/
function close_small_pop(){
$("#dialog").close();
$("#dialog_master").close();
$("#dialog_charm").close();
$("#dialog_avat").close();
$("#show_infos").close();
$("#show_pay_info").close();
$("#open_flv_master").close();
$("#show_pay_charms").close();
}
//var close=window.parent.$("#close");
var close=window.parent.document.getElementById('close');
if (close.addEventListener) {
  close.addEventListener("click", close_small_pop, false);
}else if (close.attachEvent) {
    close.attachEvent( "onclick", close_small_pop );
}
