const body = document.body;
const addBtn = document.getElementById('addBotBtn');
const form = document.getElementById('setupForm');
const openDash = document.getElementById('openDashboardBtn');
let chartsStarted = false;

const wait = ms => new Promise(r => setTimeout(r, ms));
addBtn.addEventListener('click', () => setState('setup'));
form.addEventListener('submit', async e => {
  e.preventDefault();
  setState('creating');
  await wait(1100);
  setState('bot');
});
openDash.addEventListener('click', async () => {
  setState('dashboard');
  await wait(420);
  if (!chartsStarted) startDashboardAnimations();
});
document.querySelector('.icon-btn').addEventListener('click', () => {
  if (body.dataset.state === 'dashboard') setState('bot');
});
function setState(s){ body.dataset.state = s; }

function easeOutExpo(t){ return t===1 ? 1 : 1 - Math.pow(2, -10*t); }
function animateNumber(el, target, decimals=0, duration=1250){
  const start = performance.now();
  function frame(now){
    const p = Math.min(1,(now-start)/duration);
    const v = target * easeOutExpo(p);
    el.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('ru-RU');
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function startDashboardAnimations(){
  chartsStarted = true;
  document.querySelectorAll('[data-count]').forEach((el,i)=>{
    setTimeout(()=>animateNumber(el, Number(el.dataset.count), Number(el.dataset.decimals||0)), 120+i*80);
  });
  drawLineChart('messagesChart', [800,1450,1780,1680,2260,2310,3800,2100,1980], ['6 июн','7 июн','8 июн','9 июн','10 июн','11 июн','12 июн'], 1700);
  drawLineChart('responseChart', [1.25,.78,1.5,1.18,1.4,1.35,1.85,1.2,2.1,1.55,2.35,1.5,2.2,1.12], ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'], 1800, true);
  drawDonut('donutChart', [68,17,10,5], ['Текстовые','Команды','Медиа','Другое'], [16846,4211,2478,1247]);
}
function setupCanvas(id){
  const canvas = document.getElementById(id);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  return {canvas,ctx,w:rect.width,h:rect.height};
}
function drawLineChart(id, data, labels, duration=1500, seconds=false){
  const {canvas,ctx,w,h} = setupCanvas(id);
  const pad = {l:42,r:22,t:18,b:34};
  const min = seconds ? 0 : 0;
  const max = seconds ? 3 : 4000;
  const points = data.map((v,i)=>({x:pad.l + i*(w-pad.l-pad.r)/(data.length-1), y:pad.t + (max-v)/(max-min)*(h-pad.t-pad.b)}));
  const start = performance.now();
  function grid(){
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle='rgba(255,255,255,.10)'; ctx.lineWidth=1; ctx.setLineDash([2,3]);
    const steps = seconds ? 3 : 4;
    ctx.fillStyle='rgba(255,255,255,.82)'; ctx.font='13px Arial';
    for(let i=0;i<=steps;i++){
      const y=pad.t+i*(h-pad.t-pad.b)/steps; ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
      const val=max-i*(max-min)/steps; ctx.fillText(seconds?`${Math.round(val)} сек`:`${Math.round(val/1000)}K`,8,y+4);
    }
    ctx.setLineDash([]); ctx.fillStyle='rgba(255,255,255,.78)';
    labels.forEach((lab,i)=>{const x=pad.l+i*(w-pad.l-pad.r)/(labels.length-1);ctx.fillText(lab,x-18,h-10)});
  }
  function path(progress){
    grid();
    const grad=ctx.createLinearGradient(0,pad.t,0,h-pad.b); grad.addColorStop(0,'rgba(255,255,255,.32)'); grad.addColorStop(1,'rgba(255,255,255,.02)');
    const maxX=pad.l+(w-pad.l-pad.r)*progress;
    ctx.save(); ctx.beginPath(); ctx.rect(pad.l,0,Math.max(0,maxX-pad.l),h); ctx.clip();
    ctx.beginPath(); points.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.lineTo(points[points.length-1].x,h-pad.b); ctx.lineTo(points[0].x,h-pad.b); ctx.closePath(); ctx.fillStyle=grad; ctx.fill();
    ctx.beginPath(); points.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.strokeStyle='rgba(255,255,255,.93)'; ctx.lineWidth=3; ctx.shadowColor='rgba(255,255,255,.28)'; ctx.shadowBlur=8; ctx.stroke();
    ctx.restore();
  }
  function frame(now){ const p=easeOutExpo(Math.min(1,(now-start)/duration)); path(p); if(p<1) requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}
function drawDonut(id, values, labels, counts){
  const legend = document.getElementById('donutLegend');
  const palette=['rgba(255,255,255,.72)','rgba(255,255,255,.52)','rgba(255,255,255,.34)','rgba(255,255,255,.18)'];
  legend.innerHTML = labels.map((l,i)=>`<div class="legend-row"><i class="dot" style="--c:${palette[i]}"></i><span>${l}</span><span>${values[i]}%</span><span>${counts[i].toLocaleString('ru-RU')}</span></div>`).join('');
  const {ctx,w,h}=setupCanvas(id); const cx=w/2, cy=h/2, r=Math.min(w,h)*.36, line=Math.max(34, r*.52); const total=values.reduce((a,b)=>a+b,0); const start=performance.now();
  function frame(now){
    const p=easeOutExpo(Math.min(1,(now-start)/1450)); ctx.clearRect(0,0,w,h); let angle=-Math.PI/2;
    values.forEach((v,i)=>{ const a=(v/total)*Math.PI*2*p; ctx.beginPath(); ctx.arc(cx,cy,r,angle,angle+a); ctx.strokeStyle=palette[i]; ctx.lineWidth=line; ctx.stroke(); angle += a; });
    ctx.fillStyle='rgba(255,255,255,.96)'; ctx.textAlign='center'; ctx.font='700 30px Arial'; ctx.fillText(Math.round(24782*p).toLocaleString('ru-RU'),cx,cy+2); ctx.font='14px Arial'; ctx.fillStyle='rgba(255,255,255,.78)'; ctx.fillText('Всего',cx,cy+26);
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', () => { if(body.dataset.state==='dashboard' && chartsStarted){ startDashboardAnimations(); chartsStarted = true; } });
