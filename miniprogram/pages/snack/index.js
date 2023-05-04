// pages/express/index.js
Page({


    data: {
        in_snack_list: "",
        out_snack_list: "",
        userInfo: "",
        active: 0
    },
    onShow() {
        let user = wx.getStorageSync("user")
        this.setData({
            userInfo: user
        })
        this.getInSnackData()
        this.getOutSnackData()

    },

    // 获取快递数据
    getInSnackData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('purchase')
            .orderBy("_createTime", "desc")
            .where({
                in_out_school: "校内",
                status: false
            })
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        in_snack_list: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getOutSnackData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('purchase')
            .orderBy("_createTime", "desc")
            .where({
                in_out_school: "校外",
                status: false
            })
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        out_snack_list: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goSnackOrder(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id
        console.log(id);
        wx.navigateTo({
            url: '/pages/snack_order/index?id=' + id,
        })
    },
    goSend() {
        if (!this.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: '/pages/snack_send/index',
            })
        }

    },
    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/snack_send/index') {
            wx.switchTab({
              url: '/pages/home/index',
            })
        }
    },

})