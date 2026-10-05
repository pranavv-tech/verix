import { Zap, Menu, X, LogOut, ChevronDown, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { Page } from '../App'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const NAV_ITEMS: { label: string; page: Page; authOnly?: boolean }[] = [
  { label: 'Home', page: 'landing' },
  { label: 'About', page: 'about' },
  { label: 'GitHub', page: 'github-verify' },
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Interview', page: 'interview', authOnly: true },
]

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user, isLoggedIn, logout } = useAuth()

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const nav = (page: Page) => { onNavigate(page); setMobileOpen(false); setProfileOpen(false) }

  const initials = user
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => nav('landing')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Verix</span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.filter((item) => !item.authOnly || isLoggedIn).map((item) => (
            <button
              key={item.page}
              onClick={() => nav(item.page)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.page
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.page === 'interview' && <Sparkles className="w-3.5 h-3.5" />}
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn && user ? (
            /* Logged-in profile dropdown */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Verified member</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { label: 'Dashboard', page: 'dashboard' as Page },
                      { label: 'Upload Resume', page: 'upload' as Page },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => nav(item.page)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={() => { logout(); nav('landing') }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out auth buttons */
            <>
              <button
                onClick={() => nav('signin')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => nav('signup')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-md hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-2 space-y-1">
          {isLoggedIn && user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          )}
          {NAV_ITEMS.filter((item) => !item.authOnly || isLoggedIn).map((item) => (
            <button
              key={item.page}
              onClick={() => nav(item.page)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                currentPage === item.page ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.page === 'interview' && <Sparkles className="w-3.5 h-3.5" />}
              {item.label}
            </button>
          ))}
          <div className="flex gap-2 pt-2">
            {isLoggedIn ? (
              <button
                onClick={() => { logout(); nav('landing') }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-red-200 text-red-600 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <>
                <button onClick={() => nav('signin')} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700">Login</button>
                <button onClick={() => nav('signup')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
