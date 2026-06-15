// Hardcoded Data
const groups = [
  {
    id: 1,
    name: "The Tech House",
    badge: "Looking for 1 more",
    location: "Taft Ave., Manila",
    heroImg: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
    members: [
      { initials: "AK", color: "#F59E0B", imgUrl: "https://i.pravatar.cc/80?img=47" },
      { initials: "BM", color: "#3B82F6", imgUrl: "https://i.pravatar.cc/80?img=32" },
      { initials: "CL", color: "#EF4444", imgUrl: "https://i.pravatar.cc/80?img=5"  },
      { initials: "DT", color: "#10B981" },
    ],
    vibe: "Computer Science majors who live and breathe code. We host weekly hackathons, keep the space tidy, and respect quiet hours after 10 PM. Looking for a housemate who loves problem-solving as much as we do.",
    tags: ["Hackathon Crew", "Clean Space", "Night Coders"],
    listing: {
      name: "The Loop Residences Studio",
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80",
      meta: "2 beds, 1 bath • Taft Ave., Manila",
      desc: "Modern studio with fast fiber internet, a dedicated desk area, and air-conditioning throughout.",
    },
    preferences: [
      { icon: "clean",  label: "Cleanliness", value: "High – daily tidying" },
      { icon: "noise",  label: "Noise Level",  value: "Quiet after 10 PM" },
      { icon: "social", label: "Social",        value: "Chill – occasional group nights" },
    ],
    budget: "P18k",
    moveIn: "Aug 1",
    lease: "12 mo",
  },
  {
    id: 2,
    name: "Creative Collective",
    badge: "Looking for 1 more",
    location: "Malate, Manila",
    heroImg: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80",
    members: [
      { initials: "EM", color: "#8B5CF6", imgUrl: "https://i.pravatar.cc/80?img=9"  },
      { initials: "FR", color: "#EC4899", imgUrl: "https://i.pravatar.cc/80?img=20" },
      { initials: "GS", color: "#14B8A6", imgUrl: "https://i.pravatar.cc/80?img=25" },
    ],
    vibe: "We're a mix of designers, developers, and writers who love collaborating and sharing ideas. We value a space that feels like a retreat but also sparks creativity. Expect spontaneous living room brainstorming sessions, weekend farmers' market runs, and a generally laid-back, supportive atmosphere.",
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
    lease: "12 mo",
  },
  {
    id: 3,
    name: "Downtown Medics",
    badge: "2 spots open",
    location: "Ermita, Manila",
    heroImg: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
    members: [
      { initials: "JP", color: "#64748B", imgUrl: "https://i.pravatar.cc/80?img=12" },
      { initials: "KQ", color: "#0EA5E9" },
    ],
    vibe: "Focused med students who value silence and cleanliness above all. Weekdays are strictly study mode; weekends we loosen up. Looking for housemates who respect boundaries and are self-sufficient.",
    tags: ["Study First", "No Smoking", "Early to Bed"],
    listing: {
      name: "Manila Doctors Suites",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=80",
      meta: "3 beds, 2 baths • Ermita, Manila",
      desc: "Walking distance to UP-PGH. Quiet building with 24-hour security and backup generator.",
    },
    preferences: [
      { icon: "clean",  label: "Cleanliness", value: "Very high – always clean" },
      { icon: "noise",  label: "Noise Level",  value: "Strictly quiet all week" },
      { icon: "social", label: "Social",        value: "Independent – we coexist" },
    ],
    budget: "P15k",
    moveIn: "Jul 15",
    lease: "6 mo",
  },
];

// Load Group by URL ?id= 
const params  = new URLSearchParams(window.location.search);
const groupId = parseInt(params.get('id'), 10);
const group   = groups.find(g => g.id === groupId) || groups[0];

// Update page title
document.title = `PadPal – ${group.name}`;

// Update modal title dynamically
document.getElementById('modalTitle').textContent = `Apply to Join ${group.name}`;

// Icons
const icons = {
  clean: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  noise: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  social:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

// Hero
function buildHero() {
  document.getElementById('heroImg').src = group.heroImg;
  document.getElementById('heroBadge').textContent = group.badge;
  document.getElementById('heroTitle').textContent = group.name;
  document.getElementById('heroLocation').querySelector('span').textContent = group.location;
}

// Avatar Stack
const MAX_VISIBLE = 3;

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
        av.textContent      = m.initials;
        av.style.color      = '#fff';
      };
      av.appendChild(img);
    } else {
      av.style.background = m.color;
      av.textContent      = m.initials;
      av.style.color      = '#fff';
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

// Vibe
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

// Listings
function buildListing() {
  const l = group.listing;
  document.getElementById('listingImg').src = l.img;
  document.getElementById('listingName').textContent = l.name;
  document.getElementById('listingMeta').querySelector('span').textContent = l.meta;
  document.getElementById('listingDesc').textContent = l.desc;
}

// Preferences
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

// Stats
function buildStats() {
  document.getElementById('statBudget').textContent = group.budget;
  document.getElementById('statMoveIn').textContent = group.moveIn;
  document.getElementById('statLease').textContent  = group.lease;
}

// Modal
const backdrop  = document.getElementById('modalBackdrop');
const formEl    = document.getElementById('applyForm');
const successEl = document.getElementById('modalSuccess');
const footerEl  = document.getElementById('modalFooter');

function openModal() {
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  formEl.style.display    = '';
  successEl.classList.remove('show');
  footerEl.style.display  = '';
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

// form submission shows success state then close
formEl.addEventListener('submit', e => {
  e.preventDefault();

  // basic validation
  const nameField  = document.getElementById('fieldName');
  const emailField = document.getElementById('fieldEmail');
  if (!nameField.value.trim() || !emailField.value.trim()) {
    if (!nameField.value.trim()) nameField.style.borderColor = '#EF4444';
    if (!emailField.value.trim()) emailField.style.borderColor = '#EF4444';
    [nameField, emailField].forEach(f => f.addEventListener('input', () => { f.style.borderColor = ''; }, { once: true }));
    return;
  }

  formEl.style.display  = 'none';
  footerEl.style.display = 'none';

  // update success message with group name
  successEl.querySelector('.success-sub').textContent = `${group.name} will be in touch soon.`;
  successEl.classList.add('show');

  setTimeout(closeModal, 2200);
});

// initialize
buildHero();
buildAvatarStack();
buildVibe();
buildListing();
buildPreferences();
buildStats();
