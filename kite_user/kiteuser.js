var sysId = getUrlParameter('sysId');

var _userId = null;

$(document).ready(function () {

    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;

    table.render({
        elem: '#kiteuser_table',
        height: 'full-135',
        url: kiteUserUrl + 'getKiteUserList',
        cellMinWidth: 120,
        limit: 20,
        page: true,
        cols: [[
            {
                title: '用户编号',
                field: 'userId',
                event: 'click',
                width: 120,
                sort: true
            },
            {
                title: '用户名称',
                field: 'userName',
                event: 'click'
            },
            {
                title: '手机',
                field: 'userPhone',
                event: 'click',
                width: 160
            },
            {
                title: '邮箱',
                field: 'userEmail',
                event: 'click',
                width: 160
            },
            {
                fixed: 'right',
                width: 100,
                align: 'center',
                toolbar: '#toolBar'
            }
        ]]
    });

    // 监听表格操作按钮
    table.on('tool(kiteuser_table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'click') {
            _userId = data.userId;
            initRoletable(data.userId);
            initSystable(data.userId);
            $('#tip-label').remove();
        } else if (obj.event === 'del') {
            layer.confirm('确认删除：【' + data.userId + '】' + data.userName + ' 吗？', function (confirmIndex) {
                var index = layer.load(1, {
                    shade: [0.4, '#fff']
                });
                Ajax(kiteUserUrl, 'delKiteUser/' + data.userId, 'DELETE', true, null, function (data) {
                    if (data.success) {
                        $('.layui-layer-close').click();
                        table.reload('kiteuser_table');
                    } else {
                        layer.alert(data.msg);
                    }
                    layer.close(index);
                }, function (errMsg) {
                    layer.close(index);
                    layer.alert(errMsg);
                });
                layer.close(confirmIndex);
            });
        } else if (obj.event === 'edit') {
            layer.open({
                area: ['680px', '300px'],
                type: 2,
                shadeClose: false,
                title: '修改用户',
                content: 'kiteuser_edit.html?userId=' + data.userId
            });
        }
    });

    // 查询按钮
    form.on('submit(kiteuser-search)', function (data) {
        table.reload('kiteuser_table', {
            where: {
                key: {
                    userId: $('#userId').val()
                }
            }
        });
        return false;
    });

    $('#role-save').click(function () {

        if (isEmpty(_userId)) {
            layer.msg('请先选择一条用户记录');
            return false;
        }

        var checkDatas = table.checkStatus('kiterole_table');
        var urrelList = [];
        for (var i in checkDatas.data) {
            var urrel = {};
            urrel.sysId = sysId;
            urrel.roleId = checkDatas.data[i].roleId;
            urrel.userId = _userId;
            urrelList.push(urrel);
        }

        var relInfo = {};
        relInfo.sysId = sysId;
        relInfo.userId = _userId;
        relInfo.urrelList = urrelList;

        Ajax(kiteUserUrl, 'updateUrrel', 'POST', true, JSON.stringify(relInfo), function (data) {
            if (data.success) {
                layer.msg('修改关联角色成功');
            } else {
                layer.alert(data.msg);
            }
        }, function (errMsg) {
            layer.alert(errMsg);
        });

    });

    $('#sys-save').click(function () {

        if (isEmpty(_userId)) {
            layer.msg('请先选择一条用户记录');
            return false;
        }

        var checkDatas = table.checkStatus('kitesys_table');
        var usersysList = [];
        for (var i in checkDatas.data) {
            var usersys = {};
            usersys.sysId = checkDatas.data[i].sysId;
            usersys.userId = _userId;
            usersysList.push(usersys);
        }

        var relInfo = {};
        relInfo.userId = _userId;
        relInfo.usersysList = usersysList;

        Ajax(kiteUserUrl, 'updateUsersys', 'POST', true, JSON.stringify(relInfo), function (data) {
            if (data.success) {
                layer.msg('修改关联系统成功');
            } else {
                layer.alert(data.msg);
            }
        }, function (errMsg) {
            layer.alert(errMsg);
        });

    });

    $('#user-add').click(function () {
        layer.open({
            area: ['680px', '300px'],
            type: 2,
            shadeClose: false,
            title: '新增用户',
            content: 'kiteuser_add.html'
        });
    });

    setTimeout(function () {
        layer.tips('勾选之后记得保存', '#role-save', {
            tips: [1, '#263238']
        });
    }, 1000);

});

function initRoletable(userId) {

    var table = layui.table;

    table.render({
        elem: '#kiterole_table',
        height: 'full-135',
        url: kiteRoleUrl + 'getKiteRoleList',
        where: {sysId: sysId},
        cellMinWidth: 120,
        page: false,
        cols: [[
            {
                type: 'checkbox'
            },
            {
                title: '角色标识',
                field: 'roleId',
                width: 140,
                sort: true
            },
            {
                title: '角色名称',
                field: 'roleName'
            }
        ]],
        done: function (res, curr, count) { // 反选

            Ajax(kiteRoleUrl, 'getUrrelList?sysId=' + sysId + '&userId=' + userId, 'GET', true, null, function (data) {
                if (data.success) {
                    var ids = data.data;
                    for (var i = 0; i < res.data.length; i++) {
                        for (var j = 0; j < ids.length; j++) {
                            if (res.data[i].roleId === ids[j].roleId) {
                                res.data[i]["LAY_CHECKED"] = true;
                                var index = res.data[i]['LAY_TABLE_INDEX'];
                                $('.kite-role .layui-table-body tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                                $('.kite-role .layui-table-body tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                            }
                        }
                    }
                    var checkStatus = table.checkStatus('kiterole_table');
                    if (checkStatus.isAll) {
                        $('.kite-role .layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                        $('.kite-role .layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                    }
                } else {
                    layer.alert(data.msg);
                }
            }, function (errMsg) {
                layer.alert(errMsg);
            });
        }
    });
}

function initSystable(userId) {

    var table = layui.table;

    table.render({
        elem: '#kitesys_table',
        height: 'full-135',
        url: kiteUserUrl + 'getKiteSysdefList',
        where: {sysId: sysId},
        cellMinWidth: 120,
        page: false,
        cols: [[
            {
                type: 'checkbox'
            },
            {
                title: '系统标识',
                field: 'sysId',
                width: 100,
                sort: true
            },
            {
                title: '简称',
                field: 'sysEnname',
                width: 100
            },
            {
                title: '系统名称',
                field: 'sysName'
            }
        ]],
        done: function (res, curr, count) { // 反选

            Ajax(kiteUserUrl, 'getUrsysList?userId=' + userId, 'GET', true, null, function (data) {
                if (data.success) {
                    var ids = data.data;
                    for (var i = 0; i < res.data.length; i++) {
                        for (var j = 0; j < ids.length; j++) {
                            if (res.data[i].sysId === ids[j].sysId) {
                                res.data[i]["LAY_CHECKED"] = true;
                                var index = res.data[i]['LAY_TABLE_INDEX'];
                                $('.kite-sys .layui-table-body tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                                $('.kite-sys .layui-table-body tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                            }
                        }
                    }
                    var checkStatus = table.checkStatus('kitesys_table');
                    if (checkStatus.isAll) {
                        $('.kite-sys .layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                        $('.kite-sys .layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                    }
                } else {
                    layer.alert(data.msg);
                }
            }, function (errMsg) {
                layer.alert(errMsg);
            });
        }
    });
}