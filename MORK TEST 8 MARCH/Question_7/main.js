//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector('canvas')
let gl = canvas.getContext('webgl')

//Step 2: Set Canvas Color
gl.clearColor(1, 1, 1, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

//Step 3: Set Vertices in Array form
const position = new Float32Array([
    //Top triangle
    0, 0.5,
    -0.5, 0,
    0.5, 0,
    //buttom triangle
    -0.5, 0,
    0.5, 0,
    0, -0.5
])

//Step 4: Set color coordinates in Array form (RBG)
const color = new Float32Array([
    //Top triangle
    0, 0, 0,
    0, 1, 1,
    1, 0, 1,
    //Buttom triangle
    0, 1, 1,
    1, 0, 1,
    1, 1, 0
])

//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)

//Step 6: Create, and bind Color Buffer
const colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW)

//Step 6: Create Vertex Shader
const vsSource = `
    attribute vec2 pos;
    attribute vec3 col;
    varying vec3 fragCol;
    uniform float shiftx;
    uniform float shifty;

    void main() {
        gl_Position = vec4(
            pos.x + shiftx, 
            pos.y + shifty, 
            0, 1);
        fragCol = col;
    }`

//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)

//Step 9: Create Fragment Shader
const fsSource = `
    precision mediump float;
    varying vec3 fragCol;

    void main (){
        gl_FragColor = vec4(fragCol, 1.0);
    }`

//Step 10: get JS reference for fragment shader, pass and compile shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fsSource)
gl.compileShader(fragmentShader)

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
gl.drawArrays(gl.TRIANGLES, 0, 6)


//Step 15: Draw function

//Configure the draw function & animations
const shiftx = gl.getUniformLocation(program, 'shiftx')
const shifty = gl.getUniformLocation(program, 'shifty')
var x = 0;
var y = 0;
var start = -1;
var direction = 1;

function draw() {

    if (start == 1) {

        x += 0.01 * direction
        y += (0.01) * direction

        //log the values to console
        console.log("X = ", x);
        console.log('Y = ', y)

        //limit movement to the boundries
        if (x >= 0.5 || x<= -0.5 || y>= 0.5 || y<= -0.5) {
            direction *= -1;
        }

        gl.uniform1f(shiftx, x)
        gl.uniform1f(shifty, y)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        window.requestAnimationFrame(draw)
    }   
}

//start and stop the rotation
function start_stop() {
    start *= -1
    draw()
}


