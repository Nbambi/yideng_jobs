// 管理所有模块的路由
import BooksController from './BooksController';
import IndexController from './IndexController';

function initController(router) {
    /**
     * 
     * 1. controller 接收前端路由，进行不同 action 的转发
     * 2. action 进行页面的渲染或者是直接返回接口数据（需要 Model 层与数据层交互）
     * 3. 渲染 view
     * 
     */
    router.get('/', new IndexController().actionIndex);
    router.get('/books/list', new BooksController().actionList);
    router.get('/books/create', new BooksController().actionCreate);
}

export default initController;