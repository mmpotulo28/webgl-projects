const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

//set canvas color
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

const vertices = new Float32Array([0.0, 0.0, -0.5, -0.5, 0.5, -0.5])

const colours = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
])

//create and bind buffer
const posBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

//create and bind colour buffer
const colBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colours, gl.STATIC_DRAW);

//create vertex shader
const vsSource = `
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 fragmentColours;
    float shrink = 0.25;
    
    void main() {
        gl_Position = vec4(position.x*shrink, position.y*shrink, 0, 1);
        fragmentColours = color;
    }`

//create javascript reference, pass source AND COMPILE
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)

const fsSource = `
    precision mediump float;
    varying vec3 fragmentColours;
    void main() {
        gl_FragColor = vec4(fragmentColours, 1.0);
    }`

//create js reference, pass and compile shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

//create, attach shader and link program
const program = gl.createProgram();
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program);

//use program and enable attributes
gl.useProgram(program)
gl.enableVertexAttribArray(gl.getAttribLocation(program, `position`))
gl.enableVertexAttribArray(gl.getAttribLocation(program, `color`))


//bind buffer and define attribute pointer
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `position`), 2, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `color`), 3, gl.FLOAT, false, 0, 0)

//draw
gl.drawArrays(gl.TRIANGLES, 0, 3)

/* DEBUGGING */
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  var info = gl.getProgramInfoLog(program)
  throw new Error('Could not compile WebGL program. \n\n' + info)
}
