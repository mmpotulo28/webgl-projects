const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

//set cnvas colour
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

//specicy the position
const positions = [0.0, 0.0, -0.5, -0.5, 0.5, -0.5]

//Create buffer(s) for position
const positionBuffer = gl.createBuffer()

//4.2 Bind the Position buffer as the current buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

//Create the VERTEX shaders source
const vertexShaderSource = `
  attribute vec2 position;
  float shrink = 1.0;
  void main() {
    gl_Position = vec4(position.x * shrink, position.y * shrink, 0.0, 1.0);
  }`;

//create java script reference to the shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)

//pass shader source to the shader reference an compile it
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)

const fsSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0,0,1, 1.0);
  }`;

//create java script reference to the shader
const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

//pass shader source and compile
gl.shaderSource(fragShader, fsSource)
gl.compileShader(fragShader)

//create program and attach shaders and link program
const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragShader)
gl.linkProgram(program)

//use program and enable vertex attributes
gl.useProgram(program)
gl.enableVertexAttribArray(gl.getAttribLocation(program, `position`))

//bind buffer and  define attribute pointer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `position`), 2, gl.FLOAT, false, 0, 0)

//draw triangle
gl.drawArrays(gl.TRIANGLES, 0, 3)

/* DEBUGGING */
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  var info = gl.getProgramInfoLog(program)
  throw new Error('Could not compile WebGL program. \n\n' + info)
}
