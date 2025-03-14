let Etiqueta='editor-flujo';
class EditorFlujo extends HTMLElement {
  Flujo;
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" })
  }
  
  static get observedAttributes(){
    return ["flujo"]
  }
  
  attributeChangedCallback(attr,oldVal,newVal){
    switch (attr) {
      case "flujo":
        this.Flujo = newVal;
      break;
    }
  }
  
  getTemplate() {
    let ObjetoFlujo=JSON.parse(this.Flujo);
    console.log(ObjetoFlujo.Flujo);
    
    const div = document.createElement('div');
    div.classList.add('tarjeta');
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.location.href + '/EditarFlujo.css';
    div.appendChild(link);
    
    for (var i = 0; i < ObjetoFlujo.Flujo.length; i++) {
      const divNodo = document.createElement('div');
      divNodo.innerHTML = ObjetoFlujo.Flujo[i].Nombre;
      div.appendChild(divNodo);
    }
    
    const template = document.createElement('template');
    template.innerHTML = div.outerHTML;
    return template;
  }
  
  render() {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
  }
  
  connectedCallback() {
    this.render();
  }
}
customElements.define(Etiqueta, EditorFlujo);