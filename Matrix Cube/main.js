const canvas = document.querySelector('canvas');
    const webgl = canvas.getContext('webgl');
    if(!webgl){ throw new Error ("Webgl not available/supported");};
    webgl.clearColor(0.5, 0.5, 0.5, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.enable(webgl.DEPTH_TEST);
    var r = 0.3;

    var box = new Float32Array([
        // 1 Front face red
        -r, r, r,   1, 0, 0,        -r, -r, r,   1, 0, 0,       r,-r,r,   1, 0, 0,  //1st triangle
         r, r, r,   1, 0, 0,        -r, r, r,    1, 0, 0,       r,-r,r,   1, 0, 0,  //2nd triangle

        // 2 Right face green
         r, r, r,    0, 1, 0,      r, -r, r,    0, 1, 0,        r,r,-r,   0, 1, 0,  //3rd triangle
         r, -r, r,   0, 1, 0,      r, r, -r,    0, 1, 0,       r,-r,-r,   0, 1, 0,  //4th triangle

        // 3 Back face red + Blue = Violet
        -r, r, -r,    1, 0, 1,    -r, -r, -r,   1, 0, 1,        r,-r,-r,   1, 0, 1,  //5th triangle
         r, r, -r,    1, 0, 1,     -r, r, -r,   1, 0, 1,       r,-r,-r,   1, 0, 1,  //6th triangle

        // 4 Left face green + red = yellow
        -r, r, r,     1, 1, 0,    -r, -r, r,    1, 1, 0,       -r,r,-r,   1, 1, 0,  //7th triangle
        -r, -r, r,    1, 1, 0,    -r, r, -r,    1, 1, 0,      -r,-r,-r,   1, 1, 0,  //8th triangle

        // 5 Bottom face Blue
        -r, -r, r,    0, 0, 1,    r, -r, r,      0, 0, 1,      -r,-r,-r,   0, 0, 1,  //5th triangle
        -r, -r, -r,   0, 0, 1,    r, -r, -r,     0, 0, 1,        r,-r,r,   0, 0, 1,  //6th triangle

        // 6 Top face blue + green = cyan
         -r, r, r,    0, 1, 1,      r, r, r,     0, 1, 1,      -r,r,-r,    0, 1, 1,  //7th triangle
        -r, r, -r,    0, 1, 1,     r, r, -r,     0, 1, 1,        r,r,r,    0, 1, 1,  //8th triangle
    ]);

        const buffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, box, webgl.STATIC_DRAW);

        function createmat4(){
            return new Float32Array([                   // identity matrix
                1,0,0,0, 
                0,1,0,0,
                0,0,1,0,
                0,0,0,1
            ]);}

        function translate(tx,ty,tz){
                return new Float32Array([                   // translation matrix 
                    1,0,0,0,
                    0,1,0,0,
                    0,0,1,0,
                    tx,ty,tz,1
                ])
            }
    
            function rotx(angleInRadians){                   // rotate along the x-axis
                var c = Math.cos(angleInRadians);
                var s = Math.sin(angleInRadians);
                return new Float32Array([
                    1,0,0,0,
                    0, c,s,0, 
                    0,-s,c,0,
                    0, 0,0,1, 
                ])
            }
        
        function roty(angleInRadians){                   // rotate along the y-axis
                var c = Math.cos(angleInRadians);
                var s = Math.sin(angleInRadians);
                return new Float32Array([
                    c,0,-s, 0,
                    0,1, 0,0, 
                    s,0,c,0,
                    0,0, 0, 0, 
                ]);
            }
        
        function rotz(angleInRadians){                   // rotate along the z-axis
                var c = Math.cos(angleInRadians);
                var s = Math.sin(angleInRadians);
                return new Float32Array([
                    c,-s,0,0,
                    s,c,0,0, 
                    0,0,1,0,
                    0,0,0,1, 
                ]);
            }

        function rotatexyz(m, x,y,z){

                multiply(m,m,rotx(x));
                multiply(m,m,roty(y));
                multiply(m,m,rotz(z));
            }
        
        function matmult(out,a,b){                         // function that multiplies two matrices
        
                out[0]  = a[0]*b[0]  + a[1]*b[4]  + a[2]*b[8]   + a[3]*b[12];
                out[1]  = a[0]*b[1]  + a[1]*b[5]  + a[2]*b[9]   + a[3]*b[13];
                out[2]  = a[0]*b[2]  + a[1]*b[6]  + a[2]*b[10]  + a[3]*b[14];
                out[3]  = a[0]*b[3]  + a[1]*b[7]  + a[2]*b[11]  + a[3]*b[15];
    
                out[4]  = a[4]*b[0]  + a[5]*b[4]  + a[6]*b[8]   + a[7]*b[12];
                out[5]  = a[4]*b[1]  + a[5]*b[5]  + a[6]*b[9]   + a[7]*b[13];
                out[6]   = a[4]*b[2]  + a[5]*b[6]  + a[6]*b[10]  + a[7]*b[14];
                out[7]   = a[4]*b[3]  + a[5]*b[7]  + a[6]*b[11]  + a[7]*b[15];
    
                out[8]   = a[8]*b[0]  + a[9]*b[4]  + a[10]*b[8]  + a[11]*b[12];
                out[9]   = a[8]*b[1]  + a[9]*b[5]  + a[10]*b[9]  + a[11]*b[13];
                out[10]  = a[8]*b[2]  + a[9]*b[6]  + a[10]*b[10]  + a[11]*b[14];
                out[11]  = a[8]*b[3]  + a[9]*b[7]  + a[10]*b[11]  + a[11]*b[15];
    
                out[12]  = a[12]*b[0] + a[13]*b[4] + a[14]*b[8]  + a[15]*b[12];
                out[13]  = a[12]*b[1] + a[13]*b[5] + a[14]*b[9]  + a[15]*b[13];
                out[14]  = a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14];
                out[15]  = a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15];
    
                return out;
                
            }  


        function perspective(out, fovy, aspect, near, far) {
                var f = 1.0 / Math.tan(fovy / 2),
                    nf;
                out[0] = f / aspect;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = f;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[11] = -1;
                out[12] = 0;
                out[13] = 0;
                out[15] = 0;
            
                if (far != null && far !== Infinity) {
                  nf = 1 / (near - far);
                  out[10] = (far + near) * nf;
                  out[14] = 2 * far * near * nf;
                } else {
                  out[10] = -1;
                  out[14] = -2 * near;
                }
            
                return out;
              }    


            function invert(out, a) {
                var a00 = a[0],
                    a01 = a[1],
                    a02 = a[2],
                    a03 = a[3];
                var a10 = a[4],
                    a11 = a[5],
                    a12 = a[6],
                    a13 = a[7];
                var a20 = a[8],
                    a21 = a[9],
                    a22 = a[10],
                    a23 = a[11];
                var a30 = a[12],
                    a31 = a[13],
                    a32 = a[14],
                    a33 = a[15];
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32; // Calculate the determinant
            
                var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            
                if (!det) {
                  return null;
                }
            
                det = 1.0 / det;
                out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
                out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
                out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
                out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
                out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
                out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
                out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
                return out;
              }      

        const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
        webgl.shaderSource(vertexShader,
            `attribute vec3 pos;
            attribute vec3 colours;
            varying vec3 vcolours;
            
            uniform mat4 model;
            uniform mat4 view;
            uniform mat4 projection; 

            void main(){
                gl_Position =  projection*view*model*vec4(pos,1);
                vcolours = colours; 
        }`
            );
        webgl.compileShader(vertexShader);
        if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)){
            console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
        }

        const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
        webgl.shaderSource(fragmentShader,
            `precision mediump float;
            varying vec3 vcolours;
            void main(){ gl_FragColor = vec4(vcolours,1.0); }
            
            `);
        webgl.compileShader(fragmentShader);
        webgl.compileShader(fragmentShader);

        if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)){
            console.error("Error compiling Fragment shader", webgl.getShaderInfoLog(fragmentShader));
        }

        const program = webgl.createProgram();
        webgl.attachShader(program, vertexShader);
        webgl.attachShader(program, fragmentShader);
        webgl.linkProgram(program);

    const positionLocation = webgl.getAttribLocation(program, `pos`);
    webgl.enableVertexAttribArray(positionLocation);
    webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 6*4, 0);

    const coloursLocation = webgl.getAttribLocation(program, `colours`);
    webgl.enableVertexAttribArray(coloursLocation);
    webgl.vertexAttribPointer(coloursLocation, 3, webgl.FLOAT, false, 6*4, 3*4);

    webgl.useProgram(program);
    let xs = 0.0;
    let ys = 0.0;
    let zs = 0.0;
    let rotationX = 0;
    let rotationY = 0.0;
    let model = createmat4();
    let view = createmat4();
    let projection = createmat4();
    let pov =0.55; //point of view
    let movefar = 10
    0.0000;



    document.onkeydown=function(event){
        switch(event.key){
            case 'ArrowDown':
                ys+=0.01;
                break;
            case 'ArrowUp':
                ys-=0.01;
                break;
            case 'ArrowLeft':
                xs+=0.01;
                break;
            case 'ArrowRight':
                xs-=0.01;
                break;
        case 'c':
        case 'C':
         pov -=0.01;
        case 'f':
        case'F':
        pov+=0.001;
        }}

    let rotatingX = document.querySelector("#rotX");
    rotatingX.addEventListener("mousedown", function(){
        rotationX += Math.PI/29;
    });

    let rotatingY = document.querySelector("#rotX");
    rotatingX.addEventListener("mousedown", function(){
        rotationY += Math.PI/29;
    });

    
    draw();

    function draw(){
        let model = createmat4();

        invert(model, model);
        perspective(projection, 60 * Math.PI/180,  canvas.width/canvas.height, pov, movefar ); 

        webgl.clear(webgl.COLOR_BUFFER_BIT);

        model = matmult(model,model,translate(xs,ys,zs));
        model = matmult(model, model,rotx(rotationX));
        model = matmult(model, model,rotx(rotationY));
        webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`), false, model);
        webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model);
        webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`projection`),false,projection);
        webgl.drawArrays(webgl.TRIANGLES, 0, box.length/6);
        window.requestAnimationFrame(draw);
    }

    //model matrix function
function createmat4() {
        return [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]
}