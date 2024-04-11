//1. Get a webgl context from the canvas
const canvas = document.querySelector('canvas')
const webgl = canvas.getContext(`webgl`)
if (!webgl) {
  throw new Error('WebGL not available/supported')
}
// 2. Set canvas color
webgl.clearColor(0.0, 0.0, 0, 1)
webgl.clear(webgl.COLOR_BUFFER_BIT)

//3. Specify vertex data
const vertices =  [
    0.0, 0.0,  
    -0.5, -0.5,  
    0.5, -0.5,
]

//4. Create buffer(s) for position, colour, or combined
const buffer = webgl.createBuffer()

//5. Bind the buffer as the current buffer
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer)
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

//6. Specify that buffer data from vertex data
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW)

//7. Create the two shaders source
const vsSource = `     
attribute vec2 pos;
  uniform float shiftx;
  void main() {
    gl_Position = vec4(
      pos.x + shiftx,
      pos.y + shiftx,
      0.0,
      1.0
    );
  }
`;
const fsSource = `
void main() { 
  gl_FragColor = vec4(0.5,0.0,0.8,1); 
}`

//8. Create Javascript reference to the shaders
const vertexShader = webgl.createShader(webgl.VERTEX_SHADER)
const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER)

//9. Pass the shader sources to the shader reference
webgl.shaderSource(vertexShader, vsSource)
webgl.shaderSource(fragmentShader, fsSource)

//10. Compile the shaders
webgl.compileShader(vertexShader)
webgl.compileShader(fragmentShader)

//11. Create a program, attach shaders and link program
const program = webgl.createProgram()
webgl.attachShader(program, vertexShader)
webgl.attachShader(program, fragmentShader)
webgl.linkProgram(program)
//12. Find a reference to each of the attributes in the shader
const positionLocation = webgl.getAttribLocation(program, `pos`)
//13.Enable the attribute, it is disabled by default
webgl.enableVertexAttribArray(positionLocation)
//14. Specify the layout of the vertex data
//webgl.vertexAttribPointer(index, size, type, normalized, stride, offset);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0)
//specify which program you are using
webgl.useProgram(program)

//15. finally draw the primitives i.e triangles/lines
const shiftLocation = webgl.getUniformLocation(program, 'shiftx');
let k = 0;

// Define the draw function
function draw() {
  webgl.clearColor(0.0, 0.0, 0, 1)
  webgl.clear(webgl.COLOR_BUFFER_BIT)

  webgl.uniform1f(shiftLocation, k);
  webgl.drawArrays(webgl.TRIANGLES, 0, 3)
  
}
//call the draw funtion
draw();

// Define an event listener for the button onclick event
function buttonClick(){
  var timer;
  for(timer = 0; timer <= 100000; timer ++ ){
    setTimeout(() => {
      
        k += 0.01; 
        draw();
      
      //if statement
      console.log(k);
    }, timer * 100);
  }
  
}



