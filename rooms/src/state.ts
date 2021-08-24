import {rtdb} from "./rtdb"
import map from "lodash/map";

const API_BASE_URL =  "http://localhost:3000"

//INIT cuando sepa en que room estoy



const state = {
    data: {
        nombre:"",
        mensaje: [],
    },
    listeners:[],

    subscribe(callback:(any) =>any){
        this.listeners.push(callback);
    },
    getState(){
        return this.data;
    },
    setState(newState):void{
        this.data = newState;
        for(const cb of this.listeners){       
            cb();         
        }          
        console.log('cambie:', this.data);
    },
    setInfo(email:string, nombre:string):Promise<any>{
        const estadoActual = this.getState();
        estadoActual.nombre = nombre;
        this.setState(estadoActual);

        return fetch(API_BASE_URL+"/signup",{
            method: "post",
            headers:{
                "content-type":"application/json",
            },
            body: JSON.stringify({
                email,
                nombre,
            })
        })
    },
    getUserIdAuth(email:string):Promise<any>{

        return fetch(API_BASE_URL+"/auth",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify({
                email,
            })            
        }).then(res=>{
            return res.json().then(data=>{
                return data;
            })
            
        })
    },
    setRoom(emailId:string):Promise<any>{
        return fetch(API_BASE_URL+"/rooms",{
            method: "post",
            headers:{
                "content-type":"application/json",
            },
            body: JSON.stringify({
                emailId,
            })
        })
    },
    getRoom(roomId:string):Promise<any>{
        console.log(roomId,'como entra room id');
        
        return fetch(API_BASE_URL+`/roomId/${roomId}`,{
            method:"get",
        }).then(res=>{
            return res.json().then(data=>{
                return data;
            })
        })
    },
    getUserId(email:string){
        return fetch(API_BASE_URL+`/user/${email}`,{
            method:"get",
        }).then(res=>{
            return res.json().then(data=>{
                return data;
            })
        })
    },
    getRtdbRoomId(shortRoomId:string, userId:string){
        return fetch(API_BASE_URL+`/rooms/${shortRoomId}?userId=${userId}`,{
            method:"get",
        }).then(res=>{
            return res.json().then(data=>{
                return data;
            })
        })
    },

    //AGREGAR ID DEL ROOM 
    setMensaje(mensaje:string,rtdbRoomId:string):void{   
        const name = this.data.nombre;
        console.log(` mensaje : ${mensaje}, rtdbroomId: ${rtdbRoomId}, nombre : ${name}`);        
        fetch(API_BASE_URL+`/mensajes/${rtdbRoomId}`,{
            method:"post",
            headers: {
                "content-type":"application/json",
            },
            body: JSON.stringify({
                nombre: name,
                mensaje: mensaje,
            })
        });
    },
    init(rtdbroomId:string){        
        const referencia = rtdb.ref(`/chatrooms/rooms/${rtdbroomId}/mensajes`);
        const stateActual = this.getState();
        referencia.on("value",(snap)=>{
            const mensajesGuardados = snap.val();
            const lista = map(mensajesGuardados);
            console.log(lista, 'lista en state');
                        
            stateActual.mensaje = lista;
            this.setState(stateActual);    
        });
    },
    getMensajes(rtdbRoomId:string) :Promise<any>{
        return fetch(API_BASE_URL+`/mensajes/${rtdbRoomId}`,{
            method:"get",
        }).then((res)=>{
            return res.json().then((data)=>{   
                return map(data)
            });      
        });   
    }
}


export{state};