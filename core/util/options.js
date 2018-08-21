import config from '../config'
import { warn } from './debug'
import { nativeWatch } from './env'
import { set } from '../observer/index'

import {
  ASSET_TYPES,
  LIFECYCLE_HOOKS
} from 'shared/constants'

import {
  extend,
  hasOwn,
  camelize,
  toRawType,
  capitalize,
  isBuiltInTag,
  isPlainObject
} from 'shared/util'

const strats = Object.create(null);

function mergeData(to, from) {
  // 合并数据，需要添加getter和setter
}

export function mergeDataOrFn(parentVal, childVal, vm) {
  if(!vm) {
    if(!childVal) {
      return parentVal
    }
    if(!parentVal) {
      return childVal;
    }
    return function mergeDataOrFn(){
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal,
      )
    }
  } else {
    return function mergedInstanceDataFn() {
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if(instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData;
      }
    }
  }
}

strats.data = function (parentVal, childVal, vm) {
  if(!vm) {
    if(childVal && typeof childVal !== 'function') {
      return parentVal;
    }
    return mergeData(parentVal, childVal);
  }
  return mergeData(parentVal, childVal, vm);
}

function mergeHook(parentVal, childVal) {
  return childVal
    ? parentVal 
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
}

LIFECYCLE_HOOKS.forEach( hook => {
  strats[hook] = mergeHook
})

function mergeAssets(parentVal, childVal, vm, key) {
  const res = Object.create(parentVal || null);
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})


// watch不应该被覆盖／重写，所以用数组push每个watch
strats.watch = function(parentVal, childVal, vm, key) {
  if(!parentVal) return childVal;
  const ret = {};
  extend(ret, parentVal);
  for(const key in childVal) {
    let parent = ret[key];
    let child = childVal[key];
    if(parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  } 
  return ret;
}


strats.props =
strats.methods =
strats.inject =
strats.computed = function() {
  // paren会被child覆盖
}

export function mergeOptions() {
  // export const ASSET_TYPES = [
  //   'component',
  //   'directive',
  //   'filter'
  // ]
  
  // export const LIFECYCLE_HOOKS = [
  //   'beforeCreate',
  //   'created',
  //   'beforeMount',
  //   'mounted',
  //   'beforeUpdate',
  //   'updated',
  //   'beforeDestroy',
  //   'destroyed',
  //   'activated',
  //   'deactivated',
  //   'errorCaptured'
  // ]

  // 合并策略
  // 1. 合并data：子data覆盖父data，但需要notify
  // 2. 钩子函数（即生命周期函数：LIFECYCLE_HOOKS）合并成数组
  // 3. 合并上述ASSET_TYPES，子覆盖父
  // 4. watch不应该被覆盖／重写，所以用数组push每个watch
  // 5. 其余合并（props／methods／inject／computed），一般执行子覆盖父组件
  // 6. 默认策略：子不为undefined，则返回子
}