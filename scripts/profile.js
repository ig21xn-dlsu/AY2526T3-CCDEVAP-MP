(() => {
  // ── Elements ──────────────────────────────────────────────
  const avatarBtn      = document.getElementById('avatar-btn');
  const dropdown       = document.getElementById('dropdown');
  const darkCheckbox   = document.getElementById('dark-mode-checkbox');
  const darkToggle     = document.getElementById('dark-mode-toggle');

  // ── Dark Mode ─────────────────────────────────────────────
  const DARK_KEY = 'padpal_dark_mode';

  function applyDark(on) {
    document.body.classList.toggle('dark', on);
    darkCheckbox.checked = on;
    localStorage.setItem(DARK_KEY, on ? '1' : '0');
  }

  // Restore preference on load
  const saved = localStorage.getItem(DARK_KEY);
  if (saved === '1') applyDark(true);

  // Toggle via the row (but not when clicking the checkbox itself — it fires its own change)
  darkToggle.addEventListener('click', (e) => {
    if (e.target === darkCheckbox) return; // let checkbox handle it
    applyDark(!darkCheckbox.checked);
  });

  darkCheckbox.addEventListener('change', () => {
    applyDark(darkCheckbox.checked);
  });

  // ── Dropdown open / close ─────────────────────────────────
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
    dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  // ── Settings link – pass dark-mode state via URL param ────
  const settingsLink = document.getElementById('settings-link');
  settingsLink.addEventListener('click', () => {
    const dark = document.body.classList.contains('dark');
    settingsLink.href = `profile-modal.html?dark=${dark ? '1' : '0'}`;
  });
})();
