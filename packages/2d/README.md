# Canvas

Canvas 最早是由 Apple 引入 WebKit，用于Mac OS X 的 Dashboard，随后被各个浏览器实现。如今除一些过时的浏览器不支持Canvas元素外，所有的新版本主流浏览器都支持它。

## API

#### 1、getContext(param)

获取渲染上下文和绘画功能

**接收(param)参数：**

- 2d：建立一个二维渲染上下文。这种情况可以用 CanvasRenderingContext2D()来替换getContext('2d')。

- webgl（或 experimental-webgl）： 创建一个 WebGLRenderingContext 三维渲染上下文对象。只在实现WebGL 版本1(OpenGL ES 2.0)的浏览器上可用。

- webgl2（或 experimental-webgl2）：创建一个 WebGL2RenderingContext 三维渲染上下文对象。只在实现 WebGL 版本2 (OpenGL ES 3.0)的浏览器上可用。

- bitmaprenderer：创建一个只提供将canvas内容替换为指定ImageBitmap功能的ImageBitmapRenderingContext。



## 一、绘制形状

### 1、线

#### (1) moveTo(x,y)

设置初始位置，参数为初始位置x和y的坐标点

**参数说明：**

- ``x、y``：位置坐标

#### (2) lineTo(x,y)

绘制一条从初始位置到指定位置的直线，参数为指定位置x和y的坐标点

**参数说明：**

- ``x、y``：位置坐标

#### (3) stroke()

通过线条来绘制图形轮廓

### 2、矩形

#### (1) strokeRect(x,y,width,height)

绘制一个矩形的边框

**参数说明：**

- ``x、y``：矩形的起点坐标
- ``width``：矩形的宽度
- ``height``：矩形的高度

#### (2) fillRect(x,y,width,height)

绘制一个填充的矩形

**参数说明：**

- ``x、y``：矩形的起点坐标
- ``width``：矩形的宽度
- ``height``：矩形的高度

#### (3) clearRect(x,y,width,height)

清除指定矩形区域，让清楚部分完全透明

**参数说明：**

- ``x、y``：矩形的起点坐标
- ``width``：矩形的宽度
- ``height``：矩形的高度



### 3、圆

#### (1) arc(x,y,radius,startAngle,endAngle,anticlockwise)

绘制圆弧或圆

**参数说明：**

- ``x、y``：x和y为圆心的坐标
- ``radius``：为半径
- ``startAngle``：为圆弧或圆的开始位置
- ``endAngle``：为圆弧或圆的结束位置
- ``anticlockwise``：是绘制的方向(不写默认为false，从顺时针方向)



### 4、开启和闭合路径

每次新建路径的时候都需要开启和闭合路径，这样不同路径之间才不会相互干扰。

#### (1) beginPath()

新建一条路径，生成之后，图形绘制命令被指向到路径上

#### (2) closePath()

闭合路径之后图形绘制命令又重新指向到上下文中



### 5、填充

#### (1) fill()

stroke方法是通过线条来绘制图形轮廓，而fill方法则是通过填充路径的内容区域生成实心的图形

#### (2) stroke()

通过线条来绘制图形轮廓



### 6、椭圆

#### (1) ellipse(x,y,radiusX,radiusY,rotation,startAngle,endAngle,anticlockwise)

添加椭圆路径

**参数说明：**

- ``x、y``：椭圆的圆心位置
- ``radiusX、radiusY``：x轴和y轴的半径
- ``rotation``：椭圆的旋转角度、已弧度表示
- ``startAngle``：开始绘制点
- ``endAngle``：结束绘制点
- ``anticlockwise``：绘制的方向（默认顺时针），可选参数



### 7、贝塞尔曲线

#### (1) quadraticCurveTo(cp1x,cp1y,x,y)

二次贝塞尔曲线

**参数说明：**

- ``cp1x``：控制点的x轴
- ``cp1y``：控制点的y轴位置
- ``x``：结束点的x轴位置（与lineTo中的x作用一样）
- ``y``：结束点的y轴位置（与lineTo中的y作用一样）

**代码演示：**

```javascript
// 获取 canvas 元素
var canvas = document.getElementById('canvas');
// 通过判断getContext方法是否存在来判断浏览器的支持性
if(canvas.getContext) {
    // 获取绘图上下文
    var ctx = canvas.getContext('2d');
    // 绘制一段二次贝塞尔曲线
    ctx.moveTo(50, 50);
    ctx.quadraticCurveTo(200, 200, 350, 50);
    // 绘制
    ctx.stroke();
}
```

**效果图如下：**

![](./static/quadraticCurveTo.png)



