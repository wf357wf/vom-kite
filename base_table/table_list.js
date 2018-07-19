$(document).ready(function () {

    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;

    table.render({
        elem: '#table_list',
        height: 'full-95',
        size: 'sm',
        url: baseTableUrl + 'getList',

        // 表格如需要初始化就带参数，需要用where来传值，参看reload代码可以个token重新赋值
        where: {
            token: 'initval'
        },

        cellMinWidth: 80, // 每个域最小宽度80px
        limit: 20,
        page: true,
        cols: [[{
            type: 'checkbox'
        }, {
            field: 'prdtNo',
            title: '产品编号',
            width: 100,
            unresize: true,
            sort: true
        }, {
            field: 'prdtName',
            title: '产品名称',
            edit: 'text'
        }, {
            field: 'shortName',
            title: '简称'
        }, {
            field: 'curCode',
            title: '币种编号',
            width: 120,
            sort: true
        }, {
            field: 'startDate',
            title: '开始日期',
            width: 120,
            unresize: true
        }, {
            field: 'endDate',
            title: '结束日期',
            width: 120,
            unresize: true
        }, {
            title: '状态',
            width: 100,
            templet: '#stsTpl',
            unresize: true
        }, {
            fixed: 'right',
            width: 160,
            align: 'center',
            toolbar: '#toolBar'
        }]]
    });

    // 监听单元格编辑
    table.on('edit(table_list)', function (obj) {
        var value = obj.value, // 得到修改后的值
            data = obj.data, // 得到所在行所有键值
            field = obj.field; // 得到字段
        layer.msg('[ID: ' + data.prdtNo + '] ' + field + ' 字段更改为：' + value);
    });

    // 监听表格操作按钮
    table.on('tool(table_list)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            layer.msg('查看ID：' + data.prdtNo);
        } else if (obj.event === 'del') {
            layer.confirm('确认删除：' + data.prdtName + ' 吗？', function (index) {
                layer.msg(data.prdtNo);
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            location.href = "table_edit.html?prdtNo=" + data.prdtNo;
        }
    });

    form.on('submit(prdtddmast-search)', function (data) {
        table.reload('table_list', {
            where: {
                key: {
                    prdtNo: $('#prdtNo').val(),
                    prdtName: $('#prdtName').val(),
                },

                // 给token重新赋值
                token: '2222'
            }
        });
        return false;
    });

});
