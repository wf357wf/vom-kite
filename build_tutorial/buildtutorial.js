$(document).ready(function () {
    $('#newProject').click(function () {
        layer.prompt({title: '请输入项目名称', formType: 3}, function (proName, index) {
            layer.close(index);
            var msg = layer.msg('正在后台打包，请稍后...', {time: 0});
            Ajax(buildZipUrl, 'buildZip?proName=' + proName, 'GET', true, null, function (data) {
                if (data.success) {
                    console.log(data);
                    window.location.href = "/kite-admin/download?fileName=" + data.result;
                } else {
                    layer.alert(data.msg);
                }
                layer.close(msg);
            }, function (errMsg) {
                layer.alert(errMsg);
                layer.close(msg);
            });
        });

    })
});
