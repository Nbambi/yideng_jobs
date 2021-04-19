// import Banner from '../../components/banner/banner.js';
// import '../../assets/css/index.css';
// import '../../assets/js/myUnderscore.js';

import Banner from '@components/banner/banner.js';
import '@assets/css/index.css';
import '@assets/js/myUnderscore.js';

class BooksList {
    constructor() {
        console.log('BooksList init');
    }
}

Banner();
new BooksList();