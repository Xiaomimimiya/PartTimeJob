const app = getApp();
var count = 0 
Page({
    // 页面的初始数据
    data: {
        isShowUserName: false,
        userInfo: "",
    },
    onShow() {
        let that = this
        let user = wx.getStorageSync('user')
        if (user) {
            that.setData({
                isShowUserName: true,
                userInfo: user,
            })
        } 

    },
    
    getUserProfile() {
        wx.navigateTo({
            url: '/pages/login/index',
        })
    },
    // =======================点击事件处理=================
    //用户点击退出登录
    tuichu() {
        wx.setStorageSync('user', null)
        let user = wx.getStorageSync('user')
        app.globalData.userInfo = null
        if (user && user.username) {
            this.setData({
                isShowUserName: true,
                userInfo: user
            })
        } else {
            this.setData({
                isShowUserName: false
            })
        }
    },

    clearStorage() {
        wx.clearStorage({
            success: (res) => {
                console.log(res)
                wx.showToast({
                    icon: "none",
                    title: '清理成功',
                })
            },
        })
    },
    // 
})