//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector('canvas')
let gl = canvas.getContext("webgl")
var red = 1.0
var green = 1.0
var blue = 1.0
var r = 0.5

 
//Step 2: Set Canvas Color
gl.clearColor(red, green, blue, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
 
//Step 3: Set Vertices in Array form
const position = new Float32Array([
    //front triangle 1
    -r, r, r,
    -r, -r, r,
    r, -r, r,
    
    -r, r, r,
    r, r, r,
    r, -r, r,
    
    //back triangle
    -r, r, -r,
    -r, -r, -r,
    r, -r, -r,
    
    -r, r, -r,
    r, r, -r,
    r, -r, -r,

    //left face
    -r, r, r,
    -r, -r, r,
    -r, -r, -r,

    -r, r, r,
    -r, r, -r,
    -r, -r, -r,
    
    //right face
    r, r, r,
    r, -r, r,
    r, -r, -r,
    
    r, r, r,
    r, r, -r,
    r, -r, -r,

    //top face
    -r, r, r,
    r, r, r,
    r, r, -r,
    
    -r, r, r,
    -r, r, -r,
    r, r, -r,

    //buttom face
    -r, -r, r,
    r, -r, r,
    r, -r, -r,
    
    -r, -r, r,
    -r, -r, -r,
    r, -r, -r,

    //buttom face
    
    
])
 
//Step 4: Set color coordinates in Array form (RBG)
const colors = new Float32Array([
    //1st triangle - red
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    //back face -blue
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    //left face - green
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    //right face - yellow
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,

    //top face - purple
    0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,

    //buttom face - ligh blue
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,

    
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
uniform float shift;
float angle  = 1.0;

void main() {

    gl_Position = vec4(
        pos.x * cos(shift) + pos.z * sin(shift),
        pos.y * sin(shift) - pos.z * cos(shift),
        pos.x * cos(shift) - pos.z * sin(shift),
        1);
    /*
    gl_Position = vec4(
        pos.x * shift,
        pos.y * shift,
        pos.z,
        1.0);
        */
    vColor = col;
}`;
 
//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)
 
//Step 9: Create Fragment Shader
const fsSource = `
precision mediump float;
varying vec3 vColor;
void main (){gl_FragColor = vec4(vColor, 1.0);}`
 
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

const shift = gl.getUniformLocation(program, `shift`)
var x = 1;
var direction = 1;
draw()

function draw() {
        gl.clearColor(red, green, blue, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.uniform1f(shift, x)
        gl.drawArrays(gl.TRIANGLES, 0, position.length);
}

//get slider refrerence
const slider = document.querySelector(".slider"); 

//check if slider is not null
if (!slider) {
    console.log(slider);
    console.log("not getting the slider reference")
}

//get event listner for slider
slider.oninput = function () {
    x = slider.value; //GET VALUE of the slider
    console.log("Slider value: " + x);
    draw()
}

/*slider.addEventListener("input", (event) => {
    x = event.target.value
    console.log(x)
});*/


//debugging
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const info1 = gl.getShaderInfoLog(vertexShader)
        console.error("Error in Vertex Shader!\n" + info1)
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const info2 = gl.getShaderInfoLog(fragmentShader);
        console.error("Error in Fragment Shader!\n" + info2);
    }
}






 