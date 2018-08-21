// import { defineComputed } from "../../vue/src/core/instance/state";

// import Watcher from "../../vue/src/core/observer/watcher";

const computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  const watchers = vm._computedWatchers = Object.create(null);

  for(const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get;

    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      computedWatcherOptions
    )

    if(!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  }
}

function defineComputed(target, key, userDef) {
  
}