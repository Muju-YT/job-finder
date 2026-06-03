import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, User, Mail, Lock, Building, UserPlus, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const { register, user } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

    const payload = {
      username,
      email,
      password,
      role,
      full_name: role === 'candidate' ? fullName : '',
      company_name: role === 'recruiter' ? companyName : '',
    }

    try {
      const loggedUser = await register(payload)
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
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Create your account
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Join JobNova to begin matching
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50/50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Role Choice */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`rounded-xl border py-3 text-center text-sm font-semibold transition-all ${
                role === 'candidate'
                  ? 'border-indigo-600 bg-indigo-50/30 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/15 dark:text-indigo-400'
                  : 'border-neutral-200 bg-transparent text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800'
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`rounded-xl border py-3 text-center text-sm font-semibold transition-all ${
                role === 'recruiter'
                  ? 'border-indigo-600 bg-indigo-50/30 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/15 dark:text-indigo-400'
                  : 'border-neutral-200 bg-transparent text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800'
              }`}
            >
              Recruiter
            </button>
          </div>

          {/* Username */}
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
                placeholder="john_doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === 'candidate' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Company Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                  <Building className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                  placeholder="Google Inc"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                <Lock className="h-4 w-4" />
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-500 hover:text-indigo-600">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
