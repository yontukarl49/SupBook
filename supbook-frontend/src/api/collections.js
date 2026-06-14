import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const authClient = (token) => axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const fetchCollections = async (token) => {
  const response = await authClient(token).get('/api/collections?populate=books')
  return response.data.data || []
}

export const createCollection = async (token, name) => {
  const response = await authClient(token).post('/api/collections', {
    data: { name },
  })
  return response.data.data || response.data
}

export const addBookToCollection = async (token, documentId, bookIds) => {
  const response = await authClient(token).put(`/api/collections/${documentId}`, {
    data: { books: bookIds },
  })
  return response.data.data || response.data
}

export const removeBookFromCollection = async (token, documentId, bookIds) => {
  const response = await authClient(token).put(`/api/collections/${documentId}`, {
    data: { books: bookIds },
  })
  return response.data.data || response.data
}

export const deleteCollection = async (token, documentId) => {
  const response = await authClient(token).delete(`/api/collections/${documentId}`)
  return response.data
}