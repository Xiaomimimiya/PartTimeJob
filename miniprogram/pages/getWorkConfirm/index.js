// pages/getWorkConfirm/index.js
Page({


    data: {
        details: ""
    },

    onLoad(options) {
        let item = JSON.parse(options.job)
        this.setData({
            details: item
        })
    },
    onShow(){
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    onSubmit() {
        let that = this
        let db = wx.cloud.database()
        let job = that.data.details 
        db.collection('getWork').add({
            data: {
                _createTime: new Date().getTime(),
                send_name: that.data.userInfo.username,
                username: job.username,
                age: job.age,
                sex: job.sex,
                loaction: job.loaction,
                contact: job.contact,
                desc: job.desc,
                send_id: that.data.userInfo._id,
            },
            success: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '发布成功',
                })
                console.log('发布成功', res)
                wx.navigateTo({
                    url: '/pages/getWork/index',
                })

            },
            fail: err => {
                wx.hideLoading()
                wx.showToast({
                    icon: 'none',
                    title: '网络不给力....'
                })
                console.error('发布失败', err)
            }
        })
    },
   

})