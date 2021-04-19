import fetch from 'node-fetch';

class SafeRequest {
    constructor() { }
    async fetch(url) {
        //规范数据格式
        let result = {
            code: 0, //0标识一下成功
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
                    result.code = 0; //0标识成功
                    result.data = res;
                    resolve(result);
                })
                .catch(error => {
                    result.code = -1; //-1标识失败
                    result.msg = error.message;
                    result.data = [{ book_name: '红楼梦' }, { book_name: '三国演义' }, { book_name: '水浒传' }];
                    resolve(result);
                    // reject(result);
                });
        });
    }
}

export default SafeRequest;