// Lifestyle Tag Toggle
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('tag--active');
  });
});

// Spots Needed
const spotsVal = document.getElementById('spots-val');
let spots = 2;

document.getElementById('spots-inc').addEventListener('click', () => {
  if (spots < 10) {
    spots++;
    spotsVal.textContent = spots;
  }
});

document.getElementById('spots-dec').addEventListener('click', () => {
  if (spots > 1) {
    spots--;
    spotsVal.textContent = spots;
  }
});

// Budget Range Slider
(function () {
  const MIN = 12000;
  const MAX = 40000;
  let valMin = 12000;
  let valMax = 15000;

  const track = document.querySelector('.range-track');
  const fill = document.getElementById('range-fill');
  const thumbMin = document.getElementById('thumb-min');
  const thumbMax = document.getElementById('thumb-max');
  const display  = document.getElementById('budget-display');

  function pct(v) {
    return ((v - MIN) / (MAX - MIN)) * 100;
  }

  function render() {
    const pMin = pct(valMin);
    const pMax = pct(valMax);
    fill.style.left = pMin + '%';
    fill.style.width = (pMax - pMin) + '%';
    thumbMin.style.left = pMin + '%';
    thumbMax.style.left = pMax + '%';
    display.textContent = '\u20B1' + valMin.toLocaleString() + ' \u2013 \u20B1' + valMax.toLocaleString();
    thumbMin.setAttribute('aria-valuenow', valMin);
    thumbMax.setAttribute('aria-valuenow', valMax);
  }

  function valueFromX(clientX) {
    const rect  = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round((MIN + ratio * (MAX - MIN)) / 500) * 500;
  }

  function makeDraggable(thumb, isMin) {
    let dragging = false;

    function onMove(e) {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const val = valueFromX(clientX);
      if (isMin) valMin = Math.min(val, valMax - 500);
      else valMax = Math.max(val, valMin + 500);
      render();
    }

    function onUp() {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }

    thumb.addEventListener('mousedown', e => {
      dragging = true;
      e.preventDefault();
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    thumb.addEventListener('touchstart', () => {
      dragging = true;
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }, { passive: true });

    thumb.addEventListener('keydown', e => {
      const step = 500;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        if (isMin) valMin = Math.min(valMin + step, valMax - step);
        else        valMax = Math.min(valMax + step, MAX);
        render();
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        if (isMin) valMin = Math.max(valMin - step, MIN);
        else        valMax = Math.max(valMax - step, valMin + step);
        render();
        e.preventDefault();
      }
    });
  }

  makeDraggable(thumbMin, true);
  makeDraggable(thumbMax, false);
  render();
})();

// Launch, redirects back to padpal.html
document.getElementById('btn-launch').addEventListener('click', () => {
  const nameEl = document.getElementById('group-name');
  const name   = nameEl.value.trim();

  if (!name) {
    nameEl.style.borderColor = '#EF4444';
    nameEl.focus();
    nameEl.addEventListener('input', () => { nameEl.style.borderColor = ''; }, { once: true });
    return;
  }

  // Store created group name
  sessionStorage.setItem('newGroupName', name);

  // Confirmation before redirecting
  const btn = document.getElementById('btn-launch');
  btn.textContent = '✓ Group Created! Redirecting…';
  btn.style.background = '#059669';
  btn.disabled = true;

  setTimeout(() => {
    window.location.href = 'padpal.html';
  }, 1200);
});
