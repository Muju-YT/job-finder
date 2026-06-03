import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, MapPin, DollarSign, Calendar, ChevronRight } from 'lucide-react'

export default function JobCard({ job }) {
  // Format salary figures
  const formatSalary = (val) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}k`
    }
    return val
  }

  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Map label classes
  const getJobTypeLabel = (type) => {
    switch (type) {
      case 'full_time':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
      case 'internship':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
      case 'contract':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
      default:
        return 'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
    }
  }

  const getJobTypeDisplay = (type) => {
    return type?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="glow-card group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 dark:border-neutral-800 dark:bg-[#0F0F12] dark:hover:border-indigo-950">
      <div className="space-y-4">
        {/* Header: Company Logo & Job Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company_name}
                className="h-12 w-12 rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Briefcase className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                {job.title}
              </h3>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {job.company_name}
              </p>
            </div>
          </div>
        </div>

        {/* Content details: tags */}
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getJobTypeLabel(job.job_type)}`}>
            {getJobTypeDisplay(job.job_type)}
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {job.location_type?.charAt(0).toUpperCase() + job.location_type?.slice(1)}
          </span>
        </div>

        {/* Meta text fields */}
        <div className="grid grid-cols-2 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center space-x-1.5 justify-self-end">
            <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              ${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}/yr
            </span>
          </div>
        </div>
      </div>

      {/* Footer view action */}
      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <div className="flex items-center space-x-1 text-[11px] text-neutral-400">
          <Calendar className="h-3 w-3" />
          <span>Posted {formatDate(job.created_at)}</span>
        </div>
        
        <Link
          to={`/jobs/${job.id}`}
          className="flex items-center space-x-0.5 text-xs font-semibold text-indigo-600 group-hover:text-indigo-500 dark:text-indigo-400 dark:group-hover:text-indigo-300"
        >
          <span>View Details</span>
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
