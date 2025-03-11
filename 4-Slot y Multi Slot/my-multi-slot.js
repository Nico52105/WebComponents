class MyMultiSlot extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
  }
  
  getTemplate(){
    const section=document.createElement('section');
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './my-multi-slot.css';
    section.appendChild(link);
    
    const h2 = document.createElement('h2');
    h2.innerHTML = 'Hola mundo soy un MultiSlot de javascript';
    section.appendChild(h2);
    
    const table=document.createElement('table');
    section.appendChild(table);
    
    const campos =["Nombre","Apellido","Edad"] 
    for (var i = 0; i < campos.length; i++) {
      let fila =document.createElement('tr');
      table.appendChild(fila);
      
      let celdaCampo=document.createElement('td');
      celdaCampo.innerHTML="<b>"+campos[i]+':</b>';
      fila.appendChild(celdaCampo);
      
      let celdaValor =document.createElement('td');
      fila.appendChild(celdaValor);
      
      let valor =document.createElement('slot');
      valor.setAttribute("name",campos[i]);
      celdaValor.appendChild(valor);
      // Tab to edit
    }
    
    const template = document.createElement('template');
    template.innerHTML=section.outerHTML;
    return template
  }
  
  render(){
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
  }
  
  connectedCallback(){
    this.render();
  }
}

customElements.define("my-multi-slot",MyMultiSlot);
