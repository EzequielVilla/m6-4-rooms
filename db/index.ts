import * as express from "express"
import { rtdb, firestore } from "./rtdb";
import {json} from "body-parser";
import { nanoid } from "nanoid";
import * as cors from "cors";

//configuracion del servidor.
const port = 3000;
const app = express();


//en firebase se modifica la regla de la rtdb
//Linea 3 chatrooms por rooms
//Toma y trata el request (req)
app.use(express.json());
app.use(cors());

//chequear en firestore que exista para que no tire error. 
const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

//chequea si existe el mail o no para crear el usuario .
//ENDPOINT
app.post("/signup", (req,res)=>{
    //El uso de {} simplifica lo siguiente => const email = req.body.email;
    const {email,nombre} = req.body;
    //where busca los elementos que cumplan la condicion.
    userCollection.where("email", "==", email).get().then(searchResponse=>{
        //empty. si la respuesta esta vacia creo el usuario .
        if(searchResponse.empty){
            //agrego objeto a la coleccion
            userCollection.add({
                email,
                nombre
            }).then((newUserRef)=>{
                res.json({
                    id : newUserRef.id,
                    new: true,
                })
            })
        } else{
                //searchResponse devuelve un array, no solo el objeto pedido y en su primera posicion esta el email que buscamos. Por eso el [0]
                // id: searchResponse.docs[0].id,
            res.status(400).json({
                message: 'User already exists',
            })
        }
    })
})

app.post("/auth", (req,res)=>{
    const {email} = req.body;    
    userCollection.where("email", "==", email).get().then(searchResponse=>{         
        if(searchResponse.empty){            
            res.status(400).json({
                message: 'User dont exists',
            })        
        } else{                    
            res.json({               
                //devuelve el ID en firestore
                id: searchResponse.docs[0].id,
            })
        }
    })
})

//2 Endpoints en la rtdb.
//Crear Room devuelve un ID sencillo, de 4 numeros para transmitir el ID a otra persona.
//get Room


app.post("/rooms", (req,res)=>{
    const {emailId} = req.body;    
    //solo existe si ya hay un registro con ese ID.
    userCollection.doc(emailId.toString()).get().then(doc=>{
        if(doc.exists){            
            const roomRef = rtdb.ref('/chatrooms/rooms/'+ nanoid());
            roomRef
            .set({
                mensajes: [],
                owner: emailId
            }).then(rtdbRes =>{
                //el ID de la RTDB
                const roomLongId = roomRef.key;
                //crea el numero del id sencillo
                const roomId = 1000 + Math.floor(Math.random()*999);
                //se crea un room para que tenga guardado adentro el ID de la RTDB asi no conocemos el ID Largo 
                roomsCollection.doc(roomId.toString()).set({
                    rtdbRoomId : roomLongId,
                }).then(()=>{})
                    res.json({
                        id:roomId.toString(),        
                    })
            })
        } else{
            res.status(401).json({
                message: "no existis",
            })
        }
    })
})
//Verifica si existe el room solicitado, devuelve true o false.
app.get("/roomId/:roomId",(req,res)=>{
    const {roomId} = req.params;    
    roomsCollection.doc(roomId.toString()).get().then(doc=>{
        res.json(doc.exists)
        return doc.exists;
    })
})
//Tomo el userID para obtener despues el rtdbRoomId.
app.get("/user/:email",(req,res)=>{
    const {email} = req.params;
    userCollection.where("email", "==", email).get().then(searchResponse=>{         
        if(searchResponse.empty){            
            res.status(400).json({
                message: 'User dont exists',
            })        
        } else{                    
            res.json({               
                //devuelve el ID en firestore
                id: searchResponse.docs[0].id,
            })
        }
    })
})

//tiene que llegar adicional un userID
//La barra de busqueda quedaria para postman (por ej)
// /rooms/1732?userId=uruhgl2i25h1f389 (todo el ID que despues vamos a tomar con req.query)
app.get("/rooms/:roomId", (req,res)=>{
    const {userId} = req.query;
    const {roomId} = req.params;
    
    userCollection.doc(userId.toString()).get().then(doc=>{
        if(doc.exists){
           //quiero buscar en la roomCollection el documento que tenga el ID igual al cortito, en este caso 1732
           //con esto tengo el rtdbRoomId
            roomsCollection.doc(roomId).get().then(snap=>{
                const data = snap.data();
                res.json(data);
            });
        } else{
            res.status(401).json({
                message: "no existis",
            })
        }
    })
})


//MENSAJES

app.post("/mensajes/:salaId", function(req,res){
    
    //sala ID tiene que ser el ID corto.
    const {salaId} = req.params;
    const mensajeRef = rtdb.ref(`/chatrooms/rooms/${salaId}/mensajes`);
    mensajeRef.push(req.body, function(){
        res.json('listo');
    });
});
app.get("/mensajes/:salaId", function(req,res){
    const {salaId} = req.params;
    const mensajesRef = rtdb.ref(`chatrooms/${salaId}/mensajes`);
    mensajesRef.once("value", (snap)=>{
        const contenido = snap.val();
        res.json(contenido);
    })    
})

app.listen(port,()=>{
    console.log(`escuchando en ${port}` );
});