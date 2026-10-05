import { X, ShieldCheck, Zap } from 'lucide-react'
import type { Page } from '../App'

interface AuthGateProps {
  onNavigate: (page: Page) => void
  onClose: () => void
}

export default function AuthGate({ onNavigate, onClose }: AuthGateProps) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Top gradient strip */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Login required to verify your skills.
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-7 max-w-sm mx-auto">
            Create an account or log in to upload your resume and get your skills verified using real project evidence.
          </p>

          {/* Value props */}
          <div className="flex justify-center gap-6 mb-7">
            {['Resume upload', 'GitHub analysis', 'Skill scores'].map((feat) => (
              <div key={feat} className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">{feat}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); onNavigate('signin') }}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => { onClose(); onNavigate('signup') }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
            >
              Create Account
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            Free to use · No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
