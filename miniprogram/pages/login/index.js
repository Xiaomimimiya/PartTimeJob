const app = getApp()
Page({
    data: {
        username: '',
        password: ''
    },
    //获取输入的账号
    getUserName(event) {
        //console.log('账号', event.detail.value)
        this.setData({
            username: event.detail.value
        })
    },
    //获取输入的密码
    getPassword(event) {
        // console.log('密码', event.detail.value)
        this.setData({
            password: event.detail.value
        })
    },
    //点击登陆
    login() {
        let username = this.data.username
        let password = this.data.password
        console.log(username, password);

        //登陆
        wx.cloud.database().collection('job_userinfo').where({
            username: username
        }).get({
            success(res) {
                let user = res.data[0]
                if (password == user.password) {
                    console.log('登录成功')
                    wx.showToast({
                        title: '登录成功',
                    })
                    wx.switchTab({
                        url: '/pages/my/index',
                    })
                    //保存用户登陆状态
                    wx.setStorageSync('user', user)
                } else {
                    console.log('登录失败')
                    wx.showToast({
                        icon: 'none',
                        title: '账号或密码不正确',
                    })
                }
            },
            fail(res) {
                console.log("获取数据失败", res)
            }
        })

    },
    tapHelp: function (e) {
        if (e.target.id == 'help') {
            this.hideHelp();
        }
    },
    showHelp: function (e) {
        this.setData({
            'help_status': true
        });
    },
    hideHelp: function (e) {
        this.setData({
            'help_status': false
        });
    },
    // 点击事件
    goregister() {
        wx.navigateTo({
            url: '/pages/register/index',
        })
    }
})  