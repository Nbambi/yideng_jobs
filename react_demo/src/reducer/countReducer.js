/**
 * 处理计数器状态的 reducer
 */
import { ADD, REDUCE } from '../actions/countAction';

const initialState = { count: 0 };

export function countReducer(state = initialState, action) {
    console.log('countReducer action-->', state, action);
    switch (action.type) {
        case ADD:
            return { ...state, count: state.count + 1 };
        case REDUCE:
            return { ...state, count: state.count - 1 };
        default:
            return state;
    }
}