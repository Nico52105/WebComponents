let Etiqueta='my-webcomponent-attributes';
class MyWebcomponentAttributes extends HTMLElement {
  Titulo;
  Descripcion;
  Imagen;
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" })
  }
  
  getTemplate() {
    this.Titulo=this.getAttribute("Titulo");
    this.Descripcion=this.getAttribute("Descripcion");
    this.Imagen=this.getAttribute("Imagen");
    
    const div = document.createElement('div');
    div.classList.add('tarjeta');
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.location.href + '/my-webcomponent-attributes.css';
    div.appendChild(link);
    
    
    const divTitulo= document.createElement('div');
    divTitulo.innerHTML=this.Titulo;
    div.appendChild(divTitulo);
    
    const divDescripcion = document.createElement('div');
    divDescripcion.innerHTML = this.Descripcion;
    div.appendChild(divDescripcion);

    const divImagen = document.createElement('div');
    div.appendChild(divImagen);
    
    const imagen= document.createElement('img');
    imagen.src = this.Imagen;
    divImagen.appendChild(imagen);
    
    const template = document.createElement('template');
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
customElements.define(Etiqueta, MyWebcomponentAttributes);