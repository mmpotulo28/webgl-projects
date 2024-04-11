//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector('canvas')
let gl = canvas.getContext("webgl")

//import mat4 Matrix library
import * as mat4 from '/mat4.js';

//define rgb colors
var red = 0.0
var green = 0.0
var blue = 0.0

 
//Step 2: Set Canvas Color
gl.clearColor(red, green, blue, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

//Step 3: Set Vertices in Array form
var circle = [0, 0, 0];
//create an array with initial value (1,0,0)
function drawCircle() {

  var x, y, z;
  var r = 0.5;
  var alpha = Math.PI / 4;

  for (alpha = 0; alpha < 2 * Math.PI; alpha += Math.PI / 4) {
    x = r * Math.cos(alpha);
    y = r * Math.sin(alpha);
    z = 0;

    //add values to the array
    circle.push(x);
    circle.push(y);
    circle.push(z);
      
      
    }
    return circle;
}

const position = new Float32Array(drawCircle())
console.log("Vertices", position.length / 3);

//Step 4: Set color coordinates in Array form (RBG)
const colors = new Float32Array([
    //1st triangle
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    //2st triangle
    1.0, 0.0, 1.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,

    //3rd triangle
    1.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0,

])
 
//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
 
//Step 6: Create, and bind Color Buffer
const colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
 
//Step 6: Create Vertex Shader
const vsSource = `
attribute vec3 pos;
attribute vec3 col;
varying vec3  vColor;
uniform mat4 xMatrix;

void main() {
    gl_Position = xMatrix * vec4(pos, 1.0);
    vColor = col;
}`
 
//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)
 
//Step 9: Create Fragment Shader
const fsSource = `
precision mediump float;
varying vec3 vColor;
void main (){gl_FragColor = vec4(0.5,0,1, 1.0);}`
 
//Step 10: get JS reference for fragment shader, pass and compile shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);
 
//Step 11: Create program, attach shaders and link program
const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
 
//Step 12: Use program, enable Vertex attributes
gl.useProgram(program)
gl.enableVertexAttribArray(gl.getAttribLocation(program, `pos`))
gl.enableVertexAttribArray(gl.getAttribLocation(program, `col`))
 
//Step 13: Bind buffers (position and color), and set vertex attribute pointers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `pos`), 3, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `col`), 3, gl.FLOAT, false, 0, 0)
 
//Step 14: Draw Triangles
//gl.drawArrays(gl.TRIANGLES, 0, position.length)

//Step 15: Draw Lines
gl.drawArrays(gl.TRIANGLE_FAN, 0, circle.length/3)


const button =  document.querySelector('button')
var counter = 0;
button.innerHTML = counter;

/*************************Rotation by x***********************/
const xMatrix = gl.getUniformLocation(program, `xMatrix`)
//debug xMatrix location
if(gl.getActiveUniform(program, xMatrix) == null){
    console.log("xMatrix Not found: ", gl.getActiveUniform(program, xMatrix));
}

var angle = 0;
var angleInRad;
const identityMatrix = mat4.create()
var xRotMatrix = mat4.create()

/*************************Rotation by y***********************/

function draw() {
    //canvas
    gl.clearColor(red, green, blue, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.enable(gl.DEPTH_TEST)

    //increment counter
    counter += 1;

    //check if counter is the multiples of 60
    if (counter % 60 == 0) {
        button.innerHTML = counter/60
    }

    //for x rotation
    angle += 1;
    angleInRad = Math.PI/180 * angle;
    
    xRotMatrix = mat4.rotateX(xRotMatrix, identityMatrix, angleInRad)

    //get value of xMatrix
    gl.uniformMatrix4fv(xMatrix, false, xRotMatrix)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, position.length)

    //console.log(xRotMatrix);
    window.requestAnimationFrame(draw)
}
draw()