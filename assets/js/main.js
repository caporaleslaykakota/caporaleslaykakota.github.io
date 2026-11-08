const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

async function getJSON(u) {
    const r = await fetch(u);
    if (!r.ok) throw new Error(u);
    return r.json();
}

const fmtDate = s => new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date(s + 'T12:00:00-05:00'));

function text(id, v) {
    const e = document.getElementById(id);
    if (e) e.textContent = v || '';
}

function link(id, v) {
    const e = document.getElementById(id);
    if (e && v) e.href = v;
}

function renderSite(s) {
    document.title = s.seo.title;
    $('meta[name=description]').content = s.seo.description;
    text('brandName', s.brand.short);
    ['heroEyebrow', 'heroTitle', 'heroText', 'heroPrimary', 'heroSecondary'].forEach(k => text(k, s.hero[k.replace('hero', '').replace(/^./, c => c.toLowerCase())]));
    text('aboutKicker', s.about.kicker);
    text('aboutTitle', s.about.title);
    text('aboutIntro', s.about.intro);
    text('missionTitle', s.about.missionTitle);
    text('mission', s.about.mission);
    text('visionTitle', s.about.visionTitle);
    text('vision', s.about.vision);
    text('valuesTitle', s.about.valuesTitle);
    $('#values').innerHTML = s.about.values.map(v => `<span class="pill">${v}</span>`).join('');
    text('galleryKicker', s.gallery.kicker);
    text('galleryTitle', s.gallery.title);
    text('galleryText', s.gallery.text);
    text('agendaKicker', s.agenda.kicker);
    text('agendaTitle', s.agenda.title);
    text('agendaText', s.agenda.text);
    text('rccKicker', s.rcc.kicker);
    text('rccTitle', s.rcc.title);
    text('rccText', s.rcc.text);
    text('rccCta', s.rcc.cta);
    text('joinKicker', s.join.kicker);
    text('joinTitle', s.join.title);
    text('joinText', s.join.text);
    text('joinButton', s.join.button);
    $('#steps').innerHTML = s.join.steps.map(x => `<div class="step"><div class="step-num">${x.n}</div><div><h3>${x.title}</h3><p>${x.text}</p></div></div>`).join('');
    text('contactKicker', s.contact.kicker);
    text('contactTitle', s.contact.title);
    text('contactText', s.contact.text);
    text('phone', s.contactData.phone);
    text('email', s.contactData.email);
    text('instagramHandle', s.contactData.instagram);
    text('footerCopy', `${new Date().getFullYear()} · ${s.footer.copy}`);
    text('intranetLabel', s.footer.intranet);
    link('heroJoin', s.links.application);
    link('joinButtonLink', s.links.application);
    link('whatsapp', s.links.whatsapp);
    link('waContact', s.links.whatsapp);
    link('emailLink', s.links.email);
    link('intranet', s.links.intranet);
    link('instagramLink', s.links.instagram);
    ['facebook', 'tiktok', 'youtube', 'spotify'].forEach(k => link(k, s.links[k]));
    $('#nav').innerHTML = s.nav.map(n => `<a href="${n.href}">${n.label}</a>`).join('');
}

function renderEvents(items) {
    const now = new Date();
    const a = items.filter(e => e.public && new Date(e.date + 'T23:59:59-05:00') >= now).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
    $('#events').innerHTML = a.length ? a.map(e => `<article class="event"><div class="type">${e.type}</div><div class="date">${fmtDate(e.date)} · ${e.time || 'Por confirmar'}</div><h3>${e.title}</h3><p>${e.description}</p><strong>${e.place || ''}</strong></article>`).join('') : '<p>No hay actividades públicas programadas.</p>';
}

let galleryData, activeYear;

function renderGallery(data) {
    galleryData = data;
    activeYear = data.currentYear;
    $('#galleryIntro').textContent = data.intro;
    $('#years').innerHTML = data.years.map(y => `<button class="year ${y.year === activeYear ? 'active' : ''}" data-year="${y.year}">${y.year}</button>`).join('');
    drawYear();
    $('#rehearsalTitle').textContent = data.rehearsals.title;
    $('#rehearsalText').textContent = data.rehearsals.text;
    
    // Inyectar slides con formato requerido por Swiper.js
    $('#rehearsals').innerHTML = data.rehearsals.images.map(x => `
        <div class="swiper-slide">
            <figure class="rehearsal-card" data-full="${x.src || x.thumb}" data-caption="${x.caption || x.alt}">
                <img src="${x.thumb}" alt="${x.alt}" loading="lazy">
                <figcaption>${x.caption || (x.month ? x.month + ' ' + x.year : x.alt)}</figcaption>
            </figure>
        </div>
    `).join('');

    // Inicializar el motor dinámico de Swiper táctil
    new Swiper('.rehearsals-swiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            540: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 18 },
            1024: { slidesPerView: 5, spaceBetween: 20 }
        }
    });
}

function drawYear() {
    const y = galleryData.years.find(x => x.year === activeYear);
    $('#experiences').innerHTML = y.experiences.map((e, i) => `<article class="experience" data-exp="${e.id}"><img src="${e.cover}" alt="${e.title}" loading="lazy"><div class="experience-copy"><small>${e.month} · ${e.location}</small><h3>${e.title}</h3><span>Ver ${e.images.length} fotografías →</span></div></article>`).join('');
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
    $('#modalMeta').textContent = 'Ensayos Laykakota';
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
        document.body.insertAdjacentHTML('afterbegin', '<div class="error">Error cargando JSON. Usa un servidor local; consulta README.md.</div>');
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
    if (card) {
        openSingleImage(card.dataset.full, card.dataset.caption);
    }
});

$('#modalClose').addEventListener('click', closeModal);
$('#galleryModal').addEventListener('click', e => {
    if (e.target.id === 'galleryModal') closeModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

document.addEventListener('click', e => {
    if (e.target.matches('#nav a')) {
        $('#nav').classList.remove('open');
        $('#menuBtn').classList.remove('open');
    }
});