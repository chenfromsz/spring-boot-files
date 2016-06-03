$(function(){
    $('#saveForm').validate({
        rules: {
            name       :{required:true},
            picture      :{required:true},
            price      :{required:true},
            brief :{required:true}
        },messages:{
            name :{required:"必填"},
            picture :{required:"必填"},
            price :{required:"必填"},
            brief :{required:"必填"}
        }
 	});

});

function saveEdit(){
    $("#contents").val(ME.getContent());
    if($('#saveForm').valid()){
        $.ajax({
            type: "POST",
            url: "../update",
            data: $("#saveForm").serialize(),
            headers: {"Content-type": "application/x-www-form-urlencoded;charset=UTF-8"},
            success: function (data) {
                if (data == 1) {
                    alert("编辑成功");
                    window.location.href = "../index";
                } else {
                    alert(data);
                }
            }
        });
    }else{
        alert('数据验证失败，请检查！');
    }
}
