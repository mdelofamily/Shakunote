// Shakunote init
const APP_VERSION="0.2";
kb();render();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
