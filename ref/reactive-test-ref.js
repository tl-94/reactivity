import { ref } from './ref.js'
import { effect } from '../demo3/effct-lazy.js'

const state = ref(false)

effect(() => {
    console.log(state.value,"effect")
})

setTimeout(() => {
    state.value = false
}, 2000)


setTimeout(() => {
    state.value = 3
}, 5000)