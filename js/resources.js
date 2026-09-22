// ─── RECURSOS ───
// Usa resourcesData definido en data.js.

const TYPE_LABEL = { video: 'Video', doc: 'Documento' };

function renderResources() {
  const container = document.getElementById('resources-grid');
  container.innerHTML = resourcesData.map((r, i) => `
    <a href="${r.url}" target="_blank" rel="noopener" class="resource-card reveal reveal-delay-${i % 3}">
      <div class="resource-header">
        <span class="resource-type resource-type-${r.type}">${TYPE_LABEL[r.type] || r.type}</span>
        <span class="grade-badge">${r.tag}</span>
      </div>
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <span class="resource-link">Ver ${r.type === 'video' ? 'video' : 'documento'} →</span>
    </a>
  `).join('');
  initReveal();
}

renderResources();
