const me=(x,y)=>`<path d="M0 0L8 12M8 0L1 13" transform="translate(${x},${y})" class="mk"/>`;
const Y0=(m,reg)=>(m.includes('K')||reg||/[二三四五]/.test(m))?2:14,GH=(m,reg)=>(66-Y0(m,reg))*.55;
function gl(b,m,reg){let s='';
 if(m.includes('D'))s+='<text x="2" y="30" class="tx">大</text>'+me(3,34);else if(m.includes('M'))s+=me(3,34);
 if(m.includes('C'))s+='<text x="1" y="42" class="tx">中</text>';
 if(m.includes('K'))s+='<text x="26" y="10" class="tx">大</text><text x="26" y="21" class="tx">甲</text>';
 const n=[...m].filter(c=>'二三四五'.includes(c));
 if(n.length>1)n.forEach((c,i)=>s+=`<text x="1" y="${26+i*11}" class="tx">${c}</text>`);else if(n.length)s+=`<text x="34" y="21" class="tx" style="font-size:17px">${n[0]}</text>`;
 if(reg)s+=`<text x="48" y="14" class="tx">${reg}</text>`;
 if(b==='＞')return `<svg width="35" height="12" viewBox="0 32 64 22"><g transform="translate(18,24) translate(20,19) scale(.6) translate(-20,-19)" class="gl" style="stroke-width:7.5"><path d="${B[b]}"/></g></svg>`;
 const y0=Y0(m,reg);return `<svg width="35" height="${GH(m,reg)}" viewBox="0 ${y0} 64 ${66-y0}">${b==='＞'?`<g transform="translate(18,24) translate(20,19) scale(.6) translate(-20,-19)" class="gl" style="stroke-width:7.5"><path d="${B[b]}"/></g>`:`<g transform="translate(18,24)" class="gl"><path d="${B[b]}"/></g>`}${s}</svg>`}
const pv=p=>{const o=+p.slice(-1),k=NK.indexOf(p.slice(0,-1));return o*12+k};
const SHR=new Set((()=>{const m={};for(const p in N){const g=G[N[p]];if(!g)continue;const k=g[0]+'|'+g[1];(m[k]=m[k]||new Set()).add(pv(p)>61?'甲':'乙')}return Object.keys(m).filter(k=>m[k].size>1)})());
function staff(p){const o=+p.slice(-1),L=p[0],ac=p[1]==='b',ix=o*7+'CDEFGAB'.indexOf(L)-30,hs=3,bt=60,y=bt-ix*hs;let q='';for(let k=0;k<5;k++)q+=`<line x1="4" x2="46" y1="${bt-k*2*hs}" y2="${bt-k*2*hs}" class="sl"/>`;
 if(ix<0)for(let e=-2;e>=ix;e-=2)q+=`<line x1="19" x2="33" y1="${bt-e*hs}" y2="${bt-e*hs}" class="sl"/>`;
 if(ix>8)for(let e=10;e<=ix;e+=2)q+=`<line x1="19" x2="33" y1="${bt-e*hs}" y2="${bt-e*hs}" class="sl"/>`;
 q+=`<ellipse cx="26" cy="${y}" rx="5" ry="3.6" class="sn"/>`+(ac?`<text x="10" y="${y+5}" class="sa">♭</text>`:'');
 const y0=Math.min(y-9,bt-8*hs-4),y1=Math.max(bt+4,y+9);return `<svg viewBox="0 ${y0} 50 ${y1-y0}">${q}</svg>`}
function render(){if(sel&&(!seq[sel.a]||sel.b>=seq.length))sel=null;
 const GN={},GL={},GF={};const TRI='<svg class="tri" width="8" height="8" viewBox="0 0 8 8"><path d="M4 1.2L7.2 6.8H0.8Z"/></svg>';
seq.forEach((e,i)=>{(e.g||[]).forEach(id=>{if(GF[id]===undefined)GF[id]=i;GL[id]=i})});for(const id in GF)GN[id]=(seq[GF[id]].gc&&seq[GF[id]].gc[id])||2;
 let t=0,prev=null,nph=0,sepB=false,st=null,pb=null,stc=null;const cols=[[]];if(cur<0||cur>seq.length)cur=seq.length;
 const mk0=()=>cols[cols.length-1].push({cu:1});if(cur===0)mk0();

 const lineType = new Array(seq.length).fill(0);
 // Omote (dr) starts a beat; ura (dl) closes it. Intermediate undotted
 // notes determine the number of parallel center lines. Extend through the
 // next dr marker, as required by the notation convention.
 for(let i=0; i<seq.length; i++){
   if(!(seq[i].dr > 0) || seq[i].br || seq[i].hn || seq[i].rest) continue;
   let j=i+1, countBetween=0, foundUra=false;
   while(j<seq.length){
     const e=seq[j];
     if(e.br || e.hn || e.rest) break;
     if(e.dl>0){ foundUra=true; break; }
     if(e.dr>0) break;
     // Count only truly dotless notes between omote and ura.
     if(!(e.dl>0) && !(e.dr>0)) countBetween++;
     j++;
   }
   if(!foundUra) continue;
   const count=countBetween+1;
   let end=j+1;
   while(end<seq.length){
     const e=seq[end];
     if(e.br || e.hn || e.rest) break;
     if(e.dr>0) break;
     end++;
   }
   // Include the next dr itself when one is present before a separator.
   if(end<seq.length && !seq[end].br && !seq[end].hn && !seq[end].rest && seq[end].dr>0) {
     for(let k=i;k<=end;k++) lineType[k]=Math.max(lineType[k],count);
   } else {
     for(let k=i;k<=j;k++) lineType[k]=Math.max(lineType[k],count);
   }
 }

 seq.forEach((e,i)=>{if(e.br){cols.push([]);if(cur===i+1)mk0();return}const c=cols[cols.length-1];if(e.hn){c.push({hn:1,i,gs:e.g||[]});sepB=true;if(cur===i+1)mk0();return}
  const dl = e.dl || 0;
  const dr = e.dr || 0;
  if(e.rs){c.push({rest:1,dl,dr,i,gs:e.g||[],tri:!!e.tr});t+=2;prev=null;sepB=false;if(i<cur)stc=st;if(cur===i+1)mk0();return}
  const cand=prev&&prev.p===e.p,rep=cand&&(sepB?!!e.sw:!e.sw);
  const [b,m]=G[N[e.p]]||['?',''];const rg2=pv(e.p)>61?'甲':'乙';let mk='';
  if(!rep){const imp=(pb==='リ'&&(b==='ロ'||b==='ツ'))?'甲':((pb==='ロ'||pb==='ツ')&&st==='甲'&&b==='リ')?'乙':st;
   if((SHR.has(b+'|'+m)&&imp!==rg2)||e.fm||st===null)mk=rg2;st=rg2;pb=b}
   
  const lineCount = lineType[i];

  c.push({b:rep?'＞':b,m:rep?'':m,mk,dl,dr,lineCount,tri:!!e.tr,i,gs:e.g||[]});t+=2;prev=e;sepB=false;if(i<cur)stc=st;if(cur===i+1)mk0()});
 lay=cols.map(c=>c.filter(x=>!x.cu));
 const dots=n=>'<div class="dt"></div>'.repeat(n);
 const colHtml=c=>{let h='',st=[],lastI=-1;const closeTo=n=>{while(st.length>n){const id=st.pop();const cnt=GN[id];if(GL[id]===lastI && cnt > 1){h+=`<div class="gn">×${cnt}</div>`}h+='</div>'}};
 c.forEach(it=>{if(it.cu){h+='<div class="cu"></div>';return}const gs=it.gs||[];let k=0;while(k<st.length&&k<gs.length&&st[k]===gs[k])k++;closeTo(k);for(let j=k;j<gs.length;j++){st.push(gs[j]);const cnt=GN[gs[j]];h+=cnt>1?`<div class="gp d${Math.min(j+1,4)}">`:`<div>`}
  h+=it.hn?`<div class="bh" data-i="${it.i}"></div>`:it.rest?`<div class="r${sel&&it.i>=sel.a&&it.i<=sel.b?' sel':''}" data-i="${it.i}">${it.tri?TRI:''}<div class="s">${dots(it.dl)}</div><div style="width:35px;height:29px"></div><div class="s">${dots(it.dr)}</div></div>`:`<div class="r${sel&&it.i>=sel.a&&it.i<=sel.b?' sel':''}" data-i="${it.i}">${it.tri?TRI:''}${it.lineCount?`<div class="beat-lines">${Array.from({length:it.lineCount},(_,n)=>`<i style="left:${(n-(it.lineCount-1)/2)*5}px"></i>`).join('')}</div>`:''}<div class="s">${dots(it.dl)}</div>${gl(it.b,it.m,it.mk)}<div class="s">${dots(it.dr)}</div></div>`;lastI=it.i});closeTo(0);return `<div class="col">${h}</div>`};
 document.getElementById('out').innerHTML=cols.map(colHtml).join('');
 const cu=document.querySelector('#out .cu');if(cu)cu.scrollIntoView({block:'nearest',inline:'nearest'});
 document.getElementById('tot').textContent=(cname?cname+(seq.length?' · ':''):'')+(seq.length?`სულ ${t/2} თვლა`:'');LS.set('shk.cur',seq);LS.set('shk.name',cname);const rb=document.getElementById('rg');if(rb){rb.textContent=stc||'乙';rb.classList.toggle('on',fmNext)}
 const sp=document.getElementById('selp');if(sp){sp.hidden=!sel;if(sel){const g=exactG();document.getElementById('gv').textContent=g&&GN[g]>1?'×'+GN[g]:'×';document.getElementById('pst').disabled=!(clip&&clip.length)}}
 updateUndoBtn();hiKey();
}
const dsv=(cx,cy,it)=>{let o='';if(it.tri)o+=`<polygon points="${cx+16},${cy-11} ${cx+23},${cy-11} ${cx+19.5},${cy-18}" fill="none" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>`;const l=it.dl,r=it.dr;for(let j=0;j<l;j++)o+=`<circle cx="${cx-21.5}" cy="${cy+(j-(l-1)/2)*8}" r="2.6" fill="#000"/>`;for(let j=0;j<r;j++)o+=`<circle cx="${cx+21.5}" cy="${cy+(j-(r-1)/2)*8}" r="2.6" fill="#000"/>`;return o};
function exportSvg(){const cw=52,pd=18,tH=cname?30:0;const W=Math.max(lay.length*cw+pd*2,cname?cname.length*9+pd*2:0);let H=0,out='',R=[];const GLx={},GNx={};
 seq.forEach((e,i)=>{(e.g||[]).forEach(id=>{GLx[id]=i})});for(const id in GLx){let f=seq.findIndex(e=>(e.g||[]).includes(+id));GNx[id]=(seq[f].gc&&seq[f].gc[id])||2}
 lay.forEach((col,ci)=>{const cx=W-pd-cw/2-ci*cw;let y=pd+tH,st=[],lastI=-1;
  const closeTo=n=>{while(st.length>n){const s0=st.pop(),cnt=GNx[s0.id],ex=(GLx[s0.id]===lastI&&cnt>1)?16:0;y+=ex;if(cnt>1)R.push({d:s0.d,x:cx-25.5+1*s0.d,w:51-2*s0.d,y0:s0.y,y1:y+3,lab:ex?cnt:0,cx});y+=3}};
  col.forEach(it=>{const gs=it.gs||[];let k=0;while(k<st.length&&k<gs.length&&st[k].id===gs[k])k++;closeTo(k);for(let j=k;j<gs.length;j++){st.push({id:gs[j],d:j,y});y+=3}
  if(it.rest){out+=dsv(cx,y+16,it);y+=33;lastI=it.i;return}
  if(it.hn){out+=`<line x1="${cx-10.5}" x2="${cx+1.5}" y1="${y+6}" y2="${y+6}" class="ex"/>`;y+=12;lastI=it.i;return}
  const h=it.b==='＞'?12:GH(it.m,it.mk),rh=h+4;
  if(it.lineCount){
   for(let n=0;n<it.lineCount;n++){
    const lx=cx+3+(n-(it.lineCount-1)/2)*5;
    out+=`<line x1="${lx}" x2="${lx}" y1="${y}" y2="${y+rh}" class="ex" style="stroke-width:.75"/>`;
   }
  }
  out+=gl(it.b,it.m,it.mk).replace('<svg ',`<svg x="${cx-17.5}" y="${y+2}" `);
  out+=dsv(cx,y+rh/2,it);
  y+=rh;lastI=it.i});closeTo(0);H=Math.max(H,y)});
 const cols_=['#e8e8e8','#d6d6d6','#c4c4c4','#b2b2b2'];R.sort((a,b)=>a.d-b.d);let bg='';R.forEach(r=>{bg+=`<rect x="${r.x}" y="${r.y0}" width="${r.w}" height="${r.y1-r.y0}" rx="8" fill="${cols_[Math.min(r.d,3)]}"/>`;if(r.lab)bg+=`<text x="${r.cx}" y="${r.y1-8}" text-anchor="middle" font-size="12" font-family="system-ui,sans-serif" fill="#000">×${r.lab}</text>`});
 EW=W;EH=H+pd;return `<svg xmlns="http://www.w3.org/2000/svg" width="${EW}" height="${EH}" viewBox="0 0 ${EW} ${EH}"><style>.gl{fill:none;stroke:#000;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.mk{fill:none;stroke:#000;stroke-width:2.4;stroke-linecap:round}.tx{fill:#000;font:13px "Noto Serif CJK JP","Hiragino Mincho ProN","Yu Mincho",serif}.ex{stroke:#000;stroke-width:1.5}</style><rect width="100%" height="100%" fill="#fff"/>${cname?`<text x="${W/2}" y="${pd+12}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="600" fill="#000">${cname.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`:''}${bg}${out}</svg>`}
const SC=3;function toCanvas(){return new Promise((res,rej)=>{const svg=exportSvg(),img=new Image(),u=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 img.onload=()=>{const c=document.createElement('canvas');c.width=EW*SC;c.height=EH*SC;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c)};img.onerror=rej;img.src=u})}
async function exp(kind){const tot=document.getElementById('tot');if(!seq.some(e=>e.p)){tot.textContent='ჯერ ჩაწერე ნოტები';return}
 try{const dl=(typeof claude!=='undefined'&&claude.use)?await claude.use('downloads'):null;
  const c=await toCanvas();const data=await new Promise(r=>c.toBlob(r,'image/png'));
  const baseName = (cname || document.getElementById('sn').value || 'shakuhachi').replace(/[^a-zA-Z0-9ა-ჰ_-]/g, '_');
  const fn=baseName+'.'+kind;if(dl)await dl.save({filename:fn,data});else{const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download=fn;document.body.appendChild(a);a.click();a.remove()}tot.textContent='შენახულია'}catch(e){tot.textContent=e&&e.code==='declined'?'':'ექსპორტი ვერ მოხერხდა: '+((e&&(e.code||e.message))||e)}}
document.getElementById('ep').onclick=()=>exp('png');
