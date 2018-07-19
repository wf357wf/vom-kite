$(document).ready(function () {

    var form = layui.form,
        layer = layui.layer;

    $('#roleId').focus();

    // 提交按钮
    form.on('submit(kiterole_add)', function (data) {
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        data.field.sysId = parent.sysId;
        Ajax(kiteRoleUrl, 'addKiteRole', 'PUT', true, JSON.stringify(data.field), function (data) {
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