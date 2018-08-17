export function isReserved(str){
  const c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}

/**
 * Define a property.
 */
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    configurable: true,
    writable: true,
    enumerable: !!enumerable,
    value: val
  })
}



let bailRE = /[^\w.$]/;
export function parsePath(path){
  if(bailRE.test(path)){
    return;
  }
  const segments = path.split('.');
  return function (obj) {
    for(let i = 0; i < segments.length; i++){
      if(!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  }

}