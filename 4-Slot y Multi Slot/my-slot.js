class MySlot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"})
  }
  
  getTemplate(){
    const section=document.createElement('section');
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './my-slot.css';
    section.appendChild(link);
    
    const h2=document.createElement('h2');
    h2.innerHTML='Hola mundo soy un Slot de javascript';
    section.appendChild(h2);
    
    const div=document.createElement('div');
    section.appendChild(div);
    
    const p=document.createElement('p');
    div.appendChild(p);
    
    /*Para poder mostrar el contenido del componenete en pantalla debo crear una etiqueta slot la cual se encarga de mostar el contenido agregado dentro del componente*/
    const slot = document.createElement('slot');
    p.appendChild(slot);
    
    const template=document.createElement('template');
    template.innerHTML=section.outerHTML;
    return template;
  }
  
  render(){
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
  }
  
  connectedCallback(){
    this.render();
  }
}
customElements.define("my-slot",MySlot);