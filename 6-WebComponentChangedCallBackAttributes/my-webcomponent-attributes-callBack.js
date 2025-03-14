let Etiqueta='my-webcomponent-attributes-callback';
class MyWebcomponentAttributesCallBack extends HTMLElement {
  NombreNodo;
  MensajesValidos;
  Respuestas;
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" })
  }
  
  static get observedAttributes(){
    console.log("Es muy importante que los Atributos esten en minucula para que sean funcionales.");
    return ["nombre-nodo","mensajes-validos","respuestas"]
  }
  
  attributeChangedCallback(attr,oldVal,newVal){
    console.log(oldVal);
    switch (attr) {
      case "nombre-nodo":
        this.NombreNodo = newVal;
      break;
      case "mensajes-validos":
        this.MensajesValidos = newVal;
      break;
      case "respuestas":
        this.Respuestas = newVal;
      break;
    }
  }
  
  getTemplate() {
    console.table(eval(this.Respuestas));
    const div = document.createElement('div');
    div.classList.add('tarjeta');
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.location.href + '/my-webcomponent-attributes-callBack.css';
    div.appendChild(link);
    
    
    const divTitulo= document.createElement('div');
    divTitulo.innerHTML=this.NombreNodo;
    div.appendChild(divTitulo);
    
    const divMensajesValidos = document.createElement('div');
    divMensajesValidos.innerHTML = this.MensajesValidos;
    div.appendChild(divMensajesValidos);
    
    const divRespuestas = document.createElement('div');
    divRespuestas.innerHTML = this.Respuestas;
    div.appendChild(divRespuestas);

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