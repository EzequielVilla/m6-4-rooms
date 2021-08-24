export function initOptions() {
    class OptionsComponent extends HTMLElement {
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
            .opciones{
                padding: 10px;
                margin-top:5px;
                width: 310px;
                height: 55px;
                border: solid 2px;
                border-radius:4px;
                font-size: 18px;
        
            }
            `
            const label = this.getAttribute("label");
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(style);
            var div = document.createElement("div");
            div.classList.add("root");
            div.innerHTML = `
                <label class= "label">${label}</label>
                <select class="opciones" i>
                    <option value="nuevo-room">Nuevo room</option>
                    <option value="room-existente">Room existente</option>
                    
                </select>
            `
            shadow.appendChild(div);
        }
    }
    customElements.define('options-comp', OptionsComponent);
}