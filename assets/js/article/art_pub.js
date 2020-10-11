$(function () {
    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器
    initEditor()
    initCate()
    // 初始化分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })

    // 设置图片
    $("#coverFile").on("change", function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg("请上传图片")
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = "已发布"
    $("#btnSave2").on("click", function () {
        art_state = "草稿";
    })
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()
        // 创建FormData对象，收集数据
        var fd = new FormData(this);

        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                fd.append("cover_img", blob)
                console.log(...fd);
                console.log(fd.cover_img);
                publishArticle(fd)
            })
      
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer, msg(res.message)
                }
                layer.msg("跳转成功")
                setInterval(function () {
                    window.parent.document.querySelector("#art_list").click()
                }, 1500)
            }
        })
    }
})