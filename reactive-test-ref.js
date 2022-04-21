import { ref } from './ref.js'
import { effect } from './effct.js'

const state = ref(false)

effect(() => {
    // if(state.ok){
    //     console.log("effect ok is true; text: is", state.text)
    // }
    console.log(state.value,"effect")
})

setTimeout(() => {
    state.value = false
}, 2000)


setTimeout(() => {
    state.value = 3
}, 5000)