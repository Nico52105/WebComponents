class MyComponent extends HTMLElement {
  p=document.createElement('p');
  constructor() {
    super();
    
  }
  
  connectedCallback(){
    this.p.textContent='Hola Mundo soy un custom element de javascript';
    this.appendChild(this.p);
  }
}
customElements.define("my-component",MyComponent);