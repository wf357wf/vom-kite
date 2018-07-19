$(document).ready(function () {

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;

    $('#bankId').focus();

    // 提交按钮
    form.on('submit(kitebankinfo_add)', function (data) {
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(kiteBankinfoUrl, 'addKiteBankinfo', 'PUT', true, JSON.stringify(data.field), function (data) {
            if (data.success) {
                window.location.href = "kitebankinfo.html";
            } else {
                layer.alert(data.msg);
            }
            layer.close(index);
        }, function(errMsg) {
            layer.close(index);
            layer.alert(errMsg);
        });
        return false;
    });

});