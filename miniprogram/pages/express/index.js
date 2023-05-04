// pages/express/index.js
Page({


    data: {
        express_list: "",
        userInfo:"",
        searchKey: '', //搜索词
        SearchList: ""
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getExpressData()

    },

    // 获取快递数据
    getExpressData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('express')
        .where({
            status:false
        })
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    that.setData({
                        express_list: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goExpressOrder(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/express_order/index?id=' + id,
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
                url: '/pages/express_send/index',
            })
        }
    },
    // 搜索功能实现
    getSearchKey(e) {
        this.setData({
            searchKey: e.detail.value //搜索词
        })
    },
    goSearch() {
        this.getWaiterList('search', this.data.searchKey)
    },
    //获取数据
    getWaiterList(action, searchKey) {
        wx.cloud.callFunction({
            name: "getExpressDetail",
            data: {
                action: action,
                searchKey: searchKey
            }
        }).then(res => {
            let dataList = res.result.data;
            console.log("结果数据", res)
            this.setData({
                SearchList: dataList,
            })
        }).catch(res => {
            console.log("请求失败", res)
        })
    },
    CancleSearch() {
        this.setData({
            searchKey: '', //搜索词
            SearchList: ""
        })
    },
    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/express_send/index') {
            wx.switchTab({
              url: '/pages/home/index',
            })
        }
    },

})