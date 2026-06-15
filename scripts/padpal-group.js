// ── DATA ──────────────────────────────────────────────────────────────────────
const group = {
  name: "The Creative Collective",
  badge: "Looking for 1 more",
  location: "Malate, Manila",
  heroImg: "rsquare.jpg",
  members: [
    { initials: "EM", color: "#8B5CF6", imgUrl: "https://i.pravatar.cc/80?img=9"  },
    { initials: "FR", color: "#EC4899", imgUrl: "https://i.pravatar.cc/80?img=20" },
    { initials: "GS", color: "#14B8A6", imgUrl: "https://i.pravatar.cc/80?img=25" }

  ],
  vibe: "We're a mix of designers, developers, and writers who love collaborating and sharing ideas. We value a space that feels like a retreat but also sparks creativity. Expect spontaneous living room brainstorming sessions, weekend farmers' market runs, and a generally laid-back, supportive atmosphere. We keep common areas tidy but aren't strictly regimented.",
  tags: ["Art & Design", "Coffee Enthusiasts", "Plant Parents"],
  listing: {
    name: "R Square Residences Loft",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80",
    meta: "2 Bunk beds, 1 bath • P. Ocampo St., Malate, Manila",
    desc: "A stunning industrial loft with massive windows and a great open kitchen area. Perfect for our collective setup.",
  },
  preferences: [
    { icon: "clean",  label: "Cleanliness", value: "Moderate – weekly chores" },
    { icon: "noise",  label: "Noise Level",  value: "Quiet after 11 PM" },
    { icon: "social", label: "Social",        value: "Friendly, occasional guests" },
  ],
  budget: "P30k",
  moveIn: "Sep 1",
  lease:  "12 mo",
};

const MAX_VISIBLE = 3;

// ── ICONS ─────────────────────────────────────────────────────────────────────
const icons = {
  clean: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  noise: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  social:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

// ── HERO ──────────────────────────────────────────────────────────────────────
function buildHero() {
  document.getElementById('heroImg').src      = group.heroImg;
  document.getElementById('heroBadge').textContent = group.badge;
  document.getElementById('heroTitle').textContent = group.name;
  document.getElementById('heroLocation').querySelector('span').textContent = group.location;
}

// ── AVATAR STACK ──────────────────────────────────────────────────────────────
function buildAvatarStack() {
  const stack    = document.getElementById('avatarStack');
  const visible  = group.members.slice(0, MAX_VISIBLE);
  const overflow = group.members.length - MAX_VISIBLE;

  visible.forEach(m => {
    const av = document.createElement('div');
    av.className = 'av';
    if (m.imgUrl) {
      const img = document.createElement('img');
      img.src     = m.imgUrl;
      img.alt     = m.initials;
      img.loading = 'lazy';
      img.onerror = () => {
        av.removeChild(img);
        av.style.background = m.color;
        av.textContent = m.initials;
        av.style.color = '#fff';
      };
      av.appendChild(img);
    } else {
      av.style.background = m.color;
      av.textContent = m.initials;
      av.style.color = '#fff';
    }
    stack.appendChild(av);
  });

  if (overflow > 0) {
    const ov = document.createElement('div');
    ov.className   = 'av av-overflow';
    ov.textContent = `+${overflow}`;
    stack.appendChild(ov);
  }
}

// ── VIBE ──────────────────────────────────────────────────────────────────────
function buildVibe() {
  document.getElementById('vibeDesc').textContent = group.vibe;

  const tagsEl = document.getElementById('vibeTags');
  group.tags.forEach(t => {
    const pill = document.createElement('span');
    pill.className   = 'tag';
    pill.textContent = t;
    tagsEl.appendChild(pill);
  });
}

// ── LISTING ───────────────────────────────────────────────────────────────────
function buildListing() {
  const l = group.listing;
  document.getElementById('listingImg').src          = l.img;
  document.getElementById('listingName').textContent = l.name;
  document.getElementById('listingMeta').querySelector('span').textContent = l.meta;
  document.getElementById('listingDesc').textContent = l.desc;
}

// ── PREFERENCES ───────────────────────────────────────────────────────────────
function buildPreferences() {
  const list = document.getElementById('prefList');
  group.preferences.forEach(p => {
    const item = document.createElement('div');
    item.className = 'pref-item';
    item.innerHTML = `
      <div class="pref-icon">${icons[p.icon]}</div>
      <div>
        <div class="pref-label">${p.label}</div>
        <div class="pref-value">${p.value}</div>
      </div>`;
    list.appendChild(item);
  });
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function buildStats() {
  document.getElementById('statBudget').textContent = group.budget;
  document.getElementById('statMoveIn').textContent = group.moveIn;
  document.getElementById('statLease').textContent  = group.lease;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
const backdrop = document.getElementById('modalBackdrop');
const formEl   = document.getElementById('applyForm');
const successEl= document.getElementById('modalSuccess');

function openModal() {
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  formEl.style.display    = '';
  successEl.classList.remove('show');
  document.getElementById('modalFooter').style.display = '';
  formEl.reset();
}

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('btnApplyHero').addEventListener('click', openModal);
document.getElementById('btnClose').addEventListener('click', closeModal);
document.getElementById('btnCancel').addEventListener('click', closeModal);

backdrop.addEventListener('click', e => {
  if (e.target === backdrop) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Submit
formEl.addEventListener('submit', e => {
  e.preventDefault();
  formEl.style.display = 'none';
  document.getElementById('modalFooter').style.display = 'none';
  successEl.classList.add('show');
  setTimeout(closeModal, 2200);
});

// ── INIT ──────────────────────────────────────────────────────────────────────
buildHero();
buildAvatarStack();
buildVibe();
buildListing();
buildPreferences();
buildStats();
