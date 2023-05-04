// pages/confirmOrder/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        details: "",
        price: "",
        types: "",
        userInfo: "",
    },

    onLoad(options) {
        let item = JSON.parse(options.item)
       
        this.setData({
            details: item,
            price: Number(item.price) * 100,
            types: options.types
        })
    },

    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    onSubmit() {
        let that = this
        let tackaway = that.data.details 
        let db = wx.cloud.database()
        db.collection('tackaway').add({
            data: {
                _createTime: new Date().getTime(),
                send_id: that.data.userInfo._id,
                send_name: that.data.userInfo.username,
                send_avatar: that.data.userInfo.user_avatar,
                start_address: tackaway.start,
                end_address: tackaway.end,
                endtime: tackaway.time,
                desc: tackaway.desc,
                price: tackaway.price,
                chat: tackaway.contact,
                email: that.data.userInfo.email,
                status: false,
                is_finish: false,
                type: 4

            },
            success: res => {
                wx.hideLoading()
                setTimeout(() => {
                    wx.showToast({
                        title: '发布成功',
                        complete(){
                            wx.redirectTo({
                                url: '/pages/tackaway/index',
                            })
                        }
                    })
                }, 1000);

             
            },
            fail: err => {
                wx.hideLoading()
                wx.showToast({
                    icon: 'none',
                    title: '网络不给力....'
                })
                console.error('发布失败', err)
            }
        })
    }
})