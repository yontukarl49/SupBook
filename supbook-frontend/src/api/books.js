import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const authClient = (token) => axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const fetchBooks = async (token) => {
  const response = await authClient(token).get(
    '/api/books?populate[author][fields][0]=name'
  )
  return response.data.data
}

export const createBook = async (token, bookData) => {
  const response = await authClient(token).post('/api/books', {
    data: bookData,
  })
  return response.data.data 
}


export const updateBook = async (token, bookId, bookData) => {
  const response = await authClient(token).put(`/api/books/${bookId}`, bookData)
  return response.data.data 
}

export const deleteBook = async (token, bookId) => {
  const response = await authClient(token).delete(`/api/books/${bookId}`)
  return response.data
}