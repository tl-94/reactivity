import { track, trigger } from './effect.js'



export function reactive(data) {
    return new Proxy(data, {
        // 拦截读取操作
        get(target, key) {
            track(target, key)
            // 返回属性值
            return target[key]
        },
        // 拦截设置操作
        set(target, key, newVal) {
            // 设置属性值
            target[key] = newVal
            trigger(target, key)
            return true
        }
    })
}

