let historyStack = [];
function saveHistory() {
  historyStack.push({
    seq: JSON.parse(JSON.stringify(seq)),
    cur: cur,
    sel: sel ? { ...sel } : null
  });
  if (historyStack.length > 50) historyStack.shift();
  updateUndoBtn();
}

function doUndo() {
  if (historyStack.length === 0) return;
  const state = historyStack.pop();
  seq = state.seq;
  cur = state.cur;
  sel = state.sel;
  render();
  updateUndoBtn();
}

function updateUndoBtn() {
  const ub = document.getElementById('undo');
  if (ub) ub.disabled = (historyStack.length === 0);
}
document.getElementById('undo').onclick = doUndo;
const gr=id=>{let f=-1,l=-1;seq.forEach((e,i)=>{if(e.g&&e.g.includes(id)){if(f<0)f=i;l=i}});return[f,l]};
const exactG=()=>{if(!sel)return 0;for(const id of (seq[sel.a].g||[])){const[f,l]=gr(id);if(f===sel.a&&l===sel.b)return id}return 0};
const innerG=()=>{if(!sel)return 0;const gb=seq[sel.b].g||[];let r=0;for(const id of (seq[sel.a].g||[]))if(gb.includes(id))r=id;return r};
function setCnt(dn){
  if(!sel)return;
  saveHistory();
  const ex = exactG();
  if(ex){
    const f = gr(ex)[0];
    const gc = seq[f].gc = seq[f].gc || {};
    const newVal = (gc[ex] || 2) + dn;
    if(newVal <= 1){
      seq.forEach(e=>{
        if(e.g){
          e.g = e.g.filter(x => x !== ex);
          if(!e.g.length) delete e.g;
        }
        if(e.gc && e.gc[ex] !== undefined){
          delete e.gc[ex];
          if(!Object.keys(e.gc).length) delete e.gc;
        }
      });
    } else {
      gc[ex] = newVal;
    }
  } else {
    const a=sel.a, b=sel.b, ids=new Set();
    for(let k=a; k<=b; k++) (seq[k].g||[]).forEach(x=>ids.add(x));
    for(const x of ids){const[f,l]=gr(x);if(!((f>=a&&l<=b)||(f<=a&&l>=b))){document.getElementById('gv').textContent='⚠';return}}
    const id=1+Math.max(0,...seq.flatMap(e=>e.g||[])),pos=(seq[a].g||[]).filter(x=>(seq[b].g||[]).includes(x)).length;
    for(let k=a; k<=b; k++){const g=(seq[k].g=seq[k].g||[]);g.splice(Math.min(pos,g.length),0,id)}
    seq[a].gc=Object.assign(seq[a].gc||{},{[id]:2});
  }
  render();
}
function unG(){if(!sel)return;const t=exactG()||innerG();if(!t)return;saveHistory();seq.forEach(e=>{if(e.g){e.g=e.g.filter(x=>x!==t);if(!e.g.length)delete e.g}if(e.gc&&e.gc[t]!==undefined){delete e.gc[t];if(!Object.keys(e.gc).length)delete e.gc}});render()}
function delRange(a,b){const nx=seq[b+1];if(nx)for(let k=a;k<=b;k++){const gc=seq[k].gc;if(gc)for(const id in gc)if((nx.g||[]).includes(+id)){nx.gc=Object.assign(nx.gc||{},{[id]:gc[id]})}}seq.splice(a,b-a+1)}
let clip=LS.get('shk.clip');if(!Array.isArray(clip))clip=null;
function copySel(){if(!sel)return;const a=sel.a,b=sel.b,keep=new Set();const ids=new Set();for(let k=a;k<=b;k++)(seq[k].g||[]).forEach(x=>ids.add(x));ids.forEach(x=>{const[f,l]=gr(x);if(f>=a&&l<=b)keep.add(x)});
 clip=seq.slice(a,b+1).map(e=>{const o=JSON.parse(JSON.stringify(e));if(o.g){o.g=o.g.filter(x=>keep.has(x));if(!o.g.length)delete o.g}if(o.gc){for(const id in o.gc)if(!keep.has(+id))delete o.gc[id];if(!Object.keys(o.gc).length)delete o.gc}return o});LS.set('shk.clip',clip)}
function cutSel(){if(!sel)return;saveHistory();copySel();const a=sel.a;delRange(a,sel.b);cur=a;sel=null;render()}
function pasteSel(){if(!clip||!clip.length)return;saveHistory();const pos=sel?sel.b+1:cur;let nid=1+Math.max(0,...seq.flatMap(e=>e.g||[])),map={};
 const A=seq[pos-1],B=seq[pos],com=(A&&B)?(A.g||[]).filter(x=>(B.g||[]).includes(x)):[];
 const items=clip.map(e=>{const o=JSON.parse(JSON.stringify(e));delete o.ph;(o.g||[]).forEach(x=>{if(!map[x])map[x]=nid++});if(o.g)o.g=o.g.map(x=>map[x]);if(o.gc){const n={};for(const id in o.gc)n[map[id]||id]=o.gc[id];o.gc=n}if(com.length)o.g=com.concat(o.g||[]).filter((v,i,a)=>a.indexOf(v)===i);return o});
 seq.splice(pos,0,...items);cur=pos+items.length;sel=null;render()}
window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (!e.shiftKey) {
      e.preventDefault();
      doUndo();
    }
  }
});
