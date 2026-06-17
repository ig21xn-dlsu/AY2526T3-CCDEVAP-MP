class MyComponent extends HTMLElement {
  constructor() {
    super();
    // This creates the isolated CSS sandbox
    this.attachShadow({ mode: 'open' }); 
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        /* =========================================
           1. YOUR CSS GOES HERE
           ========================================= */
        
        /* This styles the custom HTML tag itself */
        :host {
          display: block; 
          width: 100%;
        }

        /* Add the rest of your classes below */
        .wrapper {
            /* example style */
        }

      </style>

      <div class="wrapper">
          </div>
    `;
  }
}

/* =========================================
   3. NAME YOUR COMPONENT
   ========================================= */
// Change 'my-component' to whatever HTML tag you want to use (must include a hyphen!)
// Change 'MyComponent' to match the class name at the very top of this file
customElements.define('my-component', MyComponent);