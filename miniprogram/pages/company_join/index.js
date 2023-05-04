// pages/company_join/index.js

Page({


    data: {

    },
    goDetail(e) {
        let page = e.currentTarget.dataset.item
        let urls = "/pages/" + page + "/index"
        wx.navigateTo({
            url: urls,
        })
    },
    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 1]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/company_join/index') {
            // 如果是从其他页面跳转而来，则调用 onTapButton 方法
            wx.switchTab({
              url: '/pages/home/index',
            })
        }
    },

})