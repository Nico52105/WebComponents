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


    //Graficar Caminos
    let nodoFlujoPrincipal = caminos[0][0];
    let profundidad = 0;
    for (let i = 0; i < caminos.length; i++) {
      profundidad = Math.max(profundidad, caminos[i].length);
    }

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

    let tableSpan = {};
    for (let i = 0; i < profundidad; i++) {
      for (let j = 0; j < caminosNodoFlujoPrincipal; j++) {
        if (tableSpan[caminos[j][i]] == undefined) {
          tableSpan[caminos[j][i]] = 1;
        }
        else if (j != 0 && tableSpan[caminos[j][i]] == tableSpan[caminos[j - 1][i]]) {
          tableSpan[caminos[j][i]] = tableSpan[caminos[j][i]] + 1;
        }

      }
    }
    tableSpan["PasoFinal"] = 1;
    tableSpan[""] = 1;
    console.log("Span generados: ", tableSpan);

    let tabla = document.createElement('table');
    

    for (let i = 0; i < caminos.length; i++) {
      if (caminos[i][0] == nodoFlujoPrincipal) {
        let fila = document.createElement('tr');
        for (let j = 0; j < profundidad; j++) {       
          


          if (i == 0 || caminos[i][j] == "PasoFinal" || caminos[i][j] == "" || caminos[i - 1][j] != caminos[i][j]) {
            let celda = document.createElement('td');
            if (caminos[i][j] != "") {
              celda.innerHTML = (j>0?"--":"") + caminos[i][j]+(j+1==profundidad || caminos[i][j+1]==""?"":(tableSpan[caminos[i][j]]==tableSpan[caminos[i][j+1]]?"--":"|"));
              celda.rowSpan = tableSpan[caminos[i][j]];
            }

            fila.appendChild(celda);
          }
        }
        tabla.appendChild(fila);
      }
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