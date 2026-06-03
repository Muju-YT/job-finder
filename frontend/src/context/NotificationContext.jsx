import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import API from '../services/api'
import API_URL from '../services/apiConfig'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [toast, setToast] = useState(null)
  
  // A list of callbacks registered by views (like JobListingPage) to receive live data feeds
  const liveListenersRef = useRef(new Set())
  const socketRef = useRef(null)

  // Fetch initial notifications list
  const fetchNotifications = async () => {
    try {
      const res = await API.get('notifications/')
      setNotifications(res.data)
      setUnreadCount(res.data.filter((n) => !n.is_read).length)
    } catch (err) {
      console.error('Failed to fetch notifications list', err)
    }
  }

  // Toast trigger utility
  const showToast = (title, message, type = 'info', actionData = null) => {
    setToast({ title, message, type, actionData })
    setTimeout(() => {
      setToast(null)
    }, 5000)
  }

  // Register callbacks for live page updates (e.g. Job postings)
  const registerLiveListener = (callback) => {
    liveListenersRef.current.add(callback)
    return () => {
      liveListenersRef.current.delete(callback)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await API.post('notifications/mark-read/')
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await API.post('notifications/mark-read/', { id })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark notification read', err)
    }
  }

  // Manage WebSocket connection
  useEffect(() => {
    // We establish connection regardless, but attach token if authenticated
    const token = localStorage.getItem('accessToken')
    
    // Dynamically convert API_URL to ws:// or wss:// protocol
    const wsBaseUrl = API_URL.replace(/^http/, 'ws')
    const socketUrl = token 
      ? `${wsBaseUrl}/ws/notifications/?token=${token}`
      : `${wsBaseUrl}/ws/notifications/`

    if (user) {
      fetchNotifications()
    } else {
      setNotifications([])
      setUnreadCount(0)
    }

    const socket = new WebSocket(socketUrl)
    socketRef.current = socket

    socket.onopen = () => {
      console.log('Real-time connection opened successfully.')
    }

    socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data)
      const { type, data } = parsedData

      if (type === 'job_created') {
        // Trigger live broadcast callbacks
        liveListenersRef.current.forEach((cb) => cb(data))
        showToast(
          'New Job Opportunity!',
          `"${data.title}" was posted by ${data.company_name} in ${data.location}`,
          'success',
          data
        )
      } else if (type === 'notification_received') {
        // Prepend to personal list
        setNotifications((prev) => [data, ...prev])
        setUnreadCount((prev) => prev + 1)
        
        // Match icon color based on type
        let toastType = 'info'
        if (data.notification_type === 'status_change') {
          toastType = data.message.includes('Hired') || data.message.includes('Shortlisted') ? 'success' : 'warning'
        } else if (data.notification_type === 'application_received') {
          toastType = 'info'
        }
        
        showToast(data.title, data.message, toastType)
      }
    }

    socket.onclose = (event) => {
      console.log('Real-time socket closed. Code:', event.code)
    }

    socket.onerror = (err) => {
      console.error('WebSocket connection error:', err)
    }

    // Cleanup on unmount or user change
    return () => {
      socket.close()
    }
  }, [user])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toast,
        markAllAsRead,
        markAsRead,
        registerLiveListener,
        showToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
