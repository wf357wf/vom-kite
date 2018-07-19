$(document).ready(function () {

    $('#openNewTab').click(function () {

        pageLink('打开测试页面', './build_test/buildtest.html');

        // 传参，在目标页面调用getUrlParameter('aaa'), getUrlParameter('bbb') 即可获得对应参数
        // pageLink('打开测试页面', './build_test/buildtest.html?aaa=1&bbb=2');
    });

    $('#closeActiveTab').click(function () {
        closeActiveTab();
    });

});