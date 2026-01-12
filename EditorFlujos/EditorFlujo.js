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
    link.href = window.location.origin + '/EditorFlujos/EditorFlujo.css';
    div.appendChild(link);

    let caminos = this.ObtenerCaminos(ObjetoFlujo);


    //Graficar Caminos

    // Calcular profundidad máxima
    let profundidad = 0;
    for (let i = 0; i < caminos.length; i++) {
      profundidad = Math.max(profundidad, caminos[i].length);
    }

    // Rellenar con nodos vacíos para igualar profundidades del nodo principal
    let nodoFlujoPrincipal = caminos[0][0];
    let caminosNodoFlujoPrincipal = 0;
    for (let i = 0; i < caminos.length; i++) {
      if (caminos[i][0] == nodoFlujoPrincipal) {
        caminosNodoFlujoPrincipal++;
        for (let j = caminos[i].length; j < profundidad; j++) {
          caminos[i][j] = "";
        }
      }
    }

    console.log("Caminos encontrados: ", caminos);

    // Calcular ancho de nodos
    let anchoNodos = {};
    for (let i = 0; i < profundidad; i++) {
      for (let j = 0; j < caminosNodoFlujoPrincipal; j++) {
        if (anchoNodos[caminos[j][i]] == undefined) {
          anchoNodos[caminos[j][i]] = 1;
        }
        else if (j != 0 && anchoNodos[caminos[j][i]] == anchoNodos[caminos[j - 1][i]]) {
          anchoNodos[caminos[j][i]] = anchoNodos[caminos[j][i]] + 1;
        }

      }
    }
    anchoNodos["PasoFinal"] = 1;
    anchoNodos[""] = 1;
    console.log("Anchos generados: ", anchoNodos);

    div.appendChild(this.GraficarFlujo(caminos,anchoNodos,nodoFlujoPrincipal,profundidad));

    const template = document.createElement('template');
    template.innerHTML = div.outerHTML;
    return template;
  }

  ObtenerCaminos(ObjetoFlujo) {
    let caminos = [];
    let nodosVisitados = [];
    for (let i = 0; i < ObjetoFlujo.Flujo.length; i++) {
      let nodoActual = ObjetoFlujo.Flujo[i].Nombre;
      for (let j = 0; j < ObjetoFlujo.Flujo.length; j++) {
        for (let k = 0; k < ObjetoFlujo.Flujo[j].EnlacesPermitidos.length; k++) {
          if (ObjetoFlujo.Flujo[j].EnlacesPermitidos[k].NombreInteraccion.indexOf(nodoActual) >= 0) {
            let nodoAgregado = false;
            for (let l = caminos.length - 1; l >= 0; l--) {
              let nodosCamino = caminos[l];
              if (nodosCamino.indexOf(nodoActual) == nodosCamino.length - 1) {
                if (caminos[l].indexOf(ObjetoFlujo.Flujo[j].Nombre) < 0) {
                  caminos[l].push(ObjetoFlujo.Flujo[j].Nombre);
                }
                nodoAgregado = true;
              }
              else if (nodosCamino.indexOf(nodoActual) >= 0) {
                let nuevoCamino = nodosCamino.slice(0, nodosCamino.indexOf(nodoActual) + 1);
                nuevoCamino.push(ObjetoFlujo.Flujo[j].Nombre);
                for (let m = 0; m < caminos.length; m++) {
                  if (caminos[m].join("-") == nuevoCamino.join("-")) {
                    nodoAgregado = true;
                  }
                }
                if (!nodoAgregado) {
                  caminos.splice(l + 1, 0, nuevoCamino);
                  nodoAgregado = true;
                }
                break;
              }
            }
            if (!nodoAgregado) {
              caminos.push([nodoActual, ObjetoFlujo.Flujo[j].Nombre]);
            }
          }
        }
      }
      nodosVisitados.push(nodoActual);
    }
    return caminos;
  }

  GraficarFlujo(caminos,anchoNodos,nodoFlujoPrincipal,profundidad) {
    let editorFlujo = document.createElement('div');
    editorFlujo.style.height = anchoNodos[nodoFlujoPrincipal] * 100 + "px";
    editorFlujo.classList.add('diagramaFlujo');
    for (let i = 0; i < profundidad; i++) {
      let nivel = document.createElement('div');
      let anchoHijosAcumulado=0;
      for (let j = 0; j < caminos.length; j++) {        
        if (caminos[j][0] == nodoFlujoPrincipal) {
          let nodo = document.createElement('div');
          nodo.classList.add('nodo');
          
          let conectorNodoPadre = document.createElement('div');
          if (caminos[j][i] != "" && caminos[j][i] != nodoFlujoPrincipal) {
            conectorNodoPadre.classList.add('conectorPadre');            
            if(anchoNodos[caminos[j][i-1]]!=anchoNodos[caminos[j][i]]){
              anchoHijosAcumulado=anchoHijosAcumulado+anchoNodos[caminos[j][i]];
              let unionPadreHijo = document.createElement('div');
              unionPadreHijo.innerHTML="<div></div>";
              conectorNodoPadre.appendChild(unionPadreHijo);
              if(j==0 ||anchoHijosAcumulado==anchoNodos[caminos[j][i]]){
                conectorNodoPadre.classList.add('inicio');
              }
              else if((anchoNodos[caminos[j][i-1]])==anchoHijosAcumulado){
                conectorNodoPadre.classList.add('final');
                anchoHijosAcumulado=0;
              }
              else{
                conectorNodoPadre.classList.add('normal');
              }              
            }  
            conectorNodoPadre.innerHTML += "<div>==></div>";            
          }
          else {
            conectorNodoPadre.innerHTML = "&nbsp;";
          }
          nodo.appendChild(conectorNodoPadre);

          let contenidoNodo = document.createElement('div');
          console.log(caminos[j][i]);
          contenidoNodo.innerHTML = caminos[j][i];
          nodo.appendChild(contenidoNodo);

          let conectorNodoHijo = document.createElement('div');
          if (caminos[j][i + 1] != "" && caminos[j][i + 1] != undefined) {
            conectorNodoHijo.innerHTML = "==";
          }
          nodo.appendChild(conectorNodoHijo);
          nodo.style.height = (anchoNodos[caminos[j][i]] / anchoNodos[nodoFlujoPrincipal]) * 100 + "%";
          nivel.appendChild(nodo);
          j = j + anchoNodos[caminos[j][i]] - 1;
        }
      }
      editorFlujo.appendChild(nivel);
    }
    return editorFlujo;    
  }

  render() {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }
}
customElements.define(Etiqueta, EditorFlujo);