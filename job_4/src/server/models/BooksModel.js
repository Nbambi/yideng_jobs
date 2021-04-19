// 请求后端接口 拿到数据
import SafeRequest from '../utils/safeRequest';
class BooksModel {

    async getBooksList() {
        return new SafeRequest().fetch('http://localhost:81/basic/web/index.php?r=books-rest');
    }
}

export default BooksModel;