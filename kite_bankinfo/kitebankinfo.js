$(document).ready(function () {

    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;

    table.render({
        elem: '#kitebankinfo_table',
        height: 'full-95',
        url: kiteBankinfoUrl + 'getKiteBankinfoList',
        cellMinWidth: 120, // 每个域最小宽度80px
        limit: 20, // 每页大小
        page: true, // 是否分页
        cols: [[
            {
				title: '法人编号',
				field: 'bankId',
                width: 200,
				sort: true
			},
            {
				title: '法人名称',
				field: 'bankName',
                width: 200
			},
            {
				title: '法人描述',
				field: 'bankDesc'
			},
            {
                fixed: 'right',
                width: 160,
                align: 'center',
                toolbar: '#toolBar'
            }
        ]]
    });

    // 监听表格操作按钮
    table.on('tool(kitebankinfo_table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            layer.msg('查看ID：' + data.bankId);
        } else if (obj.event === 'del') {
            layer.confirm('确认删除：' + data.bankName + ' 吗？', function (confirmIndex) {
                var index = layer.load(1, {
                    shade: [0.4, '#fff']
                });
                Ajax(kiteBankinfoUrl, 'delKiteBankinfo/' + data.bankId, 'DELETE', true, null, function (data) {
                    if (data.success) {
                        $('.layui-layer-close').click();
                        table.reload('kitebankinfo_table');
                    } else {
                        layer.alert(data.msg);
                    }
                    layer.close(index);
                }, function(errMsg) {
                    layer.close(index);
                    layer.alert(errMsg);
                });
                layer.close(confirmIndex);
            });
        } else if (obj.event === 'edit') {
            location.href = "kitebankinfo_edit.html?bankId=" + data.bankId;
        }
    });

    // 查询按钮
    form.on('submit(kitebankinfo-search)', function (data) {
        table.reload('kitebankinfo_table', {
            where: {
                key: {
                    bankId: $('#bankId').val()
                }
            }
        });
        return false;
    });

});