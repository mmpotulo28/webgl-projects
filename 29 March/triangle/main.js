//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector('canvas')
let gl = canvas.getContext('webgl')
 
//Step 2: Set Canvas Color
gl.clearColor(0, 0, 0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
 
//Step 3: Set Vertices in Array form
const position = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5])
 
//Step 4: Set color coordinates in Array form (RBG)

 
//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
 
//Step 6: Create, and bind Color Buffer

//Step ?: Create, and bind texture buffer
const texCoord = new Float32Array([0, 0.5,  0.5, 1,   1.0])
const texBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
gl.bufferData(gl.ARRAY_BUFFER, texCoord, gl.STATIC_DRAW)

//create image object
const image = new Image()
image.src = "img.jpg"


 
//Step 6: Create Vertex Shader
const vsSource = `
    attribute vec2 pos;
    attribute vec2 textCord;
    varying vec2 vTextCord;
    void main() {
        gl_Position = vec4(pos, 0, 1);
        vTextCord = textCord;
    }`
 
//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)
 
//Step 9: Create Fragment Shader
const fsSource = `
    precision mediump float;
    varying vec2 vTextCord;
    uniform sampler2D uSampler;
    void main (){
        gl_FragColor = texture2D(uSampler, vTextCord);
    }`
 
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
gl.enableVertexAttribArray(gl.getAttribLocation(program, `textCord`))
 
//Step 13: Bind buffers (position and color), and set vertex attribute pointers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `pos`), 2, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `textCord`), 2, gl.FLOAT, false, 0, 0)

//create and bind texture
image.onload = function () {
    // image is loaded, continue with creating the texture
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D)
}

//Step 14: Draw Triangles
gl.drawArrays(gl.TRIANGLES, 0, 3)
 
/* DEBUGGING shader errors*/
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error( 'Error! ' + 'Fragment shader is not compiled.\n' +
            '\nFrag Shader Reason:\n' + gl.getShaderInfoLog(fragmentShader));
    }
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error! Vertex shader is not compiled.\n' +
            '\nReason:\n' + gl.getShaderInfoLog(vertexShader));
    }
}


