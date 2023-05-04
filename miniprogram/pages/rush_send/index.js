// pages/express_send/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: ""
    },
    onLoad() {

    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    publish(e) {
        console.log(e.detail.value)
        let rushClass = e.detail.value
        let db = wx.cloud.database()
        db.collection('rush_class').add({
            data: {
                _createTime: new Date().getTime(),
                time: rushClass.time,
                classname:rushClass.classname,
                desc: rushClass.desc,
                price: rushClass.price,
                chat:rushClass.contact,
                send_name: this.data.userInfo.username,
                send_id:this.data.userInfo._id,
                email:this.data.userInfo.email,
                is_finish:false,
                status: false,
                type:3,
                send_avatar: "https://th.bing.com/th/id/R.204074c918f10f417423666bdf7a10ea?rik=Q07O5YL2fBEe8A&riu=http%3a%2f%2fimg2.woyaogexing.com%2f2018%2f01%2f09%2f622d25573c861822!400x400_big.jpg&ehk=7GMVLkwKFoS3shKHCXBdnhxLLWZo%2b7EYJKtSc5o15KM%3d&risl=&pid=ImgRaw&r=0"
            },
            success: res => {
                wx.hideLoading()
                setTimeout(() => {
                    wx.showToast({
                        title: '发布成功',
                    }) 
                }, 1000);
               setTimeout(() => {
               
                wx.navigateTo({
                    url: '/pages/rush_class/index',
                }) 
               }, 2000);

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

    }

})