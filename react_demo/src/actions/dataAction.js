/**
 * 处理异步数据请求处理的 action
 */

export const FETCH_BEGIN = 'FETCH_BEGIN';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAIL = 'FETCH_FAIL';
export const fetch_begin = () => {
    return {
        type: FETCH_BEGIN
    }
}
export const fetch_success = (data) => {
    return {
        type: FETCH_SUCCESS,
        payLoad: { data }
    }
}
export const fetch_fail = (error, data) => {
    return {
        type: FETCH_FAIL,
        payLoad: { error, data }
    }
}

/**
 * 中间件与异步操作
 *  原理：在redux的dispatch方法里加入异步操作 -> 异步操作 + action的派发
 *  录播里说是增强了action的能力，个人感觉这个说法其实不是很准确，action只能是对象，所以说是在dispatch里多做了一些事比较合理
 */
export function fetchData() {
    return (dispatch, getState) => {
        dispatch(fetch_begin());
        return fetch('https://mock.yonyoucloud.com/mock/1096/demo/oppmhttps://mock.yonyoucloud.com/mock/1096/demo/oppm')
            .then(res => res.json())
            .then(json => {
                console.log('获取到的接口数据:', json);
                dispatch(fetch_success(json));
                return json;
            })
            .catch(err => {
                let defaultData = {
                    "name": "测试",
                    "textField": "修改文本"
                };
                dispatch(fetch_fail(err.message, defaultData)); //我这里是把 error 和 data 同时传回去了
                return defaultData;
            });
    }
}