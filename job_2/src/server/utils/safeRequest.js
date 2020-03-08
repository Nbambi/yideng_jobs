import fetch from 'node-fetch';

class SafeRequest {
    constructor() { }
    async fetch(url) {
        // 规范格式
        let result = {
            code: 0,
            msg: "",
            data: null
        }
        return new Promise((resolve, reject) => {
            // 对数据转 json 并返回，有异常则捕获
            fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => res.json())
                .then(res => {
                    result.data = res;
                    resolve(result);
                })
                .catch(error => {
                    result.code = -1;
                    result.msg = error.message;
                    reject(error);
                });
        });
    }
}

export default SafeRequest;