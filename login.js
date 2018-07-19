$(document).ready(function () {

    $("body").append("<div id='main_bg'/>");

    // 获取屏幕分辨率
    var height = screen.height;
    var width = screen.width;

    // 根据屏幕分辨率设置背景
    if (height <= 1024 && width <= 1208) {
        $("body").css("background-image",
            "url(../Images/index/bg1280_1024.png)");
    } else if (height <= 768 && width <= 1366) {
        $("body").css("background-image",
            "url(../Images/index/bg1366_768.png)");
    } else if (height <= 1080 && width <= 1920) {
        $("body").css("background-image",
            "url(../Images/index/bg1920_1080.png)");
    } else {
        $("body").css("background-image",
            "url(../Images/index/bg1920_1200.png)");
    }
    
    cover();

    $(window).resize(function () { //浏览器窗口变化
        cover();
    });

    $("#login_btn").hover(function () {
        $("#login_btn").attr('src', "../Images/index/btn_enter2.png");
    }, function () {
        $("#login_btn").attr('src', "../Images/index/btn_enter1.png");
    });

    var $username = $('#username');
    var $password = $('#password');

    $username.focus();
    $username.focus(function () {
        $('#error_label').text('　');
    });

    $password.focus(function () {
        $('#error_label').text('　');
    });

    $('#login_btn').click(function () {
        if (isEmpty($username.val())) {
            var curWidth = ($(document.body).height()) / 2 - 50;
            layer.msg('请输入用户名!', {
                time: 1000, //20s后自动关闭
                offset: curWidth
            });
            return false;
        }

        if (isEmpty($password.val())) {
            var curWidth = ($(document.body).height()) / 2 - 50;
            layer.msg('请输入密码!', {
                time: 1000, //20s后自动关闭
                offset: curWidth
            });
            return false;
        }

        var userInfo = {};
        userInfo.userId = $username.val();
        userInfo.userName = '管理员';
        userInfo.userPass = MD5Encrypt($password.val());

        Ajax(sessionUrl, 'userLogin', 'POST', false, JSON.stringify(userInfo), function (data) {
            if (!data.success) {
                var curWidth = ($(document.body).height()) / 2 - 50;
                layer.msg(data.msg, {
                    time: 1000, //20s后自动关闭
                    offset: curWidth
                });
                return false;
            } else {
                window.location.href = "index.html";
            }
        });
    });

    $('#username').keydown(function (e) {
        if (e.keyCode === 13) {
            $("#password").focus();
        }
    });
    $('#password').keydown(function (e) {
        if (e.keyCode === 13) {
            $("#login_btn").click();
        }
    });

});

function cover() {
    var win_width = $(window).width();
    var win_height = $(window).height();
    $("#bigpic").attr({width: win_width, height: win_height});
} 