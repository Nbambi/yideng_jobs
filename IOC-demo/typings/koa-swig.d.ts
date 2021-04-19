declare module 'koa-swig' {
    // 接收两种类型
    function render<T>(value: T | render.RenderDefaultSettings): any;
    namespace render {
        interface RenderDefaultSettings {
            root: string;
            autoescape: boolean;
            cache: string | boolean;
            ext: string;
            writeBody: boolean;
        }
    }
    export default render;
}