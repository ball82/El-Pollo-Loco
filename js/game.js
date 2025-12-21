let canvas;
let world;
let keyboard = new Keyboard(); 





function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    console.log("My Caracter is", world.character);
    console.log("My Enemies are", world.enemies);
}


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        keyboard.right = true;
    }
    if (event.key === "ArrowLeft") {
        keyboard.left = true;
    }
    if (event.key === "ArrowUp") {
        keyboard.up = true;
    }
    if (event.key === "ArrowDown") {
        keyboard.down = true;
    }
    if (event.key === " ") {
        keyboard.space = true;
        world.character.jump();
    }       
    
}); 
    
document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
        keyboard.right = false;
    }                   
    if (event.key === "ArrowLeft") {
        keyboard.left = false;
    }
    if (event.key === "ArrowUp") {
        keyboard.up = false;
    }
    if (event.key === "ArrowDown") {
        keyboard.down = false;
    }
    if (event.key === " ") {
        keyboard.space = false;
    }

});
