//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector('canvas')
let gl = canvas.getContext('webgl')
 
//Step 2: Set Canvas Color
gl.clearColor(1, 1, 1, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

//Step 3: Set Vertices in Array form
const position = new Float32Array([
    //2.font trangle 1
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,

    //2.front triangle 2
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,  
    
    //2.back trangle 1
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,

    //2.back triangle 2
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    //3.right triangle 1
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,

    //3.right triangle 2
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    //4.left triangle 1
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,

    //4.left triangle 2
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,

    //5.top triangle 1
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,

    //5.top triangle 2
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,

    //6.bottom triangle 1
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,

    //6. bottom triangle 2
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,

])

const colors = new Float32Array([
  //front face - red
  0, 1, 1,
  0, 1, 1,
  0, 1, 1,

  0, 1, 1,
  0, 1, 1,
  0, 1, 1,

  //back face - green
  0, 1, 1,
  0, 1, 1,
  0, 1, 0,
  
  0, 1, 1,
  0, 1, 0,
  0, 1, 0,

  //right face - blue
  0, 0, 1,
  0, 0, 1,
  0, 1, 0,

  0, 0, 1,
  0, 1, 0,
  0, 1, 0,

  //left face purple
  1, 0, 1,
  1, 0, 1,
  0, 1, 1,
  1, 0, 1,
  0, 1, 1,
  0, 1, 1,

  //top face yellow
  1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,

  //bottom face black
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);
 
//Step 4: Set color coordinates in Array form (RBG)
const textures = new Float32Array([
  //triangle 2
  0, 1, 0, 0, 1, 0,

  //trianlge 2
  0, 1, 0, 0, 1, 0,

  //back triangle 1
  0, 1, 0, 0, 1, 0,

  // back trianlge 2
  0, 1, 1, 1, 1, 0,

  //right trianlge 1
  0, 1, 0, 0, 1, 0,

  //right triangle 2
  0, 1, 0, 0, 1, 0,

  //left triangle 1
  0, 1, 0, 0, 1, 0,

  //left triangle 2
  0, 1, 1, 1, 1, 0,

  //top triangle 1
  0, 1, 0, 0, 1, 0,

  //top triangle 2
  0, 1, 1, 1, 1, 0,

  //bottom triangle 1
  0, 1, 0, 0, 1, 0,

  //bottom triangle 2
  0, 1, 1, 1, 1, 0,
]);
 
//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)

//Step 6: Create, and bind Color Buffer
const colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

//Step 6: Create, and bind Color Buffer
const texturebuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texturebuffer);
gl.bufferData(gl.ARRAY_BUFFER, textures, gl.STATIC_DRAW);
let imagedata = new Image();
imagedata.src = "t8.jpg";


 
//Step 6: Create Vertex Shader
const vsSource = `
    attribute vec3 pos;
    attribute vec2 texCoord;
    varying vec2 fTexCoord; 
    attribute vec3 col;
    varying vec3 vColor;
    uniform float angle;
    float x, y, z, w;
    void main() {
        x = pos.x * cos(angle) + pos.z * sin(angle);
        y = pos.y;
        z = pos.z * sin(angle) - pos.z * cos(angle);
        w = 1.0;

        gl_Position = vec4(x, y, z, w);
        fTexCoord = texCoord;
        vColor = col;
}`;
    
//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)
 
//Step 9: Create Fragment Shader
const fsSource = `
    precision mediump float;
    varying vec2 fTexCoord;
    uniform sampler2D uSampler;
    varying vec3 vColor;
    void main (){
        gl_FragColor = vec4(vColor,1);
        gl_FragColor = texture2D(uSampler,fTexCoord);
    }
    `;
 
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
gl.enableVertexAttribArray(gl.getAttribLocation(program, `col`));
gl.enableVertexAttribArray(gl.getAttribLocation(program, `texCoord`))

//Step 13: Bind buffers (position and color/texture), and set vertex attribute pointers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `pos`), 3, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `col`), 3, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, texturebuffer)
gl.vertexAttribPointer(gl.getAttribLocation(program, `texCoord`), 2, gl.FLOAT, false, 0, 0);

//texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagedata);
  //webgl.generateMipmap(webgl.TEXTURE_2D);

//Step 14: Draw Triangles


const rotation = gl.getUniformLocation(program, `angle`)
var thetha = Math.PI;
var start = -1;

function draw() {
    if (start == 1) {
        thetha += 0.01;

        gl.uniform1f(rotation, thetha);
        
        window.requestAnimationFrame(draw)

        console.log(thetha)
  }
  gl.drawArrays(gl.TRIANGLES, 0, position.length);
}

draw()

function startButton() {
  start *= -1;
  draw();
}



//debugging
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "Error! " +
        "Fragment shader is not compiled.\n" +
        "\nFrag Shader Reason:" +
        gl.getShaderInfoLog(fragmentShader)
    );
  }

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "Error! Vertex shader is not compiled.\n" +
        "\nReason:\n" +
        gl.getShaderInfoLog(vertexShader)
    );
  }
}