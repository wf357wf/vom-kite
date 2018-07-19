$(document).ready(function () {

    getBuildTestList(getUrlParameter('userId'));

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;

    form.verify({
        controlNo: [/^\d{1,8}$/, '编号必须1到8位']
    });

    form.on('submit(buildtest_edit)', function (data) {
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(buildTestUrl, 'editBuildTest', 'POST', true, JSON.stringify(data.field), function (data) {
            if (data.success) {
                window.location.href = "buildtest.html";
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
function getBuildTestList(userId) {
    var index = layer.load(1, {
        shade: [0.4, '#fff']
    });
    Ajax(buildTestUrl, 'getBuildTestList?key[userId]=' + userId, 'GET', true, null, function (data) {
        if (data.success) {
            var formData = data.data[0];

            // 初始数据校验

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