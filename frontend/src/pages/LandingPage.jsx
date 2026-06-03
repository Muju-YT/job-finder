import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Briefcase, Users, Zap, CheckCircle } from 'lucide-react'
import API from '../services/api'
import JobCard from '../components/JobCard'

export default function LandingPage() {
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await API.get('jobs/?limit=3')
        // Take the top 3 jobs
        setRecentJobs(res.data.slice(0, 3))
      } catch (err) {
        console.error('Error fetching landing page jobs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecentJobs()
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients for modern Linear/Notion feel */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent dark:from-indigo-500/5" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="text-center space-y-8">
          <div className="mx-auto flex max-w-fit items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-3.5 py-1.5 dark:border-indigo-950 dark:bg-indigo-950/20">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-dot" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Introducing JobNova v1.0
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.1]">
            Find the next <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">perfect role</span>
            <br />
            in real time.
          </h1>

          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            A beautiful, lightning-fast SaaS job matching platform. Track applications, receive live status updates, and post listings with zero delay.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link
              to="/jobs"
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:shadow-none"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="rounded-xl border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-[#0F0F12] dark:text-neutral-300 dark:hover:bg-neutral-800/50"
            >
              Register Account
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="mx-auto max-w-7xl border-t border-neutral-200 px-4 py-16 dark:border-neutral-800 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-neutral-100 bg-white/50 p-6 dark:border-neutral-900 dark:bg-[#0A0A0C]/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Real-Time Syncing</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Built on Django Channels and WebSockets. Receive hiring alerts, applicant lists, and new listings instantly.
            </p>
          </div>
          
          <div className="space-y-3 rounded-2xl border border-neutral-100 bg-white/50 p-6 dark:border-neutral-900 dark:bg-[#0A0A0C]/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">SaaS-Level UI/UX</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Elegant Notion/Linear dark theme, responsive layouts, micro-animations, and smooth skeleton loader overlays.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-neutral-100 bg-white/50 p-6 dark:border-neutral-900 dark:bg-[#0A0A0C]/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Role-Based Accounts</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Candidates build dynamic profiles and upload PDF resumes. Recruiters gain full application management dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="mx-auto max-w-7xl border-t border-neutral-200 px-4 py-16 dark:border-neutral-800 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Featured Job Openings
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Get hired at world-class internet companies.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Browse all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-44 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-44 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-44 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-500 dark:border-neutral-800">
            No active job postings found. Post a job to get started!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
