

export function initButton() {
    
    class ButtonComponent extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            const txtOriginal = this.textContent;
            var style = document.createElement("style");
            style.textContent = `
            .root{
                
            }
            .button{
                padding:0px;
                background-color: #9CBBE9;
                display : flex;
                justify-content:center;
                align-items: center;
                border: none;
                border-radius:4px;
                font-size:22px;
                cursor: pointer;
                width:310px;
                height:55px;
            }
            `
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(style);
            var div = document.createElement("div");
            div.classList.add("root");
            div.innerHTML = `
                
                <button class="button" type="submit">${txtOriginal}</button>
            `
            shadow.appendChild(div);
        }
    }
    customElements.define('button-comp', ButtonComponent);
}