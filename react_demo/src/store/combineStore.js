/**
 * 这里是拆分 reducer 后的 store
 */
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducer/rootReducer';
import thunk from 'redux-thunk';

// createStore 的第二个参数可以指定默认值，如果参数指定了默认值，applyMiddleware必须放在第三个参数位置
const combineStore = createStore(rootReducer, applyMiddleware(thunk));
export default combineStore;