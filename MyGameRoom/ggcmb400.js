(function($,window,undefined){var bC=window.location.protocol||"http:",as="//secure-",aB=".imrworldwide.com/",configGlobalFile="glcfg400.js",l="400",k="http://secure-us.imrworldwide.com/";$.getTIme=$.getTIme||function(){return(new Date()).getTime();};$.loadXmlString=function(v){try{var G=new ActiveXObject("Microsoft.XMLDOM");G.async="false";G.loadXML(v);return(G);}catch(e){try{var aP=new DOMParser();G=aP.parseFromString(v,"text/xml");return(G);}catch(e){}}return(null);};$.getAddress=function(){return k;};$.getVersion=function(){return l;};$.send=function(element){};$.ggInitialize=function(j,ax,ba,aE,aR){var aL,t,R,F,aQ=0,K={},H="us",ggEventQue=[],aU=String($.getTIme())+Math.round(Math.random()*10000),au=aR,C={ggParams:j,uid:ax,oldFlashDetect:ba,detectBrowser:aE,playerId:aU};this.modules={};if(typeof j==typeof String()){aL=$.loadXmlString("<vi>"+j+"</vi>");t=aL.firstChild.firstChild;R=0;j={};while(t!=undefined&&R<20){if(t.firstChild!=null){j[t.nodeName]=t.firstChild.nodeValue;}t=t.nextSibling;R++;}C.ggParams=j;}F=window.document.createElement("script");l=j.sdkv||l;H=j.sfcode||H;k=j.coreaddress||bC+as+H+aB;F.src=k+"novms/js/2/configs/"+configGlobalFile+"?rnd="+Math.round(Math.random()*1000000);window.document.getElementsByTagName('head')[0].appendChild(F);this.addListener=function(type,J){if(typeof K[type]=="undefined"){K[type]=[];}K[type].push(J);};function fireEvent(event,O){if(typeof event=="string"){event={type:event};}if(!event.target){event.target=O;}if(!event.type){throw new Error("Event object missing 'type' property.");}if(K[event.type]instanceof Array){var h=K[event.type];for(var i=0,L=h.length;i<L;i++){h[i].call(this,O);}}};this.removeListener=function(type,J){if(K[type]instanceof Array){var h=K[type];for(var i=0,L=h.length;i<L;i++){if(h[i]===J){h.splice(i,1);break;}}}};this.ggPM=function(bG,bP,bs,by,aG){var O={};O.eventType=bG;O.param1=bP;O.param2=bs;O.param3=by;O.param4=aG;if(this.modules.PLCMB==2||this.modules.PLDPR==2){this.emptyQueue();fireEvent("ggPM",{evtInfo:O,id:aU});}else{ggEventQue.push(O);}};this.callBack=function(global){global.registerListener("ggPM",this);for(var i=0;i<window.gg_nol_CallBack.length;i++){if(window.gg_nol_CallBack[i]==this)window.gg_nol_CallBack.splice(i,1);}};this.getConfigParams=function(){return C;};this.emptyQueue=function(){if(ggEventQue.length<=0){return}if(this.modules.PLCMB||this.modules.PLDPR){for(var i=0,L=ggEventQue.length;i<L;i+=1){fireEvent("ggPM",{evtInfo:ggEventQue[i],id:aU});}ggEventQue=[];}};this.getContainer=function(){return au;};if($.GLCFG){$.GLCFG.registerListener("ggPM",this);}else{if(!window.gg_nol_CallBack){window.gg_nol_CallBack=[];}window.gg_nol_CallBack.push(this);}};if(window.gg_nol_FlashCallBack){for(var i=0,aH,L=window.gg_nol_FlashCallBack.length;i<L;i+=1){if(window.gg_nol_FlashCallBack[i].hasOwnProperty("callBack")){aH=document.getElementById(window.gg_nol_FlashCallBack[i].swfId);if(aH){aH[window.gg_nol_FlashCallBack[i].callBack]();}}}window.gg_nol_FlashCallBack=undefined;}return $;})(this.NOLCMB=this.NOLCMB||{},this);