import { computed } from "./computed-2-manual.js";
import { reactive,effect } from "../demo3/effect-2-lazy.js";

const state1 = reactive({
    foo: "foo"
})

const state2 = reactive({
    bar: "bar"
})

//1.如果没用到computed的值 则不运行
const comp = computed(() => {
    console.log('computed run')
    return state1.foo + state2.bar
})


//3.在一个副作用函数内实现computed的值
effect(() => {
    console.log(comp.value,"access computed value")
},{
    lazy: false
})
setTimeout(() => {
    //state2的修改应该触发所有使用了comp的副作用函数重新执行
    //当运行之后发现「使用了comp的副作用函数」并没有重新执行
    //原因是我们并没有将computed的value属性与使用了它的副作用函数建立起联系
    //所以需要我们手动去track一下
    state2.bar = 'sss2'
}, 1000);
