class MyComponent extends HTMLElement {
  p=document.createElement('p');
  constructor() {
    super();
    
  }
  
  connectedCallback(){
    this.p.textContent='Hola Mundo';
    this.appendChild(this.p);
  }
}
customElements.define("my-component",MyComponent);