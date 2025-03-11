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
    
    const span = document.createElement('span');
    span.classList.add('tarjeta');
    
    console.log(document.getElementById('style-'+Etiqueta));
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id='style-'+Etiqueta;
    link.href = window. location. href+'/my-webcomponent-attributes.css';
    span.appendChild(link);
    
    
    const divTitulo= document.createElement('div');
    divTitulo.innerHTML=this.Titulo;
    span.appendChild(divTitulo);
    
    const divDescripcion = document.createElement('div');
    divDescripcion.innerHTML = this.Descripcion;
    span.appendChild(divDescripcion);

    const divImagen = document.createElement('div');
    span.appendChild(divImagen);
    
    const imagen= document.createElement('img');
    imagen.src = this.Imagen;
    divImagen.appendChild(imagen);
    
    const template = document.createElement('template');
    template.innerHTML = span.outerHTML;
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