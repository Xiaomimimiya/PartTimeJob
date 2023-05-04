// pages/express_send/index.js
Page({

    data: {
        userInfo: "",
    },
    onLoad() {

    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    publish(e) {
        let express = e.detail.value
        console.log();
        if (express.contact != "") {
            wx.navigateTo({ 
              url: '/pages/express_order_confirm/index?item='+JSON.stringify(express)+'&types=' + ('express')
            })
        } else {
            wx.showToast({
                icon: "error",
                title: '请填写完整',
            })
        }
    },
})