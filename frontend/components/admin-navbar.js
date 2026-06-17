class AdminNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { width: 20%; height: 100vh; display: block; }

        /* MOBILE DRAWER STYLES */
        @media (max-width: 768px) {
          :host {
            width: 100%; 
    height: auto; 
    position: fixed; 
    bottom: 0; 
    left: 0; 
    z-index: 1000;
          }
          #nav-drawer {
            background: white; border-top: 1px solid #C2C6D8;
            transform: translateY(85%); /* Hides most, shows handle */
            transition: transform 0.3s ease-in-out;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
          }
          #nav-drawer.open { transform: translateY(0%); }
          #toggle-handle {
            display: flex; justify-content: center; padding: 10px; cursor: pointer;
          }
          #arrow { transition: transform 0.3s ease; }
        }
        
        #toggle-handle { display: none; } /* Hidden on desktop */
        @media (max-width: 768px) { #toggle-handle { display: flex; } }

        /* DESKTOP/GENERAL STYLES */
        * { box-sizing: border-box; }
        
        #admin-navbar {
          width: 100%; height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: 5rem 1.5rem 3rem 1.5rem; border-right: 1px solid #C2C6D8;
          background: #FFF; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        #admin-text { display: flex; flex-direction: column; gap: 4px; margin-bottom: 3rem; width: 100%; }
        #admin-portal-text { color: #0050CB; font-family: 'Montserrat'; font-size: 24px; font-weight: 600; }
        #padpal-text { color: #424656; font-family: 'Montserrat'; font-size: 14px; font-weight: 500; }

        #navbar-buttons { width: 100%; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        #navbar-options { width: 100%; display: flex; flex-direction: column; gap: 8px; }
        a { width: 100%; text-decoration: none; }
        .navbar-option-button { width: 100%; display: flex; flex-direction: row; align-items: center; padding: 12px 16px; cursor: pointer; gap: 12px; }
        .navbar-option-button-text { color: #424656; font-family: 'Montserrat'; font-size: 14px; font-weight: 500; }

        #navbar-settings { display: flex; padding-top: 24px; flex-direction: column; gap: 24px; border-top: 1px solid #C2C6D8; }
        #admin-settings { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        #admin-profile-button { display: flex; flex-direction: row; align-items: center; padding: 8px 16px 0 16px; gap: 12px; }
        #admin-profile-picture-container { width: 32px; height: 32px; background-color: #3498db; border-radius: 50%; }
        #admin-profile-name { color: #424656; font-family: 'Montserrat'; font-size: 14px; font-weight: 500; }
        .red { color: #BA1A1A; }
      </style>

      <section id="nav-drawer">
        <div id="toggle-handle">
            <svg id="arrow" width="20" height="20" viewBox="0 0 20 20"><path d="M5 12l5-5 5 5" fill="none" stroke="#0050CB" stroke-width="2"/></svg>
        </div>
        <section id="admin-navbar">
            <section id="admin-text">
                <div id="admin-portal-text">Admin Portal</div>
                <div id="padpal-text">Padpal</div>
            </section>
            <section id="navbar-buttons">
                <section id="navbar-options">
                    <a href="admin-dashboard.html">
                        <div class="navbar-option-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="#0050CB" /></svg>
                            <div class="navbar-option-button-text">Dashboard</div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="navbar-option-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16"><path d="M0 16V13.2... (your existing path)" fill="#424656" /></svg>
                            <div class="navbar-option-button-text">Users</div>
                        </div>
                    </a>
                    <a href="admin-listings.html">
                        <div class="navbar-option-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"><path d="M0 19V5H6V3L9 0L12 3V9H18V19H0... (your existing path)" fill="#424656" /></svg>
                            <div class="navbar-option-button-text">Listings</div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="navbar-option-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17"><path d="M0 17V0H9L9.4 2H15V12H8L7.6 10H2V17H0... (your existing path)" fill="#424656" /></svg>
                            <div class="navbar-option-button-text">Reports</div>
                        </div>
                    </a>
                </section>
                <section id="navbar-settings">
                    <section id="admin-settings">
                        <div class="navbar-option-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M9 18C6.5... (your existing path)" fill="#424656" /></svg>
                            <div class="navbar-option-button-text">Dark Mode</div>
                        </div>
                        <div class="navbar-option-button" id="settings-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20"><path d="M7.3 20L6.9... (your existing path)" fill="#424656" /></svg>
                            <div class="navbar-option-button-text">Settings</div>
                        </div>
                        <a href="../index.html">
                            <div class="navbar-option-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M2 18C1.45... (your existing path)" fill="#BA1A1A"/> </svg>
                                <div class="navbar-option-button-text red">Log Out</div>
                            </div>
                        </a>
                    </section>
                    <section id="admin-profile">
                        <div id="admin-profile-button">
                            <div id="admin-profile-picture-container"></div>
                            <div id="admin-profile-name">Admin User</div>
                        </div>
                    </section>
                </section>
            </section>
        </section>
      </section>
    `;

    // Toggle Logic
    const drawer = this.shadowRoot.querySelector('#nav-drawer');
    const handle = this.shadowRoot.querySelector('#toggle-handle');
    const arrow = this.shadowRoot.querySelector('#arrow');

    handle.addEventListener('click', () => {
        drawer.classList.toggle('open');
        arrow.style.transform = drawer.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    this.shadowRoot.querySelector('#settings-button').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('open-settings', { bubbles: true, composed: true }));
    });
  }
}

customElements.define('admin-navbar', AdminNavbar);