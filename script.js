/* ═══════ NAVIGATION ═══════ */
function switchTo(name){
  ['home','water','air','safety','stats'].forEach(s=>{
    const el=document.getElementById('screen-'+s);
    if(el) el.classList.remove('active');
  });
  const t=document.getElementById('screen-'+name);
  if(t) t.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const ni=document.getElementById('nav-'+name);
  if(ni) ni.classList.add('active');
}

/* ═══════ VALVE CONTROL ═══════ */
let valveOpen = false;
function setValve(open){
  valveOpen = open;
  const tog = document.getElementById('valve-toggle');
  const statusText = document.getElementById('valve-status-text');
  const valveIc = document.getElementById('valve-ic');
  const stateIcon = document.getElementById('valve-state-icon');
  const stateTitle = document.getElementById('valve-state-title');
  const stateSub = document.getElementById('valve-state-sub');
  const btnClose = document.getElementById('btn-close-valve');
  const btnOpen = document.getElementById('btn-open-valve');

  if(open){
    tog.classList.add('on');
    statusText.textContent = 'Open';
    statusText.className = 'dr-val grn';
    valveIc.textContent = '🔓';
    valveIc.style.background = 'rgba(0,200,81,.15)';
    valveIc.style.borderColor = 'rgba(0,200,81,.3)';
    stateIcon.textContent = '🔓';
    stateIcon.style.background = 'rgba(0,200,81,.15)';
    stateIcon.style.borderColor = 'rgba(0,200,81,.3)';
    stateTitle.textContent = 'Valve — Open';
    stateTitle.style.color = 'var(--green)';
    stateSub.textContent = 'Water is flowing — monitor pressure';
    btnOpen.style.opacity = '0.5';
    btnClose.style.opacity = '1';
  } else {
    tog.classList.remove('on');
    statusText.textContent = 'Closed';
    statusText.className = 'dr-val red';
    valveIc.textContent = '🔒';
    valveIc.style.background = 'rgba(232,0,28,.18)';
    valveIc.style.borderColor = 'rgba(232,0,28,.3)';
    stateIcon.textContent = '🔒';
    stateIcon.style.background = 'rgba(232,0,28,.15)';
    stateIcon.style.borderColor = 'rgba(232,0,28,.3)';
    stateTitle.textContent = 'Valve — Closed';
    stateTitle.style.color = 'var(--red2)';
    stateSub.textContent = 'Tap Open Valve to restore water flow';
    btnClose.style.opacity = '0.5';
    btnOpen.style.opacity = '1';
  }
}
function toggleValve(){ setValve(!valveOpen); }

/* ═══════ FAN CONTROL ═══════ */
let fanSpeed = 75;
let fanAnimId = null;
let fanAngle = 0;
let lastTime = null;

function setFanSpeed(spd){
  fanSpeed = spd;
  // Update UI elements
  document.getElementById('fan-speed-pct').textContent = spd + '%';
  document.getElementById('fan-rpm-val').textContent = spd === 0 ? '0 RPM' : Math.round(spd * 18) + ' RPM';
  document.getElementById('fan-bar-fill').style.width = spd + '%';
  document.getElementById('fan-bar-pct-lbl').textContent = spd + '%';

  // Update pill
  const pill = document.getElementById('fan-pill');
  const pillLabel = document.getElementById('fan-pill-label');
  const fanDot = document.getElementById('fan-dot');
  const fanSub = document.getElementById('fan-sub-label');
  const fanSvg = document.getElementById('fan-svg');

  if(spd === 0){
    pill.style.background = 'rgba(255,255,255,.05)';
    pill.style.borderColor = 'rgba(255,255,255,.1)';
    pill.style.color = 'var(--text2)';
    pillLabel.textContent = 'Off';
    fanDot.style.background = 'var(--text2)';
    fanDot.style.boxShadow = 'none';
    fanDot.style.animation = 'none';
    fanSub.textContent = 'Fan stopped';
    fanSvg.style.animationDuration = 'none';
    fanSvg.style.animationPlayState = 'paused';
    fanSvg.className = 'fan-svg stopped';
  } else {
    pill.style.background = 'rgba(0,170,255,.1)';
    pill.style.borderColor = 'rgba(0,170,255,.25)';
    pill.style.color = 'var(--blue)';
    pillLabel.textContent = spd <= 30 ? 'Low' : spd <= 60 ? 'Medium' : spd < 100 ? 'Active' : 'Max';
    fanDot.style.background = 'var(--blue)';
    fanDot.style.boxShadow = '0 0 6px var(--blue)';
    fanDot.style.animation = 'blink 1.5s ease infinite';
    fanSub.textContent = spd >= 75 ? 'Auto-triggered · CO₂ high' : spd === 100 ? 'Maximum ventilation' : 'Manual control';
    // Speed: 100% = 0.5s, 50% = 1s, 25% = 2s
    const dur = Math.max(0.4, 2 - (spd / 100) * 1.6);
    fanSvg.style.animationDuration = dur + 's';
    fanSvg.style.animationPlayState = 'running';
    fanSvg.className = 'fan-svg';
  }

  // Highlight speed buttons
  ['off','low','med','high','max'].forEach(s => {
    const btn = document.getElementById('fspd-' + s);
    if(btn) btn.className = 'fan-ctrl-btn inactive-speed';
  });
  const speedMap = {0:'off', 25:'low', 55:'med', 75:'high', 100:'max'};
  const activeBtn = document.getElementById('fspd-' + speedMap[spd]);
  if(activeBtn) activeBtn.className = 'fan-ctrl-btn active-speed';
}

/* ═══════ POWER CONTROL ═══════ */
let powerOn = true;
function setPower(on){
  powerOn = on;
  const btnOn = document.getElementById('btn-power-on');
  const btnOff = document.getElementById('btn-power-off');
  if(on){
    btnOn.style.opacity = '0.5';
    btnOff.style.opacity = '1';
    btnOff.innerHTML = '<span class="btn-ico">⏻</span><div class="btn-txt"><span class="btn-lbl">Power OFF</span><span class="btn-sub">Cut affected lines</span></div>';
  } else {
    btnOff.style.opacity = '0.5';
    btnOn.style.opacity = '1';
    btnOn.innerHTML = '<span class="btn-ico">✅</span><div class="btn-txt"><span class="btn-lbl">Power ON</span><span class="btn-sub">Lines are off now</span></div>';
  }
}

/* ═══════ LIVE CLOCK ═══════ */
function updateClock(){
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const el = document.getElementById('sb-clock');
  if(el) el.textContent = h + ':' + m;
}
setInterval(updateClock, 10000);
updateClock();

/* ═══════ LIVE CO2 FLICKER ═══════ */
setInterval(()=>{
  const base = 820;
  const v = base + Math.floor(Math.random()*30 - 15);
  const d = document.getElementById('co2-display');
  const m = document.getElementById('co2-mini');
  if(d) d.textContent = v;
  if(m) m.textContent = v;
}, 4000);

/* ═══════ INIT ═══════ */
setValve(false);
setFanSpeed(75);
setPower(true);
// Set initial button opacities
document.getElementById('btn-close-valve').style.opacity = '0.5';
document.getElementById('btn-open-valve').style.opacity = '1';
document.getElementById('btn-power-on').style.opacity = '0.5';


(function(){
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const cx = 160, cy = 165, R = 122;
  const startDeg = 180, endDeg = 0;
  const minPPM = 400, maxPPM = 1000;
  const fullArc = 383;

  function degToRad(d){ return d * Math.PI / 180; }

  function ppmToAngle(ppm){
    const t = Math.min(1, Math.max(0, (ppm - minPPM) / (maxPPM - minPPM)));
    return 180 - t * 180;
  }

  function angleToXY(deg, r){
    const rad = degToRad(deg);
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  // Draw ticks
  const ticksG = document.getElementById('ticks');
  for(let i = 0; i <= 10; i++){
    const deg = 180 - i * 18;
    const inner = angleToXY(deg, R - 18);
    const outer = angleToXY(deg, R - (i % 5 === 0 ? 4 : 8));
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', inner.x); line.setAttribute('y1', inner.y);
    line.setAttribute('x2', outer.x); line.setAttribute('y2', outer.y);
    line.setAttribute('stroke-width', i % 5 === 0 ? '2' : '1');
    line.setAttribute('stroke-opacity', i % 5 === 0 ? '.45' : '.2');
    ticksG.appendChild(line);
  }

  let currentPPM = 820;
  let targetPPM = 820;
  let animFrame;

  function getColor(ppm){
    if(ppm < 600) return {color:'#00e87a', cls:'good',    txt:'Good air quality'};
    if(ppm < 800) return {color:'#ffd200', cls:'warning', txt:'Moderate CO₂ level'};
    if(ppm < 950) return {color:'#ff8c00', cls:'warning', txt:'High CO₂ — ventilate now'};
    return               {color:'#ff2d55', cls:'danger',  txt:'Danger — evacuate area'};
  }

  function updateGauge(ppm){
    const t = Math.min(1, Math.max(0, (ppm - minPPM) / (maxPPM - minPPM)));
    const offset = fullArc * (1 - t);
    const deg = ppmToAngle(ppm);
    const tip = angleToXY(deg, R - 18);

    document.getElementById('active-arc').setAttribute('stroke-dashoffset', offset.toFixed(1));
    document.getElementById('needle-line').setAttribute('x2', tip.x.toFixed(1));
    document.getElementById('needle-line').setAttribute('y2', tip.y.toFixed(1));
    document.getElementById('needle-shadow').setAttribute('x2', (tip.x + 1.5).toFixed(1));
    document.getElementById('needle-shadow').setAttribute('y2', (tip.y + 2).toFixed(1));
    document.getElementById('co2-val').textContent = Math.round(ppm);

    const info = getColor(ppm);
    const pill = document.getElementById('status-pill');
    const dot  = document.getElementById('pill-dot');
    const txt  = document.getElementById('status-text');
    pill.className = 'status-pill ' + info.cls;
    dot.className  = 'pill-dot '   + info.cls;
    txt.textContent = info.txt;
    document.getElementById('needle-line').setAttribute('stroke', 'url(#needle-grad)');
  }

  function animateTo(ppm){
    cancelAnimationFrame(animFrame);
    const start = currentPPM;
    const diff = ppm - start;
    const dur = 900;
    const t0 = performance.now();
    function step(now){
      const p = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      currentPPM = start + diff * ease;
      updateGauge(currentPPM);
      if(p < 1) animFrame = requestAnimationFrame(step);
      else currentPPM = ppm;
    }
    animFrame = requestAnimationFrame(step);
  }

  // Initial render
  updateGauge(820);

  // Live simulation
  let peak = 820;
  const history = [820];
  setInterval(function(){
    const delta = (Math.random() - 0.38) * 40;
    targetPPM = Math.min(1000, Math.max(400, targetPPM + delta));
    if(targetPPM > peak) peak = targetPPM;

    animateTo(targetPPM);

    history.push(Math.round(targetPPM));
    if(history.length > 60) history.shift();
    const avg = Math.round(history.reduce((a,b)=>a+b,0)/history.length);
    const d = Math.round(targetPPM - history[Math.max(0,history.length-6)]);

    document.getElementById('m-avg').textContent   = avg;
    document.getElementById('m-peak').textContent  = Math.round(peak);
    document.getElementById('m-delta').textContent = (d >= 0 ? '+' : '') + d;

    const avgPct  = ((avg  - 400) / 600 * 100).toFixed(0);
    const pkPct   = ((peak - 400) / 600 * 100).toFixed(0);
    const dPct    = Math.min(100, Math.abs(d) / 100 * 100).toFixed(0);
    document.getElementById('avg-bar').style.width   = avgPct  + '%';
    document.getElementById('peak-bar').style.width  = pkPct   + '%';
    document.getElementById('delta-bar').style.width = dPct    + '%';

    const avgColor = targetPPM < 600 ? '#00e87a' : targetPPM < 800 ? '#ffd200' : '#ff8c00';
    document.getElementById('m-avg').style.color = avgColor;
    document.getElementById('avg-bar').style.background = avgColor;
    document.getElementById('m-delta').style.color = d > 0 ? '#ff2d55' : '#00e87a';
    document.getElementById('delta-bar').style.background = d > 0 ? '#ff2d55' : '#00e87a';
  }, 3000);
})();