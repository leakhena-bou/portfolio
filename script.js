/* ==========================================================================
   PORTFOLIO SCRIPT — Bou Leakhena
   --------------------------------------------------------------------------
   Sections (search for these labels to jump around):
     - Loader
     - Particles / Starfield background
     - Scroll progress bar
     - Nav (scroll state, mobile burger, active link highlight)
     - Spotlight cursor glow
     - Scroll-reveal animations
     - Skill bar animation
     - Contact form handling
     - Misc (year stamp, smooth anchor scroll, etc.)
   ========================================================================== */

(function(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Loader ===== */
  const loader = document.getElementById('loader');
  window.addEventListener('load', ()=>{ setTimeout(()=> loader.classList.add('hide'), reduced ? 0 : 500); });

  /* ===== Particles ===== */
  const pWrap = document.getElementById('particles');
  const colors = ['rgba(59,130,246,.5)','rgba(6,182,212,.5)','rgba(139,92,246,.5)'];
  for(let i=0;i<22;i++){
    const p = document.createElement('div'); p.className='particle';
    const size = 2 + Math.random()*3;
    p.style.width = p.style.height = size+'px';
    p.style.left = Math.random()*100+'%';
    p.style.top = Math.random()*100+'%';
    p.style.background = colors[i%3];
    p.style.opacity = .3 + Math.random()*.3;
    p.style.animation = `floatP ${10+Math.random()*10}s ease-in-out ${Math.random()*5}s infinite`;
    pWrap.appendChild(p);
  }
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes floatP{0%,100%{transform:translateY(0)}50%{transform:translateY(-40px)}}`;
  document.head.appendChild(styleTag);

  /* Twinkling starfield */
  for(let i=0;i<34;i++){
    const s = document.createElement('div'); s.className='star';
    const size = 1 + Math.random()*2;
    s.style.width = s.style.height = size+'px';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*100+'%';
    s.style.animation = `twinkle ${2+Math.random()*3}s ease-in-out ${Math.random()*4}s infinite`;
    pWrap.appendChild(s);
  }

  /* ===== Scroll progress ===== */
  const progress = document.getElementById('scroll-progress');
  function updateProgress(){
    const h = document.documentElement;
    progress.style.width = (h.scrollTop/(h.scrollHeight-h.clientHeight)*100) + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});

  /* ===== Spotlight + parallax (single rAF loop) ===== */
  let mx=innerWidth/2, my=innerHeight/2, sx=mx, sy=my;
  window.addEventListener('pointermove', e=>{ mx=e.clientX; my=e.clientY; }, {passive:true});
  const spotlight = document.getElementById('spotlight');
  const stageInner = document.getElementById('stageInner');
  const portraitStage = document.getElementById('portraitStage');
  function loop(){
    sx += (mx-sx)*0.1; sy += (my-sy)*0.1;
    spotlight.style.setProperty('--sx', sx+'px');
    spotlight.style.setProperty('--sy', sy+'px');
    if(portraitStage){
      const r = portraitStage.getBoundingClientRect();
      const cx = r.left+r.width/2, cy = r.top+r.height/2;
      const dx = (mx-cx)/r.width, dy = (my-cy)/r.height;
      stageInner.style.transform = `rotateY(${dx*10}deg) rotateX(${-dy*10}deg)`;
    }
    requestAnimationFrame(loop);
  }
  if(!reduced) requestAnimationFrame(loop);

  /* ===== Nav hide/show + scrollspy ===== */
  const navWrap = document.getElementById('navWrap');
  let lastY = window.scrollY;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y > lastY && y > 200) navWrap.classList.add('hidden'); else navWrap.classList.remove('hidden');
    lastY = y;
  }, {passive:true});
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = ['about','skills','projects','roadmap','certificates','contact'].map(id=>document.getElementById(id));
  const spy = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting) navLinks.forEach(a=> a.classList.toggle('active', a.getAttribute('href')==='#'+en.target.id)); });
  }, { rootMargin:'-45% 0px -45% 0px' });
  sections.forEach(s=> s && spy.observe(s));

  /* ===== Mobile menu ===== */
  const mobileMenu = document.getElementById('mobileMenu');
  document.getElementById('burgerBtn').addEventListener('click', ()=> mobileMenu.classList.add('open'));
  document.getElementById('closeBtn').addEventListener('click', ()=> mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mobileMenu.classList.remove('open')));

  /* ===== Reveal on scroll ===== */
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold:.14 });
  document.querySelectorAll('.reveal, .reveal-scale').forEach(el=> io.observe(el));
  function observeReveal(el, delay){ if(delay) el.style.setProperty('--d', delay); el.classList.add('reveal'); io.observe(el); }

  /* ===== Ripple + magnetic buttons ===== */
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const r = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.className='ripple'; r.style.width = r.style.height = size+'px';
      r.style.left = (e.clientX-rect.left-size/2)+'px'; r.style.top = (e.clientY-rect.top-size/2)+'px';
      this.appendChild(r); setTimeout(()=> r.remove(), 650);
    });
    btn.addEventListener('mousemove', e=>{
      const rect = btn.getBoundingClientRect();
      const x = e.clientX-rect.left-rect.width/2, y = e.clientY-rect.top-rect.height/2;
      btn.style.transform = `translate(${x*0.15}px, ${y*0.25}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
  });

  /* ===== Back to top ===== */
  document.getElementById('toTop').addEventListener('click', ()=> window.scrollTo({top:0, behavior: reduced?'auto':'smooth'}));

  /* ===== Contact form -> hands off to Telegram with a prefilled message ===== */
  const TELEGRAM_USERNAME = 'YOUR_TELEGRAM_USERNAME'; // ← replace with your real @username (no @)
  document.getElementById('contactForm').addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    const status = document.getElementById('formStatus');
    if(!name || !email || !message){
      status.textContent = 'Please fill in your name, email, and message first.';
      status.style.color = '#F87171';
      return;
    }
    const text = `Hi Leakhena! My name is ${name} (${email}).\n\n${message}`;
    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    status.style.color = '';
    status.textContent = 'Opening Telegram — your message is ready to send!';
  });

  /* ===== Orbit visual: subtle mouse-driven glow pulse on hover handled via CSS ===== */

  /* ===== Skills data ===== */
  const catIcons = {
    'Frontend': '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/><circle cx="5.7" cy="6.5" r=".5" fill="#fff"/>',
    'Backend': '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5"/>',
    'Database': '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    'Tools': '<path d="M14.7 6.3a4 4 0 10-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.8 2.8-2-2 2.8-2.8z"/>',
    'Languages': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"/>',
  };
  const catDesc = {
    'Frontend': 'Building interactive &amp; responsive user experiences.',
    'Backend': 'Server-side logic, APIs and application architecture.',
    'Database': 'Designing structured, scalable and reliable data systems.',
    'Tools': 'Essential tools that boost productivity and quality.',
    'Languages': 'Languages I speak and use to communicate.',
  };
  const ICO = {
    triangle:'<path d="M2 4h4l6 12 6-12h4L12 21 2 4z"/>',
    layers:'<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    cup:'<path d="M4 8h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V8z"/><path d="M17 9h1.5a2.3 2.3 0 010 4.6H17"/>',
    leaf:'<path d="M5 21c9 0 14-5 14-14 0-2-1-4-1-4s-2 0-4 1C5 7 5 14 5 21z"/>',
    wave:'<path d="M2 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 9c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>',
    monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    hex:'<path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/>',
    bracket:'<path d="M8 4L2 12l6 8M16 4l6 8-6 8"/>',
    key:'<circle cx="8" cy="15" r="3.2"/><path d="M10.5 12.5L20 3M17 6l2 2M14 9l2 2"/>',
    nodes:'<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8l6 8M18 8l-6 8"/>',
    list:'<path d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"/>',
    link:'<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    bolt:'<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>',
    gitbranch:'<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="9" r="2.2"/><path d="M6 8.2V15.8M6 8.2C6 12 10 12 13 12s5 0 5-3"/>',
    box:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"/>',
    octocat:'<path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0022 12.2C22 6.58 17.52 2 12 2z"/>',
    vscode: '<path d="M14.5 3.5l4 2v13l-4 2-7-6.5-3 2.5-2-1.5 3.5-3.5L2.5 8l2-1.5 3 2.5z"/>',
    figma: '<path d="M15 2a3 3 0 0 0-3 3v3h3a3 3 0 0 0 0-6z"/><path d="M9 2a3 3 0 0 0 0 6h3V2H9z"/><path d="M9 8a3 3 0 0 0 0 6h3V8H9z"/><path d="M9 14a3 3 0 1 0 3 3v-3H9z"/><path d="M12 8h3a3 3 0 1 1 0 6h-3V8z"/>',
    postman: '<path d="M12 3a9 9 0 1 0 9 9A9 9 0 0 0 12 3z"/><path d="M12 7l2.8 5.5L12 17l-2.8-4.5z"/>',
    server:'<rect x="3" y="4" width="18" height="6.5" rx="1.6"/><rect x="3" y="13.5" width="18" height="6.5" rx="1.6"/><circle cx="7" cy="7.2" r="1" fill="#fff"/><circle cx="7" cy="16.7" r="1" fill="#fff"/>',
    dbstack:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  };
  function svgIco(path, color){ return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${color||'#fff'}" stroke-width="2">${path}</svg>`; }
  function txt(t, color){ return `<span style="font-size:.62rem;font-weight:800;color:${color||'#fff'};">${t}</span>`; }

  const skills = {
    'Frontend': [
      { name:'Vue.js', bg:'linear-gradient(135deg,#42B883,#2F6E51)', glyph:svgIco(ICO.triangle) },
      { name:'HTML5', bg:'#E34F26', glyph:txt('5') },
      { name:'CSS3', bg:'#2965F1', glyph:txt('3') },
      { name:'JavaScript', bg:'#F7DF1E', glyph:txt('JS','#1F2937') },
      { name:'Bootstrap', bg:'linear-gradient(135deg,#7952B3,#5A3E8C)', glyph:txt('B') },
      { name:'API Consumption', bg:'linear-gradient(135deg,#8B5CF6,#7C3AED)', glyph:svgIco(ICO.monitor) },
    ],
    'Backend': [
      { name:'Node.js', bg:'linear-gradient(135deg,#3C873A,#2E6A2C)', glyph:svgIco(ICO.hex) },
      { name:'Express.js', bg:'#111827', glyph:txt('ex') },
      { name:'REST APIs', bg:'linear-gradient(135deg,#7C3AED,#3B82F6)', glyph:svgIco(ICO.bracket) },
      { name:'JWT Auth', bg:'linear-gradient(135deg,#EC4899,#7C3AED)', glyph:txt('JWT') },
    ],
    'Database': [
      { name:'MySQL', bg:'linear-gradient(135deg,#3B82F6,#2563EB)', glyph:svgIco(ICO.dbstack) },
      { name:'SQL Server', bg:'linear-gradient(135deg,#3B82F6,#06B6D4)', glyph:svgIco(ICO.server) },
      { name:'CRUD Operations', bg:'#374151', glyph:svgIco(ICO.list) },
    ],
    'Tools': [
      { name:'Git', bg:'linear-gradient(135deg,#F05033,#C0392B)', glyph:svgIco(ICO.gitbranch) },
      { name:'GitHub', bg:'#111827', glyph:svgIco(ICO.octocat) },
      { name:'VS Code', bg:'linear-gradient(135deg, #007ACC, #0098FF)', glyph:svgIco(ICO.vscode) },
      { name:'Postman', bg:'linear-gradient(135deg, #FF6C37, #FF8A50)', glyph:svgIco(ICO.postman) },
      { name:'Figma', bg:'linear-gradient(135deg, #A259FF, #1ABCFE)', glyph:svgIco(ICO.figma) }
    ],
    'Languages': [
      { name:'English', bg:'#2563EB', glyph:txt('EN') },
      { name:'Khmer', bg:'linear-gradient(135deg,#7C3AED,#6D28D9)', glyph:txt('KM') },
    ],
  };

  const skillsGrid = document.getElementById('skillsGrid');
  let si=0;
  Object.entries(skills).forEach(([cat, items])=>{
    const card = document.createElement('div');
    card.className='glass skill-cat';
    card.innerHTML = `
      <div class="skill-cat-head">
        <span class="skill-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8">${catIcons[cat]}</svg></span>
        <div><h3>${cat}</h3><p class="cat-desc">${catDesc[cat]}</p></div>
      </div>
      <div class="cat-divider"><span class="dash"></span><span class="diamond"></span><span class="dash"></span></div>
      <div class="chip-grid">${items.map(it=>`<span class="tech-chip2"><span class="skill-ico" style="background:${it.bg}">${it.glyph}</span>${it.name}</span>`).join('')}</div>`;
    observeReveal(card, si*90); si++;
    skillsGrid.appendChild(card);
  });

  /* ===== Projects data ===== */
const projects = [
    { title:'SrokYerng', desc:'A full-stack property booking platform with refund reservations, property & room reviews, and amenities functionality.', tags:['Vue.js','Node.js','Express.js','MySQL'],
      iconBg:'linear-gradient(135deg,#2563EB,#0EA5E9)', icon:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8.5 14.5l2 2 4-4"/>',
      mock:'booking', screenshot:'images/project1.png', live:'https://srokyerng.devspace.linkpc.net/', github:'https://github.com/Alchemyyyy/srokyerng-booking-frontend' },
    { title:'Find&Found', desc:'A responsive lost-and-found web app with Login, Registration, OTP verification and password reset, optimized across devices.', tags:['HTML5','CSS3','Bootstrap','Vue.js'],
      iconBg:'linear-gradient(135deg,#7C3AED,#4C1D95)', icon:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
      mock:'kanban', screenshot:'images/project2.png', live:'https://find-found-project.vercel.app/', github:'https://github.com/huon-thanun/FindFound-Project' },
    { title:'Digital Clinic Website', desc:'A static clinic booking website with appointment scheduling, service listings, and a bilingual (Khmer/English) interface — deployed on Vercel.', tags:['HTML5','CSS3','Bootstrap'],
      iconBg:'linear-gradient(135deg,#0EA5E9,#1E3A8A)', icon:'<path d="M12 3v18M3 12h18" stroke-linecap="round"/>',
      mock:'notes', screenshot:'images/project3.png', live:'https://clinic-digitall.vercel.app/', github:'https://github.com/sambath22/clinic-digital' },
  ];
 
  function bookingMock(p){
    return `
      <div class="mock-app-nav">
        <span class="mock-app-logo"><span class="dot"></span>SrokYerng</span>
        <span class="mock-app-links"><span>Home</span><span>Properties</span><span>Reservations</span><span>Messages</span></span>
        <span class="mock-app-cta">Profile <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg></span>
      </div>
      <div class="mock-hero-title">Find your perfect stay in Cambodia</div>
      <div class="mock-hero-sub">Discover and book amazing hotels with the best prices.</div>
      <div class="mock-search">
        <span class="seg"><span>Destination</span><b>Where are you going?</b></span>
        <span class="seg"><span>Check in</span><b>Select date</b></span>
        <span class="seg"><span>Check out</span><b>Select date</b></span>
        <span class="seg"><span>Guests</span><b>2 guests</b></span>
        <span class="go">Search</span>
      </div>
      <div class="mock-stat-row">
        <div class="mock-stat"><b>500+</b><span>Properties</span></div>
        <div class="mock-stat"><b>1200+</b><span>Happy Guests</span></div>
        <div class="mock-stat"><b>4.8</b><span>Avg Rating</span></div>
        <div class="mock-stat"><b>24/7</b><span>Support</span></div>
      </div>`;
  }
  function kanbanMock(p){
    return `
      <div class="mock-app-nav">
        <span class="mock-app-logo"><span class="dot"></span>Find&amp;Found</span>
        <span class="mock-app-links"><span>Home</span><span>Report Item</span><span>Browse</span><span>Messages</span></span>
        <span class="mock-app-cta">Profile <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg></span>
      </div>
      <div class="mock-hero-title">Log in to your account</div>
      <div class="mock-hero-sub">Enter your details to continue, or verify with the OTP we sent you.</div>
      <div class="mock-search">
        <span class="seg"><span>Email</span><b>you@example.com</b></span>
        <span class="seg"><span>Password</span><b>••••••••</b></span>
        <span class="seg"><span>OTP Code</span><b>_ _ _ _ _ _</b></span>
        <span class="go">Verify</span>
      </div>
      <div class="mock-stat-row">
        <div class="mock-stat"><b>Login</b><span>Secure access</span></div>
        <div class="mock-stat"><b>Register</b><span>New accounts</span></div>
        <div class="mock-stat"><b>OTP</b><span>Verification</span></div>
        <div class="mock-stat"><b>Reset</b><span>Password reset</span></div>
      </div>`;
  }
  function notesMock(p){
    return `<div class="mock-notes">
      <div class="mock-notes-list">
        <div class="mock-note-item active"><div class="t">API auth notes</div><div class="s"></div></div>
        <div class="mock-note-item"><div class="t">DB indexing</div><div class="s"></div></div>
        <div class="mock-note-item"><div class="t">Deploy checklist</div><div class="s"></div></div>
      </div>
      <div class="mock-note-view">
        <div class="line accent" style="width:60%"></div>
        <div class="line" style="width:85%"></div>
        <div class="line" style="width:70%"></div>
        <code>const token = signJWT(user);</code>
        <div class="line" style="width:50%"></div>
      </div>
    </div>`;
  }
  const mockRenderers = { booking:bookingMock, kanban:kanbanMock, notes:notesMock };
 
  const pList = document.getElementById('projectsList');
  projects.forEach((p,i)=>{
    const card = document.createElement('article');
    card.className='glass project-card reveal'; card.style.setProperty('--d', i*100);
    card.innerHTML = `
      <div class="project-layout">
        <div class="browser-mock">
          <div class="browser-bar"><span></span><span></span><span></span>
            <span class="browser-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>${p.title.toLowerCase().replace(/\s+/g,'')}.dev</span>
          </div>
          <div class="browser-body${p.screenshot ? ' has-shot' : ''}">${p.screenshot ? `<img class="browser-shot" src="${p.screenshot}" alt="${p.title} screenshot" loading="lazy">` : mockRenderers[p.mock](p)}</div>
        </div>
        <div class="proj-body">
          <div class="proj-head">
            <div class="proj-head-left">
              <span class="proj-icon-badge" style="background:${p.iconBg}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8">${p.icon}</svg></span>
              <h3>${p.title}</h3>
            </div>
            <span class="proj-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg></span>
          </div>
          <p>${p.desc}</p>
          <div class="badges">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>
          <div class="project-links">
            <a href="${p.live}" target="_blank" rel="noopener" class="primary" aria-label="Live demo of ${p.title}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              Live Demo
            </a>
            <a href="${p.github}" target="_blank" rel="noopener" aria-label="Source of ${p.title}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </div>`;
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      const px = (e.clientX-rect.left)/rect.width - .5, py = (e.clientY-rect.top)/rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${py*-2}deg) rotateY(${px*2}deg)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
    io.observe(card);
    pList.appendChild(card);
  });

  /* ===== Roadmap data ===== */
  const rmIcons = {
    code:'<path d="M8 4L2 12l6 8M16 4l6 8-6 8"/>',
    cap:'<path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5"/><path d="M22 8v6"/>',
    rocket:'<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
  };
  const rmIllus = {
    laptop:`<svg viewBox="0 0 140 100" width="100%" height="100%"><defs><linearGradient id="ig1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#06B6D4"/></linearGradient></defs>
      <rect x="24" y="26" width="76" height="48" rx="4" fill="none" stroke="url(#ig1)" stroke-width="2"/>
      <rect x="30" y="32" width="64" height="34" rx="2" fill="rgba(59,130,246,0.08)"/>
      <path d="M14 78h112l-8 10H22z" fill="none" stroke="url(#ig1)" stroke-width="2"/>
      <rect x="40" y="38" width="30" height="4" rx="2" fill="#3B82F6" opacity=".6"/>
      <rect x="40" y="46" width="44" height="4" rx="2" fill="#06B6D4" opacity=".5"/>
      <rect x="40" y="54" width="20" height="4" rx="2" fill="#8B5CF6" opacity=".6"/>
      <circle cx="112" cy="20" r="3" fill="#06B6D4"/><circle cx="120" cy="34" r="2" fill="#3B82F6"/><circle cx="20" cy="16" r="2" fill="#8B5CF6"/>
    </svg>`,
    stack:`<svg viewBox="0 0 140 100" width="100%" height="100%">
      <rect x="46" y="54" width="48" height="16" rx="4" fill="none" stroke="#3B82F6" stroke-width="2"/>
      <rect x="40" y="36" width="60" height="16" rx="4" fill="none" stroke="#06B6D4" stroke-width="2"/>
      <rect x="34" y="18" width="72" height="16" rx="4" fill="none" stroke="#8B5CF6" stroke-width="2"/>
      <circle cx="20" cy="24" r="9" fill="none" stroke="#42B883" stroke-width="2"/><text x="20" y="28" font-size="9" fill="#42B883" text-anchor="middle" font-family="sans-serif">V</text>
      <circle cx="118" cy="30" r="9" fill="none" stroke="#F7DF1E" stroke-width="2"/><text x="118" y="34" font-size="8" fill="#F7DF1E" text-anchor="middle" font-family="sans-serif">JS</text>
      <circle cx="112" cy="66" r="9" fill="none" stroke="#3C873A" stroke-width="2"/><text x="112" y="70" font-size="8" fill="#3C873A" text-anchor="middle" font-family="sans-serif">N</text>
      <circle cx="24" cy="70" r="9" fill="none" stroke="#3B82F6" stroke-width="2"/><text x="24" y="74" font-size="7" fill="#3B82F6" text-anchor="middle" font-family="sans-serif">DB</text>
    </svg>`,
    browser:`<svg viewBox="0 0 140 100" width="100%" height="100%"><defs><linearGradient id="ig2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>
      <rect x="18" y="14" width="104" height="72" rx="6" fill="none" stroke="url(#ig2)" stroke-width="2"/>
      <line x1="18" y1="28" x2="122" y2="28" stroke="url(#ig2)" stroke-width="1.5"/>
      <circle cx="27" cy="21" r="2" fill="#F87171"/><circle cx="35" cy="21" r="2" fill="#FBBF24"/><circle cx="43" cy="21" r="2" fill="#34D399"/>
      <rect x="30" y="38" width="80" height="10" rx="2" fill="rgba(59,130,246,0.14)"/>
      <rect x="30" y="52" width="50" height="6" rx="2" fill="rgba(6,182,212,0.3)"/>
      <rect x="30" y="62" width="60" height="6" rx="2" fill="rgba(148,163,184,0.2)"/>
      <path d="M96 70l4 4 8-8" stroke="#22C55E" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    compass:`<svg viewBox="0 0 140 100" width="100%" height="100%"><defs><linearGradient id="ig3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#06B6D4"/></linearGradient></defs>
      <circle cx="70" cy="50" r="34" fill="none" stroke="url(#ig3)" stroke-width="2"/>
      <path d="M70 30l10 30-10 12-10-12z" fill="rgba(139,92,246,0.25)" stroke="url(#ig3)" stroke-width="1.5"/>
      <circle cx="70" cy="50" r="3" fill="#06B6D4"/>
      <circle cx="70" cy="10" r="2" fill="#3B82F6"/><circle cx="112" cy="50" r="2" fill="#3B82F6"/><circle cx="70" cy="90" r="2" fill="#3B82F6"/><circle cx="28" cy="50" r="2" fill="#3B82F6"/>
    </svg>`,
  };
  const roadmap = [
    { year:'2024', icon:'code', illus:'laptop', items:[{ title:'C++ / C++ OOP', org:'ANT Technology Training Center', desc:'May 2024 – Nov 2024. Built a foundation in programming logic and object-oriented concepts.' }] },
    { year:'2025', icon:'cap', illus:'stack', items:[{ title:'HTML5, CSS3 & Bootstrap', org:'ANT Technology Training Center', desc:'Nov 2024 – Apr 2025, followed by a 700-hour Web Development Scholarship (Jun 2025 – Jul 2026) covering Vue.js, Node.js, Express.js and MySQL provided by Ministry of Post and Telecommunications (MPTC).' }] },
    { year:'2026', icon:'rocket', illus:'browser', items:[
      { title:'DigitalClinic — Frontend Developer', org:'Academic Project, Aug - Sep 2025', desc:'Built responsive interfaces and authentication features including OTP verification.' },
      { title:'Find&Found — Frontend Developer', org:'Academic Project, Jan – Mar 2026', desc:'Built responsive interfaces and authentication features including OTP verification.' },
      { title:'SrokYerng — Full-Stack Developer', org:'Academic Project, May 2026 – Present', desc:'Developed RESTful APIs, MySQL structures and booking/review features.' }
    ] },
    { year:'Future', icon:'target', illus:'compass', items:[{ title:'Seeking a junior web developer role', org:'Open to opportunities', desc:'Looking to join a team to keep learning while contributing production-ready code.' }] },
  ];
  const rmList = document.getElementById('roadmapList');
  const rmObs = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); }); }, { threshold:.5 });
  roadmap.forEach(y=>{
    const block = document.createElement('div');
    block.className='rm-year reveal';
    block.innerHTML = `<span class="rm-checkpoint"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${rmIcons[y.icon]}</svg></span>
      <div class="glass rm-card">
        <div>
          <div class="rm-label">${y.year}</div>
          ${y.items.map(it=>`<div class="rm-item"><h4>${it.title}</h4><div class="rm-org">${it.org}</div><p>${it.desc}</p></div>`).join('')}
        </div>
        <div class="rm-illus">${rmIllus[y.illus]}</div>
      </div>`;
    io.observe(block); rmObs.observe(block);
    rmList.appendChild(block);
  });
  const rmWrap = document.getElementById('roadmapWrap');
  const rmFill = document.getElementById('rmFill');
  function updateRmFill(){
    const rect = rmWrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(vh*0.7-rect.top, 0), total);
    rmFill.style.height = total+'px';
    rmFill.style.transform = `scaleY(${visible/total})`;
  }
  window.addEventListener('scroll', updateRmFill, {passive:true});
  window.addEventListener('resize', updateRmFill);

  /* ===== Certificates data ===== */
  const certs = [
    { name:'Full-Stack Web Development', issuer:'ANT Technology Training Center', desc:'700-hour scholarship covering Vue.js, Node.js, Express.js, MySQL and team Git workflows.', mono:'FS', tags:['Vue.js','Node.js','Express.js','MySQL','Git'] },
    { name:'Introduction to Front-End Development', issuer:' by Meta and offered through Coursera', desc:'18 May 2025. Responsive layout and modern frontend styling.', mono:'HB', tags:['HTML5','CSS3','Bootstrap'] },
    { name:'C++ / C++ OOP', issuer:'ANT Technology Training Center', desc:'May 2024 – Nov 2024. Core programming logic and object-oriented design.', mono:'C+', tags:['C++','OOP'] },
    { name:'Cisco IT Essentials', issuer:'Cisco Networking Academy', desc:'Learned computer hardware, operating systems, networking basics, troubleshooting, and cybersecurity fundamentals.', mono:'CS', tags: ['Hardware', 'Networking', 'Troubleshooting'] },
    { name:'AI for Work', issuer:'DataCamp', desc:'Learned practical AI skills, prompt engineering, and responsible AI practices to enhance productivity and software development workflows.', mono:'CS', tags: ['AI', 'Prompt Engineering', 'Responsible AI'] }
  ];
  const certTrack = document.getElementById('certTrack');
  certs.forEach((c,i)=>{
    const card = document.createElement('div'); card.className='glass cert-card reveal'; card.style.setProperty('--d', i*90);
    card.innerHTML = `
      <div class="cert-top">
        <span class="cert-medal">${c.mono}</span>
        <span class="cert-num"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>0${i+1}</span>
      </div>
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
        <div>
          <h4>${c.name}</h4>
          <div class="issuer">${c.issuer}</div>
        </div>
        <span class="cert-ribbon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L6 21l6-3 6 3-2.5-8.5"/></svg></span>
      </div>
      <div class="cert-divider2"></div>
      <p>${c.desc}</p>
      <div class="cert-tags">${c.tags.map(t=>`<span class="cert-tag">${t}</span>`).join('')}</div>`;
    io.observe(card);
    certTrack.appendChild(card);
  });

  updateProgress(); updateRmFill();
})();