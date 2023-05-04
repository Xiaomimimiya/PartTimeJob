// pages/getMoney/index.js
Page({


    data: {
        money: "",
        userInfo: "",
        currtent_user_money: "",
        withlog:""
    },

    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getCurrent()
        this.getwithlog()
    },
    // 获取目前的金额
    getCurrent() {
        let db = wx.cloud.database()
        db.collection('userMoney').
        where({
                id: this.data.userInfo._id
            })
            .get()
            .then(res => {
                console.log("money",res);
                let userMoney = res.data[0].money
                this.setData({
                    currtent_user_money: userMoney
                })
            })
    },
    getwithlog(){
        let db = wx.cloud.database()
        db.collection('withdrawal').
        where({
                id: this.data.userInfo._id
            })
            .orderBy("time","desc")
            .get()
            .then(res => {
                console.log(res.data);
                this.setData({
                    withlog:res.data
                })
            })
    },
    // 用户输入
    bindKeyInput: function (e) {
        let that = this
        that.setData({
            money: e.detail.value
        })
    },
    // 提现操作
    getMoney() {
        let price = this.data.money
        let db = wx.cloud.database()
        const _ = db.command
        if (price.length == 0) {
            wx.showToast({
                icon: "error",
                title: '您没有输入金额',
            })
        } else {
            wx.showModal({
                title: '提现',
                content: `您是否要提现${price}元？`,
                complete: (res) => {
                    if (res.cancel) {
                        wx.showToast({
                            icon: "error",
                            title: "你点击了取消",
                        })
                    }
                    if (res.confirm) {
                        db.collection('userMoney').
                        where({
                                id: this.data.userInfo._id
                            })
                            .get()
                            .then(res => {
                                console.log("update", res);
                                let userMoney = res.data[0].money
                                console.log(userMoney);
                                if (userMoney >= price) {
                                    db.collection('userMoney').
                                    where({
                                        id: this.data.userInfo._id
                                    }).update({
                                        data: {
                                            money: _.inc(-price)
                                        }
                                    }).then(() => {

                                        // 记录提现流水
                                        db.collection('withdrawal').add({
                                            data: {
                                                id: this.data.userInfo._id,
                                                name: this.data.userInfo.username,
                                                price: price,
                                                desc: "提现支出",
                                                time: new Date().getTime(),
                                                type: 'withdraw',
                                            }
                                        })
                                        wx.showToast({
                                            title: '提现成功',
                                        })
                                        this.onShow()
                                    })
                                } else {
                                    wx.showToast({
                                        icon: "error",
                                        title: '余额不足',
                                    })
                                }
                            })


                    }
                }
            })
        }

    }
})