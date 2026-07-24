/* Echo Note Service Worker · v1 — ออฟไลน์เต็มระบบ
   อัปเดตเว็บครั้งใด ให้ขยับเลข CACHE_VERSION ทีละ 1 เสมอ */
var CACHE_VERSION = "echo-note-v2";
var PRECACHE = [
  "./echo-hub.html",
  "./echo-core.js",
  "./echo-multiply.html",
  "./echo-direction-stepA.html",
  "./echo-direction-stepB.html",
  "./echo-activate-AB.html",
  "./echo-custom.html",
  "./echo-clock.html",
  "./echo-activate-pageB-v2.html",
  "./echo-v2.1keysig.html",
  "./echo-clock-rotate.html",
  "./echo-modes.html",
  "./echo-camp-modes.html",
  "./echo-notevalues.html",
  "./echo-subdivide.html",
  "./echo-landing.html",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];
self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function(c){
      /* แคชทีละไฟล์ ไฟล์ไหนพลาดไม่ให้ล้มทั้งชุด */
      return Promise.all(PRECACHE.map(function(u){
        return c.add(u).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});
self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k!==CACHE_VERSION) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});
/* กลยุทธ์: เน็ตมา → ใช้ของสด + เก็บสำเนา · เน็ตล่ม → ใช้แคช */
self.addEventListener("fetch", function(e){
  if(e.request.method!=="GET") return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var copy=res.clone();
      caches.open(CACHE_VERSION).then(function(c){ c.put(e.request, copy).catch(function(){}); });
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(hit){
        return hit || caches.match("./echo-hub.html");
      });
    })
  );
});
