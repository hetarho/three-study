import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

const practiceLessons = [
  { path: '/lesson/01-basic-scene', title: '01. 기본 장면 (Basic Scene)' },
  { path: '/lesson/02-geometries', title: '02. 기하학 (Geometries)' },
  { path: '/lesson/03-materials', title: '03. 재질 (Materials)' },
  { path: '/lesson/04-textures', title: '04. 텍스처 (Textures)' },
  { path: '/lesson/05-transformations', title: '05. 변환 (Transformations)' },
  { path: '/lesson/06-lights', title: '06. 조명 (Lights)' },
  { path: '/lesson/07-shadows', title: '07. 그림자 (Shadows)' },
  { path: '/lesson/08-cameras', title: '08. 카메라 (Cameras)' },
  { path: '/lesson/09-controls', title: '09. 컨트롤 (Controls)' },
  { path: '/lesson/10-environment', title: '10. 환경 맵 (Environment)' },
  { path: '/lesson/11-loading-models', title: '11. 모델 로딩 (Loading Models)' },
  { path: '/lesson/12-particles', title: '12. 입자 (Particles)' },
  { path: '/lesson/13-events', title: '13. 이벤트 (Events)' },
  { path: '/lesson/14-text', title: '14. 텍스트 (Text)' },
  { path: '/lesson/15-post-processing', title: '15. 후처리 (Post Processing)' },
]

const theoryLessons = [
  { path: '/theory/01-webgl-fundamentals', title: '01. WebGL 기초 (Fundamentals)' },
  { path: '/theory/02-scene-graph', title: '02. 씬 그래프 (Scene Graph)' },
  { path: '/theory/03-buffer-geometry', title: '03. 기하학 심화 (BufferGeometry)' },
  { path: '/theory/04-materials-shaders', title: '04. 재질과 쉐이더 (Shaders)' },
  { path: '/theory/05-r3f-internals', title: '05. R3F 내부 구조 (Internals)' },
  { path: '/theory/06-performance', title: '06. 성능 최적화 (Performance)' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Toggle Button (Fixed) */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white shadow-lg md:hidden ${isOpen ? 'hidden' : 'block'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Container */}
      <nav
        className={`
          bg-gray-900 text-white h-screen overflow-y-auto flex-shrink-0 transition-all duration-300 ease-in-out
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 shadow-2xl' : 'relative'}
          ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
        `}
      >
        <div className="p-4 w-64"> {/* Fixed width inner container to prevent text wrapping during transition */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-blue-400">Three.js Learning</h1>
            {/* Close Button (Mobile & Desktop) */}
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-8">
            <Link
              to="/"
              className="block p-2 rounded hover:bg-gray-800 transition-colors mb-4"
              activeProps={{ className: 'bg-gray-800 text-blue-300 font-medium' }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-3 px-2">
              이론 (Theory)
            </h2>
            <ul className="space-y-1">
              {theoryLessons.map((lesson) => (
                <li key={lesson.path}>
                  <Link
                    to={lesson.path}
                    className="block p-2 rounded hover:bg-gray-800 transition-colors text-sm"
                    activeProps={{ className: 'bg-gray-800 text-blue-300 font-medium' }}
                    onClick={() => isMobile && setIsOpen(false)} // Close on mobile click
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-3 px-2">
              실습 (Practice)
            </h2>
            <ul className="space-y-1">
              {practiceLessons.map((lesson) => (
                <li key={lesson.path}>
                  <Link
                    to={lesson.path}
                    className="block p-2 rounded hover:bg-gray-800 transition-colors text-sm"
                    activeProps={{ className: 'bg-gray-800 text-blue-300 font-medium' }}
                    onClick={() => isMobile && setIsOpen(false)} // Close on mobile click
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Desktop Toggle Button (Visible when closed) */}
      {!isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-30 p-2 rounded-md bg-gray-900 text-white shadow-lg hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
