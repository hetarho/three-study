import * as React from 'react'

interface LessonLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function LessonLayout({ title, description, children }: LessonLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-2 text-gray-600">{description}</p>}
      </div>
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
