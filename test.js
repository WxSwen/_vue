const Vue = require('Vue');

const app = new Vue({
  data: {
    arr: [1,5,8],
    obj: {
      a: {
        b: {
          c: '12'
        }
      }
    }
  }
})

app.$data.obj.a.b.c = 155;