// pages/express/index.js
Page({


    data: {
        waiter_list: "",
        searchKey: '', //搜索词
        SearchList: ""
    },
    onShow() {
        this.getWaiterData()
    },

    // 获取快递数据
    getWaiterData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('waiter')
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        waiter_list: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goWaiterDetail(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/waiter_detail/index?id=' + id,
        })
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
            name: "getWaiterDetail",
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
    }
})