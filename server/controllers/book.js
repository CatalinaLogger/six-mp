const https = require('https')
const { mysql } = require('../qcloud')

async function add (ctx, next) {
    const { openid } = ctx.request.header
    const { isbn } = ctx.request.body
    if (openid && isbn) {
        const books = await mysql('books').select().where('isbn', isbn)
        if (books.length) {
            ctx.state = {
                code: -1,
                msg: '图书已存在'
            }
            return
        }
        const book = await getJson(`https://api.douban.com/v2/book/isbn/${isbn}`)
        const rate = book.rating.average
        const { title, image, alt, publisher, summary, price } = book
        const tags = book.tags.map(tag => {
            return `${tag.title} ${tag.count}`
        })
        const author = book.author.join(',')
        try {
            await mysql('books').insert({
                open_id: openid,
                isbn,
                title,
                author,
                tags: tags.toString(),
                image,
                rate,
                price,
                publisher,
                summary,
                alt,
                create_time: new Date(),
                update_time: new Date()
            })
            ctx.state = {
                msg: '添加成功',
                data: {
                    title
                }
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

async function hot (ctx, next) {
    let quantity = 9
    const { size } = ctx.query
    if (size > 0) {
        quantity = size
    }
    const books = await mysql('books')
        .select('id', 'title', 'image', 'count')
        .orderBy('count', 'desc')
        .limit(quantity)
    ctx.state.data = books
}

async function list (ctx, next) {
    const { page, size } = ctx.query
    const books = await mysql('books')
        .select('books.*', 'cSessionInfo.user_info')
        .join('cSessionInfo', 'books.open_id', 'cSessionInfo.open_id')
        .orderBy('books.id', 'desc')
        .offset(Number(page) * size)
        .limit(size)
    ctx.state.data = books.map(book => {
        const { id, isbn, title, author, tags, image, count, rate, price, publisher, summary, alt } = book
        const userInfo = JSON.parse(book.user_info)
        return Object.assign({}, { id, isbn, title, author, tags, image, count, rate, price, publisher, summary, alt }, {createName: userInfo.nickName})
    })
}

async function detail (ctx, next) {
    const { bookId } = ctx.query
    await mysql('books').where('id', bookId).increment('count', 1)
    const book = await mysql('books')
        .select('books.*', 'cSessionInfo.user_info')
        .join('cSessionInfo', 'books.open_id', 'cSessionInfo.open_id')
        .where('id', bookId)
        .first()
    const { id, isbn, title, author, image, count, rate, price, publisher, alt } = book
    const userInfo = JSON.parse(book.user_info)
    ctx.state.data = Object.assign({},
        { id, isbn, title, author, image, count, rate, price, publisher, alt },
        { tags: book.tags.split(','), summary: book.summary.split('\n'), createName: userInfo.nickName, avatarUrl: userInfo.avatarUrl })
}

function getJson (url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let src = ''
            res.on('data', data => {
                src += data
            })
            res.on('end', () => {
                const book = JSON.parse(src)
                if (book.title) {
                    resolve(book)
                }
                reject(new Error('获取图书信息失败'))
            })
        })
    })
}

module.exports = {
    add,
    hot,
    list,
    detail
}
