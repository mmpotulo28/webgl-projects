//1. Get a webgl context from the canvas
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

//2. Set canvas color
gl.clearColor(0.0, 0.0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//draw a sphere using a series of circles

var xVar, yVar, zVar, alpha, rVar;
var circle = [0, 0, 0];
var rVar = 0;
var inc = (2 * Math.PI) / 180;
var dir = 1;
var angle = 0;
var zAngle = (180 * Math.PI) / 180;
zVar = -1;
rVar = 0;

var zInit, zTot, rPrev, rMax;
zInit = zVar;
rPrev = 0;
var count = 0;

for (let i = 0; i < 90; i++) {
	//draw a single circle
	for (alpha = 0; alpha < 2 * Math.PI; alpha += inc) {
		xVar = Math.cos(alpha) * rVar;
		yVar = Math.sin(alpha) * rVar;

		circle.push(xVar, yVar, zVar);
	}
	count++;

	//create a distance between the circles
	zVar = Math.cos(angle);

	//change the value of the radius from 0 to 1 then back to 0
	rVar = Math.sin(angle);

	//increment the angle by 10 degrees
	angle += (10 * Math.PI) / 180;
}

//3.1 Specify vertex data
const positions = new Float32Array(circle);

//3.2 Specify COLOR data
const colors = [0, 0, 0];

//4.1 Create buffer(s) for position
const positionBuffer = gl.createBuffer();

//4.2 Bind the Position buffer as the current buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

//5.1 Create buffer for colour.
const colorBuffer = gl.createBuffer();

//5.2 Bind the colorbuffer as the current buffer
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//6.1 Create the VERTEX shaders source
const vertexShaderSource = `
  attribute vec3 position;
  attribute vec3 color;
  varying vec3 vColor;
  uniform float shiftx;
  uniform float shifty;
  float x,y,z;
  void main() {

    x= position.x;
    y= position.y * cos(shiftx) - position.z * sin(shiftx);
    z= position.z;

    gl_Position = vec4(x, y, z, 2.0);

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
    gl_FragColor = vec4(0,1,1, 1.0);
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
gl.vertexAttribPointer(
	gl.getAttribLocation(program, 'position'),
	3,
	gl.FLOAT,
	false,
	0,
	0,
);

//12. Set the buffer for the color attribute and enable it
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(
	gl.getAttribLocation(program, 'color'),
	3,
	gl.FLOAT,
	false,
	0,
	0,
);

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
	gl.clearColor(0.0, 0.0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.uniform1f(shiftLocationx, x);
	gl.uniform1f(shiftLocationy, y);
	gl.drawArrays(gl.LINES, 0, positions.length / 3);

	if (start == 1) {
		x += 0.01 + speed;
		y += 0.01 + speed;

		//recall the function draw
		window.requestAnimationFrame(draw);
	}
}

//16. call the draw funtion
draw();

//17. increase the speed of the triangle
function increase() {
	speed += 0.01;
}
//18. decrease the speed of the triangle
function decrease() {
	speed -= 0.01;
}

//19. reset all Data to their original values
function reset() {
	speed = 0.0;
	start = -1;
	x = 0;
	y = 0;
	draw();
}

//20. Define an event listener for the button onclick event
const startbutton = document.querySelector('#start');
startbutton.onclick = function () {
	//change the value to diplay the if statement on the draw function
	start *= -1;
	//call the draw function
	draw();
};
