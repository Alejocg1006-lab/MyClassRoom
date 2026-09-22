// ─── LÓGICA DE LA APP ───
// Usa los datos definidos en data.js (gradesData, DAYS_ES, MONTHS_ES, HOURS, BLOCKED).
// data.js debe cargarse ANTES que este archivo en el HTML.

// ─── GRADOS Y TEMAS ───
function renderGrades() {
  const container = document.getElementById('grades-grid');
  container.innerHTML = gradesData.map((g, i) => `
    <div class="grade-card reveal reveal-delay-${i % 3}">
      <div class="grade-header">
        <div class="grade-num">${g.grade.replace('°','')}<span>°</span></div>
        <div class="grade-badge">${g.label}</div>
      </div>
      <div class="grade-topics">
        ${g.topics.map(t => `<div class="grade-topic">${t}</div>`).join('')}
      </div>
    </div>
  `).join('');
  initReveal();
}

// ─── CALENDARIO ───
let weekOffset = 0;
const requestedSlots = new Set();

function getWeekStart(offset) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  monday.setHours(0,0,0,0);
  return monday;
}

function changeWeek(dir) {
  weekOffset += dir;
  renderCalendar();
}

function renderCalendar() {
  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 5);

  document.getElementById('week-label').textContent =
    `${weekStart.getDate()} – ${weekEnd.getDate()} de ${MONTHS_ES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  const today = new Date();
  const grid = document.getElementById('calendar-grid');

  let html = '';
  // Header row
  html += '<div class="cal-time-header"></div>';
  for (let d = 0; d < 6; d++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + d);
    const isToday = day.toDateString() === today.toDateString();
    html += `<div class="cal-day-header ${isToday ? 'today' : ''}">
      <span class="cal-day-name">${DAYS_ES[d]}</span>
      <span class="cal-day-num">${day.getDate()}</span>
    </div>`;
  }

  // Hour rows
  for (let h = 0; h < HOURS.length; h++) {
    html += `<div class="cal-time-cell"><span class="cal-time-label">${HOURS[h]}</span></div>`;
    for (let d = 0; d < 6; d++) {
      const key = `${weekOffset}_${d}_${h}`;
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      const isPast = day < today && !(day.toDateString() === today.toDateString());
      const isBlocked = BLOCKED[d] && BLOCKED[d].includes(h);
      const isRequested = requestedSlots.has(key);

      let cls = 'cal-slot';
      if (isRequested) cls += ' requested';
      else if (isPast || isBlocked) cls += ' blocked blocked-label';
      else cls += ' available';

      const day2 = new Date(weekStart);
      day2.setDate(weekStart.getDate() + d);
      const dayLabel = `${DAYS_ES[d]} ${day2.getDate()}/${MONTHS_ES[day2.getMonth()].slice(0,3)}`;
      const onclick = (!isBlocked && !isPast && !isRequested)
        ? `onclick="requestSlot('${key}', this, '${dayLabel}', '${HOURS[h]}')"` : '';

      html += `<div class="${cls}" ${onclick} data-key="${key}"></div>`;
    }
  }

  grid.innerHTML = html;
}

// ─── MODAL DE RESERVA ───
let pendingSlotKey = null;
let pendingSlotEl = null;

function requestSlot(key, el, dayLabel, hourLabel) {
  pendingSlotKey = key;
  pendingSlotEl = el;
  const mode = currentMode === 'presencial' ? 'Presencial' : 'Virtual';
  document.getElementById('modal-slot-info').textContent = `${mode}  ·  ${dayLabel}  ·  ${hourLabel}`;
  // Clear form
  ['field-name','field-grade','field-topic','field-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
  });
  document.getElementById('booking-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('booking-modal').classList.remove('open');
  pendingSlotKey = null;
  pendingSlotEl = null;
}

function closeModalOnBackdrop(e) {
  if (e.target === document.getElementById('booking-modal')) closeModal();
}

function submitBooking() {
  const name  = document.getElementById('field-name').value.trim();
  const grade = document.getElementById('field-grade').value;
  const topic = document.getElementById('field-topic').value.trim();
  const phone = document.getElementById('field-phone').value.trim();

  if (!name) { document.getElementById('field-name').focus(); return; }
  if (!grade) { document.getElementById('field-grade').focus(); return; }
  if (!phone) { document.getElementById('field-phone').focus(); return; }

  const slotInfo = document.getElementById('modal-slot-info').textContent;
  let msg = `Hola Alejandro, quiero reservar una clase.\n\n📅 ${slotInfo}\n👤 Nombre: ${name}\n🎓 Grado: ${grade}`;
  if (topic) msg += `\n📚 Tema: ${topic}`;
  msg += `\n📱 Mi número: ${phone}`;

  // Mark slot as requested
  if (pendingSlotEl) {
    requestedSlots.add(pendingSlotKey);
    pendingSlotEl.className = 'cal-slot requested';
    pendingSlotEl.removeAttribute('onclick');
    pendingSlotEl.style.transition = 'background 0.3s, box-shadow 0.3s';
    pendingSlotEl.style.boxShadow = '0 0 12px var(--accent-glow)';
    setTimeout(() => { if (pendingSlotEl) pendingSlotEl.style.boxShadow = ''; }, 600);
  }

  closeModal();
  window.open(`https://wa.me/573217401519?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── TOGGLE VIRTUAL / PRESENCIAL ───
let currentMode = 'virtual';
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  const notes = {
    virtual: 'Vía Google Meet o Zoom',
    presencial: 'Ubicación detectada: Medellín (se puede ajustar)'
  };
  document.getElementById('location-text').textContent = notes[mode];
}

// ─── INIT ───
renderGrades();
renderCalendar();
initReveal();

// Hero elements already visible
document.querySelectorAll('#hero .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 100 + i * 80);
});
