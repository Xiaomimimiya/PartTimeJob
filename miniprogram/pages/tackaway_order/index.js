Page({

    data: {
        take_id: "",
        take_detail: "",
        userInfo: ""
    },
    onLoad(options) {
        this.setData({
            take_id: options.id
        })
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getClassDetail()
    },
    // 获取数据
    getClassDetail() {
        let that = this
        let db = wx.cloud.database()
        db.collection('tackaway')
            .doc(that.data.take_id)
            .get({
                success(res) {
                    that.setData({
                        take_detail: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    // 购买操作
    goOrder() {
        let that = this
        let name = that.data.take_detail.send_name
        let send_id = that.data.take_detail.send_id
        let order_id = that.data.take_detail._id
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '暂未登录',
            })
        } else if (that.data.userInfo._id == send_id) {
            wx.showToast({
                icon: "error",
                title: '您自己的订单',
            })
        } else {
            wx.showModal({
                title: '下单确认',
                content: `您是否要进行接${name}的代取快递单？`,
                success(res) {
                    if (res.confirm) {
                        let tack_order = that.data.take_detail;
                        // 下单成功，添加到数据库中
                        let db = wx.cloud.database()
                        db.collection('Order_record')
                            .add({
                                data: {
                                    order_name: tack_order.desc,
                                    send_user: tack_order.send_name,
                                    price: tack_order.price,
                                    get_send: that.data.userInfo.username,
                                    send_id: tack_order.send_id,
                                    get_id: that.data.userInfo._id,
                                    type:tack_order.type,
                                    id:order_id,
                                    is_finish:false,
                                    time: new Date().getTime()
                                }
                            }).then(res => {
                                console.log("下单成功", res)
                                let tack_only_id = that.data.take_id
                                db.collection('tackaway').doc(tack_only_id).update({
                                    data: {
                                        status: true
                                    }
                                })
                                wx.showToast({
                                    title: '下单成功',
                                })
                                wx.navigateTo({
                                    url: '/pages/tackaway/index',
                                })
                            }).catch(res => {
                                console.log("下单", res)
                                wx.showToast({
                                    icon: "none",
                                    title: '下单失败',
                                })
                            })
                    } else if (res.cancel) {
                        wx.showToast({
                            icon: "error",
                            title: '您点击了取消',
                        })
                    }
                }
            })
        }
    },
    startChat(e) {
        console.log(e);
        let friend_info = e.currentTarget.dataset.item
        let that = this
        let db = wx.cloud.database()
        // 无法与自己联系
        if (friend_info.send_id == that.data.userInfo._id) {
            wx.showToast({
                icon: "error",
                title: '无法与自己联系',
            })
            return
        }
        // 判断是否有聊天记录
        const DB = wx.cloud.database().command;
        db.collection("chat_list")
            .where(
                DB.or([{
                        user_id: that.data.userInfo._id,
                        friend_id: friend_info.send_id
                    },
                    {
                        user_id: friend_info.send_id,
                        friend_id: that.data.userInfo._id
                    }
                ])
            )
            .get({
                success(res) {
                    console.log(res);
                    if (res.data.length > 0) {
                        let id = res.data[0]._id
                        wx.navigateTo({
                            url: '/pages/chat_detail/index?id=' + id
                        })
                    } else {
                        console.log("执行操作2");
                        db.collection('chat_list').add({
                            data: {
                                user_name: that.data.userInfo.username,
                                user_id: that.data.userInfo._id,
                                user_avatar: that.data.userInfo.user_avatar,

                                friend_id: friend_info.send_id,
                                friend_avatar: friend_info.send_avatar,
                                friend_name: friend_info.send_name,
                                chat_record: [{
                                    id: that.data.userInfo._id,
                                    text: "您好",
                                    time: new Date().getTime()
                                }],
                                time: new Date().getTime()
                            }
                        }).then(res => {
                            db.collection('chat_list')
                                .where(
                                    DB.or([{
                                        user_id: that.data.userInfo._id,
                                        friend_id: friend_info.send_id
                                        },
                                        {
                                            user_id: friend_info.send_id,
                                            friend_id: that.data.userInfo._id
                                        }
                                    ])
                                )
                                .get({
                                    success(res) {
                                        let id = res.data[0]._id
                                        wx.navigateTo({
                                            url: '/pages/chat_detail/index?id=' + id
                                        })
                                    }
                                })

                        })

                    }
                }
            })
    }
})