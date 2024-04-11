
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
const circle = [0,0,0]
var xC, yC, i

for(i = 0; i< 2*Math.PI; i += Math.PI/4){
    xC = Math.cos(i);
    yC = Math.sin(i);
    circle.push(xC, yC, 0);
}
const vertices = new Float32Array(circle);

//Step 4: Set color coordinates in Array form (RBG)
const colors = new Float32Array([
  //front face -red
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  //back face -blue
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

  //top face -green
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  //bottom face -yellow
  1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  //right face -orange
  1, 0.5, 0, 1, 0.5, 0, 1, 0.5, 0, 1, 0.5, 0, 1, 0.5, 0,
  //left face -purple
  1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
]);

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

void main(){
    gl_Position = vec4(
        pos.x, 
        pos.y,
        pos.z,
        2.0);
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
    gl_FragColor = vec4(vColor, 1.0);
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
var theta = 0;

function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    
    //theta += 0.01;
    
    gl.uniform1f(angleLoc,  theta)
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length);
    window.requestAnimationFrame(draw);
}
draw();