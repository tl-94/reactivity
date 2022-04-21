const bucket = new WeakMap()

// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
// effect 栈
const effectStack = [] // 新增

function effect(fn) {
    const effectFn = () => {
        // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect 
        activeEffect = effectFn
        // 在调用副作用函数之前将当前副作用函数压入栈中
        effectStack.push(effectFn) // 新增
        fn()
        // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
        effectStack.pop() // 新增
        activeEffect = effectStack[effectStack.length - 1] // 新增
    }
    // 执行副作用函数
    effectFn()
}


function reactive(data) {
    return new Proxy(data, {
        // 拦截读取操作
        get(target, key) {
            // 没有 activeEffect，直接 return 
            if (!activeEffect) return
            // 根据 target 从“桶”中取得 depsMap，它也是一个 Map 类型：key --> effects 
            let depsMap = bucket.get(target)
            // 如果不存在 depsMap，那么新建一个 Map 并与 target 关联
            if (!depsMap) {
                bucket.set(target, (depsMap = new Map()))
            }
            // 再根据 key 从 depsMap 中取得 deps，它是一个 Set 类型，
            // 里面存储着所有与当前 key 相关联的副作用函数：effects 
            let deps = depsMap.get(key)
            // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
            if (!deps) {
                depsMap.set(key, (deps = new Set()))
            }
            // 最后将当前激活的副作用函数添加到“桶”里
            deps.add(activeEffect)
            // 返回属性值
            return target[key]
        },
        // 拦截设置操作
        set(target, key, newVal) {
            // 设置属性值
            target[key] = newVal
            // 根据 target 从桶中取得 depsMap，它是 key --> effects 
            const depsMap = bucket.get(target)
            if (!depsMap) return
            // 根据 key 取得所有副作用函数 effects 
            const effects = depsMap.get(key)
            // console.log(effects, "key", key)
            // 执行副作用函数
            effects && effects.forEach(fn => fn())

        }
    })
}

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
    //由于state.ok已经是false了，所有不管
    state.text = 3
}, 5000)
