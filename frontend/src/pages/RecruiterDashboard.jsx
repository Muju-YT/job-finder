import React, { useEffect, useState } from 'react'
import API from '../services/api'
import SkeletonLoader from '../components/SkeletonLoader'
import { Briefcase, Users, FileText, CheckCircle, XCircle, Plus, Trash2, Send, Mail, MapPin, DollarSign } from 'lucide-react'

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('jobs') // 'jobs' | 'applicants' | 'post-job'

  // Job form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [locationType, setLocationType] = useState('onsite')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('full_time')
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(false)

  // Fetch recruiter data
  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        API.get('jobs/?my_postings=true'),
        API.get('applications/'),
      ])
      setJobs(jobsRes.data)
      setApplications(appsRes.data)
    } catch (err) {
      console.error('Failed to load recruiter data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle job deletion
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This will delete all its applications.')) return
    try {
      await API.delete(`jobs/${id}/`)
      setJobs((prev) => prev.filter((j) => j.id !== id))
      setApplications((prev) => prev.filter((app) => app.job !== id))
    } catch (err) {
      console.error('Failed to delete job', err)
    }
  }

  // Handle application status update
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await API.patch(`applications/${appId}/`, { status: newStatus })
      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: res.data.status } : app))
      )
    } catch (err) {
      console.error('Failed to update application status', err)
    }
  }

  // Handle job posting form submit
  const handlePostJob = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(false)

    const payload = {
      title,
      description,
      requirements,
      salary_min: parseFloat(salaryMin),
      salary_max: parseFloat(salaryMax),
      location_type: locationType,
      location,
      job_type: jobType,
    }

    try {
      const res = await API.post('jobs/', payload)
      setJobs((prev) => [res.data, ...prev])
      setFormSuccess(true)
      
      // Reset form
      setTitle('')
      setDescription('')
      setRequirements('')
      setSalaryMin('')
      setSalaryMax('')
      setLocation('')
      
      // Navigate to jobs tab after delay
      setTimeout(() => {
        setActiveTab('jobs')
        setFormSuccess(false)
      }, 1000)
    } catch (err) {
      setFormError(err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to post job')
    }
  }

  // Stats
  const totalJobs = jobs.length
  const totalApplicants = applications.length
  const totalShortlisted = applications.filter((app) => app.status === 'shortlisted').length

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Recruiter Control Center
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Manage your active listings and evaluate incoming applicants in real time
            </p>
          </div>
          
          <button
            onClick={() => setActiveTab('post-job')}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <Plus className="h-4 w-4" />
            <span>Post a New Job</span>
          </button>
        </div>

        {loading ? (
          <SkeletonLoader type="dashboard" />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex items-center space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Active Listings</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalJobs}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Applicants</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalApplicants}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Shortlisted</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalShortlisted}</p>
                </div>
              </div>
            </div>

            {/* Tabs Control */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
                    activeTab === 'jobs'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                      : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                  }`}
                >
                  Manage Jobs ({totalJobs})
                </button>
                <button
                  onClick={() => setActiveTab('applicants')}
                  className={`border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
                    activeTab === 'applicants'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                      : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                  }`}
                >
                  Manage Applicants ({totalApplicants})
                </button>
                <button
                  onClick={() => setActiveTab('post-job')}
                  className={`border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
                    activeTab === 'post-job'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                      : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                  }`}
                >
                  Post a Job
                </button>
              </nav>
            </div>

            {/* Tab: Jobs */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
                    <Briefcase className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
                    <p className="text-sm font-semibold text-neutral-800 dark:text-white">No jobs posted yet</p>
                    <p className="text-xs text-neutral-500">Post your first listing to start hiring!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#0F0F12]">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col justify-between p-5 sm:flex-row sm:items-center"
                      >
                        <div className="space-y-1 mb-4 sm:mb-0">
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-xs text-neutral-500">
                            <span className="capitalize">{job.job_type?.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>
                              ${parseFloat(job.salary_min).toLocaleString()} - ${parseFloat(job.salary_max).toLocaleString()}/yr
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-red-600 dark:hover:bg-neutral-800"
                            aria-label="Delete job"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Applicants */}
            {activeTab === 'applicants' && (
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
                    <Users className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
                    <p className="text-sm font-semibold text-neutral-800 dark:text-white">No applicants yet</p>
                    <p className="text-xs text-neutral-500">Applicants will appear here in real time as they apply.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]"
                      >
                        <div className="flex flex-col justify-between sm:flex-row sm:items-start pb-4 border-b border-neutral-100 dark:border-neutral-800 gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                                {app.candidate_details?.full_name || app.candidate_details?.username}
                              </h3>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(app.status)}`}>
                                {app.status?.toUpperCase()}
                              </span>
                            </div>
                            
                            <p className="text-xs text-neutral-500">
                              Applied for: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{app.job_details?.title}</span>
                            </p>
                            
                            <div className="flex items-center space-x-3 text-[11px] text-neutral-400">
                              <span className="flex items-center space-x-0.5">
                                <Mail className="h-3 w-3" />
                                <span>{app.candidate_details?.email}</span>
                              </span>
                              {app.candidate_details?.github && (
                                <a href={app.candidate_details.github} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500">GitHub</a>
                              )}
                              {app.candidate_details?.linkedin && (
                                <a href={app.candidate_details.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500">LinkedIn</a>
                              )}
                            </div>
                          </div>

                          {/* Quick decision actions */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                              disabled={app.status === 'shortlisted'}
                              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-indigo-50 hover:text-indigo-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-indigo-950/20 disabled:opacity-40"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'hired')}
                              disabled={app.status === 'hired'}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
                            >
                              Hire
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              disabled={app.status === 'rejected'}
                              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-red-50 hover:text-red-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-red-950/20 disabled:opacity-40"
                            >
                              Reject
                            </button>
                          </div>
                        </div>

                        {/* Extra details (Skills & Resume) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                          <div className="space-y-2">
                            <p className="font-semibold text-neutral-700 dark:text-neutral-300">Candidate Summary</p>
                            <p className="text-neutral-500 leading-relaxed font-sans whitespace-pre-line">
                              {app.candidate_details?.experience || 'No experience details specified.'}
                            </p>
                            <p className="text-neutral-400">
                              <span className="font-semibold text-neutral-600 dark:text-neutral-400">Skills:</span> {app.candidate_details?.skills || 'None'}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="font-semibold text-neutral-700 dark:text-neutral-300">Cover Letter</p>
                            <p className="text-neutral-500 leading-relaxed font-sans italic bg-neutral-50/50 p-3 rounded-xl border border-neutral-100 dark:bg-neutral-900/10 dark:border-neutral-900">
                              "{app.cover_letter || 'No cover letter provided.'}"
                            </p>
                            {app.resume_url && (
                              <div className="pt-2">
                                <a
                                  href={app.resume_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>View Resume PDF</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Post Job */}
            {activeTab === 'post-job' && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
                <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                  Post a New Job Listing
                </h2>

                {formSuccess && (
                  <div className="mb-4 rounded-xl bg-emerald-50/50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                    Job posted successfully! Redirecting...
                  </div>
                )}

                {formError && (
                  <div className="mb-4 rounded-xl bg-red-50/50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
                    {formError}
                  </div>
                )}

                <form onSubmit={handlePostJob} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Job Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Job Title</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                        placeholder="e.g. Senior Frontend Architect"
                      />
                    </div>

                    {/* Job Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Job Type</label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-indigo-500 dark:border-neutral-800 dark:text-white"
                      >
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Location Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Location Type</label>
                      <select
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-indigo-500 dark:border-neutral-800 dark:text-white"
                      >
                        <option value="onsite">On-site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    {/* Location Name */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Location</label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                        placeholder="e.g. San Francisco, CA or Remote"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Salary Min */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Min Salary ($)</label>
                      <input
                        type="number"
                        required
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                        placeholder="e.g. 90000"
                      />
                    </div>

                    {/* Salary Max */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Max Salary ($)</label>
                      <input
                        type="number"
                        required
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                        placeholder="e.g. 130000"
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Requirements (separated by lines)</label>
                    <textarea
                      required
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                      placeholder="e.g.&#10;5+ years of React development&#10;Proficiency in TailwindCSS and Framer Motion"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Job Description</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                      placeholder="Explain the role, day-to-day responsibilities, and team layout..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    <Send className="h-4 w-4" />
                    <span>Publish Job Listing</span>
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
