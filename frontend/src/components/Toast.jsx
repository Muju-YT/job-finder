import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNotification } from '../context/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { Bell, Briefcase, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

export default function Toast() {
  const { toast } = useNotification()
  const navigate = useNavigate()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-indigo-500" />
    }
  }

  const handleToastClick = () => {
    if (toast?.actionData?.id) {
      // If it's a job toast, navigate to job detail
      navigate(`/jobs/${toast.actionData.id}`)
    } else if (toast?.title?.includes('Application')) {
      // If it's application status or request, navigate to applications
      navigate('/applications')
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm px-4 sm:px-0">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={handleToastClick}
            className="flex cursor-pointer items-start space-x-3 rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-[#0F0F12]/95 dark:hover:bg-[#14141A]"
          >
            <div className="mt-0.5 flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                {toast.title}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                {toast.message}
              </p>
              {toast.actionData && (
                <span className="inline-block text-[10px] font-semibold text-indigo-500 dark:text-indigo-400">
                  Click to view details
                </span>
              )}
            </div>

            {/* Simple dot to indicate new / interactive item */}
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-dot mt-1.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
