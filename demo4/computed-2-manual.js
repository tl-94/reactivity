import { track, trigger, effect } from '../demo3/effect-2-lazy.js'

export function computed(getter) {

    const effectFn = effect(getter, {
        lazy: true,
        scheduler(fn) {
            // fn()
            // console.log("computed scheduler")
            //
            trigger(obj, 'value')
        }
    })

    const obj = {
        get value() {
            let value = effectFn();
            // 当读取 value 时，手动调用 track 函数进行追踪
            track(obj, 'value')
            // console.log("computed track")

            return value;
        }
    }

    return obj
}