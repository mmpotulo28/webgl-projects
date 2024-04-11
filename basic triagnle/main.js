let canvas = document.querySelector('canvas')
let gl = canvas.getContext('webgl')

//set canvas color
gl.clearColor(0.0, 0.0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

const positions = [0.0, 0.3, -0.5, -0.3, 0.5, -0.3]

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

const vsSource = `
    attribute vec2 position;
    void main(){
        gl_Position = vec4(position, 0.0, 1.0);
    }`

const fsSource = `
void main() {
    gl_FragColor = vec4(0.7, 0.0, 1.0, 1.0);
  }
`
//get javascript reference to shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

//Pass the shader sources to the shader reference and compile
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)

gl.shaderSource(fragmentShader, fsSource)
gl.compileShader(fragmentShader)

//attach shader and link program
const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

//find reference to each attribiute
const positionLocation = gl.getAttribLocation(program, 'position')
gl.useProgram(program)
gl.enableVertexAttribArray(positionLocation)

//Set the buffer for the position attribute and enable it
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

//draw triangle
gl.drawArrays(gl.TRIANGLES, 0, 3)
