 function toRef(obj, key) {
     const wrapper = {
         get value() {
             return obj[key]
         },
         set value(val) { 
             obj[key] = val 
         }
     }

     Object.defineProperty(wrapper, '__v_isRef', {
         value: true
     })
     return wrapper
 }



 function toRefs(obj) {
     const ret = {}
     // 使用 for...in 循环遍历对象
     for (const key in obj) {
         // 逐个调用 toRef 完成转换
         ret[key] = toRef(obj, key)
     }
     return ret
 }