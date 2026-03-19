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