import React, { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch current user details on load
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await API.get('auth/me/')
      setUser(res.data)
    } catch (err) {
      console.error('Failed to load user info', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  // Login handler
  const login = async (username, password) => {
    setError(null)
    setLoading(true)
    try {
      const res = await API.post('auth/login/', { username, password })
      localStorage.setItem('accessToken', res.data.access)
      localStorage.setItem('refreshToken', res.data.refresh)
      
      // Fetch user profile info
      const userRes = await API.get('auth/me/')
      setUser(userRes.data)
      return userRes.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid username or password'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Register handler
  const register = async (payload) => {
    setError(null)
    setLoading(true)
    try {
      await API.post('auth/register/', payload)
      // Auto login after registration
      return await login(payload.username, payload.password)
    } catch (err) {
      const data = err.response?.data
      let msg = 'Registration failed'
      if (data) {
        msg = Object.values(data).flat().join(' ')
      }
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Logout handler
  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  // Update profile locally after update API call
  const updateProfile = (profileData) => {
    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData,
        },
      }
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
