import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import SkeletonLoader from '../components/SkeletonLoader'
import { Briefcase, FileText, CheckCircle2, XCircle, Clock, MapPin, ExternalLink } from 'lucide-react'

export default function ApplicationsPage() {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950'
      case 'shortlisted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-950'
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-950'
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-950'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hired':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'shortlisted':
        return <CheckCircle2 className="h-5 w-5 text-indigo-500 animate-pulse" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-rose-500" />
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-amber-500" />
    }
  }

  const getStepProgress = (status) => {
    // Return percentage width for progress tracking bars
    switch (status) {
      case 'hired':
        return 'w-full bg-emerald-500'
      case 'shortlisted':
        return 'w-2/3 bg-indigo-500'
      case 'rejected':
        return 'w-full bg-rose-500'
      case 'pending':
      default:
        return 'w-1/3 bg-amber-500'
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            My Applied Jobs
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View detailed evaluation timelines for all your applications in real time
          </p>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={3} />
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-20 text-center dark:border-neutral-800">
            <Briefcase className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
            <p className="text-sm font-semibold text-neutral-800 dark:text-white">No applications yet</p>
            <p className="text-xs text-neutral-500 mb-4">You haven't submitted any job applications yet.</p>
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Explore Openings
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]"
              >
                {/* Header */}
                <div className="flex flex-col justify-between border-b border-neutral-100 pb-4 sm:flex-row sm:items-start dark:border-neutral-800 gap-4">
                  <div className="flex items-start space-x-3.5">
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
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {app.job_details?.title}
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">{app.job_details?.company_name}</p>
                      
                      <div className="flex items-center space-x-3 pt-1 text-[11px] text-neutral-400">
                        <span className="flex items-center space-x-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{app.job_details?.location}</span>
                        </span>
                        <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-start">
                    <span className={`inline-flex items-center space-x-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="capitalize">{app.status}</span>
                    </span>
                    
                    <Link
                      to={`/jobs/${app.job}`}
                      className="rounded-lg p-2 border border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 dark:border-neutral-800 dark:hover:bg-neutral-800"
                      aria-label="View Job Details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Progress bar timeline */}
                <div className="py-4">
                  <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    <span>Applied</span>
                    <span>Evaluation</span>
                    <span>Decision</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div className={`h-full rounded-full ${getStepProgress(app.status)} transition-all duration-500`} />
                  </div>
                </div>

                {/* Resume PDF link and cover letter note */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <div className="md:col-span-2 space-y-1">
                    <p className="font-semibold text-neutral-600 dark:text-neutral-400">Your Cover Note:</p>
                    <p className="text-neutral-500 italic font-sans">
                      "{app.cover_letter || 'No cover letter provided.'}"
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-end space-y-1 items-end">
                    <span className="text-[10px] text-neutral-400">Attached credentials:</span>
                    {app.resume_url ? (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300 transition"
                      >
                        <FileText className="h-4 w-4 text-neutral-500" />
                        <span>Download Resume PDF</span>
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-neutral-500 italic">No resume uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
