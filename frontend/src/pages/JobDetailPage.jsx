import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import API from '../services/api'
import SkeletonLoader from '../components/SkeletonLoader'
import { Briefcase, MapPin, DollarSign, Calendar, FileText, ArrowLeft, Send, Check } from 'lucide-react'

export default function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showToast } = useNotification()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState(null)
  
  // Application form states
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [applyError, setApplyError] = useState(null)

  // Fetch job details and check if candidate has already applied
  const fetchJobData = async () => {
    try {
      const jobRes = await API.get(`jobs/${id}/`)
      setJob(jobRes.data)

      // If user is candidate, check if already applied
      if (user && user.role === 'candidate') {
        const appsRes = await API.get('applications/')
        const existingApp = appsRes.data.find((app) => app.job === parseInt(id))
        if (existingApp) {
          setHasApplied(true)
          setApplicationStatus(existingApp.status)
        }
      }
    } catch (err) {
      console.error('Error fetching job details', err)
      showToast('Error', 'Failed to retrieve job details.', 'warning')
      navigate('/jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobData()
  }, [id, user])

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setApplyError(null)

    // Using FormData to support custom resume file uploads
    const formData = new FormData()
    formData.append('job', id)
    formData.append('cover_letter', coverLetter)
    if (resumeFile) {
      formData.append('resume', resumeFile)
    }

    try {
      const res = await API.post('apply/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setHasApplied(true)
      setApplicationStatus('pending')
      setShowApplyModal(false)
      showToast(
        'Application Submitted!',
        `Your application for "${job.title}" has been successfully sent.`,
        'success'
      )
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application. Please try again.'
      setApplyError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <SkeletonLoader type="detail" count={1} />
      </div>
    )
  }

  if (!job) return null

  const getJobTypeDisplay = (type) => {
    return type?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const getStatusLabelColor = (status) => {
    switch (status) {
      case 'hired':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
      case 'shortlisted':
        return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
      case 'rejected':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20'
      case 'pending':
      default:
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Browse</span>
        </Link>

        {/* Job Card Block */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
          <div className="flex flex-col justify-between sm:flex-row sm:items-start gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-start space-x-4">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company_name}
                  className="h-16 w-16 rounded-2xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Briefcase className="h-8 w-8" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
                  {job.title}
                </h1>
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  {job.company_name}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-400">
                  <span className="flex items-center space-x-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.location} ({job.location_type})</span>
                  </span>
                  <span>•</span>
                  <span>{getJobTypeDisplay(job.job_type)}</span>
                </div>
              </div>
            </div>

            {/* Application CTA actions */}
            <div>
              {!user ? (
                <Link
                  to="/login"
                  className="inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Log in to Apply
                </Link>
              ) : user.role === 'recruiter' ? (
                <div className="rounded-xl bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  Recruiter Account
                </div>
              ) : hasApplied ? (
                <div className="flex flex-col items-end space-y-1">
                  <div className="inline-flex items-center space-x-1 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                    <span>Applied</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    Status: <span className="font-bold capitalize">{applicationStatus}</span>
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Apply for Job
                </button>
              )}
            </div>
          </div>

          {/* Job Details Meta Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 py-6 text-xs border-b border-neutral-100 dark:border-neutral-800">
            <div className="space-y-1">
              <span className="font-semibold text-neutral-400 uppercase tracking-wider">Salary Range</span>
              <div className="flex items-center space-x-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                <DollarSign className="h-4 w-4 text-neutral-400" />
                <span>
                  ${parseFloat(job.salary_min).toLocaleString()} - ${parseFloat(job.salary_max).toLocaleString()}/yr
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="font-semibold text-neutral-400 uppercase tracking-wider">Location Format</span>
              <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200 capitalize">
                {job.location_type}
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-neutral-400 uppercase tracking-wider">Date Posted</span>
              <div className="flex items-center space-x-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                <Calendar className="h-4 w-4 text-neutral-400" />
                <span>{new Date(job.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Detailed requirements and Description */}
          <div className="pt-6 space-y-6">
            <div className="space-y-2.5">
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Requirements
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                {job.requirements?.split('\n').map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Job Description
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Apply Modal Form overlay */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-[#0F0F12]">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Apply to {job.company_name}
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            {applyError && (
              <div className="mt-4 rounded-xl bg-red-50/50 px-4 py-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="mt-4 space-y-4">
              {/* Cover Letter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Cover Letter / Note to Recruiter
                </label>
                <textarea
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                  placeholder="Introduce yourself and explain why you're a great fit for this role..."
                />
              </div>

              {/* PDF Resume upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Custom Resume PDF (Optional)
                </label>
                <div className="flex items-center space-x-3.5">
                  <label className="flex cursor-pointer items-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300">
                    <FileText className="h-4 w-4 text-neutral-500" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-neutral-500 truncate max-w-xs">
                    {resumeFile ? resumeFile.name : "Using your default profile resume if uploaded"}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex justify-end space-x-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? "Sending..." : "Submit Application"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
