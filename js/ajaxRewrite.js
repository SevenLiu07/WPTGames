!function(e){var t=0,n=-498,a=-408,i=Date.now(),s=function(){},o=[];e.ActiveXObject&&e.on("unload",function(){o.forEach(function(e){e.abort()})});var r=function(){try{var t=e.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")}catch(e){throw new Error("Can not create XHR Object")}return t},c=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,m=function(e){for(var t,n={};t=c.exec(e);)n[t[1]]=t[2];return n},u=function(e){if(!e.sync&&Number.isFinite(e.minTime)){var n=e.minTime-(Date.now()-e.timestamp);if(n>0)return void(e.minTimeTimer=setTimeout(function(){d(e,t)},n))}d(e,t)},d=function(e,i){e.minTimeTimer&&(i=t,clearTimeout(e.minTimeTimer),delete e.minTimeTimer),e.maxTimeTimer&&(clearTimeout(e.maxTimeTimer),delete e.maxTimeTimer),e.ongoing=!1,delete e.timestamp;var r={status:0,statusText:""};switch(e.mode){case"xhr":r.headers={},r.text="",r.xml=null;var c=e.xhr;if(delete e.xhr,c.onreadystatechange=s,i===t)try{r.status=c.status,1223===r.status&&(r.status=204),r.statusText=c.statusText,r.headers=m(c.getAllResponseHeaders()),r.text=c.responseText,c.responseXML&&c.responseXML.documentElement&&(r.xml=c.responseXML)}catch(e){}else c.abort();o.remove(e);break;case"jsonp":if(r.data=null,i===t)r.status=t,r.statusText="OK",r.data=e.receivedData;else{var u=e.id;h[u]=function(){delete h[u]}}}switch(i){case t:e.fire("complete",r);break;case n:r.status=n,r.statusText="Aborted",e.fire("abort",r);break;case a:r.status=a,r.statusText="Timeout",e.fire("timeout",r)}e.fire("finish",r)},h=e.Request=function(e,t){switch(this.url=e,t=Object.mixin(Object.clone(h.options,!0),t||{}),t.mode=t.mode.toLowerCase()){case"xhr":t.method=t.method.toLowerCase(),Object.mixin(this,t,{whiteList:["mode","method","noCache","sync","minTime","maxTime","username","password","headers","contentType"]});break;case"jsonp":t.method="get",t.noCache=!0,t.sync=!1,Object.mixin(this,t,{whiteList:["mode","method","noCache","sync","minTime","maxTime","callbackName"]})}this.ongoing=!1,JSEventTarget.create(this)};h.options={mode:"xhr",method:"get",noCache:!1,sync:!1,minTime:NaN,maxTime:NaN,username:"",password:"",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"*/*"},contentType:"application/x-www-form-urlencoded",callbackName:"callback"},h.prototype.send=function(e){var t=this;if(!t.ongoing){t.ongoing=!0,t.timestamp=Date.now(),t.fire("start"),e=e?Object.toQueryString(e):null;var n=t.url,s=t.method;"get"===s&&e&&(n+=(n.contains("?")?"&":"?")+e,e=null);var c=t.sync;switch(t.mode){case"xhr":t.noCache&&(n+=(n.contains("?")?"&":"?")+"_="+(++i).toString(36));var m=t.xhr=r();m.open(s,n,!c,t.username,t.password),Object.forEach(t.headers,function(e,t){m.setRequestHeader(t,e)}),"post"===s&&m.setRequestHeader("Content-Type",t.contentType),m.send(e),o.push(t),c||4===m.readyState?u(t):m.onreadystatechange=function(){4===m.readyState&&u(t)};break;case"jsonp":var T="_"+(++i).toString(36);n+=(n.contains("?")?"&":"?")+t.callbackName+"=Request."+T,h[t.id=T]=function(e){delete h[T],t.receivedData=e,u(t)},document.loadScript(n)}return!c&&Number.isFinite(t.maxTime)&&(t.maxTimeTimer=setTimeout(function(){d(t,a)},Math.max(0,t.maxTime))),!0}return!1},h.prototype.abort=function(){return!!this.ongoing&&(d(this,n),!0)}}(window);