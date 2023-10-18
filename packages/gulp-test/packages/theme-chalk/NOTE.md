### @for $i from 20 through 50 和 @for $i from 20 to 50 区别

@for $i from 20 through 50：从 20 开始，一直到 50（包含 50）
@for $i from 20 to 50：从 20 开始，一直到 50（不包含 50）



### sass 中的编写 数组 变量的例子

```scss
$myArray: (10, 20, 30, 40);

@debug $myArray; // 输出数组

// 使用数组中的值
@for $i from 1 to length($myArray) {
  .item-#{$i} {
    // nth($myArray, $i)返回数组中对应索引的元素值
    margin: (nth($myArray, $i));
  }
}
```
