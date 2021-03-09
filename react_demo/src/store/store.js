/**
 * 这里是一开始未拆分 reducer 的 store
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ADD, REDUCE } from '../actions/countAction';
import { FETCH_BEGIN, FETCH_SUCCESS, FETCH_FAIL } from '../actions/dataAction';

const initialState = { count: 0, loading: false, error: null, data: null };

// 默认值当然也可以直接这样给，不过更推荐使用现有的 api
// function reducer(state = initialState, action) {
function reducer(state, action) {
    console.log('action-->', state, action);
    switch (action.type) {
        case ADD:
            return { ...state, count: state.count + 1 };
        case REDUCE:
            return { ...state, count: state.count - 1 };
        case FETCH_BEGIN:
            return { ...state, error: null, data: null, loading: true };
        case FETCH_SUCCESS:
            return { ...state, error: null, data: action.payLoad.data, loading: false };
        case FETCH_FAIL:
            return { ...state, error: action.payLoad.error, data: action.payLoad.data, loading: false };
        default:
            return state;
    }
}

// createStore 的第二个参数可以指定默认值
const store = createStore(reducer, initialState, applyMiddleware(thunk));

// store.dispatch({ "type": "ADD" });
// store.dispatch({ "type": "REDUCE" });

export default store;