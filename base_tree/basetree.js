// 树节点信息，全局可引用
var zNodes = null;

// 树对象，可以通过treeObj执行树的方法，如expandAll等
var treeObj = null;

// ztree设置，可以根据官网api覆盖此设置
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
        // 新增回调
        console.log(data);
        layer.msg('新增 ' + data.id);
    }, function (data) {
        // 修改回调
        layer.msg('修改 ' + data.id);
    }, function (data) {
        // 删除回调
        layer.msg('删除 ' + data.id);
    });
}

// 点击选中事件
function zTreeOnCheck(event, treeId, treeNode) {
    console.log(treeNode);
    layer.msg('点击 ' + treeNode.id);
}

$(document).ready(function () {

    var form = layui.form;

    var index = layer.load(1, {
        shade: [0.4, '#fff']
    });
    Ajax(baseTreeUrl, 'getList', 'GET', true, null, function (data) {
        if (data.success) {
            zNodes = data.data;

            // 初始化树
            treeObj = $.fn.zTree.init($('#zTreeId'), zTreeSets, zNodes);

            // 选中第一项
            var nodes = treeObj.getNodes();
            treeObj.selectNode(nodes[0]);

            // 全部展开
            treeObj.expandAll(true);
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

});