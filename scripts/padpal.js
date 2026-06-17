// ── DATA ─────────────────────────────────────────────────────────────────────

const groups = [
  {
    id: 1,
    name: "The Tech House",
    school: "De La Salle University",
    budget: "18000",
    match: 94,
    desc: "Computer Science majors looking for a 4th housemate. We keep common areas clean and love late-night hackathons.",
    tags: ["Co-ed", "No Pets", "Quiet after 10pm"],
    members: [
      { initials: "AK", color: "#F59E0B", imgUrl: "https://i.pravatar.cc/80?img=47" },
      { initials: "BM", color: "#3B82F6", imgUrl: "https://i.pravatar.cc/80?img=32" },
      { initials: "CL", color: "#EF4444", imgUrl: "https://i.pravatar.cc/80?img=5"  },
      { initials: "DT", color: "#10B981" },
    ],
    tab: "coliving",
    // data passed to group profile page
    badge: "Looking for 1 more",
    location: "Taft Ave., Manila",
    heroImg: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
    vibe: "Computer Science majors who live and breathe code. We host weekly hackathons, keep the space tidy, and respect quiet hours after 10 PM. Looking for a housemate who loves problem-solving as much as we do.",
    vibeTags: ["Hackathon Crew", "Clean Space", "Night Coders"],
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
    moveIn: "Aug 1",
    lease: "12 mo",
  },
  {
    id: 2,
    name: "Creative Collective",
    school: "DLSU-CSB",
    budget: "30000",
    match: 88,
    desc: "Design and architecture students seeking a creative space. We love hosting small gallery nights and movie screenings.",
    tags: ["All Girls", "LGBTQ+ Friendly", "Pet Friendly"],
    members: [
      { initials: "EM", color: "#8B5CF6", imgUrl: "https://i.pravatar.cc/80?img=9"  },
      { initials: "FR", color: "#EC4899", imgUrl: "https://i.pravatar.cc/80?img=20" },
      { initials: "GS", color: "#14B8A6" }
    ],
    tab: "coliving",
    badge: "Looking for 1 more",
    location: "Malate, Manila",
    heroImg: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80",
    vibe: "We're a mix of designers, developers, and writers who love collaborating and sharing ideas. We value a space that feels like a retreat but also sparks creativity. Expect spontaneous living room brainstorming sessions, weekend farmers' market runs, and a generally laid-back, supportive atmosphere.",
    vibeTags: ["Art & Design", "Coffee Enthusiasts", "Plant Parents"],
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
    moveIn: "Sep 1",
    lease: "12 mo",
  },
  {
    id: 3,
    name: "Downtown Medics",
    school: "UP Manila",
    budget: "15000",
    match: 76,
    desc: "Med students needing a quiet, clean place near the hospital. Very focused during the week, relaxed on weekends.",
    tags: ["Co-ed", "Strictly Quiet", "No Smoking"],
    members: [
      { initials: "JP", color: "#64748B", imgUrl: "https://i.pravatar.cc/80?img=12" },
      { initials: "KQ", color: "#0EA5E9" },
    ],
    tab: "coliving",
    badge: "2 spots open",
    location: "Ermita, Manila",
    heroImg: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
    vibe: "Focused med students who value silence and cleanliness above all. Weekdays are strictly study mode; weekends we loosen up. Looking for housemates who respect boundaries and are self-sufficient.",
    vibeTags: ["Study First", "No Smoking", "Early to Bed"],
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
    moveIn: "Jul 15",
    lease: "6 mo",
  }
];

const allData = [...groups];

const MAX_VISIBLE_AVATARS = 2;

// ── AVATAR STACK ─────────────────────────────────────────────────────────────

function renderAvatarStack(members) {
  const stack = document.createElement('div');
  stack.className = 'avatar-stack';

  if (!members || !members.length) return stack;

  const visible  = members.slice(0, MAX_VISIBLE_AVATARS);
  const overflow = members.length - MAX_VISIBLE_AVATARS;

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

  return stack;
}

// ── RENDER CARDS ─────────────────────────────────────────────────────────────

function renderCards(data) {
  const grid  = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');
  grid.innerHTML = '';

  if (!data.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  data.forEach(g => {
    const card = document.createElement('div');
    card.className = 'card';

    // Header
    const header = document.createElement('div');
    header.className = 'card-header';

    const titleBlock = document.createElement('div');
    titleBlock.className = 'card-title-block';

    const name = document.createElement('div');
    name.className   = 'card-name';
    name.textContent = g.name;

    const school = document.createElement('div');
    school.className = 'card-school';
    school.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>${g.school}`;

    titleBlock.append(name, school);

    const badge = document.createElement('div');
    badge.className = 'match-badge';
    badge.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>${g.match}% Match`;

    header.append(titleBlock, badge);

    // Shared space price OR avatar stack
    if (g.tab === 'shared' && g.price) {
      const priceRow = document.createElement('div');
      priceRow.innerHTML = `<div class="space-price">${g.price}</div><div class="space-addr">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${g.address}</div>`;
      card.append(header, priceRow);
    } else {
      const avatars = renderAvatarStack(g.members);
      card.append(header, avatars);
    }

    // Description
    const desc = document.createElement('p');
    desc.className   = 'card-desc';
    desc.textContent = g.desc;

    // Tags
    const tags = document.createElement('div');
    tags.className = 'card-tags';
    g.tags.forEach(t => {
      const pill = document.createElement('span');
      pill.className   = 'tag';
      pill.textContent = t;
      tags.appendChild(pill);
    });

    // Button — only co-living groups link to group profile
    const btn = document.createElement('a');
    btn.className   = 'btn-view';
    btn.textContent = g.tab === 'coliving' ? 'View Group Profile' : 'View Listing';

    if (g.tab === 'coliving') {
      // Pass group id via query string so group page can load the right data
      btn.href = `padpal-group.html?id=${g.id}`;
    } else {
      btn.href = '#';
      btn.addEventListener('click', e => {
        e.preventDefault();
        alert(`Listing details for "${g.name}" coming soon.`);
      });
    }

    card.append(desc, tags, btn);
    grid.appendChild(card);
  });
}

// ── FILTER STATE ─────────────────────────────────────────────────────────────

let activeTab = 'coliving';
let searchQuery = '';
let campusFilter = '';
let genderFilter = '';
let budgetFilter = '';

function getFiltered() {
    return groups.filter(g => {

        const matchesTab = g.tab === activeTab;

        const q = searchQuery.toLowerCase();

        const matchesSearch =
            !q ||
            g.name.toLowerCase().includes(q) ||
            g.school.toLowerCase().includes(q) ||
            g.tags.some(t => t.toLowerCase().includes(q));

        const matchesCampus =
            !campusFilter ||
            g.school === campusFilter;

        const matchesGender =
            !genderFilter ||
            g.tags.includes(genderFilter);

        const matchesBudget =
            !budgetFilter ||
            g.budget <= budgetFilter;

            console.log(
    g.name,
    g.budget,
    budgetFilter
);

        return (
            matchesTab &&
            matchesSearch &&
            matchesCampus &&
            matchesGender &&
            matchesBudget
        );
    });
}

function refresh() { renderCards(getFiltered()); }

// ── TABS ─────────────────────────────────────────────────────────────────────

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeTab = btn.dataset.tab;
    refresh();
  });
});

// ── SEARCH ───────────────────────────────────────────────────────────────────

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  refresh();
});

document.getElementById('campusFilter')
.addEventListener('change', e => {
    campusFilter = e.target.value;
    refresh();
});

document.getElementById('genderFilter')
.addEventListener('change', e => {
    genderFilter = e.target.value;
    refresh();
});

document.getElementById('budgetFilter')
.addEventListener('change', e => {
    budgetFilter = Number(e.target.value);
    refresh();
});

// ── NAV: YOUR GROUP button goes to group page (first coliving group as placeholder) ─

document.querySelector('.btn-your-group').addEventListener('click', () => {
  window.location.href = 'padpal-group.html?id=2';
});

// Avatar Dropdown

const avatarBtn = document.getElementById('avatar-btn');
const dropdown = document.getElementById('dropdown');

if (avatarBtn && dropdown) {

  function openDropdown() {
    dropdown.classList.add('open');
    dropdown.setAttribute('aria-hidden', 'false');
  }

  function closeDropdown() {
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-hidden', 'true');
  }

  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    dropdown.classList.contains('open')
      ? closeDropdown()
      : openDropdown();
  });

  document.addEventListener('click', (e) => {
    if (
      !dropdown.contains(e.target) &&
      !avatarBtn.contains(e.target)
    ) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });
}

// ── INIT ─────────────────────────────────────────────────────────────────────

refresh();
