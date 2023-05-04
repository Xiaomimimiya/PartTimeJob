const app = getApp()

Page({
    data: {
        chat_friend: [],

        userInfo: ""
    },

    onShow() {
        // 获取到用户信息 进行储存
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        if (user) {
            this.getMyChat_friend()
        }
    },
    getMyChat_friend() {
        let that = this
        let db = wx.cloud.database()
        const DB = wx.cloud.database().command;

        db.collection('chat_list')
            .where(
                DB.or([{
                        user_id: that.data.userInfo._id,
                    },
                    {
                        friend_id: that.data.userInfo._id
                    }
                ])
            )
            .orderBy(
                "time", "desc"
            )
            .get({
                success(res) {
                 
                    that.setData({
                        chat_friend: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },

            })






    },

    // 跳转到聊天界面
    startChat(e) {
        var id = e.currentTarget.dataset.item._id;
        wx.navigateTo({
            url: '/pages/chat_detail/index?id=' + id
        })
    }
})