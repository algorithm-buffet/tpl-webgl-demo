import { useState, useEffect, useRef } from "react";
import { createProgramInfo, ProgramInfo, createBufferInfoFromArrays, Arrays, resizeCanvasToDisplaySize, setBuffersAndAttributes, BufferInfo, setUniforms, drawBufferInfo } from "twgl.js";
import { Leva, useControls } from 'leva'
import { projection, translate, rotate, scale} from "../../../utils/math-2d";
import { dataForF } from "./data";


class WebGLDrawObject {
    gl: WebGL2RenderingContext;
    programInfo: ProgramInfo;
    bufferInfo: BufferInfo;

    constructor(gl: WebGL2RenderingContext, shaderSources: string[], dataArrays: Arrays) {
        this.gl = gl;
        this.programInfo = createProgramInfo(gl, shaderSources);
        this.bufferInfo = createBufferInfoFromArrays(this.gl, dataArrays); // 绑定数据到缓冲区
    }

    drawScene(uniforms: {
        [key: string]: any;
    }) {
        const {gl, programInfo} = this;
        resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programInfo.program);

        setBuffersAndAttributes(gl, programInfo, this.bufferInfo)
        setUniforms(programInfo, uniforms);

        drawBufferInfo(gl, this.bufferInfo);
  }

  updateMatrix(translation: number[], rotationInRadians: number, scales: number[]) {
    const {gl} = this;
 
    // Compute the matrix
    let matrix = projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = translate(matrix, translation[0], translation[1]);
    matrix = rotate(matrix, rotationInRadians);
    matrix = scale(matrix, scales[0], scales[1]);

    return matrix
  }
}

const initColor = [Math.random(), Math.random(), Math.random(), 1];
const initTranslation = [150, 100];
const initRotationInRadians = 0;
const initScaleNum = [1, 1];

function Demo(props:any) {

    const drawRef = useRef<WebGLDrawObject | null>(null)
    
    useEffect(() => {
        
        var vertexShaderSource = `#version 300 es

            // an attribute is an input (in) to a vertex shader.
            // It will receive data from a buffer
            in vec2 a_position;

            // A matrix to transform the positions by
            uniform mat3 u_matrix;

            // all shaders have a main function
            void main() {
            // Multiply the position by the matrix.
                gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
            }
        `;

        var fragmentShaderSource = `#version 300 es

            precision highp float;

            uniform vec4 u_color;

            // we need to declare an output for the fragment shader
            out vec4 outColor;

            void main() {
                outColor = u_color;
            }
        `;

            var canvas = document.querySelector("#c2") as HTMLCanvasElement;
            var gl = canvas.getContext("webgl2");
            if (!gl) {
                return;
            }

            drawRef.current = new WebGLDrawObject(gl, [vertexShaderSource, fragmentShaderSource], {
                a_position: {numComponents: 2, data: dataForF}
            });

            // 更新矩阵
            const matrix = drawRef.current.updateMatrix(initTranslation, initRotationInRadians, initScaleNum);

            drawRef.current.drawScene({
                u_color: initColor,
                u_matrix: matrix
            })
                
    }, []);

    const {x, y, angle, scaleX, scaleY, color} = useControls({
      x: {
        value: initTranslation[0],
        min: 0,
        max: 360
      },
      y: {
        value: initTranslation[1],
        min: 0,
        max: 360
      },
      angle: {
        value: initRotationInRadians,
        min: 0,
        max: 360,
      },
      scaleX: {
        value: initScaleNum[0],
        min: -5,
        max: 5,
        step: 0.01
      },
      scaleY: {
        value: initScaleNum[1],
        min: -5,
        max: 5,
        step: 0.01
      },
      color: {
        value: {r: initColor[0] * 255, g: initColor[1] * 255, b: initColor[2] * 255, a: initColor[3]}
      },
   });

   useEffect(() => {
    // side effects
    var translation = [x, y];
    var rotationInRadians = angle * Math.PI / 180;;
    var scaleNum = [scaleX, scaleY];
    
    if(drawRef.current) {
        // 更新矩阵
        const matrix = drawRef.current.updateMatrix(translation, rotationInRadians, scaleNum);
        drawRef.current.drawScene({
            u_color: [color.r / 255, color.g / 255, color.b / 255, color.a],
            u_matrix: matrix
        })
    }
   }, [x, y, angle, scaleX, scaleY, color]);

   

    return <>
        <Leva />
        <canvas id="c2"></canvas>
    </>;
}

Demo.title = "2D平面 - F字母";
Demo.path = "2df";
Demo.reference = [
  'WebGL2 3D - Cameras|https://webgl2fundamentals.org/webgl/lessons/webgl-3d-camera.html'
]

export default Demo;