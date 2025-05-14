import axios from 'axios'

const axiosClient = axios.create({
  baseURL: '/api',                
  withCredentials: true,          //HttpOnly / SameSite 쿠키 허용
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
})

export default axiosClient