import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotification } from '../context/NotificationContext'
import { Sun, Moon, Bell, Power, Briefcase, User as UserIcon, Check, FileText } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotification()
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/85 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-[#0A0A0C]/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="h-6 w-6 stroke-[2.5]" />
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Job<span className="text-indigo-500">Nova</span>
              </span>
            </Link>
            
            {/* Main Links */}
            <div className="ml-10 hidden space-x-6 md:flex">
              <Link to="/jobs" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
                Browse Jobs
              </Link>
              {user && (
                <Link
                  to={user.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard'}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              )}
              {user && user.role === 'candidate' && (
                <Link to="/applications" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
                  My Applications
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                {/* Notification Dropdown Container */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Box */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-[#0F0F12] sm:w-96">
                      <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2 pb-2 dark:border-neutral-800">
                        <span className="font-semibold text-neutral-800 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-72 overflow-y-auto py-1">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-sm text-neutral-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id)
                                setShowNotifications(false)
                                if (n.notification_type === 'status_change') {
                                  navigate('/applications')
                                } else if (n.notification_type === 'application_received') {
                                  navigate('/recruiter-dashboard')
                                }
                              }}
                              className={`flex cursor-pointer items-start space-x-3 rounded-lg px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
                                !n.is_read ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''
                              }`}
                            >
                              <div className="mt-1 flex-shrink-0">
                                {n.notification_type === 'status_change' ? (
                                  <FileText className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Bell className="h-4 w-4 text-indigo-500" />
                                )}
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <p className={`text-xs ${!n.is_read ? 'font-semibold text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                  {n.title}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-neutral-400">
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {!n.is_read && (
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                >
                  {user.profile?.avatar_url || user.profile?.company_logo_url ? (
                    <img
                      src={user.role === 'candidate' ? user.profile.avatar_url : user.profile.company_logo_url}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                  <span className="hidden text-sm font-semibold sm:inline-block">
                    {user.role === 'candidate' ? user.profile?.full_name || user.username : user.profile?.company_name || user.username}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden rounded-lg p-2 text-neutral-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 dark:text-neutral-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 md:inline-flex"
                  aria-label="Logout"
                >
                  <Power className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
