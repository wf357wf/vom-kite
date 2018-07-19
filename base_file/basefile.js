$(document).ready(function () {

    var upload = layui.upload;

    // 上传文件
    upload.render({
        elem: '#uploadFile'
        , url: '/kite-admin/upload'
        , accept: 'file' //普通文件
        , done: function (res) {
            console.log(res);
            layer.alert("原文件名：" + res.fileName + "<br/>文件ID：" + res.fileId, {title: '上传成功'});
        }
    });

});