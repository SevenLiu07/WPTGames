var SWZ={};SWZ.ajax=function(e){if(e=e||{},e.type=(e.type||"GET").toUpperCase(),e.dataType=e.dataType||"json","jsonp"!==e.dataType){var t=SWZ.formatParams(e.data);if(window.XMLHttpRequest)var a=new XMLHttpRequest;else var a=new ActiveXObject("Microsoft.XMLHTTP");"GET"==e.type?(a.open("GET",e.url+"?"+t,!0),a.send(null)):"POST"==e.type&&(a.open("POST",e.url,!0),a.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),a.send(t));var n={1223:204};a.onreadystatechange=function(){if(4==a.readyState){var t=n[a.status]||a.status;if(t>=200&&t<300||304===t){var s=SWZ.parseJSON(a.responseText);e.success&&e.success(s,a.status)}else{var r={statusText:"error!",status:a.status};e.fail&&e.fail(r,a.status)}}}}},SWZ.formatParams=function(e){var t=[];for(var a in e)t.push(encodeURIComponent(a)+"="+encodeURIComponent(e[a]));return t.push(("v="+Math.random()).replace(".","")),t.join("&")},SWZ.parseJSON=window.JSON?JSON.parse:function(e){var t=/^[\],:{}\s]*$/,a=/(?:^|:|,)(?:\s*\[)+/g,n=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,s=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;return"string"==typeof e&&(e=e.trim(),e&&t.test(e.replace(n,"@").replace(s,"]").replace(a,"")))?new Function("return "+e)():e},SWZ.ajax({url:"https://www.playwpt.com/WebAPI/Utility/GetWebSiteMaintenanceFlag",type:"post",data:"",success:function(e,t){1==e.State&&0==e.Value&&(location.href="./index.html")},fail:function(e,t){}});