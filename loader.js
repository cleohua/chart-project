var Vue;
import('https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.1/vue.esm.browser.js')
.then(async module => {
    Vue = module.default;
    import('/include/js/vue/v-calendar@2.3.0.umd.min.js');
    import('/include/js/vue/vue-draggable/vuedraggable.umd.min.js');

// window.onload = async function () {
    // Vue.use(VueTouch, { name: 'v-touch' });
    // hash跳轉判斷
    let hashText = location.hash;
    let hashInfo = {};
    if (hashText) {
        hashText.slice(1).split('&').forEach(str => {
            let arr = str.split('=');
            hashInfo[arr[0]] = arr[1];
        })
        history.replaceState(null, '', location.pathname + location.search);
    }
    
    // 初始參數
    let args = {
        user_id: userID,
        userName: userLoginInfo.userName,
        sys_code: sysCode,
        isAdmin: userLoginInfo.isAdmin == 'true',
        checkin: userLoginInfo.checkin,
        isProject: userLoginInfo.isProject,
        hashInfo,
        isProxy: userLoginInfo.is_proxy,
    };

    import('./main.js').then(({ default: init }) => init(args));

// }();

})