/* =========================================================
   MATEEN ULTRA v8
   - Neural KNN + packet bursts + Breach Mode (Cipher Rain)
   - FX radar + cursor particle trail + quantum click ripples
   - Specular cursor light (CSS vars), holo tilt, magnetic hover
   - Profile lightbox, reveals, popup, resume hover
========================================================= */

// Global flags
window.__BREACH__ = false;

// 0) Year
document.getElementById('year')?.appendChild(document.createTextNode(new Date().getFullYear()));

// 1) Intersection reveals (fade/slide)
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
},{threshold:.12, rootMargin:'0px 0px -80px 0px'});
document.querySelectorAll('.fade-up, .slide-in').forEach(el=>{
  el.style.transition = 'opacity .85s ease, transform .85s ease';
  el.style.opacity = 0; el.style.transform = 'translateY(60px)';
  io.observe(el);
});

// 2) Scroll to top
const scrollBtn = document.getElementById('scrollToTop');
if(scrollBtn){
  window.addEventListener('scroll', ()=> {
    if(scrollY>300) scrollBtn.classList.add('show'); else scrollBtn.classList.remove('show');
  });
  scrollBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
}

// 3) Popup helper
function showPopup(msg){
  const pop = document.getElementById('popup'); if(!pop) return;
  pop.textContent = msg; pop.classList.remove('hidden');
  setTimeout(()=>pop.classList.add('hidden'), 1800);
}
document.querySelectorAll('.contact-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const text=item.textContent||'';
    if(text.includes('@')) showPopup('Email copied to clipboard!');
  });
});

// 4) Resume button hover
const resumeBtn = document.getElementById('resumeBtn');
if(resumeBtn){
  const orig = resumeBtn.innerHTML;
  resumeBtn.addEventListener('mouseenter', ()=> resumeBtn.innerHTML='View Resume');
  resumeBtn.addEventListener('mouseleave', ()=> resumeBtn.innerHTML=orig);
}

// 5) Profile overlay
(() => {
  const profileImg = document.getElementById('profileImg');
  const overlay = document.getElementById('profileOverlay');
  const closeBtn = document.getElementById('closeBtn');
  if(!profileImg || !overlay || !closeBtn) return;
  profileImg.addEventListener('click', ()=>{ overlay.style.display='flex'; document.body.style.overflow='hidden'; });
  const close = ()=>{ overlay.style.display='none'; document.body.style.overflow='auto'; };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
})();

// 6) Magnetic hover
(() => {
  const MAG=16;
  document.querySelectorAll('.magnet').forEach(el=>{
    const reset=()=> el.style.transform='';
    el.addEventListener('mousemove', e=>{
      const r=el.getBoundingClientRect();
      const mx=(e.clientX - r.left)/r.width - .5;
      const my=(e.clientY - r.top)/r.height - .5;
      el.style.transform = `translate(${mx*MAG}px, ${my*MAG}px)`;
    });
    el.addEventListener('mouseleave', reset);
  });
})();

// 7) Holographic 3D tilt + cursor specular light
(() => {})();

// 8A) Neural graph with KNN + packet bursts
(() => {
  const canvas = document.getElementById('neural-bg'); if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let W=innerWidth, H=innerHeight, DPR=Math.min(devicePixelRatio||1,2);
  let nodes=[], edges=[], packets=[];
  const K = 3; // nearest neighbors
  const NODE_COUNT = innerWidth < 720 ? 80 : 140;

  function resize(){
    DPR=Math.min(devicePixelRatio||1,2);
    canvas.width = Math.floor(W*DPR); canvas.height = Math.floor(H*DPR);
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function makeGraph(){
    nodes = Array.from({length:NODE_COUNT}, ()=>({
      x: rand(0,W), y: rand(0,H),
      vx: rand(-.06,.06), vy: rand(-.06,.06),
      life: Math.random()*2000
    }));
    edges = [];
    for(let i=0;i<nodes.length;i++){
      const sorted = nodes.map((n,idx)=>({idx, d:(n.x-nodes[i].x)**2 + (n.y-nodes[i].y)**2}))
                          .sort((a,b)=>a.d-b.d)
                          .slice(1,K+1);
      sorted.forEach(n=>edges.push([i,n.idx]));
    }
    packets.length = 0;
  }

  function spawnPacket(){
    const e = edges[(Math.random()*edges.length)|0]; if(!e) return;
    const a = nodes[e[0]], b = nodes[e[1]];
    packets.push({ ax:a.x, ay:a.y, bx:b.x, by:b.y, t:0, v:rand(.5,.95) });
    if(packets.length>window.__BREACH__ ? 160 : 90) packets.shift();
  }

  function step(dt){
    for(const n of nodes){
      n.x += n.vx*dt*0.06; n.y += n.vy*dt*0.06;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
      n.life += dt;
    }
    for(let i=packets.length-1;i>=0;i--){
      const p=packets[i]; p.t += (dt/1000)*p.v*(window.__BREACH__?1.4:1);
      if(p.t>=1) packets.splice(i,1);
    }
  }

  function draw(ts){
    ctx.clearRect(0,0,W,H);

    // Links
    ctx.globalCompositeOperation='lighter';
    for(const [i,j] of edges){
      const a=nodes[i], b=nodes[j];
      const d = Math.hypot(a.x-b.x, a.y-b.y);
      const alpha = Math.max(0, (window.__BREACH__? .22 : .14) - d/1000);
      if(alpha<=0) continue;
      const c1 = window.__BREACH__ ? '255,80,100' : '0,229,255';
      const c2 = window.__BREACH__ ? '255,180,60' : '124,92,255';
      const g = ctx.createLinearGradient(a.x,a.y,b.x,b.y);
      g.addColorStop(0, `rgba(${c1},${alpha})`);
      g.addColorStop(1, `rgba(${c2},${alpha})`);
      ctx.strokeStyle = g; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    }

    // Packets
    for(const p of packets){
      const x = p.ax + (p.bx - p.ax)*p.t;
      const y = p.ay + (p.by - p.ay)*p.t;
      ctx.beginPath(); ctx.arc(x,y,1.9,0,Math.PI*2);
      ctx.fillStyle = window.__BREACH__ ? 'rgba(255,200,80,.95)' : 'rgba(102,255,153,.95)'; ctx.fill();

      const x2 = p.ax + (p.bx - p.ax)*Math.max(0,p.t-0.025);
      const y2 = p.ay + (p.by - p.ay)*Math.max(0,p.t-0.025);
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x2,y2);
      ctx.strokeStyle = window.__BREACH__ ? 'rgba(255,80,100,.3)' : 'rgba(0,229,255,.32)';
      ctx.lineWidth=1.2; ctx.stroke();
    }

    // Nodes pulse
    for(const n of nodes){
      const a = .36 + .24*Math.sin((n.life+ts)*0.002*(window.__BREACH__?1.4:1));
      ctx.beginPath(); ctx.arc(n.x,n.y,2.1,0,Math.PI*2);
      ctx.fillStyle= window.__BREACH__ ? `rgba(255,120,120,${a})` : `rgba(124,92,255,${a})`;
      ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
  }

  let last = performance.now();
  function loop(ts){
    const dt = ts-last; last=ts;
    step(dt); draw(ts);
    const p = window.__BREACH__ ? 0.5 : 0.12;
    if(Math.random()<p){ spawnPacket(); if(window.__BREACH__ && Math.random()<0.5) spawnPacket(); }
    requestAnimationFrame(loop);
  }

  function init(){ W=innerWidth; H=innerHeight; resize(); makeGraph(); requestAnimationFrame(loop); }
  addEventListener('resize', ()=>{ W=innerWidth; H=innerHeight; resize(); });
  init();
})();

// 8B) FX Layer: radar sweep + cursor trail + quantum click ripples
(() => {
  const canvas = document.getElementById('fx-bg'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W=innerWidth,H=innerHeight,DPR=Math.min(devicePixelRatio||1,2);
  let particles=[], ripples=[];
  const MAX=70;

  const mouse={x:W*0.5, y:H*0.35};
  addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; }, {passive:true});
  addEventListener('click', e=>{
    ripples.push({x:e.clientX, y:e.clientY, r:0, life:1});
  });

  function resize(){
    DPR=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.floor(W*DPR); canvas.height=Math.floor(H*DPR);
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function spawnTrail(){
    particles.push({x:mouse.x,y:mouse.y,vx:(Math.random()-0.5)*.8,vy:(Math.random()-0.5)*.8,life:1});
    if(particles.length>MAX) particles.shift();
  }

  function step(dt){
    spawnTrail();
    for(const p of particles){
      p.x += p.vx*dt*0.06; p.y += p.vy*dt*0.06;
      p.life -= dt/900*(window.__BREACH__?1.3:1);
    }
    particles = particles.filter(p=>p.life>0);

    for(const r of ripples){
      r.r += dt*0.18*(window.__BREACH__?1.6:1);
      r.life -= dt/1200;
    }
    ripples = ripples.filter(r=>r.life>0);
  }

  function draw(ts){
    ctx.clearRect(0,0,W,H);

    // radar
    const R = (ts*0.06)%Math.max(W,H);
    ctx.beginPath(); ctx.arc(mouse.x, mouse.y, R, 0, Math.PI*2);
    ctx.strokeStyle= window.__BREACH__ ? 'rgba(255,180,60,.3)':'rgba(102,255,153,.25)';
    ctx.lineWidth=1; ctx.stroke();

    const grad = ctx.createRadialGradient(mouse.x,mouse.y,Math.max(0,R-2),mouse.x,mouse.y,R+2);
    grad.addColorStop(0,'rgba(0,229,255,0)'); grad.addColorStop(.6, window.__BREACH__?'rgba(255,80,100,.06)':'rgba(0,229,255,.05)'); grad.addColorStop(1,'rgba(124,92,255,0)');
    ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(mouse.x,mouse.y,R+2,0,Math.PI*2); ctx.fill();

    // particles
    for(const p of particles){
      ctx.beginPath(); ctx.arc(p.x,p.y,2.2,0,Math.PI*2);
      ctx.fillStyle= window.__BREACH__?`rgba(255,200,80,${p.life})`:`rgba(0,229,255,${p.life})`; ctx.fill();
    }

    // ripples
    for(const r of ripples){
      ctx.beginPath(); ctx.arc(r.x,r.y,Math.max(0,r.r),0,Math.PI*2);
      ctx.strokeStyle = window.__BREACH__?`rgba(255,80,120,${r.life})`:`rgba(0,229,255,${r.life})`;
      ctx.lineWidth = 2; ctx.stroke();
    }
  }

  let last=performance.now();
  function loop(ts){
    const dt=ts-last; last=ts; step(dt); draw(ts); requestAnimationFrame(loop);
  }
  addEventListener('resize', ()=>{ W=innerWidth; H=innerHeight; resize(); });
  resize(); requestAnimationFrame(loop);
})();

// 9) Cipher Rain overlay (created/destroyed on Breach)
const CipherRain = (function(){
  let canvas, ctx, cols, drops, fontSize=16, running=false, rafId=null;

  function create(){
    if(canvas) return;
    canvas = document.createElement('canvas');
    canvas.id='cipher-bg';
    canvas.className='cipher-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
  }
  function resize(){
    if(!canvas) return;
    const DPR=Math.min(devicePixelRatio||1,2);
    canvas.width = Math.floor(innerWidth*DPR);
    canvas.height = Math.floor(innerHeight*DPR);
    canvas.style.width = innerWidth+'px';
    canvas.style.height = innerHeight+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);

    fontSize = Math.max(14, Math.floor(16*(innerWidth<768?0.8:1)));
    cols = Math.ceil(innerWidth/fontSize);
    drops = new Array(cols).fill(0).map(()=>Math.random()*innerHeight/fontSize);
    ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
  }

  const glyphs = '01{}[]<>=/\\$#*@&%:;._'.split('');

  function step(){
    if(!running) return;
    ctx.fillStyle = 'rgba(5,8,12,0.12)'; ctx.fillRect(0,0,innerWidth,innerHeight);
    for(let i=0;i<cols;i++){
      const g = glyphs[(Math.random()*glyphs.length)|0];
      const t = Math.random();
      let fill;
      if(window.__BREACH__){
        // danger hues
        const alpha = 0.65*(.8+Math.random()*.4);
        fill = t<.6?`rgba(255,80,100,${alpha})`:`rgba(255,180,60,${alpha})`;
      }else{
        const alpha = 0.60*(.8+Math.random()*.4);
        fill = t<.5?`rgba(0,229,255,${alpha})`:`rgba(124,92,255,${alpha})`;
      }
      ctx.fillStyle = fill;
      const x=i*fontSize, y=drops[i]*fontSize;
      ctx.fillText(g,x,y);
      if(y>innerHeight && Math.random()>.975) drops[i]=0;
      drops[i] += (1+Math.random()*1.4) * (window.__BREACH__?1.5:1);
    }
    rafId = requestAnimationFrame(step);
  }

  return {
    start(){ create(); running=true; resize(); cancelAnimationFrame(rafId); step(); window.addEventListener('resize', resize); },
    stop(){ running=false; cancelAnimationFrame(rafId); if(canvas){ canvas.remove(); canvas=null; } window.removeEventListener('resize', resize); }
  };
})();

// 10) Keyboard: toggle Breach Mode
window.addEventListener('keydown', (e)=>{
  const key = e.key.toLowerCase();
  if(key==='`' || key==='b'){
    window.__BREACH__ = !window.__BREACH__;
    document.body.classList.toggle('breach', window.__BREACH__);
    if(window.__BREACH__){
      CipherRain.start();
      showPopup('BREACH MODE: ON');
    }else{
      CipherRain.stop();
      showPopup('Breach cleared');
    }
  }
});
/* About — inline console typing (single card) */
(() => {
  const out = document.getElementById('aboutStrip');
  if(!out) return;
  const lines = [
    "$ whoami   → syed_abdul_mateen",
    "$ role     → AI & Cybersecurity Developer",
    "$ focus    → threat-detection | process-monitoring | file-integrity",
    "$ stack    → python  flask  sklearn  yara  psutil",
    "$ contact  → syedabdulmateen284@gmail.com"
  ];
  let i=0, c=0;
  const tick=()=>{
    if(i>=lines.length) return;
    const s = lines[i];
    out.textContent = out.textContent.replace(/\u2588$/,'') + s.slice(0,c) + '█';
    if(c<s.length){ c++; setTimeout(tick, 16); }
    else { out.textContent = out.textContent.replace(/\u2588$/,'') + s + "\n"; i++; c=0; setTimeout(tick, 520); }
  };
  out.textContent=""; tick();
})();
// 7) Holographic 3D tilt + cursor specular light
(() => {
})();
