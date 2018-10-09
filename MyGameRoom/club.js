function showfullscreen() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// 判断浏览器种类
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

//document.domain='clubwpt.com';
var http_type = location.protocol + '//';
var http_name = location.hostname;

//邮件模块
var mail;
(function (mail) {
    var $content;
    mail.showMailContent = function (url, xx, yy, w, h) {
        $content = document.getElementById("mailContent");
        $content.style = "margin: auto;position: absolute; top: " + yy + "px; left: " + xx + "px;";
        //    $contentContainer.innerHTML = '<iframe name="i_' + id + '" src="' + selfOrigin + '/WebAPI/Message/Index?id=' + id + '&appName=' + appName + '" frameborder="no" scrolling="no" allowtransparency="true"></iframe>';
        $content.innerHTML = '<iframe name="aaa" src="' + url + '" width="' + w + '" height="' + h + '"  style="width:"' + w + '";height:"' + h + '"" frameborder="no" ></iframe>';
        // $content.innerHTML = '<iframe name="aaa" src="http://www.cnbeta.com/" width="'+w+'" height="'+h+'"  style="width:"'+w+'";height:"'+h+'"" frameborder="no" ></iframe>';
    }

    mail.hideMailContent = function () {
        $content = document.getElementById("mailContent");
        $content.style = "none";
    }

})(mail || (mail = {}));

//------------------------------------rsa加密--------------------------------
function rsaEncrypto(raw) {
            var result = null;
            // 格式：   日期:PublicModules:PublicExponent
            var publicKey = cookie.getItem('cryptowpt');
            if (publicKey && publicKey.split(':').length == 3) {
                var key = new RSAKeyPair(publicKey.split(':')[2], "", publicKey.split(':')[1], 1024);
                result = encryptedString(key, base64encode(strUnicode2Ansi(raw)), RSAAPP.PKCS1Padding);
            } else {
                var curUrl=baseUrl+"User/GetCryptoToken";
                new Request(curUrl, { method: "GET", maxTime: 8000, sync: true }).on('complete', function(e) {
                    if (e.status == 200) {
                        var ret = JSON.parse(e.text);
                        if (ret.State == 1) {
                            result = rsaEncrypto(raw);
                        }
                    }
                }).send();
   }
   return result;
}var content = function() {

  var $contentbox = document.getElementById("mailContent");

  return {
    setHeight: function(height) {
    //   $contentContainer.getFirstChild().setStyle('height', height);
      $contentbox.update();
    }
  };

}();