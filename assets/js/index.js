$(function () {
    getUserInfo();

    // 退出登录功能
    var layer = layui.layer
    $("#btnLogout").on("click", function () {
        // 框架提供的询问框
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 删除本地的token
            localStorage.removeItem("token")
            // 跳转页面
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });
    })
})
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败")
            }
            renderAvatar(res.data)
        },
        // 登录拦截
        // 无论成功还是失败都会触发complete
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 删除本地的token
        //         localStorage.removeItem("token")
        //         // 跳转页面
        //         location.href = '/login.html'
        //     }
        // }

    })
}
function renderAvatar(user) {
    // 用户名 （昵称优先，没有用username）
    var name = user.nickname || user.username;
    // 2. 设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 安需要渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $(".layui-nav-img").show().attr("src", user.user_pic)
        $('.user-avatar').hide()

    }
    // 渲染文本头像
    else {
        $(".layui-nav-img").hide();
        var text = name[0].toUpperCase()
        $(".user-avatar").show().html(text)
    }
}
