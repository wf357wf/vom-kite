$(document).ready(function () {

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;

    // 自定义验证
    form.verify({
        controlNo: [/^\d{1,8}$/, '编号必须1到8位']
    });

    // 监听数据字典变化模板（没有请删除注释代码）
    /*
    form.on('select(lay-filter)', function(data) {
        if(data.value == 'Y') {

        } else {

        }

        form.render();
    });
    */

    // 提交按钮
    form.on('submit(buildtest_add)', function (data) {
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(buildTestUrl, 'addBuildTest', 'PUT', true, JSON.stringify(data.field), function (data) {
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