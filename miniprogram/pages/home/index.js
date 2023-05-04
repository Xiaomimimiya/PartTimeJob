// pages/home/home.js
Page({
    data: {
        latestData: "",
        banner: "",
       
    },
    onShow() {
        this.getLatestData()
        this.getSwiper()
    },
    goDetail(e){
        let page = e.currentTarget.dataset.item
        let urls = "/pages/"+page+"/index"
        wx.navigateTo({
          url:urls,
        })
    },
    getSwiper() {
        const db = wx.cloud.database()
        let that = this
        let dataArray = []
        db.collection("lunbotu")
            .get({
                success(res) {
                    let data = res.data
                    data.forEach(element => {
                        let images = element.image
                        dataArray.push(images)
                    });
                    
                    that.setData({
                        banner: dataArray
                    })

                },
                fail(err){
                    console.log(err);
                }
                
            })
    },
    // 跳转事件
    goWork() {
        wx.navigateTo({
            url: '/pages/getWork/index',
        })
    },
    goJoin(){
        wx.navigateTo({
            url: '/pages/company_join/index',
        })
    },
    // 分别 获取快递和零食最新4条数据
    getLatestData() {
        const db = wx.cloud.database()
        let allData = []
        Promise.all([
            db.collection('express').orderBy('_createTime', 'desc').limit(3).where({
                status: false
            }).get(),
            db.collection('purchase').orderBy('_createTime', 'desc').limit(3).where({
                status: false
            }).get(),
            db.collection('tackaway').orderBy('_createTime', 'desc').limit(3).where({
                status: false
            }).get()
          
        ]).then(([res1,res2,res3]) => {
        
            allData=[...res1.data, ...res2.data,...res3.data]
            let finalData = allData.sort((a,b,c)=>{
                const timeA = new Date(a._createTime).getTime()
                const timeB = new Date(b._createTime).getTime()
                return timeB-timeA
            })
            this.setData({
                latestData: finalData
            })
        }).catch(err => {
            console.error(err)
        })

    },
    goOrderDetail(e) {
        const id = e.currentTarget.dataset.item._id
        const type = e.currentTarget.dataset.item.type
        if (type == 1) {
            wx.navigateTo({
                url: '/pages/express_order/index?id=' + id,
            })
        } else if (type == 2) {
            wx.navigateTo({
                url: '/pages/snack_order/index?id=' + id,
            })
        } else if (type == 3) {
            wx.navigateTo({
                url: '/pages/rush_order/index?id=' + id,
            })
        }else if (type ==4) {
            wx.navigateTo({
                url: '/pages/tackaway_order/index?id=' + id,
            })
        }
    }
})