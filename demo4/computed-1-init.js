import { effect } from './effct-lazy.js'

export function computed(getter) {
    //希望不立即执行，使用了再执行 获得结果
    const effectFn = effect(getter,{
        lazy: true
    })

    const obj = {
        get value() {
            return effectFn()
        }
    }

    return obj
}