class AdminNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      
    <style>
    * { box-sizing: border-box; }
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

        #nav-drawer {
        height: 100%; /* ← ADD THIS */
        }

        #navbar-settings {
          display: flex;
          padding-top: 24px;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;
          border-top: 1px solid #C2C6D8;
        }

        #admin-settings {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
          height: auto;
        }

        #admin-profile-button {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          padding: 8px 16px 0 16px;
          gap: 12px;
          align-self: stretch;
          width: 100%;
        }

        #admin-profile-picture-container {
          width: 32px;
          height: 32px;
          background-color: #3498db;
          border-radius: 50%;
        }

        #admin-profile-name {
          color: #424656;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: 0.14px;
        }

        .red {
          color: #BA1A1A;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 20px; /* 142.857% */
          letter-spacing: 0.14px;
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

            #admin-text { display: none; } /* Hide branding/settings on mobile */
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
                <section id="navbar-settings">
                <section id="admin-settings">
                    <div class="navbar-option-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 18C6.5 18 4.375 17.125 2.625 15.375C0.875 13.625 0 11.5 0 9C0 6.5 0.875 4.375 2.625 2.625C4.375 0.875 6.5 0 9 0C9.23333 0 9.4625 0.00833333 9.6875 0.025C9.9125 0.0416667 10.1333 0.0666667 10.35 0.1C9.66667 0.583333 9.12083 1.2125 8.7125 1.9875C8.30417 2.7625 8.1 3.6 8.1 4.5C8.1 6 8.625 7.275 9.675 8.325C10.725 9.375 12 9.9 13.5 9.9C14.4167 9.9 15.2583 9.69583 16.025 9.2875C16.7917 8.87917 17.4167 8.33333 17.9 7.65C17.9333 7.86667 17.9583 8.0875 17.975 8.3125C17.9917 8.5375 18 8.76667 18 9C18 11.5 17.125 13.625 15.375 15.375C13.625 17.125 11.5 18 9 18ZM9 16C10.4667 16 11.7833 15.5958 12.95 14.7875C14.1167 13.9792 14.9667 12.925 15.5 11.625C15.1667 11.7083 14.8333 11.775 14.5 11.825C14.1667 11.875 13.8333 11.9 13.5 11.9C11.45 11.9 9.70417 11.1792 8.2625 9.7375C6.82083 8.29583 6.1 6.55 6.1 4.5C6.1 4.16667 6.125 3.83333 6.175 3.5C6.225 3.16667 6.29167 2.83333 6.375 2.5C5.075 3.03333 4.02083 3.88333 3.2125 5.05C2.40417 6.21667 2 7.53333 2 9C2 10.9333 2.68333 12.5833 4.05 13.95C5.41667 15.3167 7.06667 16 9 16Z" fill="#424656" /></svg>
                        <div class="navbar-option-button-text">Dark Mode</div>
                    </div>
                    <div class="navbar-option-button" id="settings-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3ZM9.05 18H11.025L11.375 15.35C11.8917 15.2167 12.3708 15.0208 12.8125 14.7625C13.2542 14.5042 13.6583 14.1917 14.025 13.825L16.5 14.85L17.475 13.15L15.325 11.525C15.4083 11.2917 15.4667 11.0458 15.5 10.7875C15.5333 10.5292 15.55 10.2667 15.55 10C15.55 9.73333 15.5333 9.47083 15.5 9.2125C15.4667 8.95417 15.4083 8.70833 15.325 8.475L17.475 6.85L16.5 5.15L14.025 6.2C13.6583 5.81667 13.2542 5.49583 12.8125 5.2375C12.3708 4.97917 11.8917 4.78333 11.375 4.65L11.05 2H9.075L8.725 4.65C8.20833 4.78333 7.72917 4.97917 7.2875 5.2375C6.84583 5.49583 6.44167 5.80833 6.075 6.175L3.6 5.15L2.625 6.85L4.775 8.45C4.69167 8.7 4.63333 8.95 4.6 9.2C4.56667 9.45 4.55 9.71667 4.55 10C4.55 10.2667 4.56667 10.525 4.6 10.775C4.63333 11.025 4.69167 11.275 4.775 11.525L2.625 13.15L3.6 14.85L6.075 13.8C6.44167 14.1833 6.84583 14.5042 7.2875 14.7625C7.72917 15.0208 8.20833 15.2167 8.725 15.35L9.05 18ZM10.1 13.5C11.0667 13.5 11.8917 13.1583 12.575 12.475C13.2583 11.7917 13.6 10.9667 13.6 10C13.6 9.03333 13.2583 8.20833 12.575 7.525C11.8917 6.84167 11.0667 6.5 10.1 6.5C9.11667 6.5 8.2875 6.84167 7.6125 7.525C6.9375 8.20833 6.6 9.03333 6.6 10C6.6 10.9667 6.9375 11.7917 7.6125 12.475C8.2875 13.1583 9.11667 13.5 10.1 13.5Z" fill="#424656" /></svg>
                        <div class="navbar-option-button-text">Settings</div>
                    </div>

                    <a href="../index.html">
                    <div class="navbar-option-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"> <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#BA1A1A"/> </svg>
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