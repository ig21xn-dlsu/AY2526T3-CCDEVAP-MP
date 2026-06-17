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

const sharedSpaces = [
  {
    id: 101,
    tab: 'shared',
    name: 'Green Residences Condominium',
    school: 'De La Salle University',
    price: 'PHP 20,000',
    address: '200 meters near De La Salle University',
    desc: 'Modern student condo with easy campus access, a comfortable private room, and a clean shared environment.',
    match: 91,
    tags: ['WiFi', 'Furnished', 'Parking'],
    image: './images/dorm_1.jpg',
    vacancy: 1,
    roommates: 4,
    distanceKm: 0.2,
    amenities: ['wifi', 'furnished', 'parking']
  },
  {
    id: 102,
    tab: 'shared',
    name: 'Manila Residences',
    school: 'De La Salle University',
    price: 'PHP 15,000',
    address: '300 meters near De La Salle University',
    desc: 'A practical shared apartment with utility-friendly pricing and a balanced roommate setup.',
    match: 87,
    tags: ['WiFi', 'Laundry', 'Gym'],
    image: './images/dorm_2.jpg',
    vacancy: 1,
    roommates: 3,
    distanceKm: 0.3,
    amenities: ['wifi', 'laundry', 'gym']
  },
  {
    id: 103,
    tab: 'shared',
    name: 'Taft Residences',
    school: 'De La Salle University',
    price: 'PHP 14,500',
    address: '400 meters from De La Salle University',
    desc: 'Compact and convenient shared living for students who want a quick walk to class.',
    match: 84,
    tags: ['WiFi', 'Laundry'],
    image: './images/dorm_3.jpg',
    vacancy: 2,
    roommates: 1,
    distanceKm: 0.4,
    amenities: ['wifi', 'laundry']
  },
  {
    id: 104,
    tab: 'shared',
    name: 'Taft Residences',
    school: 'De La Salle University',
    price: 'PHP 11,000',
    address: '200 meters from De La Salle University',
    desc: 'Budget-friendly shared room with the essentials for a student-focused setup.',
    match: 79,
    tags: ['Furnished', 'Parking'],
    image: './images/dorm_1.jpg',
    vacancy: 1,
    roommates: 4,
    distanceKm: 0.2,
    amenities: ['furnished', 'parking']
  },
  {
    id: 105,
    tab: 'shared',
    name: '2BR Apartment',
    school: 'UP Manila',
    price: 'PHP 13,000',
    address: '500 meters from UP Manila',
    desc: 'Two-bedroom unit with enough space for a small roommate group and daily campus convenience.',
    match: 82,
    tags: ['WiFi', 'Laundry'],
    image: './images/dorm_2.jpg',
    vacancy: 1,
    roommates: 2,
    distanceKm: 0.5,
    amenities: ['wifi', 'laundry']
  },
  {
    id: 106,
    tab: 'shared',
    name: 'Townhouse 2 Storey',
    school: 'De La Salle University',
    price: 'PHP 20,000',
    address: '700 meters from De La Salle University',
    desc: 'Townhouse-style shared space for larger groups who want more room and a quieter neighborhood.',
    match: 78,
    tags: ['WiFi', 'Parking'],
    image: './images/dorm_3.jpg',
    vacancy: 2,
    roommates: 6,
    distanceKm: 0.4,
    amenities: ['wifi', 'parking']
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
        <path d="M22 12a10 10 0 1 1-5.93-9.14"/>
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

    // Button — route to the appropriate detail page for each tab
    const btn = document.createElement('a');
    btn.className   = 'btn-view';
    btn.textContent = g.tab === 'coliving' ? 'View Group Profile' : 'View Listing';

    if (g.tab === 'coliving') {
      // Pass group id via query string so group page can load the right data
      btn.href = `padpal-group.html?id=${g.id}`;
    } else {
      const query = new URLSearchParams({
        title: g.name,
        price: g.price,
        image: g.image,
        location: g.address,
        vacancy: String(g.vacancy || 1),
        roommates: String(g.roommates || 3)
      });
      btn.href = `padpal-listing-details.html?${query.toString()}`;
    }

    card.append(desc, tags, btn);
    grid.appendChild(card);
  });
}

// ── FILTER STATE ─────────────────────────────────────────────────────────────

let activeTab = 'coliving';

function renderTabControls() {
  const tabControls = document.getElementById('tabControls');
  if (!tabControls) return;

  if (activeTab === 'coliving') {
    tabControls.innerHTML = `
      <div class="search-row">
        <div class="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input id="searchInput" class="search-input" type="text" placeholder="Search universities, majors, or keywords…" />
        </div>

        <select class="filter-select" id="campusFilter">
            <option value="">Any Campus</option>
            <option value="De La Salle University">De La Salle University</option>
            <option value="DLSU-CSB">DLSU-CSB</option>
            <option value="UP Manila">UP Manila</option>
        </select>

        <select class="filter-select" id="genderFilter">
            <option value="">Gender: Any</option>
            <option value="Co-ed">Co-ed</option>
            <option value="All Girls">All Girls</option>
        </select>

        <select class="filter-select" id="budgetFilter">
            <option value="">Budget: Any</option>
            <option value="10000">Below ₱10,000</option>
            <option value="15000">Below ₱15,000</option>
            <option value="20000">Below ₱20,000</option>
        </select>
      </div>
    `;
    return;
  }

  tabControls.innerHTML = `
    <div class="shared-filters">
      <div class="shared-filters-grid">
        <div class="search-wrap shared-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input id="sharedSearchInput" class="search-input" type="text" placeholder="Search listings, locations, or amenities…" />
        </div>

        <div class="shared-labeled-field">
          <label for="sharedCampusInput">Campus / Area</label>
          <input id="sharedCampusInput" class="shared-field" type="text" placeholder="De La Salle University" />
        </div>

        <div class="shared-range-field">
          <label for="sharedDistanceSlider">Max Distance</label>
          <input id="sharedDistanceSlider" type="range" min="0" max="10" value="2.5" />
          <span id="sharedDistanceValue">2.5 km</span>
        </div>

        <div class="shared-price-row">
          <div class="shared-labeled-field">
            <label for="sharedMinPrice">Min Price</label>
            <input id="sharedMinPrice" class="shared-field shared-price" type="number" placeholder="10000" value="10000" />
          </div>

          <div class="shared-labeled-field">
            <label for="sharedMaxPrice">Max Price</label>
            <input id="sharedMaxPrice" class="shared-field shared-price" type="number" placeholder="20000" value="20000" />
          </div>
        </div>

        <div class="shared-option-group" id="sharedOccupancyGroup">
          <span class="shared-group-label">Occupancy</span>
          <label class="shared-option"><input type="checkbox" value="1-person"><span>1 Person (Private)</span></label>
          <label class="shared-option"><input type="checkbox" value="2-3-people" checked><span>2-3 People (I shared)</span></label>
          <label class="shared-option"><input type="checkbox" value="4-plus"><span>4+ People</span></label>
        </div>

        <div class="shared-option-group" id="sharedAmenitiesGroup">
          <span class="shared-group-label">Must Have Amenities</span>
          <label class="shared-option"><input type="checkbox" value="laundry"><span>Laundry</span></label>
          <label class="shared-option"><input type="checkbox" value="furnished"><span>Furnished</span></label>
          <label class="shared-option"><input type="checkbox" value="wifi"><span>Wi-Fi</span></label>
          <label class="shared-option"><input type="checkbox" value="gym"><span>Gym</span></label>
          <label class="shared-option"><input type="checkbox" value="parking"><span>Parking</span></label>
        </div>
      </div>

      <div class="shared-filter-actions">
        <button type="button" class="btn-your-group shared-apply-btn" id="sharedApplyFilters">Apply Filters</button>
        <button type="button" class="shared-reset-btn" id="sharedResetFilters">Reset</button>
      </div>
    </div>
  `;
}

function bindTabControlEvents() {
  const tabControls = document.getElementById('tabControls');
  if (!tabControls) return;

  if (activeTab === 'coliving') {
    const searchInput = document.getElementById('searchInput');
    const campusFilter = document.getElementById('campusFilter');
    const genderFilter = document.getElementById('genderFilter');
    const budgetFilter = document.getElementById('budgetFilter');

    [searchInput, campusFilter, genderFilter, budgetFilter].forEach(control => {
      if (!control) return;
      control.addEventListener(control.tagName === 'SELECT' ? 'change' : 'input', refresh);
    });
    return;
  }

  const sharedSearchInput = document.getElementById('sharedSearchInput');
  const sharedCampusInput = document.getElementById('sharedCampusInput');
  const sharedDistanceSlider = document.getElementById('sharedDistanceSlider');
  const sharedDistanceValue = document.getElementById('sharedDistanceValue');
  const sharedMinPrice = document.getElementById('sharedMinPrice');
  const sharedMaxPrice = document.getElementById('sharedMaxPrice');
  const sharedApplyFilters = document.getElementById('sharedApplyFilters');
  const sharedResetFilters = document.getElementById('sharedResetFilters');

  if (sharedDistanceSlider && sharedDistanceValue) {
    sharedDistanceSlider.addEventListener('input', e => {
      sharedDistanceValue.textContent = `${e.target.value} km`;
    });
  }

  [sharedSearchInput, sharedCampusInput, sharedMinPrice, sharedMaxPrice].forEach(control => {
    if (!control) return;
    control.addEventListener('input', refresh);
  });

  [sharedDistanceSlider, ...document.querySelectorAll('#sharedOccupancyGroup input[type="checkbox"], #sharedAmenitiesGroup input[type="checkbox"]')]
    .forEach(control => {
      if (!control) return;
      control.addEventListener(control.type === 'checkbox' ? 'change' : 'input', refresh);
    });

  if (sharedApplyFilters) {
    sharedApplyFilters.addEventListener('click', refresh);
  }

  if (sharedResetFilters) {
    sharedResetFilters.addEventListener('click', () => {
      if (sharedSearchInput) sharedSearchInput.value = '';
      if (sharedCampusInput) sharedCampusInput.value = '';
      if (sharedDistanceSlider) sharedDistanceSlider.value = 2.5;
      if (sharedDistanceValue) sharedDistanceValue.textContent = '2.5 km';
      if (sharedMinPrice) sharedMinPrice.value = 10000;
      if (sharedMaxPrice) sharedMaxPrice.value = 20000;
      document.querySelectorAll('#sharedOccupancyGroup input[type="checkbox"]').forEach((cb, index) => {
        cb.checked = index === 1;
      });
      document.querySelectorAll('#sharedAmenitiesGroup input[type="checkbox"]').forEach(cb => cb.checked = false);
      refresh();
    });
  }
}

function getFiltered() {
  if (activeTab === 'shared') {
    const searchQuery = (document.getElementById('sharedSearchInput')?.value || '').trim().toLowerCase();
    const campusQuery = (document.getElementById('sharedCampusInput')?.value || '').trim().toLowerCase();
    const maxDistance = parseFloat(document.getElementById('sharedDistanceSlider')?.value || '10');
    const minPrice = parseFloat(document.getElementById('sharedMinPrice')?.value || '0');
    const maxPrice = parseFloat(document.getElementById('sharedMaxPrice')?.value || 'Infinity');

    const occupancyChecks = document.querySelectorAll('#sharedOccupancyGroup input[type="checkbox"]') || [];
    const amenitiesChecks = document.querySelectorAll('#sharedAmenitiesGroup input[type="checkbox"]') || [];

    const selectedOccupancies = Array.from(occupancyChecks).filter(cb => cb.checked).map(cb => cb.value);
    const selectedAmenities = Array.from(amenitiesChecks).filter(cb => cb.checked).map(cb => cb.value);

    return sharedSpaces.filter(listing => {
      const matchesSearch = !searchQuery || [listing.name, listing.address, listing.desc, listing.tags.join(' ')]
        .filter(Boolean)
        .some(text => text.toLowerCase().includes(searchQuery));

      const normalize = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
      const normCampus = normalize(campusQuery);
      const matchesCampus = !campusQuery || [listing.school, listing.address, listing.name]
        .filter(Boolean)
        .some(text => normalize(text).includes(normCampus));

      const matchesDistance = typeof listing.distanceKm === 'number' ? listing.distanceKm <= maxDistance : true;
      const numericPrice = parseFloat(String(listing.price).replace(/[^\d.]/g, ''));
      const matchesPrice = numericPrice >= minPrice && numericPrice <= maxPrice;

      const occupancyBand = listing.roommates <= 1 ? '1-person' : listing.roommates <= 3 ? '2-3-people' : '4-plus';
      const matchesOccupancy = selectedOccupancies.length === 0 || selectedOccupancies.includes(occupancyBand);
      const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => listing.amenities.includes(amenity));

      return matchesSearch && matchesCampus && matchesDistance && matchesPrice && matchesOccupancy && matchesAmenities;
    });
  }

  const searchQuery = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const campusFilter = document.getElementById('campusFilter')?.value || '';
  const genderFilter = document.getElementById('genderFilter')?.value || '';
  const budgetFilter = Number(document.getElementById('budgetFilter')?.value || '0');

  return groups.filter(g => {
    const matchesTab = g.tab === activeTab;

    const matchesSearch =
      !searchQuery ||
      g.name.toLowerCase().includes(searchQuery) ||
      g.school.toLowerCase().includes(searchQuery) ||
      g.tags.some(t => t.toLowerCase().includes(searchQuery));

    const matchesCampus = !campusFilter || g.school === campusFilter;
    const matchesGender = !genderFilter || g.tags.includes(genderFilter);
    const matchesBudget = !budgetFilter || Number(g.budget) <= budgetFilter;

    return matchesTab && matchesSearch && matchesCampus && matchesGender && matchesBudget;
  });
}

function refresh() {
  renderCards(getFiltered());
}

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
    renderTabControls();
    bindTabControlEvents();
    refresh();
  });
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

renderTabControls();
bindTabControlEvents();
refresh();
