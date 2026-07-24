/* Echo Note PWA bootstrap · ฉีดท้ายทุกหน้า */
(function(){
  function addLink(rel,href){var l=document.createElement("link");l.rel=rel;l.href=href;document.head.appendChild(l);}
  if(!document.querySelector('link[rel="manifest"]')) addLink("manifest","manifest.json");
  if(!document.querySelector('link[rel="apple-touch-icon"]')) addLink("apple-touch-icon","icon-192.png");
  var m=document.createElement("meta");m.name="apple-mobile-web-app-capable";m.content="yes";document.head.appendChild(m);
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  }
})();
