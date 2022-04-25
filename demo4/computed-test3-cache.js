import { computed } from "./computed-3-dirty.js";
// import { reactive } from "./reactive.js";
import { effect,reactive } from '../demo3/effect-2-lazy.js'

const state1 = reactive({
    foo: "foo"
})

const state2 = reactive({
    bar: "bar"
})

//1.如果没用到computed的值 则不运行
const comp = computed(() => {
    console.log('computed run calc')
    return state1.foo + state2.bar
})

effect(() => {
    console.log(comp.value,"access computed value")
},{
    lazy: false
})

setTimeout(() => {
    //state2的修改应该触发所有使用了comp的副作用函数重新执行
    state2.bar = 'sss2'
}, 1000);

//如果值没发生改变，computed不用去重复计算
// setTimeout(() => {
//     console.log(comp.value,"access computed value")
// }, 3000);