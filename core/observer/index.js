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
import { observe } from '../../vue/src/core/observer';


const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
const hasProto = '__proto__' in {};

export let shouldObserve = true;
export function toggleObserve(val) {
  shouldObserve = val;
}

export class Observer{
  constructor(value){
    this.vmCount = 0;
    this.dep = new Dep();
    this.value = value;
    def(value, '__ob__', this);
    if(Array.isArray(value)) {
      // simplify
      value.__proto__ = arrayMethods;
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(obj) {
    let keys = Object.keys(obj);
    for(let i = 0;i < keys.length; i++){
      defineReactive(obj, keys[i]);
    }
  }

  observeArray(items) {
    for(let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

function observe(value) {
  let ob;
  if(!isObject(value)) return;
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
  for(let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if(Array.isArray(e)) {
      dependArray(e);
    }
  }
}
