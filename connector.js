import {getAllComents} from "./comment.js"
import {createPost} from "./post.js"


function attachEvents(){
    let homeLink=document.querySelector("a");
    let dynamicDiv=document.getElementById("dynamicDiv");

    
    homeLink.addEventListener("click", function(e){
        e.preventDefault();
        let mainContainer=document.querySelector(".container");
        if (mainContainer.style.display=="none"){
            mainContainer.style.display="block";
            dynamicDiv.style.display="none";
        }
    })
    createPost();
}

attachEvents();