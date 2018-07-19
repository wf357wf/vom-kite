$(document).ready(function () {

    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;

    table.render({
        elem: '#buildtest_table',
        height: 'full-95',
        url: buildTestUrl + 'getBuildTestList',
        cellMinWidth: 120, // 每个域最小宽度80px
        limit: 20, // 每页大小
        page: true, // 是否分页
        cols: [[
            {
                type: 'checkbox'
            },
            {
				title: '用户标识',
				field: 'userId',
				sort: true
			},
            {
				title: '姓名',
				field: 'userName',
				sort: true
			},
            {
				title: '性别',
				field: 'userSex',
				sort: true
			},
            {
				title: '电话',
				field: 'userPhone',
				sort: true
			},
            {
				title: '电子邮件',
				field: 'userEmail',
				sort: true
			},
            {
				title: '地址',
				field: 'userAddress',
				sort: true
			},
            {
				title: '备注',
				field: 'userDesc',
				sort: true
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
    table.on('tool(buildtest_table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            layer.msg('查看ID：' + data.userId);
        } else if (obj.event === 'del') {
            layer.confirm('确认删除：' + data.userId + ' 吗？', function (confirmIndex) {
                var index = layer.load(1, {
                    shade: [0.4, '#fff']
                });
                Ajax(buildTestUrl, 'delBuildTest/' + data.userId, 'DELETE', true, null, function (data) {
                    if (data.success) {
                        $('.layui-layer-close').click();
                        table.reload('buildtest_table');
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
            location.href = "buildtest_edit.html?userId=" + data.userId;
        }
    });

    // 查询按钮
    form.on('submit(buildtest-search)', function (data) {
        table.reload('buildtest_table', {
            where: {
                key: {
                    userId: $('#userId').val()
                }
            }
        });
        return false;
    });

    // 生成器说明
    layer.open({
        title: "代码生成说明",
        shade: 0,
        type: 1,
        offset: 'r',
        area: ['240px', '400px'],
        content:
            '<ul style="padding: 10px">' +
            '<li style="margin-bottom: 5px">1. 单表维护的页面可由代码生成器直接生成</li>' +
            '<li style="margin-bottom: 5px">2. 本页面所展示的所有页面都是由生成器一键生成的，增删改查均好用</li>' +
            '<li style="margin-bottom: 5px">3. 可一键生成页面的前提是：表有主键，每个字段都有字段描述</li>' +
            '<li style="margin-bottom: 5px">4. 可查看生成器代码，只需修改要生成的表名，其余保持默认即可，程序会自动定位文件生成位置</li>' +
            '<li style="margin-bottom: 5px">5. 生成好的代码需要调整，如：添加数据字典、修改页面主键要只读等</li>' +
            '<li style="margin-bottom: 5px">6. 如果同一个表生成两次，第一次的任何修改都会被覆盖，谨慎操作</li>' +
            '</ul>'
    });

});