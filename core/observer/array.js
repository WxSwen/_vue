import { def } from '../util/index';

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'splice',
  'sort'
];

methodsToPatch.forEach(function (method) {
  const origin = arrayProto[method];
  def(arrayProto, method, function mutator(...args) {
    const result = origin.apply(this, args);
    // todo
    let ob = this.__ob__;

    let inserted;
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if(inserted) ob.observeArray(inserted);
    ob.dep.notify();
    return result;
  })
})

