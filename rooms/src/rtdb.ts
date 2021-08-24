import firebase from "firebase";
firebase.initializeApp({
    apiKey: "IBP2njRVLYQ0YVJ6Q3zzkg23WsImQ4dMtrRlD2AB",
    databaseURL: "https://real-time-d3-default-rtdb.firebaseio.com/",
    authDomain: "real-time-d3.firebaseapp.com",
    
});
const rtdb = firebase.database();
export {rtdb} 