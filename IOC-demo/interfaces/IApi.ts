import { IData } from "@interfaces/IData";

export interface IApi {
    // : 返回的数据形式
    getInfo(): Promise<IData>
}