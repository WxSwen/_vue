import VNode, { cloneVNode } from './vnode'
import config from '../config'
import { SSR_ATTR } from 'shared/constants'
import { registerRef } from './modules/ref'
import { traverse } from '../observer/traverse'
import { activeInstance } from '../instance/lifecycle'
import { isTextInputType } from 'web/util/element'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  makeMap,
  isRegExp,
  isPrimitive
} from '../util/index'

export const emptyNode = new VNode('', {}, []);

const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

function sameVnode(a, b) {
  return (
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  ) || (
    isTrue(a.isAsyncPlaceholder) &&
    a.asyncFactory === b.asyncFactory &&
    isUndef(b.asyncFactory.error)
  )
}

function sameInputType(a, b) {
  if(a.tag !== 'input') return true;
  let i;
  const typeA = isDef(i = a.data) && isDef( i = i.attrs) && i.type;
  const typeB = isDef(i = b.data) && isDef( i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for(i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if(isDef(key)) map[key] = i;
  }
  return map;
}

function findIdxInOld(node, oldCh, start, end) {
  for(let i = start; i < end; i++) {
    const c = oldCh[i];
    if(isDef(c) && sameVnode(node, c)) return i;
  }
}

export function createPatchFunction(backend) {
  let i, j;
  const cbs = {};
  
  let { modules, nodeOps } = backend;

  for(i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for(j = 0; j < modules.length; ++j) {
      if(isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb(){}
  function removeNode(){}
  function isUnknownElement() {}

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if(isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx];
      } else if(isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if(sameVnode(oldStartVnode, newStartVnode)) {
        patch();
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if(sameVnode(oldEndVnode, newEndVnode)) {
        patch();
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if(sameVnode(oldStartVnode, newEndVnode)) {
        patch();

        // nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))

        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if(sameVnode(oldEndVnode, newStartVnode)) {
        patch();

        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
          if(isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if(isUndef(idxInOld)) {
            createElm();
          } else {
            vnodeToMove = oldCh[idxInOld]
            if(sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
              oldCh[idxInOld] = undefined
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
            } else {
              createElm();
            }
          }
          newStartVnode = newCh[++newStartIdx]
      }
    }

    if(oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes()
    } else if(newStartIdx > newEndIdx){
      removeVnodes();
    }
  }
}

