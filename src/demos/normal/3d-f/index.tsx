import { useState, useEffect } from "react";
import { Leva, useControls } from 'leva'

import { createProgramFromSources, resizeCanvasToDisplaySize } from "../../../utils/webgl";

import { colorForF, dataForF } from "./data";
import { xRotation, translate, transformVector, perspective, yRotation, inverse, multiply } from "../../../utils/math-3d";
import { degToRad } from "../../../utils/math-2d";


// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry(gl: WebGL2RenderingContext, dataArr: number[]) {
  var positions = new Float32Array(dataArr); // 数据格式

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above but I'm lazy.
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  var matrix = xRotation(Math.PI);
  matrix = translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW); // 将数据灌输到 ARRAY_BUFFER，这样间接输送给 position 属性
}

// Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
function setColors(gl: WebGL2RenderingContext, colorArr: number[]) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array(colorArr),
      gl.STATIC_DRAW);
}


interface IDrawData {
  vao: WebGLVertexArrayObject;
  fieldOfViewRadians: number;
  cameraAngleRadians: number;
  matrixLocation: WebGLUniformLocation;
}

// Draw the scene.
function drawScene(gl: WebGL2RenderingContext, program: WebGLProgram, data: IDrawData) {
  var numFs = 5;
  var radius = 200;

  const {vao, fieldOfViewRadians, cameraAngleRadians, matrixLocation} = data;

  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // turn on depth testing
  gl.enable(gl.DEPTH_TEST);

  // tell webgl to cull faces
  gl.enable(gl.CULL_FACE);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  // Compute the matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 2000;
  var projectionMatrix = perspective(fieldOfViewRadians, aspect, zNear, zFar);

  var cameraMatrix = yRotation(cameraAngleRadians);
  cameraMatrix = translate(cameraMatrix, 0, 0, radius * 1.5);

  // Make a view matrix from the camera matrix.
  var viewMatrix = inverse(cameraMatrix);

  // create a viewProjection matrix. This will both apply perspective
  // AND move the world so that the camera is effectively the origin
  var viewProjectionMatrix = multiply(projectionMatrix, viewMatrix);

  // Draw 'F's in a circle
  for (var ii = 0; ii < numFs; ++ii) {
    var angle = ii * Math.PI * 2 / numFs;

    var x = Math.cos(angle) * radius;
    var z = Math.sin(angle) * radius;
    var matrix = translate(viewProjectionMatrix, x, 0, z);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}


// First let's make some variables
// to hold the translation,
var fieldOfViewRadians = degToRad(60);
var cameraAngleRadians = degToRad(0);

let gl: WebGL2RenderingContext | null;
let program: WebGLProgram | null;
let vao: WebGLVertexArrayObject | null;
let matrixLocation: WebGLUniformLocation;

function Demo(props:any) {
    
    useEffect(() => {
      
var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// a varying the color to the fragment shader
out vec4 v_color;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

// the varied color passed from the vertex shader
in vec4 v_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = v_color;
}
`;

// Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#c") as HTMLCanvasElement;
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

    // Use our boilerplate utils to compile the shaders and link into a program
  program = createProgramFromSources(gl,
      [vertexShaderSource, fragmentShaderSource])!;

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");


  // look up uniform locations
  matrixLocation = gl.getUniformLocation(program, "u_matrix")!;


  // Create a buffer 创建缓存区 - 给 position 使用
  var positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state) 开辟节点数组对象（属性状态）空间
  vao = gl.createVertexArray()!;

  // and make it the one we're currently working with 将 vao 存储空间设为当前激活状态
  gl.bindVertexArray(vao);

  // Turn on the attribute 开启 a_position 属性的接收模式
  gl.enableVertexAttribArray(positionAttributeLocation);
      
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer) 将 position 属性缓冲区跟 gl.ARRAY_BUFFER 对接起来
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 
  // Set Geometry. 设置 F 的几何数据，现在 ARRAY_BUFFER 存满了待消费的数据
  setGeometry(gl, dataForF);


  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER) 告诉 GL 中的 a_position 属性如何从 positionBuffer (ARRAY_BUFFER) 获取数据
  var size = 3;          // 3 components per iteration 每次取 3 个数据
  var type = gl.FLOAT;   // the data is 32bit floats 每个数据是 32bit floats 类型 
  var normalize = false; // don't normalize the data 不归一化数据
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position 每次迭代移动距离
  var offset = 0;        // start at the beginning of the buffer 偏移量从 0 开始
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  
  // create the color buffer, make it the current ARRAY_BUFFER 新开辟一个 buffer 区，
  // and copy in the color values
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); // 现在让 gl.ARRAY_BUFFER 对接这个区
  setColors(gl, colorForF); // 给 gl.ARRAY_BUFFER 设置数据

  // 开启 a_color 属性的接收模式
  gl.enableVertexAttribArray(colorAttributeLocation);

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset);


  // 然后开始绘制场景
  drawScene(gl, program, {
    vao, fieldOfViewRadians, cameraAngleRadians, matrixLocation
  });


  // function updateCameraAngle(event, ui) {
  //   cameraAngleRadians = degToRad(ui.value);
  //     drawScene(gl!, program, {
  //       vao, fieldOfViewRadians, cameraAngleRadians, matrixLocation
  //     });
  // }



    }, []);

    const values = useControls({
      deg: {
        value: 0,
        min: -360,
        max: 360
      },
   })

   useEffect(() => {
    // side effects
    var cameraAngleRadians = degToRad(values.deg);
    if(!!gl && !!program && !!vao) {
      drawScene(gl, program, {
        vao, fieldOfViewRadians, cameraAngleRadians, matrixLocation
      });
    }

   }, [values.deg]);



    return <>
      <Leva/>
      <canvas id="c"></canvas>
    </>;
}



Demo.title = "3D F字母";
Demo.path = "3df";

export default Demo;