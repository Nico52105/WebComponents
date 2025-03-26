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
    div.classList.add('diagramaFlujo');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.location.origin + '/WebComponents/EditorFlujos/EditorFlujo.css';
    div.appendChild(link);

    let arbol = { nodos: [], enlaces: {} };
    for (let i = 0; i < ObjetoFlujo.Flujo.length; i++) {
      arbol.nodos.push(ObjetoFlujo.Flujo[i].Nombre);
      for (let j = 0; j < ObjetoFlujo.Flujo[i].EnlacesPermitidos.length; j++) {
        for (let k = 0; k < ObjetoFlujo.Flujo[i].EnlacesPermitidos[j].NombreInteraccion.length; k++) {
          if (arbol.enlaces[ObjetoFlujo.Flujo[i].Nombre] === undefined) {
            arbol.enlaces[ObjetoFlujo.Flujo[i].Nombre] = [];
          }
          arbol.enlaces[ObjetoFlujo.Flujo[i].Nombre].push(ObjetoFlujo.Flujo[i].EnlacesPermitidos[j].NombreInteraccion[k]);
        }
      }
    }
    console.log(arbol);
    let estructura = [["Inicio"]];
    let hijosEstructura = [];
    let nodosAgregados = ["Inicio"];
    for (let i = 0; i < estructura.length; i++) {
      let nivel = [];
      hijosEstructura.push([]);
      for (let j = 0; j < estructura[i].length; j++) {
        let hijosNodo = 0;
        for (let k = 0; k < arbol.nodos.length; k++) {
          if (arbol.enlaces[arbol.nodos[k]].indexOf(estructura[i][j]) >= 0) {
            hijosNodo++;
            if (nodosAgregados.indexOf(arbol.nodos[k]) < 0) {
              nodosAgregados.push(arbol.nodos[k]);
              nivel.push(arbol.nodos[k]);
            }
            else {
              if  (arbol.nodos[k] != "Inicio") {
                nivel.push("#" + arbol.nodos[k]); 
              }              
            }
          }
        }
        hijosEstructura[i].push(hijosNodo);
      }
      if (nivel.length > 0) {
        estructura.push(nivel);
      }
    }

    console.table(estructura);
    console.table(hijosEstructura);

    let columnasFlujo = 0;
    for (let i = 0; i < hijosEstructura.length; i++) {
      let contarColumnas = 0;
      for (let j = 0; j < hijosEstructura[i].length; j++) {
        contarColumnas += hijosEstructura[i][j];
      }
      if (contarColumnas > columnasFlujo) {
        columnasFlujo = contarColumnas;
      }
    }

    hijosEstructura[0][0] = columnasFlujo;
    console.table(hijosEstructura);

    let tabla = document.createElement('table');
    tabla.classList.add('tablaFlujo');
    for (let i = 0; i < estructura.length; i++) {
      let fila = document.createElement('tr');
      fila.classList.add('filaFlujo');
      for (let j = 0; j < estructura[i].length; j++) {
        let celda = document.createElement('td');
        let celdaTexto = document.createElement('div');

        let divNombreNodo = document.createElement('div');
        divNombreNodo.appendChild(document.createElement('div'));
        divNombreNodo.appendChild(document.createElement('div'));
        let divTextoNodo=document.createElement('div');
        divTextoNodo.innerHTML = estructura[i][j];
        divNombreNodo.appendChild(divTextoNodo);
        celdaTexto.appendChild(divNombreNodo);


        for (let k = 0; k < ObjetoFlujo.Flujo.length; k++) {
          if (ObjetoFlujo.Flujo[k].Nombre == estructura[i][j].replace("#", "") ) {
            if (ObjetoFlujo.Flujo[k].Respuestas.length > 0) {
              let divRespuestas = document.createElement('div');
              for (let l = 0; l < ObjetoFlujo.Flujo[k].Respuestas.length; l++) {
                let divRespuestaInteraccion = document.createElement('div');
                divRespuestaInteraccion.innerHTML = ObjetoFlujo.Flujo[k].Respuestas[l];
                divRespuestas.appendChild(divRespuestaInteraccion);
              }
              celdaTexto.appendChild(divRespuestas);
            }
          }
        }


        celda.appendChild(celdaTexto);
        celda.colSpan = hijosEstructura[i][j];
        if (hijosEstructura[i][j] == 0 && i < hijosEstructura.length - 1) {
          [i + 1].splice(j, 0, 0);
          estructura[i + 1].splice(j, 0, "");
        }        
        fila.appendChild(celda);
      }
      tabla.appendChild(fila);
    }
    div.appendChild(tabla);


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