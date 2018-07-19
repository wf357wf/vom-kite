$(document).ready(function () {

    // 初始化向导页
    initStep(function (index) {

        // index为页号，可根据实际情况对每页内容进行验证，若不需要验证，直接放回true即可。验证失败要返回false

        // false时点击下一步不会触发跳页
        var validateFlag = false;

        if (index === 1) {
            // 验证内容
            layer.msg('验证通过，跳转到下一页');
            validateFlag = true;
        }

        if (index === 2) {
            // 验证内容
            // layer.msg('验证失败，停留在本页');
            validateFlag = true;
        }

        return validateFlag;
    });

    $('.NN-back').click(function () {
        layer.msg('需要返回时使用，如果是单纯的向导，可以删除此按钮');
    });

    $('.MN-submit').click(function () {
        layer.msg('点击提交时验证的内容，即向导页最后一页的验证。提交操作也在此');
    });

    // ----------- 只是展示用 ---------
    // 第一页table
    var table = layui.table;
    table.render({
        elem: '#table_list',
        height: 'full-260',
        url: baseTableUrl + 'getList',
        // cellMinWidth: 80,
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
    // table结束

    // 弹出查看
    $('#open').click(function () {
        layer.open({
            title: "弹出查看效果",
            shadeClose: false,
            type: 2,
            area: ['90%', '90%'],
            content: "wizard_page.html"
        });
    })
    // 结束
    // ---------- 展示代码结束 --------------

});