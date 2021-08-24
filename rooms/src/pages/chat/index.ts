import { state } from "../../state";


type Mensaje ={
    nombre:string;
    mensaje:string;
}

//En algun momento usar init para cargar los mensajes de ese room especifico. 
class initChat extends HTMLElement {
    mensaje: Mensaje[] = [];
    shortRoomId: string = ""
    email: string = ""
    rtdbRoomId: string = ""
    connectedCallback(){
        this.email = state.getState().email;
        this.shortRoomId = state.getState().id;
        state.getUserId(this.email).then(user=>{
            state.getRtdbRoomId(this.shortRoomId, user.id).then(data=>{
                this.rtdbRoomId = data.rtdbRoomId;
                state.init(this.rtdbRoomId);
                this.comienzo();
                state.subscribe(()=>{                    
                    const estadoActual = state.getState();            
                    this.mensaje = estadoActual.mensaje;
                    this.render();
                });
            });

        })
    }

    escribirMensaje(){
        //
        this.querySelector(".boton").addEventListener("click", (e)=>{
            e.preventDefault();
            console.log('click');
            
            const mensaje = document.querySelector(".text").shadowRoot.querySelector('input').value;     
            state.setMensaje(mensaje,this.rtdbRoomId);           
            console.log(state.getState(), 'en escribir mensaje como queda el estado ');
            console.log(this.mensaje, 'this.mensaje que tiene');
            
            
        });    
    }
    comienzo(){
        //Obtener el userId para usar el get(room/:roomId de la API) -> esto devuelve el rtdbRoomId.
        //Ver en que room estoy, entonces getMensajes(roomID), 
        state.getMensajes(this.rtdbRoomId).then((data)=>{
            this.mensaje = data;
            
            this.render();
        })
    }
    render():void{  
        console.log('this.mensaje en render chat ', this.mensaje);
        
        this.innerHTML=`
        <header-comp></header-comp>
        <h1>Chat</h1>
        <p class="room-id">room id: ${this.shortRoomId}</p>
        <div class="chat-cont">
       
        ${ 
            this.mensaje.map((m)=>{ 
                return `<div>${m.nombre}:${m.mensaje}</div>`
            }).join("")
        }
        </div>
        <div class="input">
        <textfield-comp class="text" label=""></textfield-comp>
        </div>
        <div class="boton">
        <button-comp >Enviar</button-comp>
        </div>
        `
        this.escribirMensaje();    
    }
    
}
customElements.define("chat-page", initChat);



//va en chat-cont
