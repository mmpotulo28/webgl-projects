//1. Get a webgl context from the canvas
const canvas = document.getElementById(`mycanvas1`)
const webgl = canvas.getContext(`webgl`)
if (!webgl) {
  throw new Error('WebGL not available/supported')
}
// 2. Set canvas color
webgl.clearColor(0.0, 0.0, 0, 1)
webgl.clear(webgl.COLOR_BUFFER_BIT)

//3. Specify vertex data
const vertices = new Float32Array([
    0.0, 0.9,           //top of the triangle 
    -0.9, -0.0,     //bottom left of the triangle
    0.9, -0.0,       //bottonm right of the triangle
])

const colours = new Float32Array([1,0,0, 0,1,0, 0,0,1])

//4. Create buffer(s) for position, colour, or combined
const buffer = webgl.createBuffer()
const colorBuffer = webgl.createBuffer()

//5. Bind the buffer as the current buffer
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer)
webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer)

//6. Specify that buffer data from vertex data
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW)
webgl.bufferData(webgl.ARRAY_BUFFER, colours, webgl.STATIC_DRAW)

//7. Create the two shaders source
const vsSource = `     
attribute vec2 pos;
attribute vec3 colours;
varying vec3 fragcolours;
float shiftx = 0.2;
void main() { 
    gl_Position = vec4(pos,0,1); 
    fragcolours = colours;
}`
const fsSource = `
precision mediump float;
varying vec3 fragcolours;
void main() { gl_FragColor = vec4(fragcolours, 1.0);
}`

//8. Create Javascript reference to the shaders
const vertexShader = webgl.createShader(webgl.VERTEX_SHADER)
const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER)

//9. Pass the shader sources to the shader reference
webgl.shaderSource(vertexShader, vsSource)
webgl.shaderSource(fragmentShader, fsSource)

//10. Compile the shaders
webgl.compileShader(vertexShader)
webgl.compileShader(fragmentShader)

//11. Create a program, attach shaders and link program
const program = webgl.createProgram()
webgl.attachShader(program, vertexShader)
webgl.attachShader(program, fragmentShader)
webgl.linkProgram(program)
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer)

//12. Find a reference to each of the attributes in the shader
const positionLocation = webgl.getAttribLocation(program, `pos`)
const coloursLocation = webgl.getAttribLocation(program, `colours`)

//13.Enable the attribute, it is disabled by default
webgl.enableVertexAttribArray(positionLocation)
webgl.enableVertexAttribArray(coloursLocation)

//14. Specify the layout of the vertex data
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0)
webgl.vertexAttribPointer(coloursLocation, 3, webgl.FLOAT, false, 0, 0)

//specify which program you are using
webgl.useProgram(program)

//15. finally draw the primitives i.e triangles/lines
webgl.drawArrays(webgl.TRIANGLES, 0, 3)
