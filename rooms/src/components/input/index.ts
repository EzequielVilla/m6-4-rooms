


export function initTextField() {
    class TextFieldComponent extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
            this.render();
        }
        render() {
            
            var style = document.createElement("style");
            style.textContent = `
            .root{
                display : flex;
                flex-direction: column;
            }
            .label{
                font-size: 18px
            }
            .input{
                padding:0px
                margin-top:5px;
                width: 302px;
                height: 55px;
                border: solid 2px;
                border-radius:4px;
                font-size: 18px;
            }
            `
            const label = this.getAttribute("label");

            this.shadow.appendChild(style);
            var div = document.createElement("div");
            div.classList.add("root");
            div.innerHTML = `
                
                <label class= "label">${label}</label>
                <input class= "input" type= "text" placeholder= "" name="nombre">
            `
            const input = this.shadow.querySelector(".input");

            this.shadow.appendChild(div);
        }
    }
    customElements.define('textfield-comp', TextFieldComponent);
}