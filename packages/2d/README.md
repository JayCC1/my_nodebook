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



#### (2) bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y)

三次贝塞尔曲线和二次贝塞尔曲线不同的是多了一个控制点

**参数说明：**

- ``cp1x``：控制点1的x轴
- ``cp1y``：控制点1的y轴位置
- ``cp2x``：控制点2的x轴
- ``cp2y``：控制点2的y轴位置
- ``x``：结束点的x轴位置（与lineTo中的x作用一样）
- ``y``：结束点的y轴位置（与lineTo中的y作用一样）

**代码演示：**

```javascript
      // 获取 canvas 元素
const canvas = document.getElementById("canvas");
// 通过判断 getContext 方法是否存在赖判断浏览器的支持性
if (canvas.getContext) {
    // 获取绘图上下文
    const ctx = canvas.getContext("2d");
    // 绘制一段三次贝塞尔曲线
    ctx.beginPath(); // 开启路径
    ctx.moveTo(50, 200);
    ctx.bezierCurveTo(150, 50, 250, 350, 350, 200);
    // 绘制
    ctx.stroke();
}
```

**效果图如下：**

![](./static/bezierCurveTo.png)

## 二、绘制样式

### 1、线条的样式

#### (1)lineWidth

lineWidth 设置当前绘线的粗细，属性必须为正数。默认值为1.0



#### (2)lineCap

lineCap 设置线段端点显示的样子。默认是 butt。

**可选值：**

- butt （末端结束，没有扩展超过其末端）
- round （末端会以半圆形结束，半圆的直径等于线宽，端点处加上了半径为一半线宽的半圆）
- square（末端会以矩形结束，矩形的长度等于线宽，端点处加上了等宽且高度为一半线宽的方块）



#### (3)lineJoin

lineJoin 该属性可以设置两线段连接处所显示的样子。默认是 miter。

**可选值：**

- miter（交点将显示为尖角）
- round （交点将显示为圆角）
- bevel（交点将显示为斜角）



#### (4)miterLimit

miterLimit 限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。

线段之间夹角比较大时，交点不会太远，但随着夹角变小，交点距离会呈指数级增大。



![](./static/miterLimit_1.png)

第一个接合处的夹角比较小，接合处会比较尖，交点距离比较大 第二个接合处的夹角比较大，接合处就比较平缓。



`miterLimit` 属性就是用来设定外延交点与连接点的最大距离，默认值为 ``10``，如果交点距离大于此值，**``lineJoin``**  会变成了  **``bevel``**



#### (5)setLineDash/getLineDash

setLineDash 可以设置当前虚线样式。

setLineDash(arr) 中的 arr 长度为 ``奇数`` 或 ``偶数`` 时的效果不太一样

getLineDash 则是返回当前虚线设置的样式，长度为非负偶数的数组。

**代码示例：**

```javascript
 // 获取绘图上下文
      var ctx = canvas.getContext('2d');
      // 绘制一条虚线
      ctx.setLineDash([5, 10, 20]);
      console.log(ctx.getLineDash()); // [5, 10, 20, 5, 10, 20]
      ctx.beginPath();
      ctx.moveTo(0,100);
      ctx.lineTo(400, 100);
      ctx.stroke();
      // 再绘制一条虚线
      ctx.setLineDash([5, 10, 20, 40]);
      console.log(ctx.getLineDash()); // [5, 10, 20, 40]
      ctx.beginPath();
      ctx.moveTo(0,200);
      ctx.lineTo(400, 200);
      ctx.stroke();

```

**效果图如下：**

![](./static/LineDash.png)

**对比一下传参为奇数数组和偶数数组的区别：**

设置虚线的时候，如果传参为奇数，例如：ctx.setLineDash([5, 10, 20])，那么 setLineDash 会复制一份数组补全为偶数，相当于我们设置的是：ctx.setLineDash([5, 10, 20, 5, 10, 20])。所以这也就是为什么上图中我们设置的是 [5, 10, 20]，结果打印出来是 [5, 10, 20, 5, 10, 20]



#### (6)lineDashOffect

lineDashOffset 设置虚线样式的起始偏移量。

**代码示例：**

```javascript
// 再绘制一条虚线
ctx.setLineDash([5, 10, 20, 40]);
console.log("获取虚线样式", ctx.getLineDash()); // [5, 10, 20, 40]
ctx.beginPath();
ctx.moveTo(0, 200);
ctx.lineTo(400, 200);
ctx.stroke();
ctx.closePath();

// 添加 lineDashOffset 设置虚线样式的起始偏移量
ctx.setLineDash([5, 10, 20, 40]);
ctx.lineDashOffset = 3;
ctx.beginPath();
ctx.moveTo(0, 300);
ctx.lineTo(400, 300);
ctx.stroke();
ctx.closePath();
```

**效果图如下：**

![](./static/lineDashOffset.png)

可以明显看出虚线的总长度没有变化，只是起始点向左位移了3像素。



#### (7)strokeStyle

设置描边样式

**代码示例：**

```javascript
const ctx = canvas.getContext('2d'); // 获取绘制上下文
ctx.strokeStyle = "#f00" // 描边样式设置为红色
ctx.lineWidth = 5

// 绘制一个三角形
ctx.moveTo(50, 100) 
ctx.lineTo(50, 400)
ctx.lineTo(400, 400)
ctx.lineTo(50, 100) 
ctx.stroke();

```

**效果图如下：**

![](./static/strokeStyle.png)



(8)fillStyle

设置填充的样式

**代码示例：**

```javascript
const ctx = canvas.getContext('2d'); // 获取绘制上下文
ctx.fillStyle = "#00f" // 填充样式设置为蓝色
ctx.lineWidth = 5

// 如果是填充一个三角形，则只需两条直线就行，它会默认闭合。
ctx.beginPath()
ctx.moveTo(200, 200) 
ctx.lineTo(400, 200)
ctx.lineTo(400, 370)
ctx.fill();


```

**效果图如下：**

![](./static/fillStyle.png)





### 2、透明度

(1)globalAlpha

设置透明度值

**代码示例：**

```javascript
const ctx = canvas.getContext('2d'); // 获取绘制上下文
// 绘制一个圆
ctx.beginPath()
ctx.fillStyle = "rgba(255, 255, 0, 1)";
// 设置透明度值
ctx.globalAlpha = 0.5;
ctx.arc(200, 200, 100, 0, Math.PI*2, true);
ctx.fill();


```

**效果图如下：**

![](E:\resources\practice_test\docs\packages\2d\static\globalAlpha.png)



### 3、渐变

渐变分为 **两种** ，分别是 ``线性渐变`` 和 ``径向渐变`` ，在绘图中我们可以用线性或者径向来填充或描边。

#### (1)createLinearGradient(x1,y1,x2,y2)

线性渐变

**参数说明：**

- x1：起点的左边
