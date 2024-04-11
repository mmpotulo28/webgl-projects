let canvas = document.querySelector('canvas')
let gl = canvas.getContext('webgl')

//set canvas color
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

//create position and color arrays
const vertex = new Float32Array([0, 0, -0.5, -0.5, 0.5, -0.5])
const colour = new Float32Array([1, 1, 0, 0, 1, 1, 1, 0, 1])

//create and bind buffer
const vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW)

const colourBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer)
gl.bufferData(gl.ARRAY_BUFFER, colour, gl.STATIC_DRAW)

//create vertex shader
const vertexShaderSource = `
    attribute vec2 pos;
    attribute vec3 col;
    varying vec3 fragCol;
    float shiftx = 0.8;

    void main() {
        gl_Position = vec4(pos.x+shiftx, pos.y+shiftx, 0, 1);
        fragCol = col;
    }`

//create javascript reference, pass source AND COMPILE
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)

//create fragment shader
const fragShaderSource = `
    precision mediump float;
    varying vec3 fragCol;

    void main() {
        gl_FragColor = vec4(fragCol, 1.0);
    }`

//create javascript reference, pass source AND COMPILE
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragShaderSource)
gl.compileShader(fragmentShader)

//create, attach shader and link program
const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)


//use program and enable attributes
gl.useProgram(program)
gl.enableVertexAttribArray(gl.getAttribLocation(program, `pos`))
gl.enableVertexAttribArray(gl.getAttribLocation(program, `col`))

//bind buffer and define attribute pointer
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `pos`), 2, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `col`), 3, gl.FLOAT, false, 0, 0)

//draw
gl.drawArrays(gl.TRIANGLES, 0, 3)

/* DEBUGGING */
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  var info = gl.getProgramInfoLog(program)
  throw new Error('Could not compile WebGL program. \n\n' + info)
}

function buttonClick() {
    shrink = 0.25;
    draw()
}
