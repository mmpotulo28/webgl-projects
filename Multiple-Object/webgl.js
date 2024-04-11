//1. Get a webgl context from the canvas
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

//2. Set canvas color
gl.clearColor(0.0, 0.0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

//3.1 Specify vertex data
//vetex data for triangle
const triangle = tri()
const cube = cub()
const circle = cir()

function tri(){

  let triangle = []
  let tx, ty, tz, tAngle
  let r = 0.3
  let incr = 90 * Math.PI/180

  for( tAngle = 0; tAngle <= Math.PI; tAngle += incr){
      tx = r* Math.cos(tAngle) - 0.5
      ty = r* Math.sin(tAngle) + 0.5
      tz = 0;

      triangle.push(tx)
      triangle.push(ty)
      triangle.push(tz)
    }
  
  return triangle
}
/*------------------------------------------------------------------------------*/
function cub(){

  let cube = [0.5,0.5,0]
  let x, y, z, angle
  let r = 0.3
  let angle1 = 315 * Math.PI/4
  let angle2 = 45 * Math.PI/180
  let angle3 = 135 * Math.PI/180
  let angle4 = 225 * Math.PI/180
  let incr = 60 * Math.PI/180

  for( angle = 0; angle <= 2* Math.PI; angle += incr){
    
      x = r* Math.cos(angle) + 0.5
      y = r* Math.sin(angle) + 0.5
      z = 0

      cube.push(x)
      cube.push(y)
      cube.push(z)
    
  }
  return cube
}
/*------------------------------------------------------------------------------*/
function cir(){

  let circle = [-0.5,-0.5,0]
  let x, y, z, angle
  let r = 0.3
  let incr = 45 * Math.PI/180

  for( angle = 0; angle <= 2* Math.PI; angle += incr){
    
      x = r* Math.cos(angle) - 0.5
      y = r* Math.sin(angle) - 0.5
      z = 0

      circle.push(x)
      circle.push(y)
      circle.push(z)
  }
  return circle
}
/*------------------------------------------------------------------------------*/

const positions = new Float32Array(triangle.concat(circle).concat(cube))
console.log(cube);

//3.2 Specify COLOR data
const colors = [
  1, 1, 0,   // Yellow (mixture of red and green)
  0, 1, 1,   // Cyan (mixture of green and blue)
  1, 0, 1    // Purple (mixture of red and blue)
];

//4.1 Create buffer(s) for position
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

//5.1 Create buffer for colour.
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//6.1 Create the VERTEX shaders source
const vertexShaderSource = `
  attribute vec3 position;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    gl_Position = vec4(position, 1.0);
    vColor = color;
  }`;

//6.2 Create Javascript reference to the shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);

//6.3 Pass the shader sources to the shader reference and compile
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

//7.1 Create the FRAGMENT shaders source
const fragmentShaderSource = `
  precision mediump float;
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(1,0,0, 1.0);
  }
`;

//7.2 Create Javascript reference to the shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

//7.3 Pass the shader sources to the shader reference and compile
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

///9. Create a program, attach shaders and link program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//10. Use the program and enable the vertex attributes for position and color
gl.useProgram(program);
gl.enableVertexAttribArray(gl.getAttribLocation(program, 'position'));
gl.enableVertexAttribArray(gl.getAttribLocation(program, 'color'));

//11. Set the buffer for the position attribute and enable it
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(gl.getAttribLocation(program, 'position'), 3, gl.FLOAT, false, 0, 0);

//12. Set the buffer for the color attribute and enable it
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(gl.getAttribLocation(program, 'color'), 3, gl.FLOAT, false, 0, 0);

//13. Define Variables to use on draw function
gl.drawArrays(gl.TRIANGLES, 0 ,  3)
console.log(cube.length);
gl.drawArrays(gl.TRIANGLE_FAN, 4, cube.length/3)
console.log(circle.length);
gl.drawArrays(gl.TRIANGLES, 25 ,  circle.length/3)