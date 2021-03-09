/**
 * 处理计数器的 action
 * @returns action creator
 */
export const ADD = 'ADD';
export const REDUCE = 'REDUCE';
export const add = () => { return { type: ADD } };
export const reduce = () => { return { type: REDUCE } };
