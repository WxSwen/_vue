/**
 * Define a property.
 */
export function def(obj, key, val, enumerable){
  Object.defineProperty(obj,key,{
    value: val,
    configurable: true,
    enumerable: !!enumerable,
    writable: true,
  })
}