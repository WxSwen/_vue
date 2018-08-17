function inheritObject(o){
  function F(){}
  F.prototype = o;
  return new F();
}
function inheritPrototype(subClass,superClass){
  var p = inheritObject(superClass.prototype);
  p.constructor = subClass;
  subClass.prototype = p;
}

function ArrayOfMine () {
  console.log(ArrayOfMine.prototype);
  var args = arguments
    , len = args.length
    , i = 0
    , args$1 = [];   // 保存所有arguments
  for (; i < len; i++) {
    // 判断参数是否为数组，如果是则直接concat
    if (Array.isArray(args[i])) {
      args$1 = args$1.concat(args[i]);
    }
    // 如果不是数组，则直接push到
    else {
      args$1.push(args[i])
    }
  }
  // 接收Array.apply的返回值，刚接收的时候arr是一个Array
  var arr = Array.apply(null, args$1);
  // 将arr的__proto__属性指向 ArrayOfMine的 prototype
  console.log(ArrayOfMine.prototype);
  arr.__proto__ = ArrayOfMine.prototype;
  return arr;
}
inheritPrototype(ArrayOfMine, Array);
// 重写父类Array的push,pop等方法
ArrayOfMine.prototype.push = function () {
  console.log('监听到数组的变化啦！');
  return Array.prototype.push.apply(this, arguments);
}
var list4 = [1, 2];
var newList = new ArrayOfMine(list4, 3);
console.log(newList, newList.length, newList instanceof Array, Array.isArray(newList));
newList.push(4);
console.log(newList, newList.length, newList instanceof Array, Array.isArray(newList));