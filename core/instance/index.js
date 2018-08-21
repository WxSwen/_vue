import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 初始化一系列
stateMixin(Vue);
eventsMixin(Vue); // 挂载on once off等事件
lifecycleMixin(Vue); // 挂载其他生命周期
renderMixin(Vue);

export default Vue