$(document).ready(function () {

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        element = layui.element;

    // 自定义验证
    form.verify({
        notChinese: [/^[A-Za-z0-9]+$/, '编号不可包含中文或为空'],
        endDate: function (value) {
            if (isEmpty(value) || value < 0) {
                return "结束日期不能为空";
            } else if (value < $("#startDate").val()) {
                return "结束日期不能不能小于开始日期";
            }
        }
    });

    form.on('select(select-inter)', function (data) {
        layer.msg(data.value);

        if (data.value === 'N') {
            $('#select-assetType').attr('disabled', 'disabled');
        } else {
            $('#select-assetType').removeAttr('disabled');
        }
        layui.form.render();
    });

    var ins1 = laydate.render({
        elem: '#startDate',
        value: new Date().format('yyyy-MM-dd'),
        min: 0,
        done: function (value, date) {
            date.month -= 1;
            ins2.config.min = date;
        }
    });
    var ins2 = laydate.render({
        elem: '#endDate',
        value: new Date().format('yyyy-MM-dd'),
        min: 0,
        done: function (value, date) {
            date.month -= 1;
            ins1.config.max = date;
        }
    });

    // 提交按钮
    form.on('submit(table_submit)', function (data) {

        // 表单数据
        console.log(data.field);

        // 格式化yyyy-MM-dd为yyyyMMdd
        data.field.startDate = unFormatDate(data.field.startDate);
        data.field.endDate = unFormatDate(data.field.endDate);

        // 请求后台
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(baseTableUrl, 'addTable', 'PUT', true, JSON.stringify(data.field), function (data) {
            if (data.success) {
                window.location.href = "table_list.html";
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