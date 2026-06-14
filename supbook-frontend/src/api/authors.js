import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const authClient = (token) => axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const fetchAuthors = async (token) => {
  const response = await authClient(token).get('/api/authors')
  return response.data.data || response.data
}

export const createAuthor = async (token, name) => {
  const response = await authClient(token).post('/api/authors', {
    data: { name },
  })
  return response.data.data
}