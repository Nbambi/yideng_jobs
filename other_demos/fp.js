// PerformanceObserver 性能监测对象：MDN https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver
const observer = new PerformanceObserver((observerList) => {
    for (const entry of observerList.getEntries()) {
        console.log(entry);
    }
});

// 指定监测的 entry types 集合，当 performance entry 记录并且是指定的 entryType 之一时，观察者对象函数会被调用
// PerformanceEntry.entryType MDN --> https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry/entryType
observer.observe({ entryTypes: ['paint'] });
