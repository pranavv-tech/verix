import { useState } from 'react'
import { ArrowLeft, RefreshCw, Mail, CheckCircle2, ExternalLink, Zap } from 'lucide-react'

type Page = 'landing' | 'upload' | 'loading' | 'dashboard' | 'signin' | 'signup' | 'forgot-password' | 'email-verify'

interface EmailVerificationProps {
  onNavigate: (page: Page) => void
}

export default function EmailVerification({ onNavigate }: EmailVerificationProps) {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = () => {
    setResending(true)
    setResent(false)
    setTimeout(() => { setResending(false); setResent(true) }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">Verix</span>
      </div>

      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

          <div className="p-8 text-center">
            {/* Envelope illustration */}
            <div className="relative w-24 h-24 mx-auto mb-7">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-indigo-100/70 scale-110" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 flex items-center justify-center">
                <EnvelopeIllustration />
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3">Verify Your Email</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-1">
              {"We've sent a verification link to your email."}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Please verify your account before signing in.
            </p>

            {/* Email hint */}
            <div className="mt-5 mb-6 mx-auto max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700 truncate">aria.nakamura@example.com</span>
            </div>

            {/* Steps */}
            <div className="text-left bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 space-y-2">
              {[
                'Check your inbox for the verification email',
                'Click the verification link in the email',
                'You\'ll be redirected to your dashboard',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-indigo-700">{i + 1}</span>
                  </div>
                  <span className="text-xs text-indigo-800 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            {/* Resent success */}
            {resent && (
              <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-sm text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Verification email resent successfully.
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
                onClick={() => window.open('https://mail.google.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Open Email App
              </button>

              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm py-2.5 rounded-xl hover:border-indigo-300 hover:text-indigo-700 transition-all disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Resending...' : 'Resend Email'}
              </button>

              <button
                onClick={() => onNavigate('signin')}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Spam note */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <span className="text-base flex-shrink-0">💡</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            {"Can't find the email? Check your spam or junk folder. The link expires in 24 hours."}
          </p>
        </div>
      </div>

      <footer className="mt-10 text-xs text-slate-400">© 2026 Verix. All rights reserved.</footer>
    </div>
  )
}

function EnvelopeIllustration() {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
      {/* Envelope body */}
      <rect x="2" y="6" width="44" height="30" rx="4" fill="#E0E7FF" stroke="#818CF8" strokeWidth="1.5" />
      {/* Envelope flap */}
      <path d="M2 10 L24 24 L46 10" stroke="#818CF8" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      {/* Lines suggesting content */}
      <line x1="12" y1="20" x2="22" y2="20" stroke="#A5B4FC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="25" x2="26" y2="25" stroke="#A5B4FC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
