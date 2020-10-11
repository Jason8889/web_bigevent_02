$(function () {
    template.defaults.imports.dataFormat = function (daStr) {
        var dt = new Date(daStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())


        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }



    var layer = layui.layer
    var form = layui.form
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 渲染文章列表同时渲染分页
                renderPage(res.total)
            }
        })
    }

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

    // 筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        // 获取
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })
    var laypage = layui.laypage
    // 分页


    function renderPage(totol) {
        laypage.render({
            elem: "pageBox",
            count: totol,
            limit: q.pagesize,
            curr: q.pagenum,

            // 分页模块设置  显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            jump: function (obj, first) {
                // obj: 所有参数所在的对象
                // first： 是否是第一次初始化页面
                q.pagenum = obj.curr
                // q.paresize = obj.limit
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除
    $("tbody").on("click", ".btn-delete", function () {
        var Id = $(this).attr("data-id")
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initTable()
                    layer.msg("恭喜成功了")
                    // if ($(".btn-detele").length == 1 && q.pagenum > 1) q.pagenum--;
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable()
                }
            })

            layer.close(index);
        });
    })

    // function renderPage(total) {
    //     // 调用 laypage.render() 方法来渲染分页的结构
    //     laypage.render({
    //         elem: 'pageBox', // 分页容器的 Id
    //         count: total, // 总数据条数
    //         limit: q.pagesize, // 每页显示几条数据
    //         curr: q.pagenum, // 设置默认被选中的分页
    //         // 分页发生切换的时候，触发 jump 回调
    //         jump: function (obj) {
    //             console.log(obj.curr)
    //             // 把最新的页码值，赋值到 q 这个查询参数对象中
    //             q.pagenum = obj.curr
    //         }
    //     })
    // }

})