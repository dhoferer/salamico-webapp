// Mehl-Guide JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Track page view
    if (typeof _paq !== 'undefined') {
        _paq.push(['trackPageView']);
    }
    
    // Initialize
    renderMehlKarten(mehlSorten);
    setupFilters();
    
});

function renderMehlKarten(mehle) {
    const grid = document.getElementById('mehlGrid');
    grid.innerHTML = '';
    
    if (mehle.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-medium);">
                <h3>Keine Mehlsorten gefunden</h3>
                <p>Versuche andere Filterkriterien.</p>
            </div>
        `;
        return;
    }
    
    mehle.forEach(mehl => {
        const karte = createMehlKarte(mehl);
        grid.appendChild(karte);
    });
}

function createMehlKarte(mehl) {
    const karte = document.createElement('div');
    karte.className = 'mehl-card';
    
    // W-Wert Kategorie für Styling
    const kategorie = wWertKategorien[mehl.wKategorie];
    
    karte.innerHTML = `
        <div class="mehl-name">${mehl.name}</div>
        <div class="mehl-type">${mehl.type}</div>
        <div class="w-wert">W-Wert: ${mehl.wWert}</div>
        
        <div class="eigenschaften">
            ${mehl.eigenschaften.map(eigenschaft => `
                <div class="eigenschaft">
                    <div class="eigenschaft-icon">✓</div>
                    ${eigenschaft}
                </div>
            `).join('')}
        </div>
        
        <div class="verwendung">
            <div class="verwendung-title">${mehl.verwendung.title}</div>
            <div class="verwendung-text">${mehl.verwendung.beschreibung}</div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
            <div style="font-size: 0.85rem; color: var(--text-medium);">
                <strong>Protein:</strong> ${mehl.protein}<br>
                <strong>Herkunft:</strong> ${mehl.herkunft}
            </div>
            <div style="font-size: 0.8rem; color: var(--salamico-red); font-weight: 600;">
                ${getVerwendungsIcons(mehl.geeignetFuer)}
            </div>
        </div>
        
        ${mehl.besonderheiten ? `
            <div style="margin-top: 15px; padding: 10px; background: var(--salamico-red-pale); border-radius: 8px; font-size: 0.85rem; color: var(--salamico-red-dark);">
                <strong>Besonderheit:</strong> ${mehl.besonderheiten}
            </div>
        ` : ''}
    `;
    
    // Click event für Details
    karte.addEventListener('click', () => {
        showMehlDetails(mehl);
    });
    
    return karte;
}

function getVerwendungsIcons(verwendungen) {
    const icons = {
        'napoletana': '🇮🇹',
        'romana': '🏛️',
        'pinsa': '🌿',
        'focaccia': '🍞'
    };
    
    return verwendungen.map(v => `${icons[v] || '🍕'} ${verwendungsTypen[v]}`).join('<br>');
}

function showMehlDetails(mehl) {
    // Create modal or detailed view
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <button style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-medium);">×</button>
        
        <h2 style="color: var(--salamico-red-dark); margin-bottom: 10px;">${mehl.name}</h2>
        <p style="color: var(--text-medium); margin-bottom: 20px;">${mehl.type}</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
                <strong>W-Wert:</strong> ${mehl.wWert}<br>
                <strong>Protein:</strong> ${mehl.protein}<br>
                <strong>Herkunft:</strong> ${mehl.herkunft}
            </div>
            <div>
                <strong>Kategorie:</strong> ${getKategorieName(mehl.wKategorie)}<br>
                <strong>Geeignet für:</strong><br>
                ${mehl.geeignetFuer.map(v => verwendungsTypen[v]).join(', ')}
            </div>
        </div>
        
        <h3 style="color: var(--salamico-red); margin-bottom: 10px;">Eigenschaften</h3>
        <ul style="margin-bottom: 20px;">
            ${mehl.eigenschaften.map(e => `<li style="margin-bottom: 5px;">${e}</li>`).join('')}
        </ul>
        
        <h3 style="color: var(--salamico-red); margin-bottom: 10px;">${mehl.verwendung.title}</h3>
        <p style="line-height: 1.5; margin-bottom: 15px;">${mehl.verwendung.beschreibung}</p>
        
        ${mehl.besonderheiten ? `
            <div style="background: var(--salamico-red-pale); padding: 15px; border-radius: 10px; margin-top: 20px;">
                <strong style="color: var(--salamico-red-dark);">Besonderheit:</strong><br>
                ${mehl.besonderheiten}
            </div>
        ` : ''}
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = modalContent.querySelector('button');
    closeBtn.addEventListener('click', () => document.body.removeChild(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    });
    
    // Track detail view
    if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', 'MehlGuide', 'DetailView', mehl.name]);
    }
}

function getKategorieName(kategorie) {
    const namen = {
        'schwach': 'Schwach (90-160)',
        'mittel': 'Mittel (160-250)',
        'stark': 'Stark (250-320)',
        'sehr-stark': 'Sehr stark (320+)'
    };
    return namen[kategorie] || kategorie;
}

function setupFilters() {
    const searchInput = document.getElementById('search');
    const wFilter = document.getElementById('w-filter');
    const verwendungFilter = document.getElementById('verwendung-filter');
    
    function filterMehle() {
        const searchTerm = searchInput.value.toLowerCase();
        const wKategorie = wFilter.value;
        const verwendung = verwendungFilter.value;
        
        let gefiltert = mehlSorten.filter(mehl => {
            // Search term
            const matchesSearch = !searchTerm || 
                mehl.name.toLowerCase().includes(searchTerm) ||
                mehl.type.toLowerCase().includes(searchTerm) ||
                mehl.herkunft.toLowerCase().includes(searchTerm);
            
            // W-Wert Kategorie
            const matchesW = !wKategorie || mehl.wKategorie === wKategorie;
            
            // Verwendung
            const matchesVerwendung = !verwendung || mehl.geeignetFuer.includes(verwendung);
            
            return matchesSearch && matchesW && matchesVerwendung;
        });
        
        renderMehlKarten(gefiltert);
        
        // Track filter usage
        if (typeof _paq !== 'undefined' && (searchTerm || wKategorie || verwendung)) {
            _paq.push(['trackEvent', 'MehlGuide', 'Filter', `${searchTerm}|${wKategorie}|${verwendung}`]);
        }
    }
    
    searchInput.addEventListener('input', filterMehle);
    wFilter.addEventListener('change', filterMehle);
    verwendungFilter.addEventListener('change', filterMehle);
    
    // Clear filters function
    window.clearFilters = function() {
        searchInput.value = '';
        wFilter.value = '';
        verwendungFilter.value = '';
        renderMehlKarten(mehlSorten);
    };
}

// Sort functions
function sortMehleByWWert() {
    const sortiert = [...mehlSorten].sort((a, b) => {
        const aMin = parseInt(a.wWert.split('-')[0]);
        const bMin = parseInt(b.wWert.split('-')[0]);
        return aMin - bMin;
    });
    renderMehlKarten(sortiert);
    
    if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', 'MehlGuide', 'Sort', 'WWert']);
    }
}

function sortMehleByName() {
    const sortiert = [...mehlSorten].sort((a, b) => a.name.localeCompare(b.name));
    renderMehlKarten(sortiert);
    
    if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', 'MehlGuide', 'Sort', 'Name']);
    }
}

// Search for specific flour types
function findMehlByType(type) {
    const gefunden = mehlSorten.filter(mehl => 
        mehl.geeignetFuer.includes(type)
    );
    renderMehlKarten(gefunden);
}

// Export functions for external use
window.mehlGuide = {
    sortByWWert: sortMehleByWWert,
    sortByName: sortMehleByName,
    findByType: findMehlByType,
    showAll: () => renderMehlKarten(mehlSorten),
    clearFilters: window.clearFilters
};