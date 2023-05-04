// pages/express_send/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        imgList: [],
        fileIDs: [],
        array: ["校内", "校外"],
        index: 0,
    },
    onLoad() {

    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    //选择商品类型
    bindPickerChange(e) {
        this.setData({
            index: e.detail.value
        })

    },
    publish(e) {
        console.log(e.detail.value)
        let snack = e.detail.value
        let db = wx.cloud.database()
        let imgList = this.data.imgList
        if (!imgList || imgList.length < 1) {
            wx.showToast({
                icon: "none",
                title: '请选择图片'
            })
            return
        }
        wx.showLoading({
            title: '发布中...',
        })

        const promiseArr = []
        //一张张上传 遍历临时的图片数组
        for (let i = 0; i < this.data.imgList.length; i++) {
            let filePath = this.data.imgList[i]
            // 正则表达式，获取文件扩展名
            let suffix = /\.[^\.]+$/.exec(filePath)[0];

            promiseArr.push(new Promise((reslove, reject) => {
                wx.cloud.uploadFile({
                    cloudPath: new Date().getTime() + suffix,
                    filePath: filePath, // 上传文件路径
                }).then(res => {
                    // get resource ID
                    console.log("上传结果", res.fileID)
                    this.setData({
                        fileIDs: this.data.fileIDs.concat(res.fileID)
                    })
                    reslove()
                }).catch(error => {
                    console.log("上传失败", error)
                })
            }))
        }
        //所有图片都上传成功后

        Promise.all(promiseArr).then(res => {
            db.collection('purchase').add({
                data: {
                    _createTime: new Date().getTime(),
                    start_address: snack.start_address,
                    end_address: snack.end_address,
                    desc: snack.desc,
                    price: snack.price,
                    
                    send_id:this.data.userInfo._id,
                    send_name: this.data.userInfo.username,
                    chat: snack.contact,
                    endtime: snack.time,
                    imgs: this.data.fileIDs,
                    email: this.data.userInfo.email,
                    in_out_school:snack.type,
                    status: false,
                    is_finish:false,
                    type: 2,
                    user_avatar: this.data.userInfo.user_avatar
                },
                success: res => {
                    wx.hideLoading()
                    wx.showToast({
                        title: '发布成功',
                    })
                    //清空数据
                    this.setData({
                        imgList: [],
                        fileIDs: [],
                    })
                    console.log('发布成功', res)
                    wx.navigateTo({
                        url: '/pages/snack/index',
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
        })


    },
    //选择图片
    ChooseImage() {
        wx.chooseImage({
            count: 2 - this.data.imgList.length, //默认9,我们这里最多选择8张
            sizeType: ['compressed'], //可以指定是原图还是压缩图，这里用压缩
            sourceType: ['album', 'camera'], //从相册选择
            success: (res) => {
                console.log("选择图片成功", res)
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
                console.log("路径", this.data.imgList)
            }
        });
    },
    //删除图片
    DeleteImg(e) {
        wx.showModal({
            title: '要删除这张照片吗？',
            content: '',
            cancelText: '取消',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })


    }

})