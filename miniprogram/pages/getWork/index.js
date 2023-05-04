// pages/express_send/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        Sexarray: ["男", "女"],
        index: 0,
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    publish(e) {
        let job = e.detail.value
        wx.navigateTo({
          url: '/pages/getWorkConfirm/index?job='+JSON.stringify(job),
        })
    },
    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 1]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/getWork/index') {
            wx.switchTab({
              url: '/pages/home/index',
            })
        }
    },
  
})