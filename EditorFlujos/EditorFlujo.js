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
              let nodosCamino = caminos[l].split("-");
              if (nodosCamino.indexOf(nodoActual) == 0) {
                caminos[l] = ObjetoFlujo.Flujo[j].Nombre + "-" + caminos[l];
                nodoAgregado = true;
              }
              if (nodosCamino.indexOf(nodoActual) > 0) {
                let nuevoCamino = [];
                for (var m = nodosCamino.length - 1; m >= nodosCamino.indexOf(nodoActual); m--) {
                  nuevoCamino.push(nodosCamino[m]);
                }
                nuevoCamino.push(ObjetoFlujo.Flujo[j].Nombre);
                nuevoCamino=nuevoCamino.reverse();
                if (caminos.indexOf(nuevoCamino.join("-")) < 0) {
                  caminos.splice(l + 1, 0, nuevoCamino.join("-"));
                }
                nodoAgregado = true;
                break;
              }
            }
            if (!nodoAgregado) {
              caminos.push(ObjetoFlujo.Flujo[j].Nombre + "-" + nodoActual);
            }
          }
        }
      }
      nodosVisitados.push(nodoActual);
    }
    console.log("Caminos encontrados: ", caminos);

    //Graficar Caminos
    


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

    let flujo = [["Inicio"]];
    let nodosAgregados = [flujo[0][0]];
    for (let i = 0; i < flujo.length; i++) {
      let nivel = [];
      for (let j = 0; j < flujo[i].length; j++) {
        for (let k = 0; k < arbol.nodos.length; k++) {
          let nodoPadre = flujo[i][j].split("-")[0];
          if (arbol.enlaces[arbol.nodos[k]].indexOf(nodoPadre) >= 0) {
            let nombreNodo = arbol.nodos[k];
            if (nodosAgregados.indexOf(nombreNodo) >= 0) {
              nombreNodo = "#" + nombreNodo;
            }
            else {
              nodosAgregados.push(nombreNodo);
            }
            nivel.push(nombreNodo + "-" + nodoPadre);
          }
        }
      }
      if (nivel.length > 0) {
        flujo.push(nivel);
      }
    }
    console.table(flujo);

    let anchoMaximo = 0;
    let nivelAnchoMaximo = 0;
    for (let i = 0; i < flujo.length; i++) {
      if (flujo[i].length > anchoMaximo) {
        anchoMaximo = flujo[i].length;
        nivelAnchoMaximo = i;
      }
    }
    //ordenar espacio entre hijos
    for (let i = nivelAnchoMaximo; i < flujo.length - 1; i++) {
      let nivel = [];
      for (let j = 0; j < flujo[i].length; j++) {
        let nodoPadre = flujo[i][j].split("-")[0];
        let nodohijo = flujo[i + 1][j] ? flujo[i + 1][j].split("-")[1] : "";
        if (nodoPadre == nodohijo && nodohijo != "") {
          nivel.push(flujo[i + 1][j]);
        }
        else {
          flujo[i + 1].splice(j, 0, "");
          nivel.push("");
        }
      };
      flujo[i + 1] = nivel;
    }
    //ordenar espacio entre padres
    for (let i = nivelAnchoMaximo; i >= 1; i--) {
      let nivel = [];
      for (let j = 0; j < flujo[i].length; j++) {
        let nodoPadre = flujo[i - 1][j] ? flujo[i - 1][j].split("-")[0] : "";
        let nodohijo = flujo[i][j].split("-")[1];
        if (nodoPadre == nodohijo && nodohijo != "") {
          nivel.push(flujo[i - 1][j]);
        }
        else {
          flujo[i - 1].splice(j, 0, "");
          nivel.push("");
        }
      };
      flujo[i - 1] = nivel;
    }
    console.table(flujo);

    let tabla = document.createElement('table');
    tabla.classList.add('tablaFlujo');
    for (let i = 0; i < flujo.length; i++) {
      let fila = document.createElement('tr');
      fila.classList.add('filaFlujo');
      for (let j = 0; j < flujo[i].length; j++) {
        let celda = document.createElement('td');

        let nombreNodo = flujo[i][j].split("-")[0];
        if (nombreNodo != "" && nombreNodo != "#Inicio") {
          let divNodo = document.createElement('div');
          let divTextoNodo = document.createElement('div');
          divTextoNodo.innerHTML = nombreNodo;
          let divEdicionNodo = document.createElement('div');
          divEdicionNodo.innerHTML = "+";
          divNodo.appendChild(divEdicionNodo);
          divEdicionNodo = document.createElement('div');
          divEdicionNodo.innerHTML = "+";
          divNodo.appendChild(divEdicionNodo);
          divNodo.appendChild(divTextoNodo);
          celda.appendChild(divNodo);
        }

        //Calcula el colspan para los nodos padre
        if (i < nivelAnchoMaximo) {
          let colSpan = 1;
          while (flujo[i][j + colSpan] == "") {
            colSpan = colSpan + 1;
          }

          if (colSpan - 1 > 0) {
            celda.setAttribute('colspan', colSpan);
            j = j + (colSpan - 1);
          }
        }
        else {
          celda.classList.add('celdaHijo');
        }



        /* for (let k = 0; k < ObjetoFlujo.Flujo.length; k++) {
          if (ObjetoFlujo.Flujo[k].Nombre == flujo[i][j].replace("#", "")) {
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
        } */
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