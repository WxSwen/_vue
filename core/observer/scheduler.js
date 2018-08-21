let has = {};
let flushing = false;
let waiting = false;
const queue = [];
const activatedChildren = [];
let index = 0;

function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  waiting = flushing = false;
}

function flushSchedulerQueue() {
  flushing = true;
  let watcher, id

  queue.sort((a, b) => a.id - b.id);

  for(index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher[id];
    has[id] = null;
    watcher.run();
  }

  const activatedQueue = activatedChildren.slice();
  const updatedQueue = queue.slice();

  resetSchedulerState();

  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)
}

function callActivatedHooks(queue) {
  for(let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true);
  }
}

function callUpdatedHooks(queue) {
  let i = queue.length;
  while(i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    if(vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}

export function queueWatcher(watcher){
  const id = watcher.id;
  if(has[id] === null) {
    has[id] = true;
    if(!flushing) {
      queue.push(watch);
    } else {
      let i = queue.length - 1;
      while(i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0 , watcher);
    }

    if(!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue);
    }
  }
}