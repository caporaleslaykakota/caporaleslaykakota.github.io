const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

async function getJSON(u) {
    const r = await fetch(u);
    if (!r.ok) throw new Error(u);
    return r.json();
}

const fmtDate = s => new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date(s + 'T12:00:00-05:00'));

function text(id, v) { const e = document.getElementById(id); if (e) e.textContent = v || ''; }
function link(id, v) { const e = document.getElementById(id); if (e && v) e.href = v; }

const svgIcons = {
    calendar: '<svg class="icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
};

const isEvent = type => !type.toLowerCase().includes('ensayo');

function createCardHtml(item) {
    const eventType = isEvent(item.type) ? 'evento' : 'ensayo';
    return `
        <article class="event-card type-${eventType}">
            <div>
                <div class="card-header-row">
                    <div class="card-date-group">${svgIcons.calendar}<span class="card-date">${fmtDate(item.date)}</span></div>
                    <div class="card-time-group">${svgIcons.clock}<span class="card-time">${item.time || 'Por confirmar'}</span></div>
                </div>
                <h3 class="card-title">${item.title}</h3>
                <span class="card-type-tag">${item.type}</span>
                <p class="card-description">${item.description}</p>
            </div>
            <div class="card-footer">${svgIcons.pin}<span>${item.place || 'Por confirmar'}</span></div>
        </article>
    `;
}

function renderSite(s) {
    document.title = s.seo.title;
    $('meta[name=description]').content = s.seo.description;
    text('brandName', s.brand.short);
    ['heroEyebrow', 'heroTitle', 'heroText', 'heroPrimary', 'heroSecondary'].forEach(k => text(k, s.hero[k.replace('hero', '').toLowerCase()]));
    text('aboutKicker', s.about.kicker);
    text('aboutTitle', s.about.title);
    text('aboutIntro', s.about.intro);
    
    const aboutImg = $('#aboutImage');
    if (aboutImg && s.about.image) aboutImg.src = s.about.image;

    text('missionTitle', s.about.missionTitle);
    text('mission', s.about.mission);
    text('visionTitle', s.about.visionTitle);
    text('vision', s.about.vision);
    text('valuesTitle', s.about.valuesTitle);
    $('#values').innerHTML = s.about.values.map(v => `<span class="pill">${v}</span>`).join('');
    
    ['gallery', 'agenda', 'rcc', 'join', 'contact'].forEach(sec => {
        text(sec + 'Kicker', s[sec].kicker);
        text(sec + 'Title', s[sec].title);
        if (s[sec].text) text(sec + 'Text', s[sec].text);
    });
    
    text('rccSubtitle', s.rcc.subtitle);
    const previewImg = $('#rccPreviewImg');
    if (previewImg) previewImg.src = s.rcc.bannerImage || s.rcc.flyer;
    
    const rccBtn = $('#rccCtaBtn');
    if (s.rcc.ticketingActive) {
        rccBtn.textContent = s.rcc.cta;
        rccBtn.style.display = 'inline-flex';
        rccBtn.onclick = () => openSingleImage(s.rcc.flyer, s.rcc.title);
    }

    text('joinButton', s.join.button);
    if (s.join.bgImage) $('#unete').style.setProperty('--join-bg', `url('../${s.join.bgImage.replace('assets/', '')}')`);
    $('#steps').innerHTML = s.join.steps.map(x => `<div class="step"><div class="step-num">${x.n}</div><div><h3>${x.title}</h3><p>${x.text}</p></div></div>`).join('');
    
    text('phone', s.contactData.phone);
    text('email', s.contactData.email);
    text('footerCopy', `${new Date().getFullYear()} · ${s.footer.copy}`);
    
    link('heroJoin', s.links.application);
    link('joinButtonLink', s.links.application);
    link('whatsapp', s.links.whatsapp);
    link('waContact', s.links.whatsapp);
    link('emailLinkText', s.links.email);
    link('instagramLink', s.links.instagram);
    ['facebook', 'tiktok', 'youtube', 'spotify'].forEach(k => link(k, s.links[k]));
    
    const navHtml = s.nav.map(n => `<a href="${n.href}">${n.label}</a>`).join('');
    const lockIconHtml = `<a href="${s.links.intranet}" class="intranet-lock-link" target="_blank" rel="noopener" title="Intranet"><svg class="intranet-lock-icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></a>`;
    $('#nav').innerHTML = navHtml + lockIconHtml;
}

let rawEventsData = [];

function renderEvents(items) {
    rawEventsData = items;
    const now = new Date();
    const upcoming = items
        .filter(e => e.public && new Date(e.date + 'T23:59:59-05:00') >= now)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5);

    const container = $('#events');
    if (upcoming.length) {
        container.innerHTML = upcoming.map(e => `<div class="swiper-slide">${createCardHtml(e)}</div>`).join('');
        new Swiper('.agenda-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            pagination: { el: '.agenda-swiper .swiper-pagination', clickable: true },
            breakpoints: { 640: { slidesPerView: 2, spaceBetween: 16 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }
        });
    } else {
        container.innerHTML = '<p style="color:var(--muted);">No hay actividades públicas programadas.</p>';
    }
}

function renderCalendarModal() {
    const container = $('#calendarsContainer');
    container.innerHTML = '';
    const now = new Date();
    for (let i = 0; i < 2; i++) {
        container.appendChild(createMonthGrid(new Date(now.getFullYear(), now.getMonth() + i, 1)));
    }
    const upcoming = rawEventsData.filter(e => e.public).sort((a, b) => a.date.localeCompare(b.date));
    if (upcoming.length) showCalendarDetails([upcoming[0]]);
}

function createMonthGrid(date) {
    const year = date.getFullYear(), month = date.getMonth();
    const monthName = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(date);
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const wrapper = document.createElement('div');
    wrapper.className = 'calendar-month';
    
    let html = `<h4 class="month-title">${monthName}</h4><div class="calendar-grid">`;
    ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach(d => html += `<div class="day-label">${d}</div>`);
    for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day empty"></div>';

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const matches = rawEventsData.filter(e => e.public && e.date === dateStr);
        let dayClasses = ['calendar-day'];
        if (matches.length > 0) {
            if (matches.some(m => isEvent(m.type))) dayClasses.push('has-event');
            if (matches.some(m => !isEvent(m.type))) dayClasses.push('has-ensayo');
        }
        html += `<div class="${dayClasses.join(' ')}" data-date="${dateStr}">${day}</div>`;
    }

    html += '</div>';
    wrapper.innerHTML = html;
    wrapper.addEventListener('click', e => {
        const dayEl = e.target.closest('.calendar-day[data-date]');
        if (dayEl) {
            const matches = rawEventsData.filter(ev => ev.public && ev.date === dayEl.dataset.date);
            if (matches.length) showCalendarDetails(matches);
        }
    });
    return wrapper;
}

function showCalendarDetails(items) {
    $('#calendarDetailPanel').innerHTML = items.map(createCardHtml).join('');
}

let galleryData, activeYear;

function renderGallery(data) {
    galleryData = data;
    activeYear = data.currentYear;
    $('#galleryIntro').textContent = data.intro;
    $('#years').innerHTML = data.years.map(y => `<button class="year ${y.year === activeYear ? 'active' : ''}" data-year="${y.year}">${y.year}</button>`).join('');
    drawYear();
    
    text('rehearsalTitle', data.rehearsals.title);
    text('rehearsalText', data.rehearsals.text);
    $('#rehearsals').innerHTML = data.rehearsals.images.map(x => `
        <div class="swiper-slide">
            <figure class="rehearsal-card" data-full="${x.src || x.thumb}" data-caption="Ensayo Laykakota">
                <img src="${x.thumb}" alt="Ensayo" loading="lazy">
            </figure>
        </div>
    `).join('');

    new Swiper('.rehearsals-swiper', {
        slidesPerView: 1, spaceBetween: 16, loop: true, grabCursor: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 540: { slidesPerView: 2, spaceBetween: 16 }, 768: { slidesPerView: 3, spaceBetween: 18 }, 1024: { slidesPerView: 5, spaceBetween: 20 } }
    });
}

function drawYear() {
    const y = galleryData.years.find(x => x.year === activeYear);
    $('#experiences').innerHTML = y.experiences.map(e => `
        <article class="experience" data-exp="${e.id}">
            <img src="${e.cover}" alt="${e.title}" loading="lazy">
            <div class="experience-copy">
                <small>${e.month} · ${e.location}</small>
                <h3>${e.title}</h3>
                <span>Ver ${e.images.length} fotografías →</span>
            </div>
        </article>
    `).join('');
}

function openExperience(id) {
    const y = galleryData.years.find(x => x.year === activeYear), e = y.experiences.find(x => x.id === id);
    $('#modalTitle').textContent = e.title;
    $('#modalMeta').textContent = `${e.month} ${e.year} · ${e.location}`;
    $('#modalText').textContent = e.description;
    $('#modalGrid').innerHTML = e.images.map(x => `<a href="${x.src}" target="_blank"><img src="${x.thumb}" alt="${x.alt}" loading="lazy"></a>`).join('');
    $('#galleryModal').classList.add('open');
    document.body.classList.add('no-scroll');
}

function openSingleImage(src, title) {
    $('#modalTitle').textContent = title;
    $('#modalMeta').textContent = 'Ritmo, Color y Candelaria';
    $('#modalText').textContent = '';
    $('#modalGrid').innerHTML = `<a href="${src}" target="_blank" style="grid-column: span 4;"><img src="${src}" alt="${title}" style="max-height: 70vh; object-fit: contain; width: 100%;"></a>`;
    $('#galleryModal').classList.add('open');
    document.body.classList.add('no-scroll');
}

function closeModal() {
    $('#galleryModal').classList.remove('open');
    document.body.classList.remove('no-scroll');
}

(async () => {
    try {
        const [s, e, g] = await Promise.all([getJSON('data/site.json'), getJSON('data/events.json'), getJSON('data/gallery.json')]);
        renderSite(s);
        renderEvents(e);
        renderGallery(g);
    } catch (err) {
        console.error(err);
        document.body.insertAdjacentHTML('afterbegin', '<div class="error">Error cargando JSON. Usa un servidor local.</div>');
    }
})();

$('#menuBtn').addEventListener('click', () => {
    const n = $('#nav');
    n.classList.toggle('open');
    $('#menuBtn').classList.toggle('open');
    $('#menuBtn').setAttribute('aria-expanded', n.classList.contains('open'));
});

$('#years').addEventListener('click', e => {
    if (!e.target.matches('.year')) return;
    activeYear = +e.target.dataset.year;
    $$('.year').forEach(x => x.classList.toggle('active', +x.dataset.year === activeYear));
    drawYear();
});

$('#experiences').addEventListener('click', e => {
    const c = e.target.closest('.experience');
    if (c) openExperience(c.dataset.exp);
});

$('#rehearsals').addEventListener('click', e => {
    const card = e.target.closest('.rehearsal-card');
    if (card) openSingleImage(card.dataset.full, card.dataset.caption);
});

$('#modalClose').addEventListener('click', closeModal);
$('#galleryModal').addEventListener('click', e => { if (e.target.id === 'galleryModal') closeModal(); });

$('#openCalendarModalBtn').addEventListener('click', () => { renderCalendarModal(); $('#calendarModal').classList.add('open'); document.body.classList.add('no-scroll'); });
$('#calendarModalClose').addEventListener('click', () => { $('#calendarModal').classList.remove('open'); document.body.classList.remove('no-scroll'); });
$('#calendarModal').addEventListener('click', e => { if (e.target.id === 'calendarModal') { $('#calendarModal').classList.remove('open'); document.body.classList.remove('no-scroll'); } });

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); $('#calendarModal').classList.remove('open'); document.body.classList.remove('no-scroll'); }
});

document.addEventListener('click', e => {
    if (e.target.matches('#nav a')) { $('#nav').classList.remove('open'); $('#menuBtn').classList.remove('open'); }
});