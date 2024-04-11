//Step 1: Get Canvas reference, and get webgl context
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

//Step 2: Set Canvas Color
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);

//Step 3: Set Vertices in Array form
let a = [1, 1, 1];
let b = [1, -1, 1];
let c = [-1, -1, 1];
let d = [-1, 1, 1];
let e = [1, 1, -1];
let f = [1, -1, -1];
let g = [-1, -1, -1];
let h = [-1, 1, -1]; 

const position = new Float32Array([
    //front face
    -1, 1, 1,
    1, 1, 1,
    1, -1, 1,
    
    -1, 1, 1,
    -1, -1, 1,
    1, -1, 1,

    //back face
    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,
    
    -1, 1, -1,
    -1, -1, -1,
    1, -1, -1,

    //left face
    -1, 1, 1,
    -1, 1, -1,
    -1, -1, -1,
    
    -1, 1, 1,
    -1, -1, -1,
    -1, -1, 1,

    //right face
    1, 1, 1,
    1, 1, -1,
    1, -1, -1,
    
    1, 1, 1,
    1, -1, -1,
    1, -1, 1,

    //top face
    -1, 1, 1,
    -1, 1, -1,
    1, 1, -1,
    -1, 1, 1,
    1, 1, -1,
    1, 1, 1,
    
    //bottom face
    -1, -1, 1,
    -1, -1, -1,
    1, -1, -1,
    -1, -1, 1,
    1, -1, -1,
    1, -1, 1,


]);


//Step 4: Set color coordinates in Array form (RBG)
const colors = new Float32Array([
    //front face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    
    //back face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    //left face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    //right face
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,

    //top face -purple
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,

    //bottom face -white
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
])
    

//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

//Step 6: Create, and bind Color Buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

//Step 6: Create Vertex Shader source
const vsSource = `
    attribute vec3 pos;
    attribute vec3 col;
    varying vec3 vColor;
    uniform float angle;
    
    //rotational matrices
    uniform mat4 rotX;
    uniform mat4 rotY;
    uniform mat4 rotZ;
    
    void main() {
            gl_Position = rotZ * rotY * rotX * vec4(pos, 2.0);
            vColor = col;
    }`;

//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

//Step 9: Create Fragment Shader source
const fsSource = `
    precision mediump float;    
    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1);
    }`

//Step 10: get JS reference for fragment shader, pass and compile shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

//Step 10: Create program, attach shaders and link program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//Step 11: Use program, enable Vertex attributes
gl.useProgram(program);
gl.enableVertexAttribArray(gl.getAttribLocation(program, 'pos'));
gl.enableVertexAttribArray(gl.getAttribLocation(program, 'col'));

//Step 12: Bind buffers (position and color), and set vertex attribute pointers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(gl.getAttribLocation(program, 'pos'), 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(gl.getAttribLocation(program, 'col'), 3, gl.FLOAT, false, 0, 0);


//Step 13: Draw Triangles
gl.drawArrays(gl.TRIANGLES, 0, position.length);


//debug program link status
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    //debug vertex shader source
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
    }

    //debug fragment shader source
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
    }

    console.error(
      "ERROR compiling Program!",
      console.log(gl.getProgramInfoLog(program))
    );
}
/*============================================================= */

/******************Rotaton***********************************/

const rotX = gl.getUniformLocation(program, 'rotX');
const rotY = gl.getUniformLocation(program, 'rotY');
const rotZ = gl.getUniformLocation(program, 'rotZ');
var xMatrix, yMatrix, zMatrix, iMatrix;

//function for identity rotational matrix
function identityMatrix() {
    iMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    return iMatrix;
}

yMatrix = identityMatrix();
xMatrix = identityMatrix();
zMatrix = identityMatrix();


//function for rotational matrix over the x axis
function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication

  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

//function for rotational matrix over the y axis
function rotateY(out, a, radian) {
  var s = Math.sin(radian);
  var c = Math.cos(radian);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication

  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

//function for rotational matrix over the z axis
function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication

  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/*=======================================================================*/
 
const angle = gl.getUniformLocation(program, 'angle');
var radian = 5;
var start = -1;
var rotValue = 0;

function buttonStart () {
    start *= -1;
    yMatrix = identityMatrix();
    xMatrix = identityMatrix();
    zMatrix = identityMatrix();
    draw();
}
function xRotation(){
    rotValue = 1;
}

function yRotation() {
    rotValue = 2;
}

function zRotation() {
    rotValue = 3;
}
function xyzRotation() {
  rotValue = 4;
}

/******************************Draw Funtion********************************/
function draw() {
    if (start == 1) {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      radian += 1;
      //convert radian to radians
      radian = radian * (Math.PI / 180);

      switch (rotValue) {
        case 0:
          break;

        case 1:
          xMatrix = rotateX(identityMatrix(), xMatrix, radian);
          break;
        case 2:
          yMatrix = rotateY(identityMatrix(), yMatrix, radian);
          break;
        case 3:
          zMatrix = rotateZ(identityMatrix(), zMatrix, radian);
          break;
        case 4:
          xMatrix = rotateX(identityMatrix(), xMatrix, radian);
          yMatrix = rotateY(identityMatrix(), yMatrix, radian);
          zMatrix = rotateZ(identityMatrix(), zMatrix, radian);
          break;
        default:
          console.error("Invalid Option!, chooose another one");
          break;
      }

      gl.uniform1f(angle, radian);
      gl.uniformMatrix4fv(rotX, false, xMatrix);
      gl.uniformMatrix4fv(rotY, false, yMatrix);
      gl.uniformMatrix4fv(rotZ, false, zMatrix);

      gl.drawArrays(gl.TRIANGLES, 0, position.length);
      window.requestAnimationFrame(draw);
      console.log(radian);
    }
}



 