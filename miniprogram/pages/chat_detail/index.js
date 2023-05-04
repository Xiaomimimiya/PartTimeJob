const app = getApp()


Page({
    data: {
        userInfo: "",
        friend_id: "",

        user_id: "",
        record_id: "",

        chat_detail: "",
        friend_avatar: "",
        user_avatar: "",

        inputValue: "",
        time: 0
    },
    onLoad: function (options) {
        // 获取对方的ID
        console.log(options);
        this.setData({
            record_id: options.id
        })
        this.getChatList()

    },

    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            user_id: user._id,
            userInfo: user
        })
        this.getChatList()

    },
    //获取聊天数据 
    getChatList() {
        let that = this
        let db = wx.cloud.database()
        db.collection('chat_list').doc(that.data.record_id).watch({
            onChange: function (snapshot) {
                console.log(snapshot);
                that.setData({
                    chat_detail: snapshot.docs[0].chat_record,
                    friend_avatar: snapshot.docs[0].friend_avatar,
                    user_avatar: snapshot.docs[0].user_avatar,
                    image:snapshot.docs[0].chat_record
                })
                that.setData({
                    scrollLast: "toView"
                })
                if (that.data.userInfo._id == snapshot.docs[0].friend_id) {
                    wx.setNavigationBarTitle({
                        title: snapshot.docs[0].user_name
                    })
                } else {
                    wx.setNavigationBarTitle({
                        title: snapshot.docs[0].friend_name
                    })

                }
            },
            onError: function (err) {
                console.log(err)
            }
        })
    },
    handleInput(e) {
        clearTimeout(this.data.time)
        var that = this;
        this.data.time = setTimeout(() => {
            that.getInputValue(e.detail.value)
        }, 200)
    },
    getInputValue(value) {
        console.log(value);
        this.setData({
            inputValue: value
        })
    },
    publishMessage() {
        if (this.data.inputValue.trim() == "") {
            wx.showToast({
                icon: "none",
                title: '不能发送空消息',
            })
            return;
        }
        let that = this
        let db = wx.cloud.database()
        db.collection('chat_list').doc(that.data.record_id)
            .get({
                success(res) {
                    console.log("数据请求成功");
                    let chat_record = res.data.chat_record;
                    console.log(chat_record);
                    var message = {}
                    message.id = that.data.userInfo._id
                    message.text = that.data.inputValue
                    message.time = new Date().getTime()

                    console.log(message);
                    chat_record.push(message)
                    console.log(chat_record);

                    db.collection('chat_list').doc(that.data.record_id).update({
                        data: {
                            chat_record: chat_record,
                            time: new Date().getTime()
                        },
                        success(res) {
                            that.getChatList(),
                                that.setData({
                                    inputValue: ''
                                })
                        },
                        fail(err) {
                            console.log(err);
                        }

                    })
                },
                fail(err) {
                    console.log(err);
                }
            })
    },
    sendImage() {
        let  that= this
        wx.chooseMedia({
            count: 1,
            mediaType: ["image"],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success(res) {
                let tempFiles = res.tempFiles[0].tempFilePath
                console.log(tempFiles);
                that.setData({
                    inputValue: tempFiles
                })
                let db = wx.cloud.database()
                db.collection('chat_list').doc(that.data.record_id)
                    .get({
                        success(res) {
                            console.log("数据请求成功");
                            let chat_record = res.data.chat_record;
                            console.log(chat_record);
                            var message = {}
                            message.id = that.data.userInfo._id
                            message.text = that.data.inputValue
                            message.time = new Date().getTime()

                            console.log(message);
                            chat_record.push(message)
                            console.log(chat_record);

                            db.collection('chat_list').doc(that.data.record_id).update({
                                data: {
                                    chat_record: chat_record,
                                    time: new Date().getTime()
                                },
                                success(res) {
                                    that.getChatList(),
                                        that.setData({
                                            inputValue: ''
                                        })
                                },
                                fail(err) {
                                    console.log(err);
                                }

                            })
                        },
                        fail(err) {
                            console.log(err);
                        }
                    })
            }
        })
    },
    previewImage(e) {
        let url = e.currentTarget.dataset.url.text;
        console.log(url);
        wx.previewImage({
            current: url,
            urls: [url]
        })
    },
})