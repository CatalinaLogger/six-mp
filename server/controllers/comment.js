const { mysql } = require('../qcloud')

async function add (ctx, next) {
    const { openid } = ctx.request.header
    const { bookId, comment, address, device } = ctx.request.body
    if (openid && comment) {
        try {
            await mysql('comments').insert({
                book_id: bookId,
                open_id: openid,
                comment,
                address,
                device,
                create_time: new Date(),
                update_time: new Date()
            })
            ctx.state = {
                msg: '添加成功'
            }
        } catch (e) {
            console.log(e)
            ctx.state = {
                code: -1,
                msg: '添加失败'
            }
        }
    }
}

async function list (ctx, next) {
    const { bookId } = ctx.query
    const comments = await mysql('comments')
        .select('comments.*', 'cSessionInfo.user_info')
        .join('cSessionInfo', 'comments.open_id', 'cSessionInfo.open_id')
        .where('book_id', bookId)
    ctx.state.data = comments.map(item => {
        const { comment, address, device } = item
        const userInfo = JSON.parse(item.user_info)
        return Object.assign({}, { comment, address, device, createTime: item.create_time }, {createName: userInfo.nickName, avatarUrl: userInfo.avatarUrl})
    })
}

module.exports = {
    add,
    list
}
