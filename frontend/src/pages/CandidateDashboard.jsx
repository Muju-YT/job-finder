import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import SkeletonLoader from '../components/SkeletonLoader'
import { Briefcase, CheckCircle, FileText, XCircle, Clock, MapPin, ArrowRight } from 'lucide-react'

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('applications/')
        setApplications(res.data)
      } catch (err) {
        console.error('Failed to load candidate applications', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  // Calculate statistics
  const totalApplied = applications.length
  const totalShortlisted = applications.filter((app) => app.status === 'shortlisted').length
  const totalHired = applications.filter((app) => app.status === 'hired').length

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hired':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
      case 'shortlisted':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
      case 'rejected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
    }
  }

  const formatStatus = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Candidate Dashboard
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Monitor and track your real-time job applications
          </p>
        </div>

        {loading ? (
          <SkeletonLoader type="dashboard" />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Stat 1 */}
              <div className="flex items-center space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Applied</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalApplied}</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Shortlisted</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalShortlisted}</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Offers Hired</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalHired}</p>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                Application History
              </h2>

              {applications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
                  <Briefcase className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
                  <p className="text-sm font-semibold text-neutral-800 dark:text-white">No applications yet</p>
                  <p className="text-xs text-neutral-500 mb-5">Start applying to get recruited!</p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    <span>Browse All Jobs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#0F0F12]">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col justify-between p-5 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start space-x-3.5 mb-3 sm:mb-0">
                        {app.job_details?.company_logo ? (
                          <img
                            src={app.job_details.company_logo}
                            alt={app.job_details.company_name}
                            className="h-10 w-10 rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                            <Briefcase className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <Link
                            to={`/jobs/${app.job}`}
                            className="text-sm font-semibold text-neutral-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition-colors"
                          >
                            {app.job_details?.title}
                          </Link>
                          <p className="text-xs font-medium text-neutral-500">
                            {app.job_details?.company_name}
                          </p>
                          <div className="flex items-center space-x-3 pt-1 text-[11px] text-neutral-400">
                            <span className="flex items-center space-x-0.5">
                              <MapPin className="h-3 w-3" />
                              <span>{app.job_details?.location}</span>
                            </span>
                            <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(app.status)}`}>
                          {formatStatus(app.status)}
                        </span>
                        
                        {app.resume_url && (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-xs font-medium text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Resume</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
