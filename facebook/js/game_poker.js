/**
 * Created by liuhuan on 2016/7/22.
 */
var http_type=location.protocol+'//';
var lHost = window.location.host;
var getHost = lHost.substring(4);
var baseUrl = http_type + "napi." + getHost + '/WebAPI/';
var baseUrls = http_type + location.host + '/';
//var baseUrl=http_type+"www.playwpt.com/WebAPI/";
/*统计对象*/
var conversionLabels = {
        as:"iIUfCJqZ7G0QzISpnAM",//Avatar selected
        ue:"QXcECK7C0m0QzISpnAM",//Username entered
        fb:"BsikCKvC0m0QzISpnAM",//Registration w/ Facebook
        em:"rvKdCMzw5m0QzISpnAM" //Registration w/ Email Address
    };
var sex=1;
var sourceUrl="";//转盘全局变量
var btn_retry=$("#btn_retry");
//打开弹窗
function open_shop(element,panel_shop){
/*  if(element=='poker'){
    $("#frame_shop").src='http://shop.playwpt.com/shop.html';
  }*/
    var get_panel=document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("panel_shop");
    get_panel.activate(panel_shop);
    document.getElementById(element).open();
/*点击GO TO PERSONAL打开个人中心头像页面*/
    var ps_center=document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("open_ps_center");//Go To Personal Center按钮
    var pop_avatar=document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("show_pay_info");//show_pay_charms提示弹窗
    var pop_master=document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("open_flv_master");//show_pay_charms提示弹窗
    ps_center.onclick=function(){
      try {
            document.getElementById("gameSwf").close_shop();//close_shop方法回调
      } catch (e) {
      }
      $("#poker").close();//关闭小商城
      pop_avatar.close();//关闭提示窗
      open_personal('personal',2);
    };
/*点击GO TO PERSONAL打开个人中心幸运物页面*/
      var ps_charms=document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("open_ps_charm");//Go To Personal Center按钮
      var pop_charms=document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("show_pay_charms");//show_pay_charms提示弹窗
      ps_charms.onclick=function(){
        $("#poker").close();//关闭小商城
        pop_charms.close();//关闭提示窗
        open_personal('personal',3);
        try {
              document.getElementById("gameSwf").close_shop();//close_shop方法回调
        } catch (e) {
        }
      };
/*点击 打开大师分flash弹窗*/
  var open_dsf=document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("flv_master");//How to get more WPT reward points?按钮
  open_dsf.onclick=function(){
          try {
                document.getElementById("gameSwf").open_master();//open_dsf打开大师分flash弹窗
          } catch (e) {
          }
          $("#poker").close();//关闭小商城
    pop_master.close();//关闭大师分提示窗
        };
// poker小商城 点击“关闭按钮”，回调close_shop函数。
$("#close").off('click');
$("#close").on('click',function(){
  //$("#frame_shop").src='';
  try {
      document.getElementById("gameSwf").close_shop();
    } catch (e) {
    }
});
}
//打开个人中心弹窗
function open_personal(element,panel_personal){
  window.frames[1].get_avatar_list();//打开个人中心时重新调用获取头像函数
  window.frames[1].get_charms_list();//打开个人中心时重新调用获取礼物函数
  window.frames[1].get_pwd_time();//获取最后修改密码的时间
  /*点击获取头像按钮打开个商城购买头像选项卡*/
      var ava_center=document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("btn_getAva");
      ava_center.onclick=function(){
        $("#personal").close();//关闭小商城
        open_shop('poker',1);//打开小商城的avatar选项卡
      };
   /*点击获取幸运物按钮打开个商城购买幸运物选项卡*/
      var charm_center=document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("btn_gift");
      charm_center.onclick=function(){
        $("#personal").close();//关闭小商城
        open_shop('poker',2);//打开小商城的charms选项卡
      };
// poker个人中心 更换头像后，回调updateHead函数。
  var btn_curAvatar=document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("btn_ok");
  btn_curAvatar.on('click',function(){
  try {
      document.getElementById("gameSwf").updateHead();
    } catch (e) {
    }
});
    document.getElementById(element).open();
    var get_panel=document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("panel_personal");
    get_panel.activate(panel_personal);
}
/*判断转盘支付方式：0:facebook支付系统 1：web端支付系统*/
function style_pay(){
  var getUrl=window.location.href;
  if(getUrl.indexOf("facebook")!=-1){
    sourceUrl=0;/*0:facebook支付系统*/
  }else{
    sourceUrl=1;/*1：web端支付系统*/
  }
  return sourceUrl;
}
/*打开支付页面*/
function open_pay(pay_url){
  if(sourceUrl==0){
    var payurl_fb=pay_url;
    var url_split=payurl_fb.split("=");//字符串切割为["https://shop.playwpt.com/webapi/page/Home/SpinProductDesc?payID", "32位订单号"]
    var pay_id=url_split[1];//取url_split[1]
    var orderinfo = {
        "url": pay_url,
        "pid":pay_id
    };
    FacebookCreditsOrder(orderinfo,2);//调用父页面FacebookCreditsOrder方法
  }else{
    $("#frame_pay").src=pay_url;//定义框架url地址
    $("#payment").open();//打开payment
  }
}
  /*支付完成后点击ok按钮关闭支付系统弹窗*/
var frame_pay=$("#frame_pay");
if(frame_pay){
  frame_pay.onload=function(){
    var close_pay_flash=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("qd_ok");
    var btn_retry=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("btn_retry");
    var pay_option=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("pay_option");
    var billing_info=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("billing_info");
    var complete=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("complete");
    var complet_order=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("complet_order");
    var pay_cancle=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("btn_cancle");
    close_pay_flash.on('click',function(){
      $("#payment").close();
      try {
              document.getElementById("gameSwf").pay_success();
            } catch (e) {
      }
    });
    pay_cancle.on('click',function(){
        try {
                document.getElementById("gameSwf").close_pay();
              } catch (e) {
        }
    });
    //点击retry关闭支付页面，打开商城页面
    btn_retry.on('click',function(){
      //$("#payment").close();
      complete.close();//关闭retry弹窗
      pay_option.style.display='block';//点击retry按钮，打开Payment options选项卡
      billing_info.style.display='none';
      complet_order.style.display='none';
      //open_shop('poker',0);
    })
  };
}
  // 关闭payment支付系统，回调close_pay函数。
  $("#close_pay").off('click');
  $("#close_pay").on('click',function(){
    var payment_slot=$("#payment_slot");
    try {
      var complete=document.getElementsByTagName('iframe')[2].contentWindow.document.getElementById("complete");
      if(complete.isOpen==true){
        document.getElementById("gameSwf").pay_success();//弹窗id存在，支付成功的状态下点击支付的关闭X 回调pay_success
      }else{
        document.getElementById("gameSwf").close_pay();//点击支付的关闭X poker回调
      }
      } catch (e) {
      }
            if(payment_slot) {//slot点击关闭 需要做的处理
              if (payment_slot.isOpen == true) {
                try {
                  document.getElementById("gameSwf_slot").close_slot_shop();//点击支付的关闭X slot回调
                } catch (e) {
                }
              }
            }
  });
/*打开排行榜*/
function open_leaderboard(){
  $("#leaderboard").open();
  //$("#frame_lb").src=http_type+'webapps.playwpt.com/PokerLeaderboard/leaderboard.html';
  $("#frame_lb").src =baseUrls + 'leaderboard/leaderboard.html';
}
//关闭弹窗
function close_shop(element){
  document.getElementById(element).close();
}
//---------------------------------------------------判断是否已绑定联众账号---------------------------------------
function top_nav(){
    var parametes = {"version":Math.random()};
      var curUrl=baseUrl+"Passport/GetLoginUserInfo";
      new Request(curUrl, {method: "GET"})
          .on('complete', function (e) {
            var guideData = JSON.parse(e.text);
            if (guideData.State == 1) {
               if(guideData.Value.IsLogined==true){//判断是否已登录
                     var val=guideData.Value.DefaultDisplayName;
                 /*获取cookie*/
                 var uid=guideData.Value.UId;
                 var get_cok=cookie.getItem('tooLowGoldPlayerfbGoldTipFlag'+uid);
                 if(get_cok){
                   $("#dialog_public").open();
                   $("#pub_info").innerHTML=guideData.Message;
                   $("#btn_ok").on('click',function(){
                     $("#dialog_public").close();
                   })
                 }
                 var clear_cok='tooLowGoldPlayerfbGoldTipFlag'+uid;
                 cookie.removeItem(clear_cok,{'domain':'.playwpt.com','path':'/'});//使用后删除cookie

                     if(guideData.Value.IsBindLz==false){//如果未绑定联众账号 则打开创建用户名窗口
                         $("#dialog_head").open();
                         $("#show_name").style.display="block";//显示创建username部分
                         $("#show_head").style.display="none";//隐藏选择头像部分
                         $("#ipt_name").value=val;//username默认为用户注册的邮箱@符前面的文字
                     }else if(guideData.Value.IsBindAvatar==false){//如果未选择头像 则打开选择头像窗口
                         $("#dialog_head").open();
                         //show_head();
                         $("#show_name").style.display="none";//隐藏创建username部分
                         $("#show_head").style.display="block";//显示选择头像部分
                     }else{
                       $("#dialog_head").close();
                       game_poker();//打开flash界面
                     }
               }
            }else if(guideData.State ==-2000){
              $("#dialog_ip").open();
              $("#info_ip").innerHTML=guideData.Message;
            }
          }).send(parametes);
}
document.on('domready',function(){
    top_nav();
/*var get_source=document.getElementsByTagName('iframe')[0].contentWindow.location.parameters.source;
var get_state=document.getElementsByTagName('iframe')[0].contentWindow.location.parameters.state;*/
    //fb用户首次登陆相当于注册
    if(location.parameters.source=="fb"&&location.parameters.state==1){
    //google统计
    ga('send','event','Signup','Register','Facebook');
    window.google_trackConversion({google_conversion_id: 864698956,google_conversion_label: conversionLabels.fb,google_remarketing_only: false});
    }
});
//----------------------------------------------------已登录用户-绑定联众角色名-----------------------------------------
function bindName(){
  var roleName=$("#ipt_name").value;
  var param_bind = {"version":Math.random(),'roleName':roleName};
  var curUrl=baseUrl+"Passport/BindLzRoleName";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
            //google统计
            ga('send','event','Signup','Entered','Username');
            window.google_trackConversion({google_conversion_id: 864698956,google_conversion_label: conversionLabels.ue,google_remarketing_only: false});
            top_nav();
            $("#show_name").style.display="none";//隐藏创建username部分
            $("#show_head").style.display="block";//显示选择头像部分
            //show_head();
          }else{
            $("#worn_name").innerHTML=guideData.Message;
          }
        }).send(param_bind);
}
function bindAvatar(){
/*  if(sex==1){
    var avatarCode='100'+picInfo.manPic;
  }else{
    var avatarCode='200'+picInfo.womanPic;
  }*/
  if(sex==1){
      var avatarCode='1001';
    ga('send','event','Signup','Avatar','M');
    window.google_trackConversion({google_conversion_id: 864698956,google_conversion_label: conversionLabels.as,google_remarketing_only: false});
    }else{
      var avatarCode='2001';
    ga('send','event','Signup','Avatar','F');
    window.google_trackConversion({google_conversion_id: 864698956,google_conversion_label: conversionLabels.as,google_remarketing_only: false});
  }
  var param_bindAva = {"version":Math.random(),'sex':sex,'avatarCode':avatarCode};
  var curUrl=baseUrl+"Passport/BindAvatar";
    new Request(curUrl, {method: "POST"})
        .on('complete', function (e) {
          var guideData = JSON.parse(e.text);
          if (guideData.State == 1) {
            top_nav();
          }else{
            $("#worn_name").innerHTML=guideData.Message;
          }
        }).send(param_bindAva);
}
  //点击next如果未键入name 则提示
    $("#btn_next").on('click',function(){
        var ipt_name=$("#ipt_name");
        var worn_name=$("#worn_name");
        if(ipt_name.value==""){
          worn_name.innerHTML="Please input your username";
        }else if(ipt_name.value.indexOf(" ") >=0){
          worn_name.innerHTML="Sorry, your Username cannot contain space";
		}else if(ipt_name.value.replace(/[^\x00-\xff]/g, 'xx').length<4){
          worn_name.innerHTML="Your username is too short, please input 4-20 characters as your username";
		}else if(ipt_name.value.replace(/[^\x00-\xff]/g, 'xx').length>20){
		      worn_name.innerHTML="Your username is too long, please input 4-20 characters as your username";
		}else{
          bindName();//绑定账号
    }
  });
//点击playgames如果未键入name 则提示
    $("#start_gm").on('click',function(){
			//弹出提示验证邮箱弹窗信息
      bindAvatar();//绑定选择头像
    });
  //选择游戏角色头像
  function head() {
    var heads=$("#chose_head").findAll('a');
    var act_icon=$("#chose_head").findAll('.active_icon');
        for(var i=0;i<heads.length;i++){
           heads[i].on('click',function(){
                for(var a=0;a<heads.length;a++){
                   heads[a].removeClass('active_head');
                   act_icon[a].style.display='none';
                   this.find('.active_icon').style.display='block';
                   this.addClass('active_head');
                   sex=this.id;
                }
           });
        }
  }head();
//随即显示一组默认头像
/*function show_head(){
var man_pic=Math.ceil(Math.random()*8);
var woman_pic=Math.ceil(Math.random()*6);
  man.src=http_type+'static.playwpt.com/www/images/100'+man_pic+'.png';
  woman.src=http_type+'static.playwpt.com/www/images/200'+woman_pic+'.png';
  picInfo={manPic:man_pic,womanPic:woman_pic};
  return picInfo;
}*/
/*flash检测*/
var playerVersion = swfobject.getFlashPlayerVersion();
var majorVersion = playerVersion.major;
if (majorVersion > 0) {
} else {
    alert("Flash player plugin is required for PlayWPT games.");
    /* 发送日志信息*/
    function sendWriteLog(){
        var parametes = {"logMsg":""};
            parametes.logMsg = "Flash player plugin is required for PlayWPT games.";
        var curUrl=baseUrl+"Utility/WriteLog";
        new Request(curUrl, {method: "POST"})
            .on('complete', function (e) {
            }).send(parametes);
    }
    sendWriteLog();
}

//获取poker游戏页面
function game_poker() {
    var parametes = {};
    var curUrl=baseUrl+"PlayGame/GetFlashVars_Poker";
    new Request(curUrl, {method: "POST"})
    //new Request('http://www.playwpt.com/WebAPI/PlayGame/GetFlashVars_Poker', { method: "POST" })
  .on('complete', function (e) {
      var guideData = JSON.parse(e.text);
      if (guideData.State == 1) {
          $("#dialog_flv").close();
          var _flashVarsssss = guideData.Value;
          openFlash(_flashVarsssss);
      }else {
        $("#dialog_flv").open();
        $("#flv_info").innerHTML=guideData.Message;
      }

  }).send(parametes);
}
if(btn_retry){
  btn_retry.on('click',function(){
    game_poker();
  });
}
// =======加载游戏 Flash=======
var isOpen = false;
function openFlash(_flashVars) {
    if (!isOpen) {
                var flashvars = {};
                var params = {};
                params.quality = 'high';
                params.wmode = 'Opaque';
                params.menu = 'false';
                params.id = 'Template';
                params.allowScriptAccess = 'always';
                params.allowFullScreen = 'true';
                params.name = 'Template';
                params.base = '.';
                params.FlashVars = _flashVars;
                var attributes = {};
                //swfobject.embedSWF('http://static.playwpt.com/poker/client/Common.swf?dt=' + (new Date()).valueOf(), 'gameSwf', '100%', '100%', '7', '', flashvars, params, attributes);
                swfobject.embedSWF(http_type+'static.playwpt.com/poker/client/Common.swf?dt=' + (new Date()).valueOf(), 'gameSwf', '100%', '100%', '7', '', flashvars, params, attributes);
                isOpen = true;
    }
}
/*商城打开支付后 成功后提示消息弹窗 点击ok关闭提示窗口*/
$("#qd_ok").on('click',function() {
  $("#complete").close();
  try {
    document.getElementById("gameSwf").pay_success();
  } catch (e) {
  }
});
