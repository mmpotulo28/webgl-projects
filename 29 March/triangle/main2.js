//Step 1: Get Canvas reference, and get webgl context
const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

// create a texture object
const texture = gl.createTexture()

//Step 2: Set Canvas Color
gl.clearColor(1, 1, 1, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

//Step 3: set up the triangle vertices and texture coordinates
const vertices = [-0.5, -0.5, 0.5, -0.5, 0, 0.5]

//Step 4: Set texture coordinates in Array form
const texcoords = [0, 0.5, 0.5, 1, 1.0]

//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

//Step 6: Create, and bind texture Buffer
const texcoordBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW)

// load an image into the texture
const image = new Image()
image.src = "removed.png"

image.onload = function () {
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.generateMipmap(gl.TEXTURE_2D)
}

//Step 6: Create Vertex Shader
const vertexShaderSource = `
  attribute vec2 pos;
  attribute vec2 aTextCoord;
  varying vec2 vTextCoord;
  void main() {
    gl_Position = vec4(pos, 0, 1);
    vTextCoord = aTextCoord;
  }
`

//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)

//Step 9: Create Fragment Shader
const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_texture;
  varying vec2 vTextCoord;
  void main() {
    gl_FragColor = texture2D(u_texture, vTextCoord);
  }
`

//Step 10: get JS reference for fragment shader, pass and compile shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragmentShaderSource)
gl.compileShader(fragmentShader)

//Step 11: Create program, attach shaders and link program
const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

//Step 12: Use program, enable Vertex attributes
gl.useProgram(program)
const positionLocation = gl.getAttribLocation(program, 'pos')
gl.enableVertexAttribArray(positionLocation)
const texcoordLocation = gl.getAttribLocation(program, 'aTextCoord')
gl.enableVertexAttribArray(texcoordLocation)

//Step 13: Bind buffers (position and color), and set vertex attribute pointers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0)

// bind the texture to the shader program
const textureLocation = gl.getUniformLocation(program, 'u_texture')
gl.uniform1i(textureLocation, 0)
gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D, texture)

//Step 14: Draw Triangles
gl.drawArrays(gl.TRIANGLES, 0, 3)

/* DEBUGGING shader errors*/
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {

    console.error('Error! ' + 'Fragment shader is not compiled.\n' + '\nFrag Shader Reason:' + gl.getShaderInfoLog(fragmentShader))
  }

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    
    console.error('Error! Vertex shader is not compiled.\n' + '\nReason:\n' + gl.getShaderInfoLog(vertexShader))
  }
}

