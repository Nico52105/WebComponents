let Etiqueta='my-webcomponent-attributes-callback';
class MyWebcomponentAttributesCallBack extends HTMLElement {
  NombreNodo;
  MensajeValidos;
  Respuestas;
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" })
  }
  
  static get observedAttributes(){
    console.log("cambio");
    return ["NombreNodo","MensajeValidos","Respuestas"]
  }
  
  attributeChangedCallback(attr,oldVal,newVal){
    console.log(attr);
    switch (attr) {
      case "NombreNodo":
        this.NombreNodo = newVal;
      break;
      case "MensajeValidos":
        this.MensajeValidos = newVal;
      break;
      case "Respuestas":
        this.Respuestas = newVal;
      break;
    }
  }
  
  getTemplate() {
    console.log("Status");
    const div = document.createElement('div');
    div.classList.add('tarjeta');
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.location.href + '/my-webcomponent-attributes-callBack.css';
    div.appendChild(link);
    
    
    const divTitulo= document.createElement('div');
    divTitulo.innerHTML=this.NombreNodo;
    div.appendChild(divTitulo);
    
    const divDescripcion = document.createElement('div');
    divDescripcion.innerHTML = this.MensajeValidos;
    div.appendChild(divDescripcion);

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
customElements.define(Etiqueta, MyWebcomponentAttributesCallBack);