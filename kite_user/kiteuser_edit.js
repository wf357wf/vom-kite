$(document).ready(function () {

    initBankInfo();
    getKiteUserList(getUrlParameter('userId'));

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;

    form.on('submit(kiteuser_edit)', function (data) {

        if(!isEmpty(data.field.userPass)) {
            data.field.userPass = MD5Encrypt(data.field.userPass);
        }

        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(kiteUserUrl, 'editKiteUser', 'POST', true, JSON.stringify(data.field), function (data) {
            if (data.success) {
                var parentIndex = parent.layer.getFrameIndex(window.name);
                parent.layer.close(parentIndex);
                parent.layui.table.reload('kiteuser_table');
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

// 初始化表单
function getKiteUserList(userId) {
    var index = layer.load(1, {
        shade: [0.4, '#fff']
    });
    Ajax(kiteUserUrl, 'getKiteUserList?key[userId]=' + userId, 'GET', true, null, function (data) {
        if (data.success) {
            var formData = data.data[0];
            formData.bankId = data.refObj;
            formData.userPass = '';
            $("#form_edit").setForm(formData);
            layui.form.render();
        } else {
            layer.alert(data.msg);
        }
        layer.close(index);
    }, function(errMsg) {
        layer.close(index);
    });
}

function initBankInfo() {
    Ajax(kiteBankinfoUrl, 'getKiteBankinfoList', 'GET', false, null, function (data) {
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