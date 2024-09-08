import { Book } from 'gede-book-api'

const data = await Book.getData('HYB14586410')

console.log(data.contents.join('\n'))