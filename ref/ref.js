import { reactive } from "../demo3/reactive.js"
// 封装一个 ref 函数
export function ref(val) { 
      // 在 ref 函数内部创建包裹对象
  const wrapper = { 
      value: val 
 } 
  // 将包裹对象变成响应式数据
  return reactive(wrapper) 
 }