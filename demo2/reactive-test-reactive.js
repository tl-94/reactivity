import { reactive } from './reactive.js'
import { effect } from './effect.js'

const state = reactive({
    ok: true,
    text: 2222
})

effect(() => {
    if(state.ok){
        console.log("effect ok is true; text: is", state.text)
    }
    console.log(state.ok,"effect")
})

setTimeout(() => {
    state.ok = false
}, 2000)


setTimeout(() => {
    //由于state.ok已经是false了，副作用函数对text已经没有依赖了，所以不应该触发副作用函数重新执行
    state.text = 3
}, 5000)