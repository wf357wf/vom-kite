$(document).ready(function () {

    getKiteBankinfoList(getUrlParameter('bankId'));

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;

    form.on('submit(kitebankinfo_edit)', function (data) {
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(kiteBankinfoUrl, 'editKiteBankinfo', 'POST', true, JSON.stringify(data.field), function (data) {
            if (data.success) {
                window.location.href = "kitebankinfo.html";
            } else {
                layer.alert(data.msg);
            }
            layer.close(index);
        }, function (errMsg) {
            layer.close(index);
            layer.alert(errMsg);
        });
        return false;
    });
});

// 初始化表单
function getKiteBankinfoList(bankId) {
    var index = layer.load(1, {
        shade: [0.4, '#fff']
    });
    Ajax(kiteBankinfoUrl, 'getKiteBankinfoList?key[bankId]=' + bankId, 'GET', true, null, function (data) {
        if (data.success) {
            var formData = data.data[0];
            $("#form_edit").setForm(formData);
            layui.form.render();
        } else {
            layer.alert(data.msg);
        }
        layer.close(index);
    }, function (errMsg) {
        layer.close(index);
    });
}