import { track, trigger, effect } from '../demo3/effect-2-lazy.js'

export function computed(getter) {
    let value
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            if (!dirty) {
                //当计算属性依赖的响应式数据变化时，代表需要重新计算
                dirty = true
                // 手动调用 trigger 函数触发响应
                trigger(obj, 'value')
            }
        }
    })

    const obj = {
        get value() {
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            // 当读取 value 时，手动调用 track 函数进行追踪
            track(obj, 'value')
            return value
        }
    }

    return obj
}