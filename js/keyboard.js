const ins=it=>{saveHistory();const a=seq[cur-1],b=seq[cur];if(a&&b){const com=(a.g||[]).filter(x=>(b.g||[]).includes(x));if(com.length)it.g=com}seq.splice(cur,0,it);cur++;sel=null};
const WH=[0,2,4,5,7,9,11],BL=[1,3,6,8,10],BC=[2,4,8,10,12];
function kb(){const f=(i,o,st,cl)=>{const n=NM[i],p=NK[i]+o,ok=!!N[p];let c;
 if(mode==='s')c=staff(p);else if(mode==='l')c=n+o+(SH[i]?`<small>${SH[i]}${o}</small>`:'');else{const g=G[N[p]]||['?',''];c=gl(g[0],g[1],'')}
 return `<button class="kb ${cl||''}" ${ok?'':'disabled'} data-p="${p}" ${st||''}>${c}</button>`};
 let h='';for(let o=4;o<=7;o++)h+=`<div class="oc"><div class="g b14">${BL.map((i,j)=>f(i,o,`style="grid-column:${BC[j]}/span 2"`,'bl')).join('')}</div><div class="g w7">${WH.map(i=>f(i,o)).join('')}</div></div>`;
 document.getElementById('pk').innerHTML=h;document.getElementById('md').textContent={s:'𝄞',l:'ABC',j:'字'}[mode]}
function applyMark(type){
  saveHistory();
  const applyTo = (k) => {
    if(!seq[k]) return;
    if(type === 'none'){ 
      seq[k].dl = 0; 
      seq[k].dr = 0; 
      seq[k].tr = 0; 
    }
    else if(type === 'right'){ 
      seq[k].dr = (seq[k].dr || 0) + 1;
      seq[k].dl = 0; 
    }
    else if(type === 'left'){ 
      seq[k].dl = (seq[k].dl || 0) + 1;
      seq[k].dr = 0; 
    }
    else if(type === 'tri'){ 
      seq[k].tr = 1; 
    }
  };
  if(sel){
    for(let k=sel.a; k<=sel.b; k++) applyTo(k);
  } else if(cur > 0){
    applyTo(cur - 1);
  }
  render();
}
// ფუნჯის (Format Painter) ლოგიკა
let activeStyleBuffer = null;

function clearBrush() {
  activeStyleBuffer = null;
  const brushBtn = document.getElementById('brush');
  if (brushBtn) brushBtn.classList.remove('active-brush');
}

function toggleBrush() {
  const brushBtn = document.getElementById('brush');
  if (activeStyleBuffer) {
    clearBrush();
  } else if (sel) {
    activeStyleBuffer = seq.slice(sel.a, sel.b + 1).map(e => ({
      dl: e.dl || 0,
      dr: e.dr || 0,
      tr: e.tr || 0
    }));
    brushBtn.classList.add('active-brush');
  }
  render();
}

function applyStyleBuffer(targetA, targetB) {
  if (!activeStyleBuffer || activeStyleBuffer.length === 0) return;
  saveHistory();
  const len = targetB - targetA + 1;
  for (let i = 0; i < len; i++) {
    const k = targetA + i;
    if (!seq[k]) break;
    const style = activeStyleBuffer[i % activeStyleBuffer.length];
    seq[k].dl = style.dl;
    seq[k].dr = style.dr;
    seq[k].tr = style.tr;
  }
  render();
}

document.getElementById('brush').onclick = toggleBrush;
document.getElementById('pad').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const l=seq[cur-1];
 if(lpF){lpF=false;return}
 if(b.dataset.p){ins(fmNext?{p:b.dataset.p,fm:1}:{p:b.dataset.p});fmNext=false;render()}
 else if(b.id==='rg'){fmNext=!fmNext;render()}
 else if(b.id==='md'){mode=mode==='s'?'l':mode==='l'?'j':'s';kb()}
 else if(b.id==='mark_none'){applyMark('none')}
 else if(b.id==='mark_left'){applyMark('left')}
 else if(b.id==='mark_right'){applyMark('right')}
 else if(b.id==='mark_tri'){applyMark('tri')}
 else if(b.id==='sx2'){
   clearBrush();
   sel=null;
   render();
 }
 else if(b.id==='sp'){if(l&&l.hn){ins({rs:1});render()}else if(l&&!l.br){ins({hn:1});render()}}
 else if(b.id==='en'){if(l&&!l.br){ins({br:1});render()}}
 else if(b.id==='undo'){doUndo()}
 else if(b.id==='un'){if(cur>0){saveHistory();delRange(cur-1,cur-1);cur--;sel=null;render()}}
 else if(b.id==='gm'){setCnt(-1)}
 else if(b.id==='cpy'){copySel();render()}
 else if(b.id==='cut'){cutSel()}
 else if(b.id==='pst'){pasteSel()}
 else if(b.id==='gpl'){setCnt(1)}
 else if(b.id==='gx'){unG()}};
document.getElementById('cl').onclick=()=>{saveHistory();clearBrush();seq=[];cur=0;cname='';render()};
let lpO=false, lpOT=null;
const outE=document.getElementById('out');

outE.addEventListener('pointerdown', e => {
  lpO = false;
  clearTimeout(lpOT);
  const r = e.target.closest('[data-i]');
  if(!r) return;
  const i = +r.dataset.i;
  
  lpOT = setTimeout(() => {
    lpOT = null;
    lpO = true;
    if (sel && sel.anc !== undefined) {
      sel.a = Math.min(sel.anc, i);
      sel.b = Math.max(sel.anc, i);
    } else {
      sel = { anc: i, a: i, b: i };
    }
    if (activeStyleBuffer) {
      applyStyleBuffer(sel.a, sel.b);
    } else {
      render();
    }
    if(navigator.vibrate) navigator.vibrate(15);
  }, 450);
});

['pointerup','pointercancel','pointerleave'].forEach(t => outE.addEventListener(t, () => clearTimeout(lpOT)));
outE.addEventListener('contextmenu', e => e.preventDefault());

outE.addEventListener('click', e => {
  if(lpO) { lpO = false; return; }
  const r = e.target.closest('[data-i]');
  if(!r) { 
    if(!activeStyleBuffer) sel = null; 
    render(); 
    return; 
  }
  const i = +r.dataset.i;
  
  if (sel && sel.anc !== undefined) {
    sel = { anc: i, a: i, b: i };
    if (activeStyleBuffer) {
      applyStyleBuffer(sel.a, sel.b);
    }
  } else {
    const bb = r.getBoundingClientRect();
    cur = (e.clientY - bb.top < bb.height / 2) ? i : i + 1;
    if (activeStyleBuffer) {
      applyStyleBuffer(i, i);
    } else {
      sel = null;
    }
  }
  render();
});
let lpT=null,lpF=false;const pd_=document.getElementById('pad');
pd_.addEventListener('pointerdown',e=>{lpF=false;clearTimeout(lpT);const b=e.target.closest('button[data-p]');if(!b||b.disabled)return;lpT=setTimeout(()=>{lpT=null;lpF=true;const p=b.dataset.p;let k=cur-1;while(k>=0&&(seq[k].br||seq[k].hn))k--;const it=(k>=0&&seq[k].p===p)?{p,sw:1}:{p};if(fmNext){it.fm=1;fmNext=false}ins(it);render();if(navigator.vibrate)navigator.vibrate(15)},450)});
['pointerup','pointercancel','pointerleave'].forEach(t=>pd_.addEventListener(t,()=>clearTimeout(lpT)));
pd_.addEventListener('contextmenu',e=>e.preventDefault());
