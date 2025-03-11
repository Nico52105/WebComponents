class MyShadow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"})
  }
  
  getTemplate(){
    const section=document.createElement('section');
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './my-shadow.css';
    section.appendChild(link);
    
    const h2=document.createElement('h2');
    h2.innerHTML='Hola mundo soy un Shadow DOM de javascript';
    section.appendChild(h2);
    
    const div=document.createElement('div');
    section.appendChild(div);
    
    const p=document.createElement('p');
    p.innerHTML='De esta manera puedo proteger los estilos del componente de los estilos definidos de la pagina.';
    div.appendChild(p);
    
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
customElements.define("my-shadow",MyShadow);