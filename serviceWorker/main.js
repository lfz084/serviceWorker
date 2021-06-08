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
            isSuccess.innerHTML=('注册成功');

            var serviceWorker;
            if (registration.installing) {
                serviceWorker = registration.installing;
                state.innerHTML=('installing');
            } else if (registration.waiting) {
                serviceWorker = registration.waiting;
                state.innerHTMLn=('waiting');
            } else if (registration.active) {
                serviceWorker = registration.active;
                state.innerHTML=('active');
            }
            if (serviceWorker) {
                swState.innerHTML=(serviceWorker.state);
                serviceWorker.addEventListener('statechange', function(e) {
                    swState.innerHTML+=(' >>> ' + e.target.state);
                });
            }
        }).catch(function(error) {
            isSuccess.innerHTML=('注册没有成功');
        });
    } else {
        isSupport.innerHTML=('不支持');
    }
}