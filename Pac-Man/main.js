import * as mat4 from '/mat4.js'

//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector("canvas");
let gl = canvas.getContext("webgl");

canvas.width = 400;
canvas.height = 400;

//Step 2: Set Canvas Color
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);

//Step 3: Set Vertices in Array form
//cube vertices
const circle1 = [0.0,0.0,0]
var xC, yC, i
var r = 0.3


for(i = 0; i< 1.8*Math.PI; i += Math.PI/30){
    xC = r* Math.cos(i)
    yC = r* Math.sin(i)
    circle1.push(xC, yC, 0);
}


//circle 2
const circle2 = [0,0,0]

for(i = 0; i< 1.8*Math.PI; i += Math.PI/30){
    xC = (r * Math.cos(i))
    yC = (r * Math.sin(i))
    circle2.push(xC, yC, 0);
}


const vertices = new Float32Array(circle1.concat(circle2));

//Step 4: Set color coordinates in Array form (RBG)
const col = []
var r, g, b
var len = vertices.length

for(i = 0; i< len ; i++){
    r = Math.random();
    b = Math.random();
    g = r * b

    col.push(r,g,b)
}

const colors = new Float32Array(col);

//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//Step 6: Create, and bind Color Buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

//Step 6: Create Vertex Shader
const vsScourse = `
attribute vec3 pos;
attribute vec3 color;
varying vec3 vColor;
uniform float angle;
uniform mat4 model;

void main(){
    gl_Position = model * vec4(
        pos.x, 
        pos.y,
        pos.z,
        1.0);
    vColor = color;
}`

//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsScourse);
gl.compileShader(vertexShader);

//Step 9: Create Fragment Shader
const fsScourse = `
precision mediump float;
varying vec3 vColor;

void main(){
    gl_FragColor = vec4(1.0,1.0,0.0, 1.0);
}`

//Step 10: get JS reference for fragment shader, pass and compile shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fsScourse);
gl.compileShader(fragmentShader);

//Step 11: Create program, attach shaders and link program
const program = gl.createProgram()
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

//Step 12: Use program, enable Vertex attributes
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
let pos = gl.getAttribLocation(program, "pos");
gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(pos);

//Step 13: Bind buffers (position and color), and set vertex attribute pointers
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
let color = gl.getAttribLocation(program, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(color);

//Step 14: Draw Triangles

const angleLoc = gl.getUniformLocation(program, "angle");
const model = gl.getUniformLocation(program, "model")
var theta = 0;
var xDir = 0, yDir = 0
var x, y, xmeasure = 0, ymeasure = 0
var start = -1
var xtrace = 0.7, ytrace = 0.7
var xtDir = 0, ytDir = 0, xt, yt


const id1 = mat4.create()

const id2 = mat4.create()
mat4.translate(id2, id2, 0.7, 0.7, 0)

function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    
    if(start == 1){

        /////////////////object 3////////////////////////////
        if(xDir !=0 || yDir !=0){
            xmeasure += 0.01 * xDir
            ymeasure += 0.01 * yDir
        }
        console.log("X position: " + xmeasure + "\nY position: " + ymeasure)

        /********boundaries*********/
        if(xmeasure > 0.7 || xmeasure < -0.7){
            xDir = 0
        }
        if(ymeasure > 0.7 || ymeasure < -0.7){
            yDir = 0
        }

        x = 0.01 * xDir
        y = 0.01 * yDir
        
        mat4.translate(id1, id1, x, y, 0)

        /////////////////object 2////////////////////////////
        if(xtDir !=0 || ytDir !=0){
            xtrace += 0.01 * xtDir
            ytrace += 0.01 * ytDir
            console.log("XT position: " + xtrace + "\nYT position: " + ytrace)
        }

        /********tracking logic*********/
        if(xmeasure < xtrace/2){
            xtDir = -1
        }
        if(xmeasure > xtrace/2){
            xtDir = 1
        }

        if(ymeasure < ytrace/2){
            ytDir = -1
        }
        if(ymeasure > ytrace/2){
            ytDir = 1
        }

        /********boundaries*********/
        if(xtrace > 0.2 || xtrace < -1.4){
            xtDir = 0
            console.log("x boudary reached!: ", xtrace);
        }
        if(ytrace > 0.2 || ytrace < -1.4){
            ytDir = 0
            console.log("Y boudary reached!: ", ytrace);
        }

        xt = 0.01 * xtDir
        yt = 0.01 * ytDir
        console.log("xtrace: "+xtrace+" ytrace: "+ytrace);

        mat4.translate(id2, id2, xt, yt, 0)
    }

    gl.uniformMatrix4fv(model, false, id1)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, circle1.length/3);

    gl.uniformMatrix4fv(model, false, id2)
    gl.drawArrays(gl.TRIANGLE_FAN, circle1.length/3, circle2.length/3)
    
    window.requestAnimationFrame(draw);
}
draw();

//window key directions
window.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: // left arrow
            xDir = -1;
            yDir = 0
            break;
        case 38: // up arrow
            yDir = 1;
            xDir = 0
            break;
        case 39: // right arrow
            xDir = 1;
            yDir = 0
            break;
        case 40: // down arrow
            yDir = -1;
            xDir = 0
            break;
    }
}

const startBtn = document.querySelector("#start")
startBtn.onclick = function(){
    start *= -1
    
    if(start == 1){
        console.log("Start")
    }else if(start == -1){
        console.log("Stop")
    }
}



