// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const dbGood = db.collection('tackaway')

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    if (event.action == 'search' && event.searchKey) {
        return await dbGood.where({
                $and: [{
                        $or: [{
                                start_address: db.RegExp({
                                    regexp: event.searchKey,
                                    options: 'i'
                                })
                            },
                            {
                                end_address: db.RegExp({
                                    regexp: event.searchKey,
                                    options: 'i'
                                })
                            }
                        ],
                    },
                    {
                        status: false
                    }
                ]

            })
            .get()
    }
}