import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const registerUser = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/local/register`, {
        username,
        email,
        password,
    })
    return response.data
}

export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/local`, {
    
    identifier: email,
    password,
    })
    return response.data
}

