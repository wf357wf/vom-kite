$(document).ready(function () {

    var element = layui.element;
    var table = layui.table;

    // 交易数据域表格
    table.render({
        elem: '#table_list_1',
        height: 'full-370',
        url: baseTableUrl + 'getList',
        cellMinWidth: 180,
        limit: 20,
        page: true,
        cols: [[{
            field: 'prdtNo',
            title: '产品编号',
            width: 140,
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
            fixed: 'right',
            width: 100,
            align: 'center',
            toolbar: '#toolBar1'
        }]]
    });

    table.on('tool(table_list_1)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            var expstr = '<span class="drag exp-badge exp-bg-gray" exp="variation" ' +
                'val="' + data.prdtNo + '"><p>' + data.prdtName + '【' + data.prdtNo + '】' + '</p>';
            $('.sortable-list').append(expstr + '<i class="close layui-icon">&#x1007;</i></span>');
            addevent();
        }
    });

    element.on('tab(tab-card)', function () {

        // 注意，一开始隐藏的列表面板，点开是必须重新render才能正常加载
        if (this.getAttribute('lay-id') === 'id2') {

            // 数据总线页表格
            table.render({
                elem: '#table_list_2',
                height: 'full-370',
                url: baseTableUrl + 'getList',
                cellMinWidth: 180,
                limit: 20,
                page: true,
                cols: [[{
                    field: 'prdtNo',
                    title: '总线ID',
                    width: 140,
                    unresize: true,
                    sort: true
                }, {
                    field: 'prdtName',
                    title: '总线名称',
                    edit: 'text'
                }, {
                    fixed: 'right',
                    width: 100,
                    align: 'center',
                    toolbar: '#toolBar2'
                }]]
            });

            table.on('tool(table_list_2)', function (obj) {
                var data = obj.data;
                if (obj.event === 'edit') {
                    var expstr = '<span class="drag exp-badge exp-bg-gray" exp="variation" ' +
                        'val="' + data.prdtNo + '"><p>' + data.prdtName + '【' + data.prdtNo + '】' + '</p>';
                    $('.sortable-list').append(expstr + '<i class="close layui-icon">&#x1007;</i></span>');
                    addevent();
                }
            });
        }
    });

    // 拖拽
    $(".sortable-list").sortable({connectWith: ".connectList"}).disableSelection();

    // 提交
    $('#exp-submit').click(function () {
        var expStr = "";
        $('.sortable-list').find('span').each(function (i, e) {
            if ($(e).attr('exp') === 'normal') {
                expStr += $(e).find('p').text();
            } else if ($(e).attr('exp') === 'variation') {
                expStr += '${' + $(e).attr('val') + '}';
            } else {
                expStr += $(e).attr('exp');
            }
        });
        if (expStr.indexOf("常量") !== -1) {
            layer.msg('存在未配置常量（双击可配置）');
        } else {
            var regex = '\\$\\{.*?\\}';
            var expCheck = expStr.replace(new RegExp(regex, 'g'), 1);
            try {
                eval(expCheck);
                // 写入父级全局变量，以便父级获值
                parent._expStr = expStr;
                parent._expHtml = $('.sortable-list').html();
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            } catch (error) {
                layer.msg('表达式配置错误');
            }
        }
    });

    // 重置
    $('#exp-reset').click(function () {
        layer.confirm('确认重置吗？', {
            btn: ['确认', '取消']
        }, function (index) {
            $('.sortable-list').html("");
            layer.close(index);
        });
    });

    // 表达式按钮
    $('.exp-btn').click(function () {

        var expstr = "";

        switch ($(this).attr('exp')) {
            case "+":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="+">+';
                break;
            case "-":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="-">-';
                break;
            case "*":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="*">*';
                break;
            case "/":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="/">/';
                break;
            case "(":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="(">(';
                break;
            case ")":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp=")">)';
                break;
            case "==":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="==">==';
                break;
            case "!=":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="!=">!=';
                break;
            case ">":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp=">">>';
                break;
            case ">=":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp=">=">>=';
                break;
            case "<":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="<"><';
                break;
            case "<=":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="<="><=';
                break;
            case "&&":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="&&">&&';
                break;
            case "||":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="||">||';
                break;
            case "%":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="%">%';
                break;
            case "normal":
                expstr = '<span class="drag exp-badge exp-bg-gray" exp="normal"><p>常量</p>';
                break;
        }
        $('.sortable-list').append(expstr + '<i class="close layui-icon">&#x1007;</i></span>');
        addevent();
    });

});

function addevent(init) {

    var last = ':last';

    if (init) {
        last = '';
    }

    $(".close" + last).click(function () {
        $(this).parent().remove();
    });

    $('.sortable-list > span' + last).hover(function () {
        $(this).find('i').show();
    }, function () {
        $(this).find('i').hide();
    });

    $('.sortable-list > span' + last).dblclick(function () {
        if ($(this).attr('exp') === 'normal') {
            var that = $(this);
            var normalVal = that.find('p').text();
            if (normalVal === '常量') {
                normalVal = '';
            }
            layer.prompt({
                title: '请输入常量值',
                formType: 0,
                value: normalVal
            }, function (val, index) {
                layer.close(index);
                that.find('p').text(val);
            });
        }
    });

}

function initExp(expHtml) {
    // 初始化
    $('.sortable-list').append(expHtml);
    addevent(true);
}