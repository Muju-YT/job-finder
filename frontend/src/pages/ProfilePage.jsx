import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import API from '../services/api'
import { User, Building, FileText, Send, Mail, Briefcase, Plus, Link as LinkIcon, Globe, Image } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useNotification()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Candidate states
  const [fullName, setFullName] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)

  // Recruiter states
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [logoFile, setLogoFile] = useState(null)

  // Load profile values on mount
  useEffect(() => {
    if (user) {
      if (user.role === 'candidate') {
        const p = user.profile || {}
        setFullName(p.full_name || '')
        setSkills(p.skills || '')
        setExperience(p.experience || '')
        setEducation(p.education || '')
        setGithub(p.github || '')
        setLinkedin(p.linkedin || '')
      } else {
        const p = user.profile || {}
        setCompanyName(p.company_name || '')
        setCompanyDescription(p.company_description || '')
        setWebsite(p.website || '')
      }
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Using FormData to support image & resume file uploads
    const formData = new FormData()
    if (user.role === 'candidate') {
      formData.append('full_name', fullName)
      formData.append('skills', skills)
      formData.append('experience', experience)
      formData.append('education', education)
      if (github) formData.append('github', github)
      if (linkedin) formData.append('linkedin', linkedin)
      if (avatarFile) formData.append('avatar', avatarFile)
      if (resumeFile) formData.append('resume', resumeFile)
    } else {
      formData.append('company_name', companyName)
      formData.append('company_description', companyDescription)
      if (website) formData.append('website', website)
      if (logoFile) formData.append('company_logo', logoFile)
    }

    try {
      const res = await API.put('profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      // Update AuthContext user state locally
      updateProfile(res.data)
      showToast('Profile Updated!', 'Your profile details have been successfully saved.', 'success')
    } catch (err) {
      console.error(err)
      setError(err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Account Profile Settings
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Build and optimize your candidate or recruiter credentials
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50/50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. File Upload section */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              {user.role === 'candidate' ? (
                <>
                  {user.profile?.avatar_url ? (
                    <img
                      src={user.profile.avatar_url}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-800"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">Profile Picture</label>
                    <label className="flex cursor-pointer items-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300">
                      <Image className="h-3.5 w-3.5" />
                      <span>Upload Avatar</span>
                      <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} className="hidden" />
                    </label>
                    <span className="text-[10px] text-neutral-500 truncate block">
                      {avatarFile ? avatarFile.name : ""}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {user.profile?.company_logo_url ? (
                    <img
                      src={user.profile.company_logo_url}
                      alt="Logo"
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-800"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      <Building className="h-8 w-8" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">Company Logo</label>
                    <label className="flex cursor-pointer items-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300">
                      <Image className="h-3.5 w-3.5" />
                      <span>Upload Logo</span>
                      <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="hidden" />
                    </label>
                    <span className="text-[10px] text-neutral-500 truncate block">
                      {logoFile ? logoFile.name : ""}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 2. Text fields - Candidate specific */}
            {user.role === 'candidate' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Key Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                      placeholder="e.g. React, Python, Django, PostgreSQL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">GitHub Link</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                        <Globe className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">LinkedIn Link</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                        <LinkIcon className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Education Details</label>
                  <textarea
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                    placeholder="e.g. BS in Computer Science from MIT"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Work Experience Summary</label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                    placeholder="e.g. Senior Software Architect at Google (3 years)&#10;Frontend lead at Stripe (2 years)"
                  />
                </div>

                {/* Resume Upload PDF */}
                <div className="space-y-1.5 pt-4">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Upload Default PDF Resume</label>
                  <div className="flex items-center space-x-3">
                    <label className="flex cursor-pointer items-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300">
                      <FileText className="h-4 w-4 text-neutral-500" />
                      <span>Choose PDF File</span>
                      <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} className="hidden" />
                    </label>
                    <span className="text-xs text-neutral-500 truncate max-w-xs">
                      {resumeFile ? resumeFile.name : user.profile?.resume_url ? "Resume uploaded already" : "No resume uploaded"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Text fields - Recruiter specific */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                      placeholder="e.g. Vercel Inc"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Company Website</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                        <Globe className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent py-2.5 pl-10 pr-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                        placeholder="https://vercel.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Company Description</label>
                  <textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={5}
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:text-white"
                    placeholder="Describe your company, key services, and engineering culture..."
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? "Saving settings..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
