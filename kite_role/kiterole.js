var sysId = getUrlParameter('sysId');

var zNodes = null;
var treeObj = null;

var _roleId = null;

var zTreeSets = {
    view: {
        selectedMulti: true,
        nameIsHTML: true
    },
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: false
    }
};

$(document).ready(function () {

    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var element = layui.element;

    table.render({
        elem: '#kiterole_table',
        height: 'full-135',
        url: kiteRoleUrl + 'getKiteRoleList',
        where: {sysId: sysId},
        cellMinWidth: 120,
        page: false,
        cols: [[
            {
                title: '角色标识',
                field: 'roleId',
                width: 160,
                event: 'click',
                sort: true
            },
            {
                title: '角色名称',
                field: 'roleName',
                event: 'click'
            },
            {
                fixed: 'right',
                width: 80,
                align: 'center',
                toolbar: '#toolBar'
            }
        ]]
    });

    // 表格点击
    table.on('tool(kiterole_table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'click') {
            _roleId = data.roleId;
            initUsertable(_roleId);
            initMenutree(_roleId);
            $('#tip-label').remove();
        } else if (obj.event === 'del') {
            layer.confirm('确认删除：' + data.roleName + ' 吗？', function (confirmIndex) {
                var index = layer.load(1, {
                    shade: [0.4, '#fff']
                });
                Ajax(kiteRoleUrl, 'delKiteRole/' + sysId + '/' + data.roleId, 'DELETE', true, null, function (data) {
                    if (data.success) {
                        $('.layui-layer-close').click();
                        table.reload('kiterole_table');
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
                area: ['680px', '240px'],
                type: 2,
                shadeClose: false,
                title: '新增角色',
                content: 'kiterole_edit.html?roleId=' + data.roleId
            });
        }
    });

    // 查询按钮
    form.on('submit(kiterole-search)', function (data) {
        table.reload('kiterole_table', {
            where: {
                key: {
                    roleId: $('#roleId').val()
                }
            }
        });

        return false;
    });

    $('#user-save').click(function () {

        if(isEmpty(_roleId)) {
            layer.msg('请先选择一条角色记录');
            return false;
        }

        var checkDatas = table.checkStatus('kiteuser_table');
        var urrelList = [];
        for(var i in checkDatas.data) {
            var urrel = {};
            urrel.sysId = sysId;
            urrel.roleId = _roleId;
            urrel.userId = checkDatas.data[i].userId;
            urrelList.push(urrel);
        }

        var relInfo = {};
        relInfo.sysId = sysId;
        relInfo.roleId = _roleId;
        relInfo.urrelList = urrelList;

        Ajax(kiteRoleUrl, 'updateUrrel', 'POST', true, JSON.stringify(relInfo), function (data) {
            if (data.success) {
                layer.msg('修改关联用户成功');
            } else {
                layer.alert(data.msg);
            }
        }, function(errMsg) {
            layer.alert(errMsg);
        });

    });

    $('#menu-save').click(function () {

        if(isEmpty(_roleId)) {
            layer.msg('请先选择一条角色记录');
            return false;
        }

        var nodes = treeObj.getCheckedNodes();
        var mrrelList = [];
        for(var i in nodes) {
            var node = nodes[i];
            if('M' === node.menuType) {
                var mrrel = {};
                mrrel.sysId = sysId;
                mrrel.roleId = _roleId;
                mrrel.menuId = node.menuId;
                mrrelList.push(mrrel);
            }
        }

        var relInfo = {};
        relInfo.sysId = sysId;
        relInfo.roleId = _roleId;
        relInfo.mrrelList = mrrelList;

        Ajax(kiteRoleUrl, 'updateMrrel', 'POST', true, JSON.stringify(relInfo), function (data) {
            if (data.success) {
                layer.msg('修改关联菜单成功');
            } else {
                layer.alert(data.msg);
            }
        }, function(errMsg) {
            layer.alert(errMsg);
        });

    });

    $('#role-add').click(function () {
        layer.open({
            area: ['680px', '240px'],
            type: 2,
            shadeClose: false,
            title: '新增角色',
            content: 'kiterole_add.html'
        });
    });

    setTimeout(function () {
        layer.tips('勾选之后记得保存', '#user-save', {
            tips: [1, '#263238']
        });
    }, 1000);

});

function initMenutree(roleId) {

    Ajax(kitePagedefUrl, 'getKitePagedefList/' + sysId, 'GET', true, null, function (data) {
        if (data.success) {

            zNodes = data.data;
            treeObj = $.fn.zTree.init($('#zTreeId'), zTreeSets, zNodes);
            treeObj.expandAll(true);

            Ajax(kiteRoleUrl, 'getMrrelList/' + sysId + '/' + roleId, 'GET', true, null, function (data) {
                if (data.success) {
                    var ids = data.data;
                    var nodes = treeObj.transformToArray(treeObj.getNodes());
                    for (var i in nodes) {
                        var node = nodes[i];
                        if ('M' === node.menuType) {
                            for (var id in ids) {
                                if (ids[id].menuId === node.menuId) {
                                    treeObj.checkNode(node, true, true);
                                }
                            }
                        }
                    }
                } else {
                    layer.alert(data.msg);
                }
            }, function (errMsg) {
                layer.alert(errMsg);
            });

        } else {
            layer.alert(data.msg);
        }
    }, function (errMsg) {
        layer.alert(errMsg);
    });
}

function initUsertable(roleId) {

    var table = layui.table;

    table.render({
        elem: '#kiteuser_table',
        height: 'full-135',
        url: kiteUserUrl + 'getKiteUserList',
        cellMinWidth: 120,
        page: false,
        cols: [[
            {
                type: 'checkbox'
            },
            {
                title: '用户编号',
                field: 'userId',
                width: 120,
                sort: true
            },
            {
                title: '用户名称',
                field: 'userName'
            },
            {
                title: '手机',
                field: 'userPhone',
                width: 160
            },
            {
                title: '邮件',
                field: 'userEmail',
                width: 160
            }
        ]],
        done: function (res, curr, count) { // 反选

            Ajax(kiteRoleUrl, 'getUrrelList?sysId=' + sysId + '&roleId=' + roleId, 'GET', true, null, function (data) {
                if (data.success) {
                    var ids = data.data;
                    for (var i = 0; i < res.data.length; i++) {
                        for (var j = 0; j < ids.length; j++) {
                            if (res.data[i].userId === ids[j].userId) {
                                res.data[i]["LAY_CHECKED"] = true;
                                var index = res.data[i]['LAY_TABLE_INDEX'];
                                $('.kite-user .layui-table-body tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                                $('.kite-user .layui-table-body tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                            }
                        }
                    }
                    var checkStatus = table.checkStatus('kiteuser_table');
                    if (checkStatus.isAll) {
                        $('.kite-user .layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                        $('.kite-user .layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
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