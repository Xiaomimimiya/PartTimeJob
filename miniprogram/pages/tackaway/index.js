// pages/express/index.js
Page({


    data: {
        tackaway_list: "",
        userInfo:"",
        searchKey: '', //搜索词
        SearchList: ""
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getTackawayData()

    },

    // 获取外卖数据
    getTackawayData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('tackaway')
        .where({
            status:false
        })
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        tackaway_list: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goTackawayOrder(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/tackaway_order/index?id=' + id,
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
                url: '/pages/tackaway_send/index',
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
            name: "getTackAwayDetail",
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
        if (prevPage.route === 'pages/tackaway_send/index') {
            wx.switchTab({
              url: '/pages/home/index',
            })
        }
    },

})