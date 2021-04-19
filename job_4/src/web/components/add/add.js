const Add = {
    init() {
        console.log('我是添加图书的js');

        // 需要动态绑定事件，不然反复点击相同的菜单时会发现事件无效，这里...不太懂为啥会发生这种问题
        // $('#create-btn').click(function () {
        //     alert('click event');
        // });

        $(document).on('click', '#create-btn', function () {
            alert('click event');
        });
    }
}

export default Add;