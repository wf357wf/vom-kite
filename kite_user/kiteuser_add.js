$(document).ready(function () {

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;


    $('#userId').focus();

    initBankInfo();

    // 提交按钮
    form.on('submit(kiteuser_add)', function (data) {

        data.field.userPass = MD5Encrypt(data.field.userPass);

        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(kiteUserUrl, 'addKiteUser', 'PUT', true, JSON.stringify(data.field), function (data) {
            if (data.success) {
                var parentIndex = parent.layer.getFrameIndex(window.name);
                parent.layer.close(parentIndex);
                parent.layui.table.reload('kiteuser_table');
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

function initBankInfo() {
    Ajax(kiteBankinfoUrl, 'getKiteBankinfoList', 'GET', true, null, function (data) {
        if (data.success) {
            for (var i in data.data) {
                var bank = data.data[i];
                $('#bankId').append('<option value="' + bank.bankId + '">'
                    + '[' + bank.bankId + ']' + bank.bankName + '</option>');
            }
            layui.form.render();
        } else {
            layer.alert(data.msg);
        }
    }, function (errMsg) {
        layer.alert(errMsg);
    });
}