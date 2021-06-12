var VERSION = 'v3';

// 缓存
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(VERSION).then(function(cache) {
            return cache.addAll([
                './',
                './index.html'
              ]);
        })
    );
});

// 缓存更新
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // 如果当前版本和缓存版本不一致
                    if (cacheName !== VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function(event) {


    event.respondWith(
        /*
        fetch(event.request)
        .then(response => {
            post({ message: `response.ok=${response.ok}` })
            if (response.ok) {
                let cloneRes = response.clone();
                caches.open(VERSION).then(cache => {
                    cache.put(event.request, cloneRes);
                });
                return response
            }
            else {
                return caches.match(event.request);
            }
        })
        */

        caches.match(event.request).then(response => {
                    if (response.ok) {
                        getFetch()
                        return response;
                    }
                    else {
                        return getFetch();
                    }
                })
                .catch(err => {
                    return getFetch();
                })
    )
    
    function getFetch() {
        return new Promise((resolve, reject) => {
            fetch(event.request)
                .then(response => {
                    if (response.ok) {
                        let cloneRes = response.clone();
                        caches.open(VERSION).then(cache => {
                            cache.put(event.request, cloneRes);
                        });
                        resolve(response);
                    }
                    else {
                        reject();
                    }
                })
                .catch(err=>{
                    reject();
                })
        })
    }



});

var port;

function post(msgObj) {
    if (port && port.postMessage) {
        port.postMessage(msgObj);
    }
}


self.addEventListener('message', function(event) {
    var data = event.data;
    if (data.command == "twoWayCommunication") {
        if (!port) {
            event.ports[0].postMessage({
                "message": "Hi, Page"
            });
        }
        port = event.ports[0];
    }
});


setTimeout(() => {
    post({ message: "aaa" })
}, 5000)