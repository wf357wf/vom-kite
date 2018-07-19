var zNodes = null;
var treeObj = null;

var sysId = getUrlParameter('sysId');

// 缓存编辑节点
var _editNode = null;
// 新增/修改标志
var _optFlag = null;

var zTreeSets = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false,
        nameIsHTML: true
    },
    check: {
        enable: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: false
    },
    callback: {
        onClick: zTreeOnCheck
    }
};

// 悬浮按钮事件
function addHoverDom(treeId, treeNode) {
    buildHoverDom(treeId, treeNode, function (data) {
        addNode(data);
    }, function (data) {
        editNode(data);
    }, function (data) {
        delNode(data);
    });
}

// 点击选中事件
function zTreeOnCheck(event, treeId, treeNode) {
    editNode(treeNode);
}

$(document).ready(function () {

    var form = layui.form;

    var index = layer.load(1, {
        shade: [0.4, '#fff']
    });
    Ajax(kitePagedefUrl, 'getKitePagedefList/' + sysId, 'GET', true, null, function (data) {
        if (data.success) {
            zNodes = data.data;

            // 初始化树
            treeObj = $.fn.zTree.init($('#zTreeId'), zTreeSets, zNodes);

            // 选中第一项
            var nodes = treeObj.getNodes();
            treeObj.selectNode(nodes[0]);

            addNode(nodes[0]);

            // 全部展开
            treeObj.expandAll(false);
        } else {
            layer.alert(data.msg);
        }
        layer.close(index);
    }, function (errMsg) {
        layer.alert(errMsg);
    });

    // 查询
    form.on('submit(ztree-search)', function (data) {
        searchZtree(treeObj, data.field.searchText);
        return false;
    });

    // 类型选择
    form.on('select(menuType)', function (data) {
       if(data.value === 'M') {
           $('#menuHref').attr('lay-verify', 'required').removeAttr('disabled');
       } else {
           $('#menuHref').removeAttr('lay-verify').attr('disabled', 'disabled');
       }

       if(data.value === 'R') {
           $('#menuParentid').val('root');
       } else {
           $('#menuParentid').val(_editNode.id);
       }
    });

    // 修改/新增
    form.on('submit(kitepagedef_btn)', function (data) {
        var field = data.field;
        field.sysId = sysId;

        var index = layer.load(1, {
            shade: [0.4, '#fff']
        });

        if(_optFlag === 'UPDATE') { // 修改

            Ajax(kitePagedefUrl, 'editKitePagedef', 'POST', true, JSON.stringify(field), function (data) {
                if (data.success) {
                    for(var i in field) {
                        _editNode[i] = field[i];
                    }
                    _editNode.name = field.menuName;
                    treeObj.updateNode(_editNode);

                    layer.msg('修改成功');
                } else {
                    layer.alert(data.msg);
                }
                layer.close(index);
            }, function (errMsg) {
                layer.alert(errMsg);
            });

        } else { // 新增

            Ajax(kitePagedefUrl, 'addKitePagedef', 'PUT', true, JSON.stringify(field), function (data) {
                if (data.success) {
                    field.id = field.menuId;
                    field.name = field.menuName;

                    treeObj.addNodes(_editNode, -1, field); // 将节点插入到最后（-1）

                    layer.msg('添加成功');
                } else {
                    layer.alert(data.msg);
                }
                layer.close(index);
            }, function (errMsg) {
                layer.alert(errMsg);
            });

        }

        return false;
    });

});

function editNode(treeNode) {

    _editNode = treeNode;
    _optFlag = 'UPDATE';

    resetForm('treeForm');

    $('#treeForm').setForm(treeNode);
    $('#label-title').text('修改菜单');
    $('#menuId').attr('disabled', 'disabled');
    $('#menuType').attr('disabled', 'disabled');

    var menuType = treeNode.menuType;

    if(menuType === 'M') { // 只有菜单类型才需要配置地址
        $('#menuHref').attr('lay-verify', 'required').removeAttr('disabled');
    } else {
        $('#menuHref').removeAttr('lay-verify').attr('disabled', 'disabled');
    }

    layui.form.render();
}

function addNode(treeNode) {

    if(isEmpty(treeNode)) { // 树为空时只能添加根节点
        $('#menuType').val('R').attr('disabled', 'disabled');
        $('#menuHref').attr('disabled', 'disabled').removeAttr('lay-verify');
        layui.form.render();
        return;
    }

    var menuType = treeNode.menuType;

    switch (menuType) {
        case 'M':
            layer.msg('菜单节点不能再添加菜单');
            return;
        case 'R':
            $('#sel-menu').removeAttr('disabled');
            $('#sel-dir').removeAttr('disabled');
            $('#sel-label').removeAttr('disabled');
            break;
        case 'D':
            $('#sel-menu').removeAttr('disabled');
            $('#sel-dir').removeAttr('disabled');
            $('#sel-label').attr('disabled', 'disabled');
            break;
        case 'L':
            $('#sel-menu').removeAttr('disabled');
            $('#sel-dir').attr('disabled', 'disabled');
            $('#sel-label').attr('disabled', 'disabled');
            break;
    }

    _editNode = treeNode;
    _optFlag = 'ADD';

    resetForm('treeForm');

    var nodeData = {
        menuParentid : treeNode.id
    };

    $('#menuType').removeAttr('disabled');
    $('#menuType').val('M'); // 默认
    $('#menuHref').attr('lay-verify', 'required').removeAttr('disabled'); // 默认

    $('#treeForm').setForm(nodeData);
    $('#label-title').text('新增菜单');
    $('#menuId').removeAttr('disabled');

    layui.form.render();
}

function delNode(treeNode) {
    if(isEmpty(treeNode.children)) {

        layer.confirm('确认删除当前结点吗？', {
            btn: ['确认','取消']
        }, function(index){

            var index_load = layer.load(1, {
                shade: [0.4, '#fff']
            });
            Ajax(kitePagedefUrl, 'delKitePagedef/' + sysId + '/' + treeNode.menuId, 'DELETE', true, null, function (data) {
                if (data.success) {
                    treeObj.removeNode(treeNode);
                    layer.msg('删除成功');
                } else {
                    layer.alert(data.msg);
                }
                layer.close(index_load);
            }, function (errMsg) {
                layer.alert(errMsg);
            });

            layer.close(index);
        });

    } else {
        layer.msg('存在子节点，不能直接删除');
    }
}