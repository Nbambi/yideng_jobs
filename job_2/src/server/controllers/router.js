// 管理所有模块的路由
import BooksController from './BooksController';
import IndexController from './IndexController';

export default function( router ){
    router.get( '/', new IndexController().actionIndex);
    router.get( '/books/list', new BooksController().actionList);
}