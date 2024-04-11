//1. Get a webgl context from the canvas
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

//2. Set canvas color
gl.clearColor(0.0, 0.0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

//3.1 Specify vertex data
const positions = [
  0, 0.3,   // Vertex 1 (top)
  -0.5, -0.3,  // Vertex 2 (bottom-left)
  0.5, -0.3   // Vertex 3 (bottom-right)
];

//3.2 Specify COLOR data
const colors = [
  1, 1, 0,   // Yellow (mixture of red and green)
  0, 1, 1,   // Cyan (mixture of green and blue)
  1, 0, 1    // Purple (mixture of red and blue)
];
//4.1 Create buffer(s) for position
const positionBuffer = gl.createBuffer();

//4.2 Bind the Position buffer as the current buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//5.1 Create buffer for colour.
const colorBuffer = gl.createBuffer();

//5.2 Bind the colorbuffer as the current buffer
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//6.1 Create the VERTEX shaders source
const vertexShaderSource = `
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 vColor;
  uniform float shiftx;
  uniform float shifty;
  void main() {
    gl_Position = vec4(
      position.x + shiftx,
      position.y + shifty,
      0.0,
      1.0
    );
    vColor = color;
  }
`;
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
    gl_FragColor = vec4(vColor, 1.0);
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
gl.vertexAttribPointer(gl.getAttribLocation(program, 'position'), 2, gl.FLOAT, false, 0, 0);

//12. Set the buffer for the color attribute and enable it
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(gl.getAttribLocation(program, 'color'), 3, gl.FLOAT, false, 0, 0);

//13. Define Variables to use on draw function
const shiftLocationx = gl.getUniformLocation(program, 'shiftx');
const shiftLocationy = gl.getUniformLocation(program, 'shifty');
let x = 0.0;
let y = 0.0;

//14. Define Variable to use on the onclick button function
var timer = 0;
var xdir = 1;
var ydir = 1;
var speed = 0.0;
var start = -1;

//15. Define the draw function
function draw() {
  gl.clearColor(0.0, 0.0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.uniform1f(shiftLocationx, x);
  gl.uniform1f(shiftLocationy, y);
  gl.drawArrays(gl.TRIANGLES, 0, 3)

  if(start == 1){
    //increments for moving the triagnle
    x += (0.01 + speed) *xdir;
    y += (0.01 + speed) *ydir;

    //create horizontal boundries
    if(x> 0.5 || x <- 0.5){
      xdir *=-1   //change the direction of x
    }
    //create vertical boundries
    if(y > 0.7 || y < -0.7){
      ydir *= -1;   //change the direction of y
    }
  
  console.log('x = ', x);
  console.log('y = ', y);

  //recall the function draw
  window.requestAnimationFrame(draw)
}
}

//16. call the draw funtion
draw();

//17. increase the speed of the triangle
function increase(){
  speed += 0.01;
}
//18. decrease the speed of the triangle
function decrease(){
  speed -= 0.01;
}

//19. reset all Data to their original values
function reset(){
  timer = 0;
  xdir = 1;
  ydir = 1;
  speed = 0.0;
  start = -1;
  x = 0;
  y = 0;
}

//20. Define an event listener for the button onclick event
function buttonClick(){
  //change the value to diplay the if statement on the draw function
  start *= -1;   
  //call the draw function
  draw();

}//end funtion buttonClick
