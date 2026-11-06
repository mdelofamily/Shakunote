// Shakunote init
const APP_VERSION="0.3";
kb();render();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
