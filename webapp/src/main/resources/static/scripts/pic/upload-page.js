$(document).ready(function(){
    pic.init();
    page.init();
    getDataHtml(1);
});
var page = {
    init:function(){
        var _this = this;
        $(".g-tabItem").unbind().click(function(){//相册点击
            var index = $(this).index();
            $(".upload-case").each(function(i,e){
                if(i == index) $(e).show();
                else $(e).hide();
            });
            if($(this).text() == "图库选择"){
                _this.photos.init();
            }else{
                clearTimeout(_this.photos.time);
            }
            $(this).addClass("g-currentTabItem").siblings().removeClass("g-currentTabItem");
        });
        if(pic.getParam("q")){
            $(".g-tabItem").eq(parseInt(pic.getParam("q"))).trigger("click").siblings().hide();
        }
        return this;
    },
    photos : {//相册选择
        init:function(){
            $(".upload-list").delegate(".upload-item","click",function(){
                $(this).addClass("upload-item-cur").siblings().removeClass("upload-item-cur");
            });
            this.setPosition();
            return this;
        },
        time : null,
        setPosition:function(){//相册显示
            var imgs = $(".upload-list img"),
                len = imgs.length,
                done = 0,
                speed = 50,
                _this = this;
            imgs.data("done",false);
            clearTimeout(_this.time);
            fresh();
            function fresh(){
                _this.time = setTimeout(function(){
                    fresh();
                },speed);
                imgs.each(function(i,e){
                    var h = $(e).height();
                    if(h == 0) return;
                    if(h == 116){
                        if(parseInt($(e).css("marginTop")) != 0)
                            $(e).css({marginTop:0});
                        if($(e).data("set") !== true)
                            $(e).css({visibility:"visible",opacity:0}).data("set",true).stop().animate({opacity:1},300);
                        return;
                    }
                    if(h<116 && parseInt($(e).css("marginTop")) != parseInt((116-h)/2)){
                        $(e).css("marginTop",parseInt((116-h)/2)).css({visibility:"visible",opacity:0}).data("set",true).stop().animate({opacity:1},300);
                    }
                });
                var done = true;
                imgs.each(function(i,e){
                    if($(e).data("set") == false)
                        done = false;
                });
                if(done == true){
                    speed = parseInt(speed * 1.2);
                }
            }
        }
    },
    upload:{//本地上传
        init : function(width,height){
            this.target = {};
            this.target.width = width;
            this.target.height = height;
            this.target.scale = width/height;
            return this;
        },
        finish : function(src,acWidth,acHeight){

            var operate = $("#operate"),
                isee = operate.find(".i_see"),
                max = 315,
                bg_top = operate.find(".bg_top"),
                bg_right = operate.find(".bg_right"),
                bg_bottom = operate.find(".bg_bottom"),
                bg_left = operate.find(".bg_left"),
                _this = this;

            operate.parent().find("span").hide();

            operate.find("img").attr("src",src);
            if(acWidth>=acHeight){
                var w = max,
                    h  = Math.round(acHeight * w / acWidth);
                operate.width(w).height(h).css({top:parseInt(max-h)/2,left:0}).find("img").fadeIn(300);
            }else{
                var h = max,
                    w  = Math.round(acWidth * h / acHeight);
                operate.width(w).height(h).css({top:0,left:parseInt(max-w)/2}).find("img").fadeIn(300);
            }

            var view = $("#view"),
                viewImg = view.find("img");
            if(_this.target.scale>=1){
                var viewCss = {
                    width : max + 2,
                    height : (max + 2) / _this.target.scale
                }
            }else{
                var viewCss = {
                    height : max + 2,
                    width : (max + 2) * _this.target.scale
                }
            }
            viewCss.top = (max + 2 - viewCss.height) / 2;
            viewCss.left = (max + 2 - viewCss.width) / 2;
            viewCss = round(viewCss)
            view.css(viewCss);
            viewImg.attr({src:src}).css({display:"block"});
            view.parent().show();
            $(".upload-box").hide();
            $(".file-type").show();
            $(".reupload").show();
            var isee_status = {
                top : parseInt(isee.css("top")),
                left : parseInt(isee.css("left")),
                width : parseInt(isee.css("width")),
                height : parseInt(isee.css("height")),
                scale : w/h
            }

            var client = {
                start_x : 0,
                start_y : 0,
                end_x : 0,
                end_y : 0,
                status : ""
            }

            isee[0].onmousedown = function(event){
                $(this).data("mousedown",true);//兼容IE7\6
                isee_status.minNum = 24;
                isee_status.top = parseInt(isee.css("top"));
                isee_status.left = parseInt(isee.css("left"));
                isee_status.width = parseInt(isee.css("width"));
                isee_status.height = parseInt(isee.css("height"));
                isee_status.min = Math.max(isee_status.minNum,isee_status.minNum / _this.target.scale);

                event = event || window.event;

                client.status = $(this).css("cursor");
                client.start_x = event.clientX;
                client.start_y = event.clientY;

                $("html").addClass(client.status=="move"?"m-resize":client.status);
                //阻止事件传播
                if(event.stopPropagation) event.stopPropagation();//标准
                if(event.cancelBubble !== undefined) event.cancelBubble = true;//IE

                //阻止默认操作
                if(event.preventDefault) event.preventDefault();//标准
                if(event.returnValue !== undefined) event.returnValue = false;//IE

                if(document.addEventListener){//标准
                    document.addEventListener("mousemove",move,true);
                    document.addEventListener("mouseup",up,true);
                }
                if(document.attachEvent){//IE
                    //在IE中，捕获事件通过调用元素上的setCapture()捕获它们
                    this.setCapture();
                    this.attachEvent("onmousemove",move);
                    this.attachEvent("onmouseup",up);
                    //作为mouseup，注销事件
                    this.attachEvent("onlosecapture",up);
                }
            }

            function up(e){
                $(isee).data("mousedown",false);//兼容IE7\6
                $("html").removeClass(client.status=="move"?"m-resize":client.status);
                if(!e) e = window.event;//IE

                if(document.removeEventListener){//标准
                    document.removeEventListener("mouseup",up,true);
                    document.removeEventListener("mousemove",move,true);
                }
                if(document.detachEvent){
                    isee[0].detachEvent("onlosecapture",up);
                    isee[0].detachEvent("onmouseup",up);
                    isee[0].detachEvent("onmousemove",move);
                    isee[0].releaseCapture();
                }
                //阻止事件传播
                if(e.stopPropagation) e.stopPropagation();//标准
                if(e.cancelBubble !== undefined) e.cancelBubble = true;//IE
            }

            function move(e){
                e = e || window.event;//IE
                client.end_x = e.clientX;
                client.end_y = e.clientY;

                //阻止事件传播
                if(e.stopPropagation) e.stopPropagation();//标准
                if(e.cancelBubble !== undefined) e.cancelBubble = true;//IE

                var s = [],
                    x = client.end_x-client.start_x,
                    y = client.end_y-client.start_y,
                    outerTop = isee_status.top + isee_status.height,
                    outerLeft = isee_status.left + isee_status.width;

                switch(client.status){
                    case "move":
                        s[0] = isee_status.width;
                        s[1] = isee_status.height;
                        s[2] = isee_status.top + y;
                        s[3] = isee_status.left + x;
                        s[2] = s[2] < 0 ? 0 :s[2];
                        s[3] = s[3] < 0 ? 0 : s[3];
                        s[2] = s[2] + s[1] > h ? h - s[1] : s[2];
                        s[3] = s[3] + s[0] > w ? w - s[0] : s[3];
                        break;
                    case "se-resize"://右下角
                        s[2] = isee_status.top;
                        s[3] = isee_status.left;
                        y = Math.max(x/_this.target.scale,y);
                        s[1] = isee_status.height + y;
                        var t = Math.min((w-isee_status.left)/_this.target.scale,h-s[2]);
                        s[1] = s[1]>t?t:s[1];//最大值
                        s[1] = s[1]<isee_status.min?isee_status.min:s[1];//最小值
                        s[0] = s[1]*_this.target.scale;
                        break;
                    case "nw-resize"://左上角
                        y = Math.min(x/_this.target.scale,y);
                        s[2] = isee_status.top + y;
                        var t = Math.max(outerTop - outerLeft / _this.target.scale,0);
                        s[2] = s[2]<t?t:s[2];//最大值
                        s[2] = outerTop-s[2]<isee_status.min?outerTop-isee_status.min:s[2]//最小值
                        s[1] = outerTop - s[2];
                        s[0] = s[1]*_this.target.scale;
                        s[3] = outerLeft - s[0];
                        break;
                    case "ne-resize"://右上角
                        s[3] = isee_status.left;
                        y = Math.min(-x/_this.target.scale,y);
                        s[2] = isee_status.top + y;
                        var t = Math.max(outerTop - (w-isee_status.left)/_this.target.scale,0);
                        s[2] = s[2]<t?t:s[2];//最大值
                        s[2] = outerTop-s[2]<isee_status.min?outerTop-isee_status.min:s[2]//最小值
                        s[1] = outerTop - s[2];
                        s[0] = s[1]*_this.target.scale;
                        break;
                    case "sw-resize"://右下角
                        s[2] = isee_status.top;
                        y = Math.max(-x/_this.target.scale,y);
                        s[1] = isee_status.height + y;
                        var t = Math.min(outerLeft/_this.target.scale,h-isee_status.top);
                        s[1] = s[1]>t?t:s[1];//最大值
                        s[1] = s[1]<isee_status.min?isee_status.min:s[1]//最小值
                        s[0] = s[1]*_this.target.scale;
                        s[3] = outerLeft - s[0];
                        break;
                    case "n-resize"://上
                        s[1] = isee_status.height - y;
                        var t = Math.min(Math.min(outerLeft+isee_status.left,(w-outerLeft)*2+isee_status.width)/_this.target.scale,outerTop);
                        s[1] = s[1]>t?t:s[1];//最大值
                        s[1] = s[1]<isee_status.min?isee_status.min:s[1]//最小值
                        s[0] = s[1]*_this.target.scale;
                        s[2] = outerTop - s[1];
                        s[3] = (outerLeft + isee_status.left - s[0])/2;
                        break;
                    case "s-resize"://下
                        s[2] = isee_status.top;
                        s[1] = isee_status.height + y;
                        var t = Math.min(Math.min(outerLeft+isee_status.left,(w-outerLeft)*2+isee_status.width)/_this.target.scale,h-isee_status.top);
                        s[1] = s[1]>t?t:s[1];//最大值
                        s[1] = s[1]<isee_status.min?isee_status.min:s[1]//最小值
                        s[0] = s[1]*_this.target.scale;
                        s[3] = (outerLeft + isee_status.left - s[0])/2;
                        break;
                    case "w-resize"://左

                        s[0] = isee_status.width - x;
                        var t = Math.min(Math.min((isee_status.height+isee_status.top*2)*_this.target.scale,(isee_status.height+(h-outerTop)*2)*_this.target.scale),outerLeft);
                        s[0] = s[0]>t?t:s[0];//最大值
                        var myMin = Math.max(isee_status.minNum,isee_status.minNum * _this.target.scale);
                        s[0] = s[0]<myMin?myMin:s[0]//最小值
                        s[1] = s[0]/_this.target.scale;
                        s[2] = isee_status.top - (s[1]-isee_status.height)/2;
                        s[3] = outerLeft - s[0];
                        break;
                    case "e-resize"://右
                        s[3] = isee_status.left;
                        s[0] = isee_status.width + x;
                        var t = Math.min(Math.min((isee_status.height+isee_status.top*2)*_this.target.scale,(isee_status.height+(h-outerTop)*2)*_this.target.scale),w-isee_status.left);
                        s[0] = s[0]>t?t:s[0];//最大值
                        var myMin = Math.max(isee_status.minNum,isee_status.minNum * _this.target.scale);
                        s[0] = s[0]<myMin?myMin:s[0]//最小值
                        s[1] = s[0]/_this.target.scale;
                        s[2] = isee_status.top - (s[1]-isee_status.height)/2;
                        break;
                }
                size.apply(this,round(s));
                iview.apply(this,s);
            }


            isee[0].onmousemove = function(event){
                var w = $(this).width(),
                    h = $(this).height();
                if(isee.data("mousedown") == true)//兼容IE7\6
                    return;
                event = event || window.event;
                var x = event.offsetX !== undefined ? event.offsetX : event.layerX;//兼容Firefox，另event.hasOwnProperty("offsetX")不兼容IE
                var y = event.offsetY !== undefined ? event.offsetY : event.layerY;
                if(x <= 8 && y <= 8){
                    $(this).css({cursor:"nw-resize"});
                }else if(x >= w-8 && y <= 8){
                    $(this).css({cursor:"ne-resize"});
                }else if(x >= w-8 && y >= h-8){
                    $(this).css({cursor:"se-resize"});
                }else if(x <= 8 && y >= h-8){
                    $(this).css({cursor:"sw-resize"});
                }else if(y <= 8){
                    $(this).css({cursor:"n-resize"});
                }else if(x >= w-8){
                    $(this).css({cursor:"e-resize"});
                }else if(y >= h-8){
                    $(this).css({cursor:"s-resize"});
                }else if(x <= 8){
                    $(this).css({cursor:"w-resize"});
                }else{
                    $(this).css({cursor:"move"});
                }
            };

            var firstSize = []
            if(this.target.scale<=isee_status.scale){//目标比上传图片窄
                firstSize[0] = h*this.target.scale;
                firstSize[1] = h;
                firstSize[2] = 0;
                firstSize[3] = (w - firstSize[0])/2;

            }else{//目标比上传图片宽
                firstSize[0] = w;
                firstSize[1] = w/this.target.scale;
                firstSize[2] = (h - firstSize[1])/2;
                firstSize[3] = 0;
            }
            size.apply(this,round(firstSize));
            iview.apply(this,firstSize);

            function round(ar){//把数组、对象每个元素Math.round，返回新的
                var o,type = Object.prototype.toString.call(ar);

                type = type.substring(8,type.length-1).toUpperCase();
                switch(type){
                    case 'ARRAY':
                        o = [];
                        for(var i= 0,len=ar.length;i<len;i++){
                            o.push(Math.round(ar[i]));
                        }
                        break;
                    case 'OBJECT':
                        o = {};
                        for(var i in ar){
                            if(!ar.hasOwnProperty(i)) continue;
                            o[i] = Math.round(ar[i]);
                        }
                        break;
                }
                return o;
            }

            function size(width,height,top,left){
                isee.css({width:width,height:height,top:top,left:left});
                bg_top.css({width:"100%",height:top,top:0,left:0});
                bg_right.css({width:w-left-width,height:height,top:top,left:left+width});
                bg_bottom.css({width:"100%",height:h-top-height,top:top+height,left:0});
                bg_left.css({width:left,height:height,top:top,left:0});
            }

            function iview(o_width,o_height,o_top,o_left){
                var css = {
                    width : viewCss.width  / ( o_width / w),
                    height : viewCss.height  / ( o_height / h)
                }
                css.top = -css.height * o_top / h;
                css.left = -css.width * o_left / w;
                viewImg.css(round(css));
                var p1 = [],p2 = [],p3 = [],p4 = [];
                p1.push(acWidth * o_left / w);
                p1.push(acHeight * o_top / h);

                p2.push(acWidth * (o_left+ o_width) / w);
                p2.push(acHeight * o_top / h);

                p3.push(acWidth * (o_left+ o_width) / w);
                p3.push(acHeight * (o_top+o_height) / h);

                p4.push(acWidth * o_left / w);
                p4.push(acHeight * (o_top+o_height) / h);

                $("#p1").val(round(p1).join(","));
                $("#p2").val(round(p2).join(","));
                $("#p3").val(round(p3).join(","));
                $("#p4").val(round(p4).join(","));
            }

        }
    }
}
//上传图片
function uploadPic_submit(ob){
    this.AllowExt=".jpg,.jpeg,.png";
    var fileObj = $(ob);
    var picPath = fileObj.val();
    this.FileExt= picPath.substr(picPath.lastIndexOf(".")).toLowerCase();
    if(this.AllowExt!=0&&this.AllowExt.indexOf(this.FileExt)==-1)//判断文件类型是否允许上传
    {
        showMsg("上传文件类型错误,请选择.jpg,.jpeg,.png的图片");
        return;
    }
    ajaxFileUpload(fileObj.attr("id"));
}

//上传图片
function ajaxFileUpload(id){
    var url = '/pic/uploadPic';
    $.ajaxFileUpload({
        url : url,// 需要链接到服务器地址
        fileElementId : id,// 文件选择框的id属性
        dataType : 'json',// 服务器返回的格式，可以是json
        success : function(data) {
            if(data.errorMsg){
                showMsg(data.errorMsg, "错误");
            }else{
                page.upload.finish(data.pathInfo,data.width,data.height);
            }
        }
    });
}
//打开文件对话框
function chooseFile() {
    $("#pictureFile").trigger("click");
}
//确定选择
function sureChoose(callback) {
    var isUpPic = $("#uppic").hasClass("g-currentTabItem");
    var isChoosePic = $("#choosepic").hasClass("g-currentTabItem");
    if(isUpPic){
        var fileUrl = $("#view > img").attr("src"), left_up = $("#p1").val(), left_bottom = $("#p4").val(), right_up = $("#p2").val(), right_bottom = $("#p3").val();
        if(!fileUrl ||  fileUrl.length == 0 ){
            showMsg("请上传图片");
            callback();
            return;
        }

        var cutUrl = "/pic/cutPic";
        var cutParams = {"fileUrl":fileUrl, "left_up":left_up, "right_bottom":right_bottom};
        $.post(cutUrl, cutParams, function(data) {
                if(data.errorMsg){
                    showMsg(data.errorMsg, "错误");
                    callback();//回调空数据,激活确定按钮
                }else{
                    callback(data);
                }
            }
        , "json");
    } else if(isChoosePic) {
        var curItem = $("#upload-list>div.upload-item-cur");
        if(curItem.length == 0){
            showMsg("请选择图片");
            callback();
            return;
        }
        var pic_url = curItem.find("img").attr("src");
        callback({"pathInfo":pic_url});
    }
}
//删除图片
function delChoose(callback) {
    var isChoosePic = $("#choosepic").hasClass("g-currentTabItem");
    if(isChoosePic) {
        var curItem = $("#upload-list>div.upload-item-cur");
        if(curItem.length == 0){
            showMsg("请选择图片");
            callback();
            return;
        }
        var pic_url = curItem.find("img").attr("src");
        callback({"pathInfo":pic_url});
    }
}
//分页数据
function getDataHtml(pageNo,pagesize) {
    $.ajax({
        url: "/pic/listPic",
        dataType: "json",
        type: "POST",
        cache: false,
        data: {page: pageNo-1,size: pagesize || 8},
        success: function (data) {
            var $list = $('#upload-list').empty();
            $.each(data.content, function (i, v) {
                var html = "";
                html += '<div class="upload-item">'+
                    '<div class="img"><img src="'+ v.pathInfo + v.fileName + '"/></div>'+
                    '<p>'+v.width+'x'+ v.height+'</p>'+
                    '<div class="selected"></div>'+
                    '</div>';

                $list.append($(html));
            })
            page.photos.setPosition();
            document.getElementById('pagebar').innerHTML = PageBarNumList.getPageBar(data.number+1, data.totalPages, 3, 'getDataHtml',pagesize || 8,true);
        },
        error: function (e) {}
    });
}

