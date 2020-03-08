import { join } from 'path'; // 引入 join 方法

const config = {
    port: 3000,
    logDir: join(__dirname, '../logs'),
    viewDir: join(__dirname, '../../web/views'),
    assetsDir: join(__dirname, '../assets')
}

export default config;