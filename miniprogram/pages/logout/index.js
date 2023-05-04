// pages/logout/index.js
Page({


    data: {

    },
    logout() {
        wx.showModal({
            title: '请再次确认',
            content: '您是否确实要注销账号？',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                    })
                }

                if (res.confirm) {
                    wx.showToast({
                        icon: "success",
                        title: '注销成功',
                    })
                }
            }
        })
    }

})