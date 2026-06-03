import axios from 'axios'
import API_URL from './apiConfig'

const API = axios.create({
  baseURL: `${API_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Auto JWT token refreshing
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If request failed with 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          // Attempt to fetch new access token
          const res = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          })

          const newAccessToken = res.data.access
          localStorage.setItem('accessToken', newAccessToken)

          // Retry original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return API(originalRequest)
        } catch (refreshError) {
          // Refresh token expired or invalid; log user out
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login?expired=true'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

export default API
