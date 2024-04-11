//Step 1: Get Canvas reference, and get webgl context
let canvas = document.querySelector('canvas');
let gl = canvas.getContext('webgl');

//import mat4 Matrix library
import * as mat4 from '/mat4.js';
import * as vec3 from '/vec3.js';

//define rgb colors
var red = 0.0;
var green = 0.0;
var blue = 0.0;

//Step 2: Set Canvas Color
gl.clearColor(red, green, blue, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

//Step 3: Set Vertices in Array form
const cube = [
	//front face - blue
	-1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1,

	//back face - red
	-1, 1, -2, -1, -1, -2, 1, -1, -2, -1, 1, -2, 1, 1, -2, 1, -1, -2,

	//left face - yellow
	-1, 1, 1, -1, 1, -2, -1, -1, -2,

	-1, 1, 1, -1, -1, 1, -1, -1, -2,

	//right face - green
	1, 1, 1, 1, 1, -2, 1, -1, -2,

	1, 1, 1, 1, -1, 1, 1, -1, -2,

	//top face - white
	-1, 1, 1, -1, 1, -2, 1, 1, -2,

	-1, 1, 1, 1, 1, 1, 1, 1, -2,

	//bottom face - blue
	-1, -1, 1, -1, -1, -2, 1, -1, -2,

	-1, -1, 1, 1, -1, 1, 1, -1, -2,
];

const position = new Float32Array(cube);
console.log('Vertices', position.length / 3);
//3 cordinates per vertex, 3 vertices per triangle, 2 triangles per face
console.log('Sides', position.length / (3 * 3 * 2));

//Step 4: Set color coordinates in Array form (RBG)
const colors = new Float32Array([
	//front face - purple
	1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

	1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

	//back face - red
	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

	//left face - yellow
	1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,

	1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,

	//right face - green
	0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

	0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

	//top face - white
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

	//bottom face - blue
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
]);

//Step 5: Create, and bind Position buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

//Step 6: Create, and bind Color Buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

//Step 6: Create Vertex Shader
const vsSource = `
attribute vec3 pos;
attribute vec3 col;
varying vec3  vColor;
uniform mat4 xMatrix;
uniform mat4 yMatrix;
uniform mat4 zMatrix;
uniform mat4 sMatrix;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main() {
    gl_Position =  xMatrix * yMatrix *zMatrix * vec4(pos, 2.0);
    vColor = col;
}`;

//Step 8: get JS reference for vertex shader, pass and compile shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

//Step 9: Create Fragment Shader
const fsSource = `
precision mediump float;
varying vec3 vColor;
void main (){gl_FragColor = vec4(vColor, 1.0);}`;

//Step 10: get JS reference for fragment shader, pass and compile shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

//Step 11: Create program, attach shaders and link program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
//debug program
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('Error in shader', gl.getShaderInfoLog(vertexShader));
	}
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('Error in shader', gl.getShaderInfoLog(fragmentShader));
	}
}

//Step 12: Use program, enable Vertex attributes
gl.useProgram(program);
gl.enableVertexAttribArray(gl.getAttribLocation(program, `pos`));
gl.enableVertexAttribArray(gl.getAttribLocation(program, `col`));

//Step 13: Bind buffers (position and color), and set vertex attribute pointers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(
	gl.getAttribLocation(program, `pos`),
	3,
	gl.FLOAT,
	false,
	0,
	0,
);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(
	gl.getAttribLocation(program, `col`),
	3,
	gl.FLOAT,
	false,
	0,
	0,
);

//Step 14: Draw Triangles
//gl.drawArrays(gl.TRIANGLES, 0, position.length)

//Step 15: Draw Lines
gl.drawArrays(gl.TRIANGLES, 0, position.length / 3);

//variable declaration
const button = document.querySelector('button');
var angle = 0;
var angleInRad;
var sliderAngle;
var sAngleInRad;
const identityMatrix = mat4.create();

/*************************Rotation by x***********************/
const xMatrix = gl.getUniformLocation(program, `xMatrix`);
//debug xMatrix location
if (gl.getActiveUniform(program, xMatrix) == null) {
	console.log('xMatrix Not found: ', gl.getActiveUniform(program, xMatrix));
}

var xRotMatrix = mat4.create();

/*************************Rotation by y***********************/
const yMatrix = gl.getUniformLocation(program, `yMatrix`);
//debug yMatrix location
if (gl.getActiveUniform(program, yMatrix) == null) {
	console.log('yMatrix Not found: ', gl.getActiveUniform(program, yMatrix));
}

var yRotMatrix = mat4.create();

/*************************Rotation by z***********************/
const zMatrix = gl.getUniformLocation(program, `zMatrix`);
//debug zMatrix location
if (gl.getActiveUniform(program, zMatrix) == null) {
	console.log('zMatrix Not found: ', gl.getActiveUniform(program, zMatrix));
}
var zRotMatrix = mat4.create();

/*************************Slider Rotation***********************/
const sMatrix = gl.getUniformLocation(program, `sMatrix`);
//debug sliderMatrix location
if (!gl.getUniformLocation(program, 'sMatrix')) {
	console.log(
		'sMatrix Not found\nsMatrix Location: ',
		gl.getUniformLocation(program, 'sMatrix'),
	);
}

var sRotMatrix = mat4.create();

/*************************HTML Button  Functions************************/
{
	const xButton = document.querySelector('#xButton');
	const yButton = document.querySelector('#yButton');
	const zButton = document.querySelector('#zButton');
	const allButton = document.querySelector('#allButton');
	const resetButton = document.querySelector('#resetButton');
	var choice = 0;

	xButton.onclick = function byX() {
		zRotMatrix = mat4.create();
		yRotMatrix = mat4.create();
		angle = 0;
		choice = 1;
	};
	yButton.onclick = function byY() {
		zRotMatrix = mat4.create();
		xRotMatrix = mat4.create();
		angle = 0;
		choice = 2;
	};
	zButton.onclick = function byZ() {
		xRotMatrix = mat4.create();
		yRotMatrix = mat4.create();
		angle = 0;
		choice = 3;
	};

	allButton.onclick = function byAll() {
		zRotMatrix = mat4.create();
		yRotMatrix = mat4.create();
		angle = 0;
		choice = 4;
	};
	resetButton.onclick = function reset() {
		xRotMatrix = mat4.create();
		zRotMatrix = mat4.create();
		yRotMatrix = mat4.create();
		angle = 0;
		choice = 0;
		slider.value = 0;
	};
}
/*************************Check sides by y axis************************/
const slider = document.querySelector('#slider');
const CamSlider = document.querySelector('#CamSlider');

/*========================Perspective projection=====================*/

/*************************model matrix************************/
const modelMatrix = gl.getUniformLocation(program, `modelMatrix`);
//debug modelMatrix location
var mMatrix = mat4.create();

/*************************view matrix**************************/
const viewMatrix = gl.getUniformLocation(program, `viewMatrix`);
var vMatrix = mat4.create();

/*************************projection matrix********************/
const projectionMatrix = gl.getUniformLocation(program, `projectionMatrix`);
var pMatrix = mat4.create();

/*************************Draw Function************************/
var tempChoice = 9;
var logg = 1;
var xCamera = 0;
var cameraDistance = 0;
function draw() {
	//canvas
	gl.clearColor(red, green, blue, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	//for rotation
	angle += 1;
	angleInRad = (Math.PI / 180) * angle;

	switch (choice) {
		case 1:
			//X rotation
			xRotMatrix = mat4.rotateX(xRotMatrix, identityMatrix, angleInRad);
			break;
		case 2:
			//Y rotation
			yRotMatrix = mat4.rotateY(yRotMatrix, identityMatrix, angleInRad);
			break;
		case 3:
			//Z rotation
			zRotMatrix = mat4.rotateZ(zRotMatrix, identityMatrix, angleInRad);
			break;
		case 4:
			//All Axis rotation
			xRotMatrix = mat4.rotateY(xRotMatrix, identityMatrix, angleInRad);
			yRotMatrix = mat4.rotateX(yRotMatrix, identityMatrix, angleInRad);
			zRotMatrix = mat4.rotateZ(zRotMatrix, identityMatrix, angleInRad);
			break;
		default:
			break;
	}

	//set values for Matrices' uniform locations

	//pespective projection
	// Create the perspective matrix
	const fieldOfView = (45 * Math.PI) / 180; // in radians
	const aspectRatio = canvas.width / canvas.height;
	const nearClip = 0.1;
	const farClip = 100;
	const perspectiveMatrix = mat4.create();
	mat4.perspective(
		perspectiveMatrix,
		fieldOfView,
		aspectRatio,
		nearClip,
		farClip,
	);

	// Create the camera matrix
	window.onkeydown = function (e) {
		if (e.keyCode == 37) {
			xCamera -= 1;
		}
		if (e.keyCode == 39) {
			xCamera += 1;
		}
		if (e.keyCode == 38) {
			cameraDistance += 1;
		}
		if (e.keyCode == 40) {
			cameraDistance -= 1;
		}
	};

	console.log('zcamera Distance', cameraDistance);
	console.log('xcamera Distance', xCamera);
	console.log('Forward camera Distance', CamSlider.value);
	const cameraPosition = vec3.fromValues(
		xCamera,
		cameraDistance,
		CamSlider.value,
	);
	const targetPosition = vec3.fromValues(0, 0, 0);
	const upDirection = vec3.fromValues(0, -1, 0);
	const cameraMatrix = mat4.create();
	mat4.lookAt(cameraMatrix, cameraPosition, targetPosition, upDirection);

	// Multiply the perspective matrix and camera matrix to create the MVP matrix
	const mvpMatrix = mat4.create();
	mat4.multiply(mvpMatrix, perspectiveMatrix, cameraMatrix);

	// Pass the MVP matrix to the vertex shader

	gl.uniformMatrix4fv(projectionMatrix, false, mvpMatrix);

	//mMatrix = mat4.translate(mMatrix, identityMatrix, 0.5, 0.5, 0)
	gl.uniformMatrix4fv(modelMatrix, false, mMatrix);

	gl.uniformMatrix4fv(zMatrix, false, zRotMatrix);
	gl.uniformMatrix4fv(zMatrix, false, zRotMatrix);
	gl.uniformMatrix4fv(xMatrix, false, xRotMatrix);
	gl.uniformMatrix4fv(yMatrix, false, yRotMatrix);
	gl.uniformMatrix4fv(sMatrix, false, sRotMatrix);

	gl.drawArrays(gl.TRIANGLES, 0, position.length / 3);

	//log values once
	if (tempChoice != choice) {
		console.log('Choice: ', choice);
	}
	tempChoice = choice;

	if (logg != 0) {
		console.log('Camera + Perspective Matrix:\n', mvpMatrix);
		console.log('slider rotation Matrix:\n', sRotMatrix);
		logg = 0;
	}

	window.requestAnimationFrame(draw);
}
draw();
