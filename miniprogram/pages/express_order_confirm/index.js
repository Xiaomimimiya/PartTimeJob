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

    /**
     * 生命周期函数--监听页面加载
     */
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
        let express = that.data.details 
        let db = wx.cloud.database()
        db.collection('express').add({
            data: {
                _createTime: new Date().getTime(),
                send_id: that.data.userInfo._id,
                send_name: that.data.userInfo.username,
                send_avatar: that.data.userInfo.user_avatar,

                start_address: express.start_address,
                end_address: express.end_address,
                endtime: express.time,

                desc: express.desc,
                price: express.price,

                chat: express.contact,
                email: that.data.userInfo.email,

                status: false,
                is_finish: false,
                type: 1

            },
            success: res => {
                wx.hideLoading()
                setTimeout(() => {
                    wx.showToast({
                        title: '发布成功',
                        complete(){
                            wx.redirectTo({
                                url: '/pages/express/index',
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