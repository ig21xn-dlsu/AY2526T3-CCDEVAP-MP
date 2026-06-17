class AdminNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        /* --- DESKTOP DEFAULT STYLES --- */
        :host { 
            width: 20%; 
            height: 100vh; 
            display: block; 
            flex-shrink: 0; /* Prevents navbar from squishing */
        }

        #admin-navbar {
            width: 100%; 
            height: 100%; 
            display: flex; 
            flex-direction: column;
            padding: 5rem 1.5rem 3rem 1.5rem; 
            border-right: 1px solid #C2C6D8;
            background: #FFF; 
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        #toggle-handle { display: none; } /* Hidden on desktop */

        /* --- MOBILE RESPONSIVE OVERRIDES --- */
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
                background: white; 
                border-top: 1px solid #C2C6D8;
                transform: translateY(85%);
                transition: transform 0.3s ease-in-out;
                box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
            }
            #nav-drawer.open { transform: translateY(0%); }
            
            #toggle-handle {
                display: flex; justify-content: center; padding: 10px; cursor: pointer;
            }
            
            #admin-navbar {
                height: auto; /* Allow nav to wrap contents */
                padding: 1rem;
                flex-direction: row; /* Horizontal icons */
                border-right: none;
            }

            #admin-text, #navbar-settings { display: none; } /* Hide branding/settings on mobile */
            #navbar-options { flex-direction: row; justify-content: space-around; }
            .navbar-option-button { flex-direction: column; width: auto; padding: 4px; }
        }

        /* --- SHARED STYLES --- */
        * { box-sizing: border-box; }
        #admin-text { display: flex; flex-direction: column; gap: 4px; margin-bottom: 3rem; width: 100%; }
        #admin-portal-text { color: #0050CB; font-family: 'Montserrat'; font-size: 24px; font-weight: 600; }
        #padpal-text { color: #424656; font-family: 'Montserrat'; font-size: 14px; font-weight: 500; }

        #navbar-buttons { width: 100%; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        #navbar-options { width: 100%; display: flex; flex-direction: column; gap: 8px; }
        a { width: 100%; text-decoration: none; }
        .navbar-option-button { width: 100%; display: flex; flex-direction: row; align-items: center; padding: 12px 16px; cursor: pointer; gap: 12px; }
        .navbar-option-button-text { color: #424656; font-family: 'Montserrat'; font-size: 14px; font-weight: 500; }
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
                    <a href="admin-dashboard.html"><div class="navbar-option-button"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="#0050CB" /></svg><div class="navbar-option-button-text">Dashboard</div></div></a>
                    <a href="#"><div class="navbar-option-button"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16"><path d="M0 16V13.2... " fill="#424656" /></svg><div class="navbar-option-button-text">Users</div></div></a>
                    <a href="admin-listings.html"><div class="navbar-option-button"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"><path d="M0 19V5H6V3L9 0L12 3V9H18V19H0... " fill="#424656" /></svg><div class="navbar-option-button-text">Listings</div></div></a>
                    <a href="#"><div class="navbar-option-button"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17"><path d="M0 17V0H9L9.4 2H15V12H8L7.6 10H2V17H0... " fill="#424656" /></svg><div class="navbar-option-button-text">Reports</div></div></a>
                </section>
                </section>
        </section>
      </section>
    `;
    
    // Toggle Logic
    const drawer = this.shadowRoot.querySelector('#nav-drawer');
    this.shadowRoot.querySelector('#toggle-handle').addEventListener('click', () => {
        drawer.classList.toggle('open');
        this.shadowRoot.querySelector('#arrow').style.transform = drawer.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  }
}
customElements.define('admin-navbar', AdminNavbar);