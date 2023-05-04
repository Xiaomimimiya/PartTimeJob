// 实名认证界面的逻辑实现
Page({
    data: {
        photoFront: '', // 学生卡正面照片
        photoBack: '', // 学生卡反面照片
    },

    // 拍摄学生卡正面照片
    takePhotoFront() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera', "album"],
            success: (res) => {
                this.setData({
                    photoFront: res.tempFilePaths[0],
                });
            },
        });
    },

    // 拍摄学生卡反面照片
    takePhotoBack() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: (res) => {
                this.setData({
                    photoBack: res.tempFilePaths[0],
                });
            },
        });
    },

    submit() {
        wx.showModal({
            title: '信息确认',
            content: '提交后，后台将进行审核',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                    })
                }

                if (res.confirm) {
                    
                    wx.showToast({
                        title: '正在审核中',
                        duration: 1000,
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/infoAuth/index',
                        })

                    },1000)


                }
            }
        })
    }
});