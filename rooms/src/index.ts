import { initButton } from "./components/button";
import { initHeader } from "./components/header";
import { initTextField } from "./components/input";
import { initOptions } from "./components/input-options";
import "./pages/home/index";
import "./pages/chat/index";
import "./routes"



(function main(){
    initButton();
    initHeader();
    initTextField();
    initOptions();
    
})()

