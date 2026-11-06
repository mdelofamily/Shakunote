// Swipe on the top bar: previous/next saved composition (library order, no wrap-around)
try{
const TOPBAR_SEL='#app>.row:first-child';
function swipeLib(d){const l=LS.get('shk.lib')||{},ks=Object.keys(l);if(!ks.length)return;
 const i=ks.indexOf(cname),j=i<0?(d>0?0:ks.length-1):i+d;
 if(j<0||j>=ks.length)return;
 if(seq.length){const n=cname||('კომპოზიცია '+(ks.length+1));l[n]={t:Date.now(),seq:clean(seq)};if(!LS.set('shk.lib',l))return}
 const k=ks[j];saveHistory();setBak();seq=clean(l[k].seq);cur=seq.length;cname=k;$('sn').value=k;render()}
const el=document.querySelector(TOPBAR_SEL);
if(el){let x0=0,y0=0,t0=0,on=false;
 const st=(x,y,t)=>{on=!t.closest('button,input');x0=x;y0=y;t0=Date.now()};
 const en=(x,y)=>{if(!on)return;on=false;const dx=x-x0,dy=y-y0;if(Date.now()-t0<700&&Math.abs(dx)>60&&Math.abs(dx)>2*Math.abs(dy))swipeLib(dx<0?1:-1)};
 el.addEventListener('touchstart',e=>{const t=e.touches[0];st(t.clientX,t.clientY,e.target)},{passive:true});
 el.addEventListener('touchend',e=>{const t=e.changedTouches[0];en(t.clientX,t.clientY)},{passive:true});
 el.addEventListener('mousedown',e=>st(e.clientX,e.clientY,e.target));
 el.addEventListener('mouseup',e=>en(e.clientX,e.clientY))}
}catch(err){console.error('swipe init failed',err)}
