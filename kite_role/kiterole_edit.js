$(document).ready(function () {

    getKiteRoleList(getUrlParameter('roleId'));

    var form = layui.form,
        layer = layui.layer;

    form.on('submit(kiterole_edit)', function (data) {
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        data.field.sysId = parent.sysId;
        Ajax(kiteRoleUrl, 'editKiteRole', 'POST', true, JSON.stringify(data.field), function (data) {
            if (data.success) {
                var parentIndex = parent.layer.getFrameIndex(window.name);
                parent.layer.close(parentIndex);
                parent.layui.table.reload('kiterole_table');
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
function getKiteRoleList(roleId) {
    var index = layer.load(1, {
        shade: [0.4, '#fff']
    });
    Ajax(kiteRoleUrl, 'getKiteRoleList?key[roleId]=' + roleId + '&sysId=' + parent.sysId, 'GET', true, null, function (data) {
        if (data.success) {
            var formData = data.data[0];
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