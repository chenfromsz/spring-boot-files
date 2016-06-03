$(function () {
    $("#uploadBigpic").on('click',picUp);
});

function picUp() {
    var picWidth = 720, picHeight = 400, callback = setImgUrl;
    var isSubmit = false;//防止重复剪切图片
    rt = pic.dialog.show({
        src: "/pic/upload",
        name: "_uploadPic_iframe",
        title: "上传图片",
        width: 750,
        height: 550,
        titleLineType: 'g-topbg',
        btn: {
            yes: "确定",
            del: "删除",
            no: "取消",
            no_style: 'white',
            del_style: 'orange',
            yes_before_close: function (win) {
                if (!isSubmit) {
                    isSubmit = true;
                    win.sureChoose(function (data) {
                        if (data) {
                            callback(data);
                            rt.hide();
                        } else {
                            isSubmit = false;
                        }
                    });
                }
                return false;//剪切返回前不关闭
            },
            del_before_close: function (win) {
                win.delChoose(function (data) {
                    if (data) {
                        delImaConfirm(data);
                    }
                });
            }
        },
        load: function (win) {
            win.page.upload.init(picWidth, picHeight);
        }
    });
}

/**
 * 选择图片后渲染img
 * @param btn
 */
function setImgUrl(obj) {
    var pathinfo = obj.pathInfo;
    if (pathinfo) {
        $("#picture").val(pathinfo);
        $("#coverpic").attr("src", pathinfo);
    }
}

function delImaConfirm(obj){
    var pathinfo = obj.pathInfo;
    if (pathinfo) {
        if (confirm('您确定删除所选图片吗？')) {
            $.ajax({
                type: "POST",
                url: "/pic/deletePic",
                data: {filename: pathinfo},
                headers: {"Content-type": "application/x-www-form-urlencoded;charset=UTF-8"},
                success: function (data) {
                    if (data == 1) {
                        alert("图片已删除");
                    } else {
                        alert(data);
                    }
                },
                error:function(data){
                    $.each(data,function(v){
                        alert(v);
                    });
                }
            });
        }
    }
}
