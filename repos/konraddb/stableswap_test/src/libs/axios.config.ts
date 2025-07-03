import axios from 'axios'

const api = axios.create({
  baseURL: process.env.KHALANI_MOCKS_URL || 'http://localhost:3000',
  headers: {
    'Content-type': 'application/json',
  },
})

export default api
