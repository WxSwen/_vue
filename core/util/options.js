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