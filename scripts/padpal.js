// Hard Coded Data
// place an image in the imgUrl to show a photo; omit to fall back to colored initials.
const groups = [
  {
    id: 1,
    name: "The Tech House",
    school: "DLSU",
    match: 94,
    desc: "Computer Science majors looking for a 4th housemate. We keep common areas clean and love late-night hackathons.",
    tags: ["Co-ed", "No Pets", "Quiet after 10pm"],
    members: [
      { initials: "AK", color: "#F59E0B", imgUrl: "https://i.pravatar.cc/80?img=47" },
      { initials: "BM", color: "#3B82F6", imgUrl: "https://i.pravatar.cc/80?img=32" },
      { initials: "CL", color: "#EF4444", imgUrl: "https://i.pravatar.cc/80?img=5"  },
      { initials: "DT", color: "#10B981" },
    ],
    tab: "coliving"
  },
  {
    id: 2,
    name: "Creative Collective",
    school: "DLSU-CSB",
    match: 88,
    desc: "Design and architecture students seeking a creative space. We love hosting small gallery nights and movie screenings.",
    tags: ["All Girls", "LGBTQ+ Friendly", "Pet Friendly"],
    members: [
      { initials: "EM", color: "#8B5CF6", imgUrl: "https://i.pravatar.cc/80?img=9"  },
      { initials: "FR", color: "#EC4899", imgUrl: "https://i.pravatar.cc/80?img=20" },
      { initials: "GS", color: "#14B8A6" }
    ],
    tab: "coliving"
  },
  {
    id: 3,
    name: "Downtown Medics",
    school: "UP Manila",
    match: 76,
    desc: "Med students needing a quiet, clean place near the hospital. Very focused during the week, relaxed on weekends.",
    tags: ["Co-ed", "Strictly Quiet", "No Smoking"],
    members: [
      { initials: "JP", color: "#64748B", imgUrl: "https://i.pravatar.cc/80?img=12" },
      { initials: "KQ", color: "#0EA5E9" },
    ],
    tab: "coliving"
  }
];

const MAX_VISIBLE_AVATARS = 2;

// Render Avatar Stack 
function renderAvatarStack(members) {
  const stack = document.createElement('div');
  stack.className = 'avatar-stack';

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
      
      // if image fails to load, fall back to colored initials
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

// Render Cards
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

    // Avatar stack
    const avatars = renderAvatarStack(g.members);

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

    // Viewing Profile Button
    const btn = document.createElement('a');
    btn.className = 'btn-view';
    btn.href = 'padpal-group.html';
    btn.textContent = 'View Group Profile';

    card.append(header, avatars, desc, tags, btn);
    grid.appendChild(card);
  });
}

// Filter Logic
let activeTab   = 'coliving';
let searchQuery = '';

function getFiltered() {
  return groups.filter(g => {
    const matchesTab    = g.tab === activeTab;
    const q             = searchQuery.toLowerCase();
    const matchesSearch = !q
      || g.name.toLowerCase().includes(q)
      || g.school.toLowerCase().includes(q)
      || g.tags.some(t => t.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });
}

function refresh() { renderCards(getFiltered()); }

// Tab Switching (Co-Living and Shared Spaces)
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

// Searching
document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  refresh();
});

// Initialize
refresh();
