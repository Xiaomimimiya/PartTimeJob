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
        let tackaway = e.detail.value
        if (tackaway.contact != "") {
            wx.navigateTo({ 
              url: '/pages/tackaway_order_confirm/index?item='+JSON.stringify(tackaway)+'&types=' + ('tackaway')
            })
        } else {
            wx.showToast({
                icon: "error",
                title: '请填写完整',
            })
        }
        // let db = wx.cloud.database()
        // db.collection('tackaway').add({
        //     data: {
        //         _createTime: new Date().getTime(),

        //         send_name: that.data.userInfo.username,
        //         send_id: that.data.userInfo._id,
        //         email: that.data.userInfo.email,
        //         send_avatar: that.data.userInfo.user_avatar,
        //         start_address: tackaway.start,
        //         end_address: tackaway.end,
        //         endtime: tackaway.time,

        //         price: tackaway.price,
        //         chat: tackaway.contact,

        //         desc: tackaway.desc,
        //         is_finish: false,
        //         status: false,
        //         type: 

        //     },
        //     success: res => {
        //         wx.hideLoading()
        //         setTimeout(() => {
        //             wx.showToast({
        //                 title: '发布成功',
        //             })
        //         }, 1000);
        //         setTimeout(() => {
        //             wx.navigateTo({
        //                 url: '/pages/tackaway/index',
        //             })
        //         }, 2000);

        //     },
        //     fail: err => {
        //         wx.hideLoading()
        //         wx.showToast({
        //             icon: 'none',
        //             title: '网络不给力....'
        //         })
        //         console.error('发布失败', err)
        //     }
        // })

    },
   
})