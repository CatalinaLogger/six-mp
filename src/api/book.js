import fly from '@/common/utils/request'

export function addBook(isbn) {
  return fly.post('/book/add',
    {
      isbn
    }
  )
}

export function hotBook(size) {
  return fly.get('/book/hot',
    {
      size
    }
  )
}

export function listBook(page, size) {
  return fly.get('/book/list',
    {
      page,
      size
    }
  )
}

export function detailBook(bookId) {
  return fly.get('/book/detail',
    {
      bookId
    }
  )
}
