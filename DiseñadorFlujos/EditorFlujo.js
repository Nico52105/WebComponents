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

    let indexNodoSeleccionado=0;
    let nodoRaiz="Inicio";
    let nodoBuscado=["Inicio"];
    
    
    for (var i = 0; i < nodoBuscado.length; i++) {
      const divNivel = document.createElement('div');
      divNivel.classList.add('nivel');
      divNivel.setAttribute('nodo',nodoBuscado[indexNodoSeleccionado-1]);
      div.appendChild(divNivel);
      
      for (var j = 0; j < ObjetoFlujo.Flujo.length; j++) {
        if (indexNodoSeleccionado<nodoBuscado.length && ObjetoFlujo.Flujo[j].Nombre == "") {
          const divNodo = document.createElement('div');
          divNivel.appendChild(divNodo);
          
          const divNombreNodo=document.createElement('div');
          divNombreNodo.innerHTML = ObjetoFlujo.Flujo[j].Nombre;
          divNodo.appendChild(divNombreNodo);
          
          //for (var k = 0; k < ObjetoFlujo.Flujo[j].Respuestas.length; k++) {
          //  const divMensajesNodo = document.createElement('div');
          //  divMensajesNodo.innerHTML = ObjetoFlujo.Flujo[j].Respuestas[k];
          //  divNodo.appendChild(divMensajesNodo);
          //}
          //
          //for (var k = 0; k < ObjetoFlujo.Flujo[j].OpcionesTexto.length; k++) {
          //  const divOpcionesNodo = document.createElement('div');
          //  divOpcionesNodo.innerHTML = ObjetoFlujo.Flujo[j].OpcionesTexto[k];
          //  divNodo.appendChild(divOpcionesNodo);
          //}
        }
        else{
          for (var k = 0; k < ObjetoFlujo.Flujo[j].EnlacesPermitidos.length; k++) {
              if (ObjetoFlujo.Flujo[j].EnlacesPermitidos[k].NombreInteraccion.indexOf(nodoBuscado[i]) >= 0){
                if(nodoBuscado.indexOf(ObjetoFlujo.Flujo[j].Nombre)==-1)
                nodoBuscado.push(ObjetoFlujo.Flujo[j].Nombre);
              }
            }
          }
        indexNodoSeleccionado++;
        }
      }
      
    const template = document.createElement('template');
    console.log(div.outerHTML);
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