$(document).ready(function () {

    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        element = layui.element;

    getTableInfo(getUrlParameter('prdtNo'));

    // 主键不能修改
    $('#prdtNo').attr("disabled", "disabled");

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

    // 监听选择变化
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
        done: function (value, date) {
            date.month -= 1;
            ins2.config.min = date;
        }
    });
    var ins2 = laydate.render({
        elem: '#endDate',
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
        Ajax(baseTableUrl, 'updTable', 'POST', true, JSON.stringify(data.field), function (data) {
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

    function getTableInfo(prdtNo) {
        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });
        Ajax(baseTableUrl, 'getList?key[prdtNo]=' + prdtNo, 'GET', true, null, function (data) {
            if (data.success) {
                data.data[0].startDate = DateFormat(data.data[0].startDate);
                data.data[0].endDate = DateFormat(data.data[0].endDate);
                $("#form_edit").setForm(data.data[0]);
                layui.form.render();
            } else {
                layer.alert(data.msg);
            }
            layer.close(index);
        }, function(errMsg) {
            layer.close(index);
            layer.alert(errMsg);
        });
    }
});