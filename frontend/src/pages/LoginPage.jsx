import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, KeyRound, User, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { login, user } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard', { replace: true })
      } else {
        navigate('/candidate-dashboard', { replace: true })
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const loggedUser = await login(username, password)
      if (loggedUser.role === 'recruiter') {
        navigate('/recruiter-dashboard')
      } else {
        navigate('/candidate-dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-[#0F0F12]">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {searchParams.get('expired') && (
          <div className="flex items-center space-x-2 rounded-xl bg-amber-50/50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <span>Session expired. Please log in again.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50/50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                placeholder="developer_john"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-500 hover:text-indigo-600">
            Sign up today
          </Link>
        </div>
      </div>
    </div>
  )
}
