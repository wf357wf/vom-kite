layui.use(['form', 'table', 'treeGrid'], function () {

    var treeGrid = layui.treeGrid;
    var table = layui.table;
    var form = layui.form;

    var treeTable = treeGrid.render({
        elem: '#treeTable',
        url: baseTreeUrl + 'getList',
        height: 'full-135',
        treeId: 'treeId', // 树形id字段名称
        treeUpId: 'treeUpid', // 树形父id字段名称
        treeShowName: 'treeName', // 以树形式显示的字段
        toolFun: toolFun,
        cols: [[
            {type: 'checkbox'},
            {field: 'treeName', width: '300', title: '节点名称'},
            {field: 'treeId', width: '200', title: '树ID'},
            {field: 'treeUpid', width: '200', title: '树上级ID'},
            {field: 'treeType', width: '200', title: '类型字段'},
            {field: 'treeDesc', width: '200', title: '描述字段'},
            {fixed: 'right', width: '120', align: 'center', toolbar: '#toolBar'}
        ]],
        page: false
    });

    form.on('submit(gridtree-search)', function (data) {
        layer.msg('节点名称：' +$('#treeName').val() +'， 可以根据key值到后台查询');
        treeTable.reload('treeTable', {
            where: {
                key: {
                    treeName: $('#treeName').val()
                }
            }
        });
        return false;
    });

});

function toolFun(data, event) {
    if (event === 'detail') {
        layer.msg('查看ID：' + data.treeId);
    } else if (event === 'del') {
        layer.confirm('确认删除：' + data.treeName + ' 吗？', function (index) {
            layer.msg(data.treeId);
            layer.close(index);
        });
    } else if (event === 'edit') {
        layer.msg(JSON.stringify(data))
    }
}