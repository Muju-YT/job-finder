import React from 'react'

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count })

  const renderSkeleton = () => {
    switch (type) {
      case 'detail':
        return (
          <div className="animate-pulse space-y-6 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#0F0F12]">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>
            <hr className="border-neutral-200 dark:border-neutral-800" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-10 w-1/3 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        )
      case 'dashboard':
        return (
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="h-8 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="space-y-4">
              <div className="h-20 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-20 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        )
      case 'card':
      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#0F0F12]"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                </div>
                <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex space-x-2 pt-2">
                  <div className="h-6 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-6 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        )
    }
  }

  return renderSkeleton()
}
