// index.js
Page({
    data: {
        account: '',
        password: '',
        email: ''
    },
    bindAccountInput: function (e) {
        let account = e.detail.value
        this.setData({
            account: account
        })
    },
    bindPasswordInput: function (e) {
        let password = e.detail.value
        this.setData({
            password: password
        })
    },
    bindEmailInput: function (e) {
        let email = e.detail.value
        this.setData({
            email: email
        })


    },
    register() {
        let db = wx.cloud.database()
        let username = this.data.account
        let password = this.data.password
        let email = this.data.email

        if (username.length < 4) {
            wx.showToast({
                icon:"error",
                title: '账号格式错误',
            })
            return
        }

        if (password.length < 4) {
            wx.showToast({
                icon:"error",
                title: '密码格式错误',
            })
            return
        }
        // 验证邮箱格式是否正确
        
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!reg.test(email)) {
            wx.showToast({
                icon:"error",
                title: '邮箱格式错误',
            })
          return;
        }

        db.collection('job_userinfo').add({
            data: {
                username: this.data.account,
                password: this.data.password,
                email: this.data.email,
                user_avatar: "cloud://home-platform-0gpmrg4uda95ceae.686f-home-platform-0gpmrg4uda95ceae-1308239074/comm_avatar.png",
                _createTime: new Date().getTime(),
            },
            success: res => {
                setTimeout(function () {
                    wx.hideLoading()
                    setTimeout(() => {
                        wx.showToast({
                            title: '注册成功',
                        })
                    }, 1000);
                    wx.showLoading({
                        title: '发布中...',
                    })
                    wx.redirectTo({
                        url: '/pages/login/index'
                    })
                }, 1000)
            },
            fail: err => {
                wx.hideLoading()
                wx.showToast({
                    icon: 'none',
                    title: '网络不给力....'
                })
                console.error('注册失败', err)
            }
        })
    },
    url(){
        wx.navigateTo({
          url: '/pages/login/index',
        })
    }
})