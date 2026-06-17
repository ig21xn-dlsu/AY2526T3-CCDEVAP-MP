class profileSettingsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
  
  position: fixed; 
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  pointer-events: auto; 
}
body, main {
    margin: 0;
    position: relative;
    width: 100vw;
    height: 100vh;
}

* {
    box-sizing: border-box;
}

input[type="text"], input[type="password"], textarea {
  border: none;      
  outline: none;      
  box-shadow: none;   
  background: none;   
  width: 100%;
}

#grey-overlay {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(26, 28, 30, 0.40);
    backdrop-filter: blur(4px);
    opacity: 0.5;
    z-index: 5;
}

#settings-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* This pulls the box back exactly into the center */
    z-index: 10;

    width: 42rem;
    height: auto;

    border-radius: 12px;
    border: 1px solid #C2C6D8;
    background: #FFF;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    overflow: hidden;
}

#modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;

    border-bottom: 1px solid #C2C6D8;
    background: #FFF;
    width: 100%;

    color: #1A1C1E;
    font-family: 'Montserrat';
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px; /* 133.333% */
}

#modal-main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    padding: 1.5rem;
    gap: 3rem;
}

#personal-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    gap: 0.75rem;
}

#personal-info-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 0.5rem;

    color: #1A1C1E;
    font-family: 'Montserrat';
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px; /* 140% */
}

#personal-info-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    gap: 1.5rem;
    width: 100%;
}

#profile-picture-container {
    display: flex;
    padding: 1rem;
    align-items: center;
    gap: 1.5rem;
    align-self: stretch;

    border-radius: 12px;
    border: 1px solid #C2C6D8;
    background: #F3F3F6;
}

#image-container {
    display: flex;
    width: 96px;
    height: 96px;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.20);
}

#profile-photo-settings {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    flex: 1 0 0;
}

#upload-new-button {
    display: flex;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 1px solid #C2C6D8;
    background: #E2E2E5;

    color: #1A1C1E;
    text-align: center;
    font-family: 'Montserrat';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.14px;
}

.personal-info-input {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;

    color: #424656;
    font-family: 'Montserrat';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.14px;
}

.info-container {
    display: flex;
    padding: 12px 16px;
    justify-content: flex-start;
    align-items: flex-start;
    align-self: stretch;

    border-radius: 8px;
    border: 1px solid #727687;
    background: #FFF;
    color: #1A1C1E;

    font-family: 'Montserrat';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */   
}

#separator {
    height: 1px;
    align-self: stretch;
    border-top: 1px solid #C2C6D8;
}

#security {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
}

#security-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    align-self: stretch;

    color: #1A1C1E;
    font-family: 'Montserrat';
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px; /* 140% */   
}

#security-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    gap: 1.5rem;
}

.password-contanier {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    color: #424656;
    font-family: 'Montserrat';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.14px;

    width: 100%;
}

.password-container-legit {
    display: flex;
    padding: 14px 16px;
    justify-content: flex-start;
    align-items: flex-start;
    align-self: stretch;

    border-radius: 8px;
    border: 1px solid #727687;
    background: #FFF;

    color: #6B7280;
    font-family: 'Montserrat';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

#old-new-password {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;

    width: 100%;
}

#modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end; 
    width: 100%; 
    
    padding: 24px;
    gap: 16px;

    border-radius: 0 0 12px 12px;
    border-top: 1px solid #C2C6D8;
    background: #F3F3F6;
}

#cancel-button {
    display: flex;
    padding: 13.5px 32px 14.5px 32px;
    justify-content: center;
    align-items: center;

    color: #727687;
    text-align: center;
    font-family: 'Montserrat';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.14px;
}

#save-changes-button {
    display: flex;
    padding: 12px 32px;
    justify-content: center;
    align-items: center;
    gap: 7.99px;

    border-radius: 8px;
    background: #FE9400;

    color: #633700;
    text-align: center;
    font-family: 'Montserrat';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.14px;
}
      </style>

      <div id="grey-overlay"></div>
    <section id="settings-modal">
        <section id="modal-header">
            Settings
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                    fill="#727687" />
            </svg>
        </section>
        <section id="modal-main">
            <section id="personal-info">
                <div id="personal-info-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z"
                            fill="#0050CB" />
                    </svg>
                    Personal Information
                </div>
                <section id="personal-info-content">
                    <section id="profile-picture-container">
                        <div id="image-container"></div>
                        <div id="profile-photo-settings">
                            <div
                                style="color: #424656; font-family: 'Montserrat'; font-size: 14px; font-style: normal; font-weight: 500; line-height: 20px; /* 142.857% */ letter-spacing: 0.14px;">
                                Profile Photo</div>
                            <div
                                style="color: #727687; font-family: 'Montserrat'; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px;">
                                Accepts PNG, JPG under 5MB</div>
                            <div id="upload-new-button">Upload New</div>
                        </div>
                    </section>

                    <section class="personal-info-input">Name
                        <div class="info-container"><input type="text" placeholder="Ian Gabriel Ilagan"></div>
                    </section>
                    <section class="personal-info-input">Email Address
                        <div class="info-container"><input type="text" placeholder="ian_gabriel_ilagan@dlsu.edu.ph">
                        </div>
                    </section>
                </section>
            </section>

            <div id="separator"></div>

            <section id="security">
                <div id="security-header"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="20"
                        viewBox="0 0 16 20" fill="none">
                        <path
                            d="M8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20ZM8 17.9C9.73333 17.35 11.1667 16.25 12.3 14.6C13.4333 12.95 14 11.1167 14 9.1V4.375L8 2.125L2 4.375V9.1C2 11.1167 2.56667 12.95 3.7 14.6C4.83333 16.25 6.26667 17.35 8 17.9Z"
                            fill="#0050CB" />
                    </svg>
                    Security
                </div>
                <section id="security-content">
                    <section class="password-contanier">
                        Current password-contanier
                        <section class="password-container-legit">
                            <input type="password" placeholder="••••••••">
                        </section>
                    </section>
                    <section id="old-new-password">
                        <section class="password-contanier">
                            New Password
                            <section class="password-container-legit">
                                <input type="password" placeholder="••••••••">
                            </section>
                        </section>
                        <section class="password-contanier">
                            Confirm New Password
                            <section class="password-container-legit">
                                <input type="password" placeholder="••••••••">
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
        <section id="modal-footer">
            <section id="cancel-button">Cancel</section>
            <section id="save-changes-button"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 18 18" fill="none">
                    <path
                        d="M18 4V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14L18 4ZM9 15C9.83333 15 10.5417 14.7083 11.125 14.125C11.7083 13.5417 12 12.8333 12 12C12 11.1667 11.7083 10.4583 11.125 9.875C10.5417 9.29167 9.83333 9 9 9C8.16667 9 7.45833 9.29167 6.875 9.875C6.29167 10.4583 6 11.1667 6 12C6 12.8333 6.29167 13.5417 6.875 14.125C7.45833 14.7083 8.16667 15 9 15ZM3 7H12V3H3V7Z"
                        fill="#633700" />
                </svg>
                Save Changes
            </section>
        </section>
    </section>
    `;
      
      this.shadowRoot.querySelector('#cancel-button').addEventListener('click', () => this.remove());
      this.shadowRoot.querySelector('#save-changes-button').addEventListener('click', () => this.remove());
      this.shadowRoot.querySelector('#modal-header svg').addEventListener('click', () => this.remove());
  }
}

customElements.define('profile-settings-modal', profileSettingsModal);