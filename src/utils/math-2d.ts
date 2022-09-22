/**
 * An array or typed array with 16 values.
 * refer: https://webgl2fundamentals.org/webgl/lessons/webgl-2d-matrices.html
 * @typedef {number[]|TypedArray} Matrix3
 * @memberOf module:webgl-2d-math
 */
import type { TMatrixOrVectorType } from "./math-base";


// 默认矩阵类型是 32bit 浮点类型
let MatType = Float32Array;

type TMatrixType = TMatrixOrVectorType;

/**
 * Sets the type this library creates for a Mat3
 * @param {constructor} Ctor the constructor for the type. Either `Float32Array` or `Array`
 * @return {constructor} previous constructor for Mat3
 */
export function setDefaultType(Ctor: any) {
    const OldType = MatType;
    MatType = Ctor;
    return OldType;
}

/**
 * 3x3 矩阵乘法运算 输入矩阵 a 和 b, 返回两者的乘法结果
 * 注意，在代码世界里的矩阵相当于是数据世界中的矩阵置换：https://webgl2fundamentals.org/webgl/lessons/webgl-matrix-vs-math.html
 * 注意这里的乘法实现是 B 左乘 A
 * @param {module:webgl-2d-math.Matrix3} a A matrix.
 * @param {module:webgl-2d-math.Matrix3} b A matrix.
 * @param {module:webgl-2d-math.Matrix4} [dst] 可选，用于存储结果的矩阵，不传的话默认新建
 * @return {module:webgl-2d-math.Matrix3} the result.
 * @memberOf module:webgl-2d-math
 */
export function multiply(a: TMatrixType, b: TMatrixType, dst?: TMatrixType) {
    dst = dst || new MatType(9);
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];

    dst[0] = b00 * a00 + b01 * a10 + b02 * a20;
    dst[1] = b00 * a01 + b01 * a11 + b02 * a21;
    dst[2] = b00 * a02 + b01 * a12 + b02 * a22;
    dst[3] = b10 * a00 + b11 * a10 + b12 * a20;
    dst[4] = b10 * a01 + b11 * a11 + b12 * a21;
    dst[5] = b10 * a02 + b11 * a12 + b12 * a22;
    dst[6] = b20 * a00 + b21 * a10 + b22 * a20;
    dst[7] = b20 * a01 + b21 * a11 + b22 * a21;
    dst[8] = b20 * a02 + b21 * a12 + b22 * a22;

    return dst;
}


/**
 * 创建 3x3 单位矩阵
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl2-2d-math.Matrix3} an identity matrix
 */
export function identity(dst?: TMatrixType) {
    dst = dst || new MatType(9);
    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 1;
    dst[5] = 0;
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 1;

    return dst;
}

/**
  * 创建二维投影矩阵，就屏幕空间（正常像素）转换到剪辑空间（-1, 1）
  * @param {number} width 宽（像素单位）
  * @param {number} height 高（像素单位）
  * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
  * @return {module:webgl-2d-math.Matrix3} a projection matrix that converts from pixels to clipspace with Y = 0 at the top.
  * @memberOf module:webgl-2d-math
  */
export function projection(width: number, height: number, dst?: TMatrixType) {
    dst = dst || new MatType(9);
    // Note: This matrix flips the Y axis so 0 is at the top.

    dst[0] = 2 / width;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = -2 / height;
    dst[5] = 0;
    dst[6] = -1;
    dst[7] = 1;
    dst[8] = 1;

    return dst;
}


/**
 * 将 m 乘以投影矩阵
 * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
 * @param {number} width width in pixels
 * @param {number} height height in pixels
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl-2d-math.Matrix3} the result
 * @memberOf module:webgl-2d-math
 */
export function project(m: TMatrixType, width: number, height: number, dst?: TMatrixType) {
    return multiply(m, projection(width, height), dst);
}


/**
 * 创建二维平移矩阵
 * @param {number} tx amount to translate in x
 * @param {number} ty amount to translate in y
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl-2d-math.Matrix3} a translation matrix that translates by tx and ty.
 * @memberOf module:webgl-2d-math
 */
export function translation(tx: number, ty: number, dst?: TMatrixType) {
    dst = dst || new MatType(9);

    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 1;
    dst[5] = 0;
    dst[6] = tx;
    dst[7] = ty;
    dst[8] = 1;

    return dst;
}


/**
 * 平移操作，乘以 2D 平移矩阵
 * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
 * @param {number} tx amount to translate in x
 * @param {number} ty amount to translate in y
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl-2d-math.Matrix3} the result
 * @memberOf module:webgl-2d-math
 */
export function translate(m: TMatrixType, tx: number, ty: number, dst?: TMatrixType) {
    return multiply(m, translation(tx, ty), dst);
}


/**
 * 2 维旋转矩阵
 * @param {number} angleInRadians amount to rotate in radians
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl-2d-math.Matrix3} a rotation matrix that rotates by angleInRadians
 * @memberOf module:webgl-2d-math
 */
export function rotation(angleInRadians: number, dst?: TMatrixType) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst = dst || new MatType(9);

    dst[0] = c;
    dst[1] = -s;
    dst[2] = 0;
    dst[3] = s;
    dst[4] = c;
    dst[5] = 0;
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 1;

    return dst;
}

/**
 * 乘以 2 维旋转矩阵
 * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
 * @param {number} angleInRadians amount to rotate in radians
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl-2d-math.Matrix3} the result
 * @memberOf module:webgl-2d-math
 */
export function rotate(m: TMatrixType, angleInRadians: number, dst?: TMatrixType) {
    return multiply(m, rotation(angleInRadians), dst);
}


/**
 * 创建 2D 缩放矩阵
 * @param {number} sx amount to scale in x
 * @param {number} sy amount to scale in y
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl-2d-math.Matrix3} a scale matrix that scales by sx and sy.
 * @memberOf module:webgl-2d-math
 */
export function scaling(sx: number, sy: number, dst?: TMatrixType) {
    dst = dst || new MatType(9);

    dst[0] = sx;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = sy;
    dst[5] = 0;
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 1;

    return dst;
}



/**
 * 乘以 2D 缩放矩阵
 * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
 * @param {number} sx amount to scale in x
 * @param {number} sy amount to scale in y
 * @param {module:webgl-2d-math.Matrix4} [dst] optional matrix to store result
 * @return {module:webgl-2d-math.Matrix3} the result
 * @memberOf module:webgl-2d-math
 */
export function scale(m: TMatrixType, sx: number, sy: number, dst?: TMatrixType) {
    return multiply(m, scaling(sx, sy), dst);
}


// 二维向量点乘
export function dot(x1: number, y1: number, x2: number, y2: number) {
    return x1 * x2 + y1 * y2;
}

// 二维向量距离公式
export function distance(x1: number, y1: number, x2: number, y2: number) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

// 二维向量归一化
export function normalize(x: number, y: number) {
    var l = distance(0, 0, x, y);
    if (l > 0.00001) {
        return [x / l, y / l];
    } else {
        return [0, 0];
    }
}

// 二维向量对称操作
// i = incident 要镜像的向量
// n = normal 对称轴的法向量（归一化后的，并不是对称轴本身）
export function reflect(ix: number, iy: number, nx: number, ny: number) {
    // I - 2.0 * dot(N, I) * N.
    var d = dot(nx, ny, ix, iy);
    return [
        ix - 2 * d * nx,
        iy - 2 * d * ny,
    ];
}

// 弧度转换成角度
export function radToDeg(r: number) {
    return r * 180 / Math.PI;
}

// 角度转换成弧度
export function degToRad(d: number) {
    return d * Math.PI / 180;
}

// 矩阵左乘向量（数学意义上的），相当于用矩阵来操作点
export function transformPoint(m: TMatrixType, v: number[]) {
    var v0 = v[0];
    var v1 = v[1];
    var d = v0 * m[0 * 3 + 2] + v1 * m[1 * 3 + 2] + m[2 * 3 + 2];
    return [
        (v0 * m[0 * 3 + 0] + v1 * m[1 * 3 + 0] + m[2 * 3 + 0]) / d,
        (v0 * m[0 * 3 + 1] + v1 * m[1 * 3 + 1] + m[2 * 3 + 1]) / d,
    ];
}

// 矩阵求逆：伴随矩阵+代数余子式
// refer: https://blog.csdn.net/daduzimama/article/details/120509856
export function inverse(m: TMatrixType, dst?: TMatrixType) {
    dst = dst || new MatType(9);

    const m00 = m[0 * 3 + 0];
    const m01 = m[0 * 3 + 1];
    const m02 = m[0 * 3 + 2];
    const m10 = m[1 * 3 + 0];
    const m11 = m[1 * 3 + 1];
    const m12 = m[1 * 3 + 2];
    const m20 = m[2 * 3 + 0];
    const m21 = m[2 * 3 + 1];
    const m22 = m[2 * 3 + 2];

    // 3 个余子式（去掉头尾）
    const b01 = m22 * m11 - m12 * m21;
    const b11 = -m22 * m10 + m12 * m20;
    const b21 = m21 * m10 - m11 * m20;

    // 计算行列式的值
    const det = m00 * b01 + m01 * b11 + m02 * b21;
    const invDet = 1.0 / det;

    // 利用余子式求逆
    dst[0] = b01 * invDet;
    dst[1] = (-m22 * m01 + m02 * m21) * invDet;
    dst[2] = (m12 * m01 - m02 * m11) * invDet;
    dst[3] = b11 * invDet;
    dst[4] = (m22 * m00 - m02 * m20) * invDet;
    dst[5] = (-m12 * m00 + m02 * m10) * invDet;
    dst[6] = b21 * invDet;
    dst[7] = (-m21 * m00 + m01 * m20) * invDet;
    dst[8] = (m11 * m00 - m01 * m10) * invDet;

    return dst;
}