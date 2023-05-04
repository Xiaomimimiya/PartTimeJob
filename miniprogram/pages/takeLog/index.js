// pages/sendlog/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        tackLog: "",
        active: 0,
    },


    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },


    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getTakeLog()

    },
    getTakeLog() {
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('Order_record')
        .orderBy("time","desc")
            .where({
                get_id: id
            })
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        tackLog: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    // 取消订单 
    cancleOrder(e) {
        let order_id = e.currentTarget.dataset.item.id
        let db = wx.cloud.database()
        console.log(order_id);
        wx.showModal({
            title: '订单取消',
            content: '确定取消接单？',
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
                    }).update({
                        data: {
                            status: false
                        },
                    }).then(res => {
                        db.collection('Order_record').where({
                            id: order_id
                        }).remove()

                    })
                }
            }
        })
        this.onShow()
    },
    // 点击完成订单
    CompleteOrder(e) {
        let that = this
        let order_id = e.currentTarget.dataset.item._id
        let price = e.currentTarget.dataset.item.price

        let db = wx.cloud.database()
        const _ = db.command
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
                        _id: order_id
                    }
                    let upcondition = {
                        is_finish: true,
                    }
                    db.collection('Order_record').where(condition).update({
                        data: upcondition,
                        success: function (res) {
                            db.collection("withdrawal").add({
                                data: {
                                    desc: "接单收入",
                                    time: new Date().getTime(),
                                    type: "getMoney",
                                    price: price,
                                    id: that.data.userInfo._id,
                                    name: that.data.userInfo.username,
                                }
                            })
                            db.collection("userMoney")
                                .where({
                                    id: that.data.userInfo._id,
                                }).get({
                                    success(res) {
                                        console.log("Res",res.data);
                                        if (res.data == "") {
                                            db.collection("userMoney")
                                               .add({
                                                    data: {
                                                        id: that.data.userInfo._id,
                                                        money: Number(price),
                                                        time: new Date().getTime(),
                                                        username: that.data.userInfo.username,
                                                    }
                                                })   
                                        } else {
                                            db.collection("userMoney")
                                                .where({
                                                    id: that.data.userInfo._id,
                                                }).update({
                                                    data: {
                                                        money: _.inc(Number(price))
                                                    }
                                                })
                                        }

                                    }
                                })
                            that.onShow()
                        },
                    })
                }
            }
        })
    }
})