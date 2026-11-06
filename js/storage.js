const LS={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
const cp=(o,e)=>{if(e.g!=null){const g=Array.isArray(e.g)?e.g.slice():[e.g];if(g.length)o.g=g}if(e.gc!=null){const gc=typeof e.gc==='object'?{...e.gc}:(e.g!=null&&!Array.isArray(e.g)?{[e.g]:e.gc}:null);if(gc&&Object.keys(gc).length)o.gc=gc}return o};
const keep=(o,e)=>{if(typeof e.ph==='number')o.ph=e.ph;if(e.tr)o.tr=1;if(e.dl!=null)o.dl=e.dl;if(e.dr!=null)o.dr=e.dr;return o};
const clean=a=>Array.isArray(a)?a.filter(e=>e&&(e.br||e.hn||e.rs||N[e.p])).map(e=>cp(e.br?{br:1}:e.hn?{hn:1}:e.rs?keep({rs:1},e):keep({p:e.p,...(e.sw||e.rp?{sw:1}:{}),...(e.fm?{fm:1}:{})},e),e)):[];
const $=id=>document.getElementById(id);let delArm=null;
function setBak(){if(seq.length)LS.set('shk.bak',seq)}
function sv(m){$('svm').textContent=m||''}
function list(){const l=LS.get('shk.lib')||{},box=$('sl');box.innerHTML='';const ks=Object.keys(l).sort((a,b)=>l[b].t-l[a].t);
 if(!ks.length){box.innerHTML='<div class="m">შენახული კომპოზიციები ჯერ არ არის</div>';return}
 ks.forEach(k=>{const r=document.createElement('div');r.className='li';const sp=document.createElement('span');sp.textContent=k+' · '+new Date(l[k].t).toLocaleDateString();
  const o=document.createElement('button');o.textContent='გახსნა';o.onclick=()=>{saveHistory();setBak();seq=clean(l[k].seq);cur=seq.length;cname=k;$('sn').value=k;render();$('sv').hidden=true};
  const x=document.createElement('button');x.textContent=delArm===k?'წაშლა?':'✕';x.onclick=()=>{if(delArm===k){delete l[k];LS.set('shk.lib',l);delArm=null}else delArm=k;list()};
  r.append(sp,o,x);box.append(r)})}
async function saveFile(fn,data){const dl=(typeof claude!=='undefined'&&claude.use)?await claude.use('downloads'):null;
 if(dl)await dl.save({filename:fn,data});else{const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download=fn;document.body.appendChild(a);a.click();a.remove()}}
$('sb').onclick=()=>{list();sv('');$('sv').hidden=false};$('sx').onclick=()=>{$('sv').hidden=true;delArm=null};
$('ss').onclick=()=>{if(!seq.length){sv('ჯერ ჩაწერე ნოტები');return}const l=LS.get('shk.lib')||{};let n=$('sn').value.trim()||('კომპოზიცია '+(Object.keys(l).length+1));l[n]={t:Date.now(),seq:clean(seq)};cname=n;render();
 sv(LS.set('shk.lib',l)?'შენახულია: '+n:'შენახვა ვერ მოხერხდა (ბრაუზერის მეხსიერება დაბლოკილია)');$('sn').value=n;list()};
$('snw').onclick=()=>{saveHistory();clearBrush();setBak();seq=[];cur=0;cname='';$('sn').value='';render();sv('ახალი ჩანაწერი. წინა ინახება: „დაბრუნება“')};
$('sbk').onclick=()=>{const b=LS.get('shk.bak');if(!b||!b.length){sv('დასაბრუნებელი არაფერია');return}saveHistory();const cs=seq;seq=clean(b);cur=seq.length;LS.set('shk.bak',cs);render();$('sv').hidden=true};
$('sje').onclick=async()=>{if(!seq.length){sv('ჯერ ჩაწერე ნოტები');return}try{
  const baseName = (cname || $('sn').value || 'shakuhachi-composition').replace(/[^a-zA-Z0-9ა-ჰ_-]/g, '_');
  await saveFile(baseName + '.json',new Blob([JSON.stringify({v:1,name:cname||$('sn').value,seq:clean(seq)})],{type:'application/json'}));
  sv('ფაილი შენახულია');
}catch(e){sv(e&&e.code==='declined'?'':'JSON ვერ შეინახა: '+((e&&(e.code||e.message))||e))}};
$('sji').onclick=()=>$('sf').click();
$('sf').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result),q=clean(o.seq);if(!q.length)throw 0;saveHistory();clearBrush();setBak();seq=q;cur=seq.length;cname=o.name||'';if(o.name)$('sn').value=o.name;render();$('sv').hidden=true}catch(x){sv('ფაილი ვერ წავიკითხე')}};r.readAsText(f);e.target.value=''};
{const c=LS.get('shk.cur');if(Array.isArray(c)){seq=clean(c);cur=seq.length;cname=LS.get('shk.name')||''}}
