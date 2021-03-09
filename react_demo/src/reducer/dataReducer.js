/**
 * 处理异步请求数据的 reducer
 */
import { FETCH_BEGIN, FETCH_SUCCESS, FETCH_FAIL } from '../actions/dataAction';

const initialState = { loading: false, error: null, data: null };

export function dataReducer(state = initialState, action) {
    console.log('dataReducer action-->', state, action);
    switch (action.type) {
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