let canvas = document.querySelector('canvas');
let context = canvas.getContext(2);

function btn(){
    canvas.style = "background-color: blue; ";
    
    //shrink the width and height
    canvas.width -= canvas.width*(10/100);
    canvas.height -= canvas.height*(10/100);

    /*
    //DRAW CIRCLE
    context.beginPath();
    context.arc(100,50,20,0,2*Math.PI);
    context.stroke();
    */

    //log the current values of width and height on the console
    console.log('width', canvas.width);
    console.log('height', canvas.width);

    
}