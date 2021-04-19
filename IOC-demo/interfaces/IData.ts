export interface IData {
    item: string;
    // ?代表可有可无
    result?: Array<number | string>;
}

// // x是IData类型
// const x: IData = {
//     item: 'hello',
//     result: [111, '测试字符']
// }