$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度在1~6之间"
            }
        }
    });
    initUserInfo()
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //   成功后 渲染
                form.val("formUserInfo", res.data)
            },
        })
    }

    // 表单重置
    $("#btnReset").on("click", function (e) {
        // 阻止默认事件
        e.preventDefault();
        // 从新用户渲染
        initUserInfo()
    })


    // 修改用户信息
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你，修改用户成功！")
                // 调用夫框架的全局方法
                window.parent.getUserInfo()
            }
        })

    })
})