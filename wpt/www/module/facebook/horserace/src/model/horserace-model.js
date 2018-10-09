/**
 * Created by shiwz on 17-3-8.
 */

   
  module.exports  = {
        /*share 分享 好友*/
        shareFriends:function(data,callback,failcallback,errorcallback){
            console.log(22)
            PLAY.ajax.Post({
                url:"https://www.playwpt.com/WebAPI/FacebookApi/SetHorseRacingPromotionDetail",
                data:data,
                success:function(data,res){
                    if(res){
                        callback&&callback(res);
                    }
                },
                fail:function(data,res){
                    if(res){
                        failcallback && failcallback(res);
                    }
                },
                error:function(data,res){
                    errorcallback && errorcallback(res);
                }
            });
        },
        /*获取邀请者*/
        getInviterUserName:function(data,callback,failcallback,errorcallback){
            PLAY.ajax.Post({
                url:"https://www.playwpt.com/WebAPI/FacebookApi/GetHorseRacingPromotionInviter",
                data:data,
                success:function(data,res){
                    if(res){
                        callback&&callback(res);
                    }
                },
                fail:function(data,res){
                    if(res){
                        failcallback && failcallback(res);
                    }
                },
                error:function(data,res){
                    errorcallback && errorcallback(res);
                }
            });
        },
        /*getFaceBookInvitableFriends */
        getFaceBookInvitableFriends:function(data,callback,failcallback,errorcallback){
            PLAY.ajax.Post({
                url:"https://www.playwpt.com/WebAPI/FacebookApi/GetFaceBookInvitableFriends",
                success:function(data,res){
                    if(res){
                        callback&&callback(res);
                    }
                },
                fail:function(data,res){
                    if(res){
                        failcallback && failcallback(res);
                    }
                },
                error:function(data,res){
                    errorcallback && errorcallback(res);
                }
            });
        },
        showLoading:function(){
            if($("#loadingHorseraceModel").length){$("#loadingHorseraceModel").show()}
        },
        hideLoading:function(){
            if($("#loadingHorseraceModel").length){$("#loadingHorseraceModel").hide()}
        }

   
};



