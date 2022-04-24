const bucket = new WeakMap()

// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
// effect 栈
const effectStack = []

// 定义一个任务队列
const jobQueue = new Set()
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve()

// 一个标志代表是否正在刷新队列
let isFlushing = false
//
function flushJob() {
    // 如果队列正在刷新，则什么都不做
    if (isFlushing) return
    // 设置为 true，代表正在刷新
    isFlushing = true
    // 在微任务队列中刷新 jobQueue 队列
    p.then(() => {
        jobQueue.forEach(job => job())
    }).finally(() => {
        // 结束后重置 isFlushing 
        isFlushing = false
    })
}
export function effect(fn,options) {
    const effectFn = () => {
        cleanup(effectFn)
        // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect 
        activeEffect = effectFn
        // 在调用副作用函数之前将当前副作用函数压入栈中
        effectStack.push(effectFn)
        fn()
        // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
    effectFn.deps = []
    effectFn.options = options || {};
    effectFn()
}
const obj = reactive({
    foo: 1
})
// effect(
//     () => {
//         console.log(obj.foo, 'effect run')
//     },
//     // options 
//     {
//         // 调度器 scheduler 是一个函数
//         scheduler(fn) {
//             // 将副作用函数放到宏任务队列中执行
//             setTimeout(fn)
//         }
//     }
// )

//初始化run一次
// effect(() => {
//     console.log(obj.foo,"effect2 run")
// },{
//     scheduler(fn) {
//         // fn()
//         jobQueue.add(fn);
//         flushJob()
//     }
// });
// obj.foo++;
// obj.foo++;
// obj.foo++;

// console.log("end")

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

    effectsToRun.forEach(effectFn => {
        // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
        if (effectFn.options.scheduler) { // 新增
            effectFn.options.scheduler(effectFn) // 新增
        } else {
            // 否则直接执行副作用函数（之前的默认行为）
            effectFn() // 新增
        }
    })
}



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
    // deps 就是一个与当前副作用函数存在联系的依赖集合
    // 将其添加到 activeEffect.deps 数组中
    activeEffect.deps.push(deps)
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

function cleanup(effectFn) {
    // 遍历 effectFn.deps 数组
    for (let i = 0; i < effectFn.deps.length; i++) {
        // deps 是依赖集合
        const deps = effectFn.deps[i]
        // 将 effectFn 从依赖集合中移除
        deps.delete(effectFn)
    }
    // 最后需要重置 effectFn.deps 数组
    effectFn.deps.length = 0
}

// const state = reactive({
//     ok: true,
//     text: 2222
// })

// effect(() => {
//     if(state.ok){
//         console.log("effect ok is true; text: is", state.text)
//     }
//     console.log(state.ok,"effect")
// })

// setTimeout(() => {
//     state.ok = false
// }, 2000)


// setTimeout(() => {
//     state.text = 3
// }, 5000)
