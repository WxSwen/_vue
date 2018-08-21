import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    // 执行顺序
    // mergeOption
    // initLifecycle : 初始化周期状态
    // initEvents: 初始化某些事件
    // initRender: 初始化渲染（将createElement绑定到vm上）
    // callHook(beforeCreate)
    // initInjections
    // initState （初始化数据绑定，computed，watch）
    // initProvide
    // callHook(created)

    // if (vm.$options.el) {
    //   vm.$mount(vm.$options.el)
    // }

    
  }
}