import React, { useEffect, useState } from 'react'
import API from '../services/api'
import JobCard from '../components/JobCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { useNotification } from '../context/NotificationContext'
import { Search, MapPin, DollarSign, Filter, RefreshCw, X, Briefcase } from 'lucide-react'

export default function JobListingPage() {
  const { registerLiveListener } = useNotification()
  
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [search, setSearch] = useState('')
  const [locationType, setLocationType] = useState('')
  const [jobType, setJobType] = useState('')
  const [location, setLocation] = useState('')
  const [minSalary, setMinSalary] = useState('')

  // Fetch jobs from backend
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (locationType) params.location_type = locationType
      if (jobType) params.job_type = jobType
      if (location) params.location = location
      if (minSalary) params.min_salary = minSalary

      const res = await API.get('jobs/', { params })
      setJobs(res.data)
    } catch (err) {
      console.error('Failed to load jobs list', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [locationType, jobType, location, minSalary]) // Fetch automatically on select changes

  // Hook up real-time live updates!
  useEffect(() => {
    const unsubscribe = registerLiveListener((newJob) => {
      // Real-time addition of newly posted job listings
      setJobs((prev) => {
        // Prevent duplicate if already in state
        if (prev.some((j) => j.id === newJob.id)) return prev
        return [newJob, ...prev]
      })
    })
    return () => unsubscribe()
  }, [registerLiveListener])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleResetFilters = () => {
    setSearch('')
    setLocationType('')
    setJobType('')
    setLocation('')
    setMinSalary('')
    // Clear and refetch
    setTimeout(() => {
      fetchJobs()
    }, 0)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between md:flex-row md:items-end gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Browse Job Openings
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Explore listings that update automatically in real time
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-dot" />
            <span>Listening for live updates...</span>
          </div>
        </div>

        {/* Search Bar & Primary Filters */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent py-2 pl-9 pr-4 text-xs text-neutral-900 outline-none transition focus:border-indigo-500 dark:border-neutral-800 dark:text-white"
              placeholder="Search title, skills..."
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              <MapPin className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent py-2 pl-9 pr-4 text-xs text-neutral-900 outline-none transition focus:border-indigo-500 dark:border-neutral-800 dark:text-white"
              placeholder="City or 'Remote'..."
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Filter Openings
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            <span>Reset Search</span>
          </button>
        </form>

        {/* Sidebar + Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12] h-fit">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <span className="font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </span>
            </div>

            {/* Location Type Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Location Type</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-neutral-800 dark:text-neutral-200"
              >
                <option value="">All Arrangements</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Employment Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-neutral-800 dark:text-neutral-200"
              >
                <option value="">All Employment</option>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            {/* Min Salary Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Min Annual Salary ($)</label>
              <select
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-neutral-800 dark:text-neutral-200"
              >
                <option value="">Any Base</option>
                <option value="40000">$40k+</option>
                <option value="80000">$80k+</option>
                <option value="120000">$120k+</option>
                <option value="150000">$150k+</option>
              </select>
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <SkeletonLoader type="card" count={3} />
            ) : jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 py-20 text-center dark:border-neutral-800">
                <Briefcase className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-white">No jobs match your query</p>
                <p className="text-xs text-neutral-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
