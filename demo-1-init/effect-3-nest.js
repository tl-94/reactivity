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

/**
 * 建立数据与副作用函数之间的联系
 */
export function track(target, key) {
    // 没有 activeEffect，直接 return 
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    // 把当前激活的副作用函数添加到依赖集合 deps 中
    deps.add(activeEffect)
}

/**
 * 副作用函数并执行
 */
export function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
        if (effectFn !== activeEffect) { 
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => effectFn())
    // effects && effects.forEach(effectFn => effectFn()) 
}


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

const state = reactive({
    text: 2222,
    foo: "a foo"
})

effect(() => {
    console.log(state.text,"effect run");
    effect(() => {
        console.log("output foo", state.foo)
    })
    // console.log(state.text,"effect run after");
    let temp2 = state.text
})


// setTimeout(() => {
//     state.text = 3
// }, 2000)

// setTimeout(() => {
    state.text = 3333
// }, 2000)