var registerSW = () => {

    const isSupport = document.getElementById("isSupport");
    const isSuccess = document.getElementById("isSuccess");
    const state = document.getElementById("state");
    const swState = document.getElementById("swState");

    if ('serviceWorker' in navigator) {
        isSupport.innerHTML = ('支持');

        // 开始注册service workers
        navigator.serviceWorker.register('./sw.js', {
            scope: './'
        }).then(function(registration) {
            isSuccess.innerHTML = ('注册成功');
            var serviceWorker;

            if (registration.installing) {
                serviceWorker = registration.installing;
                state.innerHTML = ('installing');
            } else if (registration.waiting) {
                serviceWorker = registration.waiting;
                state.innerHTMLn = ('waiting');
            } else if (registration.active) {
                serviceWorker = registration.active;
                state.innerHTML = ('active');
            }
            if (serviceWorker) {
                swState.innerHTML = (serviceWorker.state);
                serviceWorker.addEventListener('statechange', function(e) {
                    swState.innerHTML += (' >>> ' + e.target.state);
                });
            }
        }).catch(function(error) {
            isSuccess.innerHTML = ('注册没有成功');
        });
    } else {
        isSupport.innerHTML = ('不支持');
    }

    //getCaches();
    twoWayCommunication();

}



var getCaches = () => {

    caches.keys()
        .then((cacheNames) => {
            for (let cacheName of cacheNames) {
                getFileList(cacheName);
            }
        })
}

var getFileList = (cacheName) => {

    caches.open(cacheName)
        .then(cache => {
            cache.keys()
                .then(requests => {
                    for (let request of requests) {
                        pushUrl(cacheName, request.url)
                    }
                })
        })
}

var deleteCacheAll = () => {
    caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
}

var chs = new Map();

var pushUrl = (cacheName, url) => {
    console.log("push" + cacheName)
    let urls = chs.get(cacheName) || [];
    urls.push(url);
    chs.set(cacheName, urls.slice(0));
    console.log(chs.get(cacheName))
}

var printCaches = () => {

    chs.forEach(function(value, key, map) {
        console.log("key=" + key);
        value.forEach((v) => {
            console.log(v)
        })
    });

}

function twoWayCommunication() {
    if (navigator.serviceWorker.controller) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
            console.log("Response from the SW : " + event.data.message);
        }
        navigator.serviceWorker.controller.postMessage({
            "command": "twoWayCommunication",
            "message": "Hi, SW"
        }, [messageChannel.port2]);
    }
}