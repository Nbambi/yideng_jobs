$(function () {
    $('#submit').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/saveUser',
            type: 'GET',
            dataType: 'json',
            data: {
                username: $('#username').val()
            },
            success: function (data) {
                alert(data.msg);
            },
            error: function () {
                alert(data.msg);
            }
        });
    });
});