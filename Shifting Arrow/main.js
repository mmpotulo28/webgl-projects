//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector('canvas')
let gl = canvas.getContext("webgl")
var red = 0.0
var green = 0.0
var blue = 0.0

 
//Step 2: Set Canvas Color
gl.clearColor(red, green, blue, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
 
//Step 3: Set Vertices in Array form
const position = new Float32Array([
    0.5, 0.0, 0, 0.5, 0, -0.5,
    0.0, 0.25, -0.5, -0.25, -0.5, 0.25,
    0.0, 0.25, 0.0, -0.25, -0.5, -0.25,
])
 
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
attribute vec2 pos;
attribute vec3 col;
varying vec3  vColor;
uniform float shift;

void main() {
    gl_Position = vec4(
        pos.x + shift,
        pos.y,
        0, 1);
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
gl.vertexAttribPointer(gl.getAttribLocation(program, `pos`), 2, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `col`), 3, gl.FLOAT, false, 0, 0)
 
//Step 14: Draw Triangles
gl.drawArrays(gl.TRIANGLES, 0, 30)


const shifting = gl.getUniformLocation(program, `shift`)
var x = 0.0;
var start = -1;
var direction = 1;

function buttonStart() {
    // body
    start *= -1;
    red = 0.0;
    green = 0.0;
    blue = 0.0;

    draw();
}

function draw() {
    if (start == 1) {
        gl.clearColor(red, green, blue, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        if (x > 1.7) {
            //direction *= -1;   
            x = -1.5;
        }

        x += 0.01 * direction;

        gl.uniform1f(shifting, x)
        gl.drawArrays(gl.TRIANGLES, 0, 30)
        window.requestAnimationFrame(draw);
    }
    
}

function changeColor() {
    red = Math.random()
    green = Math.random()
    blue = Math.random()

    console.log("R:", red + " | G:", green + " | B:", blue);

}


 