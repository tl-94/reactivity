import { reactive } from './reactive.js'
import { effect } from './effct.js'

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
    state.text = 3
}, 5000)