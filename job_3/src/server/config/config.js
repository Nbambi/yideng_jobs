import { join } from 'path'; // 引入 join 方法

let config = {
    logDir: join(__dirname, '../logs'),
    viewDir: join(__dirname, '../../web/views'),
    assetsDir: join(__dirname, '../../web/assets')
}

if (false) {
    // 这是一段永远不会执行的废代码 -> 测试 rollup 清洗效果
    alert('this is no use code!');
    alert('this is no use code!');
    alert('this is no use code!');
    alert('this is no use code!');
    alert('this is no use code!');
    alert('this is no use code!');
}

// 开发环境配置
if (process.env.NODE_ENV === 'development') {
    let devConfig = {
        port: 3000,
        cache: false
    }
    config = { ...config, ...devConfig };
}

// 生产环境配置
if (process.env.NODE_ENV === 'production') {
    let prodConfig = {
        port: 8000,
        cache: 'memory'
    }
    config = { ...config, ...prodConfig };
}

export default config;