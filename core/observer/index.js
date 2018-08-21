import Dep from './dep'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'


const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
const hasProto = '__proto__' in {};


// 确定是否需要添加observe
export let shouldObserve = true;
export function toggleObserve(val) {
  shouldObserve = val;
}

export class Observer{
  constructor(value){
    this.vmCount = 0;
    this.dep = new Dep();
    this.value = value;
    // 将observe保存在每个数据的__ob__中
    def(value, '__ob__', this);
    if(Array.isArray(value)) {
      // 简化数组方法继承
      value.__proto__ = arrayMethods;
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(obj) {
    // 遍历对象，添加getter和setter
    let keys = Object.keys(obj);
    for(let i = 0;i < keys.length; i++){
      defineReactive(obj, keys[i]);
    }
  }

  observeArray(items) {
    // 遍历数组
    for(let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

function observe(value) {
  let ob;
  if(!isObject(value)) return;
  // 判断是否存在__ob__，存在返回__ob__；不存在递归
  if(hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if(shouldObserve && !value._isVue){
    ob = new Observer(value);
  }
  return ob;
}

export function defineReactive(obj, key) {
  const dep = new Dep();
  let val;
  let shallow = undefined;
  let property = Object.getOwnPropertyDescriptor(obj, key);

  if(property && property.configurable === false) {
    return
  }

  let getter = property && property.get;
  if(!getter && arguments.length === 2) {
    val = obj[key];
  }
  let setter = property && property.set;

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    configurable: true,
    writable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      // 通过dep.depend去收集sub
      if(Dep.target) {
        dep.depend();
        if(childOb) {
          childOb.dep.depend();
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = setter ? setter.call(obj) : val;
      if(newVal !== value || (newVal !== newVal && value !== value)) {
        return;
      }
      if(setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  })
}

function dependArray(value) {
  // 数组再收集dep
  for(let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if(Array.isArray(e)) {
      dependArray(e);
    }
  }
}

export function set(target, key, val){
  
}