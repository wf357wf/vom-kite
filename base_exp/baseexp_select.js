_expStr = "";
_expHtml = "";

$(document).ready(function () {

    var editHtml = '<span class="drag exp-badge exp-bg-gray" exp="variation" val="120026">' +
        '<p>临时存款【120026】</p><i class="close layui-icon">ဇ</i></span>' +
        '<span class="drag exp-badge exp-bg-gray" exp="<=">&lt;=<i class="close layui-icon">ဇ</i></span>' +
        '<span class="drag exp-badge exp-bg-gray" exp="variation" val="130001">' +
        '<p>银行存款【130001】</p><i class="close layui-icon">ဇ</i></span>';
    $('#expEditHtml').val(editHtml);

    $('#add').click(function () {
        layer.open({
            title: "表达式配置",
            shadeClose: false,
            type: 2,
            area: ['90%', '95%'],
            content: "baseexp.html",
            end: function () {
                if (!isEmpty(_expStr)) {
                    $('#expAdd').val(_expStr);
                    $('#expAddHtml').val(_expHtml);
                }
            }
        });
    });

    $('#edit').click(function () {
        layer.open({
            title: "表达式配置",
            shadeClose: false,
            type: 2,
            area: ['90%', '95%'],
            content: "baseexp.html",
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.initExp($('#expEditHtml').val()); // 初始化
            },
            end: function () {
                if (!isEmpty(_expStr)) {
                    $('#expEdit').val(_expStr);
                    $('#expEditHtml').val(_expHtml);
                }
            }
        });
    });

});