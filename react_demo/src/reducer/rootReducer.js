/**
 * 总 reducer
 */
import { combineReducers } from 'redux';
import { countReducer } from './countReducer';
import { dataReducer } from './dataReducer';

export default combineReducers({ countReducer, dataReducer });