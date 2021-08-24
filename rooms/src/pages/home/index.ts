import { state } from "../../state";
import { Router } from "@vaadin/router";


class Home extends HTMLElement{

    connectedCallback(){
        this.render();   
        const form = document.querySelector('.form');        
        this.querySelector(".boton").addEventListener("click", (e)=>{
            e.preventDefault();
            const nombre =  document.querySelector(".name").shadowRoot.querySelector('input').value;       
            const email = document.querySelector(".email").shadowRoot.querySelector('input').value; 
            state.setInfo(email,nombre).then(res=>{
                const roomOptionValue = document.querySelector(".room").shadowRoot.querySelector("select").value;
                const roomId = document.querySelector(".room-id").shadowRoot.querySelector("input").value;

                //chequeo si el room existe o no para poder ingresar
                if (roomOptionValue == "room-existente"){
                    state.getRoom(roomId).then(roomExiste=>{
                        if (res.status != 400 && roomExiste == true){
                            const lastState = state.getState();
                                state.setState({
                                    ...lastState,
                                    email,
                                    id: roomId,
                                })
                                Router.go("/chat");
                                
                        }
                        else if (res.status != 400 && roomExiste == false){
                            document.querySelector(".room-id").shadowRoot.querySelector('.label').textContent = 'Room id. El id introducido no existe';
                            document.querySelector(".room-id").shadowRoot.querySelector('input').value = '';
    
                                
                    }
                    })
                    //declarar una variable para ver si es true o false la existencia del roomId.
                    //400 es error
                    if(res.status == 400){
                        document.querySelector(".email").shadowRoot.querySelector('input').value = '';
                        document.querySelector(".email").shadowRoot.querySelector('.label').textContent = 'Email. El introducido ya existe';
                    }
                }
                
                else if (res.status != 400 && roomOptionValue == "nuevo-room"){
                    //crear room
                    state.getUserIdAuth(email).then(dataEmail=>{                        
                        state.setRoom(dataEmail.id).then(data=>{
                            data.json().then(roomId=>{
                                const lastState = state.getState();
                                state.setState({
                                    ...lastState,
                                    email,
                                    id: roomId.id
                                })
                                Router.go("/chat");
                            });  
                        });
                    })
                }
                

            });   
        });
    }
    render(){

        //aplicar un style que oculte o muestre el room id dependiendo de la opcion elegida.
        this.innerHTML=`
        <header-comp></header-comp>
        <h1>Bienvenidx</h1>
        <form class="form">
            <textfield-comp class="email" label="Email"></textfield-comp>
            <textfield-comp class="name" label="Tu nombre"></textfield-comp>
            <options-comp class="room" label="room"></options-comp>
            <textfield-comp class="room-id" label="Room id"></textfield-comp>
            <button-comp class="boton">Comenzar</button-comp>
        </form>
        `
    }
}
customElements.define("home-page", Home);
