// pages/company_join_home/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgList: [],
        fileIDs: [],

        index: 0,
        array: ["私营", "国营", "合资", "其他"],
    },



    publish(e) {
        wx.showModal({
            title: '提交确认',
            content: '提交后，后台将进行审核',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                    })
                }

                if (res.confirm) {
                    wx.hideLoading()
                    setTimeout(() => {
                        wx.showToast({
                            title: '正在审核中',
                        })
                    }, 1000);
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/company_join/index',
                        })
                    }, 2000);
                }
            }
        })
    },
})