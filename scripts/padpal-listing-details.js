const state = {
  isSaved: false
};

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    title: params.get('title') || 'Modern Loft near Tech Campus',
    price: params.get('price') || 'PHP 20,000',
    image: params.get('image') || './images/dorm_1.jpg',
    location: params.get('location') || '1204 Innovation Way, District 4',
    distance: params.get('distance') || '',
    vacancy: params.get('vacancy') || '1',
    roommates: params.get('roommates') || '4'
  };
}

function formatDistance(listing) {
  if (listing.distance) {
    return listing.distance;
  }

  const distanceMatch = String(listing.location).match(/(\d+(?:\.\d+)?)\s*(km|kilometers?|m|meters?)/i);
  if (!distanceMatch) {
    return '4.3 km to campus';
  }

  const value = Number(distanceMatch[1]);
  const unit = distanceMatch[2].toLowerCase();

  if (unit.startsWith('k')) {
    return `${value} km to campus`;
  }

  return `${Math.round(value)} meters to campus`;
}

function initializeApp() {
  const listing = getUrlParams();
  loadListingData(listing);
  setupEventListeners();
}

function loadListingData(listing) {
  document.querySelector('.listing-title').textContent = listing.title;

  document.querySelector('.location-info').innerHTML = `
    <span>📍</span>
    <span>${listing.location}</span>
    <span class="distance">${formatDistance(listing)}</span>
  `;

  document.querySelector('.price').textContent = listing.price;

  updateQuickStats(listing);
  document.getElementById('mainImage').src = listing.image;
  document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
    const images = ['./images/dorm_1.jpg', './images/dorm_2.jpg', './images/dorm_3.jpg'];
    thumb.src = images[index] || listing.image;
    thumb.dataset.full = images[index] || listing.image;
  });
}

function updateQuickStats(listing) {
  const statsContainer = document.querySelector('.quick-stats');
  const roommates = parseInt(listing.roommates, 10);

  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon" aria-hidden="true"></div>
      <div class="stat-label">${roommates} Roommates</div>
      <div class="stat-subtext">1 year left</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" aria-hidden="true"></div>
      <div class="stat-label">Co-ed</div>
      <div class="stat-subtext">Inclusive Space</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" aria-hidden="true"></div>
      <div class="stat-label">100 sq ft</div>
      <div class="stat-subtext">Private Room</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" aria-hidden="true"></div>
      <div class="stat-label">12 Months</div>
      <div class="stat-subtext">Lease Term</div>
    </div>
  `;
}

function setupEventListeners() {
  document.querySelector('.back-btn').addEventListener('click', () => {
    window.location.href = './padpal.html';
  });

  document.querySelector('.save-btn').addEventListener('click', (e) => {
    state.isSaved = !state.isSaved;
    if (state.isSaved) {
      e.currentTarget.textContent = 'Saved';
      e.currentTarget.style.background = '#dcfce7';
      e.currentTarget.style.color = '#166534';
    } else {
      e.currentTarget.textContent = 'Save';
      e.currentTarget.removeAttribute('style');
    }
  });

  document.querySelector('.report-btn').addEventListener('click', openReportModal);

  document.querySelector('.send-message-btn').addEventListener('click', () => {
    openMessageModal();
  });

  document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Contact feature coming soon.');
    });
  });

  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      document.getElementById('mainImage').src = e.currentTarget.dataset.full;
    });
  });

  setupReportModal();
  setupMessageModal();
}

function openReportModal() {
  document.getElementById('reportModal').classList.add('active');
}

function closeReportModal() {
  document.getElementById('reportModal').classList.remove('active');
  document.getElementById('reportForm').reset();
}

function setupReportModal() {
  const modal = document.getElementById('reportModal');
  const reportForm = document.getElementById('reportForm');
  const closeBtn = document.querySelector('.modal-close-btn');
  const cancelBtn = document.querySelector('.btn-cancel');
  const descriptionInput = document.getElementById('description');

  descriptionInput.disabled = true;
  descriptionInput.style.opacity = '0.6';

  closeBtn.addEventListener('click', closeReportModal);
  cancelBtn.addEventListener('click', closeReportModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeReportModal();
  });

  document.querySelectorAll('input[name="reason"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const isOther = e.target.value === 'other';
      descriptionInput.disabled = !isOther;
      descriptionInput.style.opacity = isOther ? '1' : '0.6';
    });
  });

  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedReason = document.querySelector('input[name="reason"]:checked');
    const description = descriptionInput.value.trim();

    if (selectedReason && selectedReason.value === 'other' && !description) {
      alert('Please provide details for "Other" reason');
      return;
    }

    console.log('Report submitted:', {
      reason: selectedReason ? selectedReason.value : '',
      description
    });

    alert('Thank you for reporting this listing. Our moderation team will review it shortly.');
    closeReportModal();
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);

function openMessageModal() {
  const modal = document.getElementById('messageModal');
  if (modal) modal.classList.add('active');
}

function closeMessageModal() {
  const modal = document.getElementById('messageModal');
  const form = document.getElementById('messageForm');
  if (modal) modal.classList.remove('active');
  if (form) form.reset();
}

function setupMessageModal() {
  const modal = document.getElementById('messageModal');
  const form = document.getElementById('messageForm');
  const closeBtn = document.querySelector('.modal-close-msg-btn');
  const cancelBtn = document.querySelector('.btn-cancel-msg');

  if (!modal || !form) return;

  closeBtn.addEventListener('click', closeMessageModal);
  cancelBtn.addEventListener('click', closeMessageModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeMessageModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('msgSubject').value.trim();
    const body = document.getElementById('msgBody').value.trim();

    if (!subject || !body) {
      alert('Please fill both subject and message body.');
      return;
    }

    console.log('Message sent:', { subject, body });
    alert('Your message has been sent.');
    closeMessageModal();
  });
}
