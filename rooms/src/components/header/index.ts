export function initHeader() {
    class HeaderComponent extends HTMLElement{
        constructor() {
            super();
            this.render();
        }
        render() {
            const txtOriginal = this.textContent;
            var style = document.createElement("style");
            style.textContent = `
            .root{
                display: flex;
                background-color: #FF8282;
                justify-content : center;
                align-items: center;            
                height : 60px;
                font-family: sans-serif;
                font-size: 22px ;
                font-weight: 700;
            }
            `
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(style);
            var div = document.createElement("div");
            div.classList.add("root");
            div.textContent = txtOriginal;
            shadow.appendChild(div);
        }
    }
    customElements.define('header-comp', HeaderComponent);
}