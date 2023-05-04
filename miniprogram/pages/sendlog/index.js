// pages/sendlog/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        sendExpressLog: "",
        sendSnackLog: "",
        rushClassLog: "",
        tackawayLog:"",
        active: 0,
    },

    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    onShow() {
        this.getSendExpressLog()
        this.getSendSnackLog()
        this.getRushClassLog()
    },
    getSendExpressLog() {
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('express')
            .where({
                send_id: id
            })
            .get({
                success(res) {

                    that.setData({
                        sendExpressLog: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })


    },
    getSendSnackLog() {
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('purchase')
            .where({
                send_id: id
            })
            .get({
                success(res) {

                    that.setData({
                        sendSnackLog: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getRushClassLog() {
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('rush_class')
            .where({
                send_id: id
            })
            .get({
                success(res) {

                    that.setData({
                        rushClassLog: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getTackLog() {
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('tackaway')
            .where({
                send_id: id
            })
            .get({
                success(res) {

                    that.setData({
                        tackawayLog: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    // 点击删除订单
    cancleOrder(e) {
        let order_id = e.currentTarget.dataset.item._id
        console.log(order_id);
        let db = wx.cloud.database()
        wx.showModal({
            title: '订单删除',
            content: '确定删除此订单？',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                        duration: 2000
                    })
                }

                if (res.confirm) {
                    db.collection('express').where({
                        _id: order_id
                    }).remove()
                    this.onShow()
                }
            }
        })
    },
    // 点击完成订单
    CompleteOrder(e) {
        let order_id = e.currentTarget.dataset.item._id
        console.log(order_id);
        let db = wx.cloud.database()
        wx.showModal({
            title: '完成订单',
            content: '确定此订单完成？',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                        duration: 2000
                    })
                }

                if (res.confirm) {

                    let condition = {
                        // 是已经接单 别接单才能进行完成操作 
                        status: true,
                        // 唯一id
                        _id: order_id
                    }
                    let upcondition={
                        is_finish: true
                    }
                    db.collection('express').where(condition).update({
                        data: upcondition,
                        success:function(){
                            wx.navigateTo({
                              url: '/pages/sendlog/index',
                            })
                        },
                       
                    })

                }
            }
        })
    }
})