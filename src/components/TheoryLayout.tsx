import * as React from 'react'
import { Link } from '@tanstack/react-router'

interface TheoryLayoutProps {
  title: string
  children: React.ReactNode
  prevLink?: string
  nextLink?: string
}

export function TheoryLayout({ title, children, prevLink, nextLink }: TheoryLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full bg-white text-black overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full px-4 py-8 md:px-8 md:py-12">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight mb-2">{title}</h1>
        </header>
        
        <article className="prose prose-lg prose-slate max-w-none prose-headings:text-black prose-p:text-black prose-strong:text-black prose-li:text-black prose-blockquote:text-black prose-th:text-black prose-td:text-black prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
          {children}
        </article>

        <footer className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
          {prevLink ? (
            <Link to={prevLink} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              ← 이전 글
            </Link>
          ) : (
            <div />
          )}
          
          {nextLink ? (
            <Link to={nextLink} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              다음 글 →
            </Link>
          ) : (
            <div />
          )}
        </footer>
      </div>
    </div>
  )
}
