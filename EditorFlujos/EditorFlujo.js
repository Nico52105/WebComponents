let Etiqueta = 'editor-flujo';
class EditorFlujo extends HTMLElement {
  Flujo;

  constructor() {
    super();
    this.attachShadow({ mode: "open" })
  }

  static get observedAttributes() {
    return ["flujo"]
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    switch (attr) {
      case "flujo":
        this.Flujo = newVal;
        break;
    }
  }

  getTemplate() {
    let ObjetoFlujo = JSON.parse(this.Flujo);
    console.log(ObjetoFlujo.Flujo);

    const div = document.createElement('div');
    div.classList.add('tarjeta');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.location.href + 'EditorFlujo.css';
    div.appendChild(link);

    let indexNodoSeleccionado = 0;
    let nodoPadre;
    let nodosBuscados = ["Inicio"];
    let proximosNodosBuscados = [];


    for (var i = 0; i < nodosBuscados.length; i++) {
      console.log("nodosBuscados");
      console.log(nodosBuscados);

      const divNivel = document.createElement('div');
      divNivel.classList.add('nivel');
      
      div.appendChild(divNivel);

      for (var j = 0; j < ObjetoFlujo.Flujo.length; j++) {
        if (nodosBuscados.indexOf(ObjetoFlujo.Flujo[j].Nombre)!=-1) {
          
          const divNodo = document.createElement('div');
          divNivel.appendChild(divNodo);

          const divNombreNodo = document.createElement('div');
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
        else {
          for (var k = 0; k < ObjetoFlujo.Flujo[j].EnlacesPermitidos.length; k++) {
            if (ObjetoFlujo.Flujo[j].EnlacesPermitidos[k].NombreInteraccion.indexOf(nodosBuscados[indexNodoSeleccionado])!=-1) {
              console.log("Validar que no exista el nodo"); 
              console.log(ObjetoFlujo.Flujo[j].Nombre);              
              if (proximosNodosBuscados.indexOf(ObjetoFlujo.Flujo[j].Nombre) == -1) {
                proximosNodosBuscados.push(ObjetoFlujo.Flujo[j].Nombre);
                console.log("proximosNodosBuscados");
                console.log(proximosNodosBuscados);
              }
            }
          }
        }
      }
      indexNodoSeleccionado++;
      if(nodosBuscados.length==indexNodoSeleccionado){
        nodosBuscados = proximosNodosBuscados;
        proximosNodosBuscados = [];
        indexNodoSeleccionado = 0;
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