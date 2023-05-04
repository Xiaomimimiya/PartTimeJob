// pages/job_detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        job_id: "",
        job_detail: "",
        content:"",
        require:""
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            job_id: options.id
        })
        
    },
    onShow() {
        this.getJobData()
    },
    getJobData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('merchant')
            .doc(that.data.job_id)
            .get({
                success(res) {
                    that.setData({
                        job_detail: res.data,
                        content:res.data.content,
                        require:res.data.require
                    })
                    
                },
                fail(err) {
                    console.log(err);
                },
            })
    }
})