import fly from '@/common/utils/request'

export function addComment(comment) {
  return fly.post('/comment/add', comment)
}

export function listComment(bookId) {
  return fly.get('/comment/list',
    {
      bookId
    }
  )
}
