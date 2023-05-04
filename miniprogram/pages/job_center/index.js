// pages/job_center/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data_item: ""
    },


    onLoad(options) {

    },

    onShow() {
        let that = this
        const db = wx.cloud.database()
        db.collection('merchant').get({
            success(res) {
                let data = res.data
                that.setData({
                    data_item: data
                })
            }
        })
    },
    goDetail(res){
        let id =res.currentTarget.dataset.item._id
        wx.navigateTo({
          url: '/pages/job_detail/index?id=' + id,
        })
    }

})