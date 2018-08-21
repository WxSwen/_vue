import Dep, { pushTarget, popTarget } from './dep';
import { parsePath } from '../util';
import { traverse } from './traverse';
import { queueWatcher } from './scheduler';


let uid = 0;

export default class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher){
    this.vm = vm;

    // todo
    if(isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);

    if(options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.sync = !!options.sync;
      this.lazy = !!options.lazy;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    
    this.cb = cb;
    this.id = ++uid;
    this.active = true;
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();

    if(typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
    }

    this.value = this.get();
  }

  get() {
    pushTarget(this);
    let value;
    const vm = this.vm;

    try {
      value = this.getter.call(vm, vm);
    } catch(e) {
      throw(e);
    } finally{
      if(this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }

  addDep(dep) {
    const id = dep.id;
    if(!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if(!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }

  cleanupDeps() {
    
  }

  update() {
    if(this.lazy) {
      this.dirty = true;
    } else if(this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }

  run() {
    if(this.active) {
      const value = this.get();

      if(value !== this.value || isObject(value) || this.deep) {
        const oldValue = this.value;
        this.value = value;
        if(this.user) {
          try{
            this.cb.call(this.vm, this.value, oldValue)
          }catch(e) {
            throw(e);
          }
        }
        this.cb.call(this.vm, this.value, oldValue)
      }
    }
  }
}