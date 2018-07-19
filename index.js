// 动态加载菜单, 不能放到ready里面

$('#top1').tfload('./base_menutmp/top.html');
$('#kite-navTabs').tfload('./base_menutmp/left.html');

/*
Ajax(sessionUrl, 'getUserMenus', 'GET', false, null, function (data) {
    if (data.success) {
        $('#top1').append(data.vo);
        $('#kite-navTabs').append(data.vo1);
    } else {
        alert("初始化系统菜单失败");
    }
});
*/

// 禁用页签缓存
// sessionStorage.setItem('kite.base.contentTabs', '')

$(document).ready(function () {

    // 个性化配置页
    $('#settingMenu').click(function (e) {
        e.stopPropagation();
    });

    layui.use(['form', 'element'], function () {

        // setTimeout(function () {
        //     layer.tips('点击查看页面代码', '#viewSource', {
        //         tips: [1, '#263238']
        //     });
        // }, 1500);

        var form = layui.form;

        // 动态选择
        if (localStorage.getItem('theme_style') && localStorage.getItem('theme_style') === '0') {
            $('#theme_style').val(0);
        } else {
            $('#theme_style').val(1);
        }

        if (localStorage.getItem('nav_tab') && localStorage.getItem('nav_tab') === '0') {
            $("input[name=nav_tab][value='0']").attr("checked", true);
        } else {
            $("input[name=nav_tab][value='1']").attr("checked", true);
        }

        if (localStorage.getItem('nav_color')) {
            $("input[name=nav_color][value='" + localStorage.getItem('nav_color') + "']").attr("checked", true);
        } else {
            $("input[name=nav_color][value='bg-primary-600']").attr("checked", true);
        }

        if (localStorage.getItem('nav_inverse')) {
            $("input[name=nav_inverse][value='" + localStorage.getItem('nav_inverse') + "']").attr("checked", true);
        } else {
            $("input[name=nav_inverse][value='0']").attr("checked", true);
        }

        if (localStorage.getItem('menu_status')) {
            $("input[name=menu_status][value='" + localStorage.getItem('menu_status') + "']").attr("checked", true);
        } else {
            $("input[name=menu_status][value='1']").attr("checked", true);
        }

        form.render();

        // 菜单主题
        form.on('select(theme_style)', function (data) {
            localStorage.setItem('theme_style', data.value);
            if (data.value === '0')
                _userStyle.sidebarImprove('site-menubar-light');
            else if (data.value === '1')
                _userStyle.sidebarImprove('site-menubar-dark');
        });

        // 导航标签是否开启
        form.on('radio(nav_tab)', function (data) {
            localStorage.setItem('nav_tab', data.value);
            if (data.value === '1') { // 开启
                $('#kite-siteConTabs ul.con-tabs').removeAttr('style');
                $('body').addClass('site-contabs-open');
            } else if (data.value === "0") { // 关闭
                $('body').removeClass('site-contabs-open');
            }
        });

        // 顶部导航条颜色
        form.on('radio(nav_color)', function (data) {
            localStorage.setItem('nav_color', data.value);
            _userStyle.navbarImprove(data.value, false);
        });

        // 通体显示
        form.on('radio(nav_inverse)', function (data) {
            localStorage.setItem('nav_inverse', data.value);
            _userStyle.navbarImprove('navbar-inverse', data.value === '0');
        });

        // 菜单是否收起
        form.on('radio(menu_status)', function (data) {
            localStorage.setItem('menu_status', data.value);
            var setting = $('#menuFoldSetting');
            if (data.value === '1') {
                $('body').removeClass('site-menubar-fold site-menubar-keep site-menubar-fold-alt')
                    .addClass('site-menubar-unfold');
                setting.addClass('hidden');
                $.site.menubar.unfold();
            } else if (data.value === '0') {
                $('body').addClass('site-menubar-fold site-menubar-keep').removeClass('site-menubar-unfold');
                setting.removeClass('hidden');
                $.site.menubar.fold();
            }
        });

        // 下拉选择搜索
        form.on('select(search-comp)', function (data) {
            if(isEmpty(data.value)) {
                return false;
            }
            var selectVal = data.value.split('|');
            if(isContains(selectVal[0], "http://")) {
                window.open(selectVal[0]);
            } else {
                pageLink(selectVal[1], selectVal[0]);
            }
        });

        // 提示查看代码位置
        if(isEmpty(localStorage.getItem('iRealyKnow'))) {
            layer.msg('点击右下角可以查看代码', {
                time: 0
                , btn: ['知道了', '好的', '确定']
            });
            localStorage.setItem('iRealyKnow', 'yes');
        }
    });
});


/**
 * 打开当前页面代码预览
 */
function openSourceCode() {
    var url = top.window.$('ul.con-tabs>li.active')[0].innerHTML.trim();
    url = url.substring(0, url.indexOf("target")).trim();
    url = url.substring(url.lastIndexOf("/")).trim();
    url = url.substring(1, url.length - 1);

    var noCodeUrl = 'welcome|buildserver|buildtutorial|icon|buildupdate|basefooter|d3|kiteuser|kiterole|kitepagedef|kitebankinfo';
    if(isContains(noCodeUrl, url.split('.')[0])) {
        layer.msg('当前页面暂无代码可以查看');
        return;
    }

    layer.open({
        area: ['1100px', '600px'],
        type: 2,
        shadeClose: true,
        title: '查看代码',
        content: '/kite-admin/Codes/' + url
    });
}