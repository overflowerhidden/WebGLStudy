function initShaders(gl, vsSource, fsSource) {
  // 创建程序对象
  const program = gl.createProgram();
  // 建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);

  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  //启动程序对象
  gl.useProgram(program);
  //将程序对象挂到上下文对象上
  gl.program = program;
  return true;
}

function loadShader(gl, type, source) {
  // 根据着色器类型，建立着色器对象
  const shader = gl.createShader(type);
  // 将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source);
  // 编译着色器对象
  gl.compileShader(shader);
  // 返回着色器对象
  return shader;
}

function getMousePosInWebgl({ clientX, clientY }, canvas) {
  // 获取鼠标点在webgl 坐标系中的位置
  const { left, top, width, height } = canvas.getBoundingClientRect();
  const [cssX, cssY] = [clientX - left, clientY - top];

  // canvas 坐标系转webgl 坐标系
  // 1.解决坐标原点位置差异
  const [halfWidth, halfHeight] = [width / 2, height / 2];
  const [xBaseCenter, yBaseCenter] = [
    cssX - halfWidth,
    cssY - halfHeight,
  ];
  // 2.解决Y方向的差异
  const yBaseCenterTop = -yBaseCenter;
  // 3.解决坐标基底差异
  const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight];
  return { x, y };
}

function glToCssPos({ x, y }, { width, height }) {
  const [halfWidth, halfHeight] = [width / 2, height / 2];
  return {
    x: x * halfWidth,
    y: -y * halfHeight
  }
}

//线性比例尺
function ScaleLinear(ax, ay, bx, by) {
  const delta = {
    x: bx - ax,
    y: by - ay,
  };
  const k = delta.y / delta.x;
  const b = ay - ax * k;
  return function (x) {
    return k * x + b;
  };
}

/* 正弦函数 */
function SinFn(a, Omega, phi) {
  return function (x) {
    return a * Math.sin(Omega * x + phi);
  };
}

function GetIndexInGrid(w, size) {
  return function (x, y) {
    return (y * w + x) * size
  }
}

/* 对Image 加载事件的封装 */
function imgPromise(img) {
  return new Promise((resolve) => {
    img.onload = function () {
      resolve(img);
    }
  });
}

export { initShaders, getMousePosInWebgl, imgPromise, glToCssPos, ScaleLinear, SinFn, GetIndexInGrid }