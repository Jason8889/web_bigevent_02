var baseURL = "http://ajax.frontend.itheima.net"
$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url
    // 对需要权限的接口配置头信息
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    params.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 删除本地的token
            localStorage.removeItem("token")
            // 跳转页面
            location.href = '/login.html'
        }
    }
})