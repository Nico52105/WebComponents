class MyShadow extends HTMLElement {
  constructor() {
    super();
    
  }
  
  getTemplate(){
    const template=document.createElement('template');
    
    const section=document.createElement('section');
    
    const h2=document.createElement('h2');
    h2.innerHTML='Hola mundo soy un Shadow DOM de javascript';
    section.appendChild(h2);
    
    const div=document.createElement('div');
    section.appendChild(div);
    
    const p=document.createElement('p');
    p.innerHTML='Más texto de ejemplo';
    div.appendChild(p);
    
    template.innerHTML=section.outerHTML;
    return template;
  }
  
  render(){
    this.appendChild(this.getTemplate().content.cloneNode(true));
    console.log('ok');
  }
  
  connectedCallback(){
    this.render();
  }
}
customElements.define("my-shadow",MyShadow);