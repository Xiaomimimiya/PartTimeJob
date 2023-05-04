// pages/waiter_detail/index.js
Page({


    data: {
        waiter_id: "",
        waiter_detail:"",
        waiter_desc:"",
        company_desc:""
    },
    onLoad(options) {
        this.setData({
            waiter_id: options.id
        })
    },
    onShow() {
        this.getWaiterData()
    },
    getWaiterData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('waiter')
            .doc(that.data.waiter_id)
            .get({
                success(res) {
                   let waiter_content = res.data.desc
                   let company_info = res.data.company_info
                    that.setData({
                        waiter_detail: res.data,
                        waiter_desc: waiter_content,
                        company_desc:company_info
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    }
})