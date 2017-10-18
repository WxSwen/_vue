import { def } from '../util/lang';

const arrayProto = Array.prototype;
//新建数组原型链对象
export const arrayMethod = Object.create(arrayProto);

/**
 * Intercept mutating methods and emit events
 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function(method){
  //缓存原始数组方法
  const origin = arrayProto[method];

  def(arrayMethod, method, function mutator(...args){
    const result = origin.apply(this,args);
    const ob = this.__ob__;
    //将数组中需要插入的参数分离出来观测
    let inserted;
    switch(method){
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);  
        break;  
    }
    if(inserted) ob.obsertArray(inserted);
    //订阅splice修改
    ob.dep.notify();
    return result;
  })
})


