import { useState } from 'react'
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import { FloatingInput } from './SignIn'

type Page = 'landing' | 'upload' | 'loading' | 'dashboard' | 'signin' | 'signup' | 'forgot-password' | 'email-verify'

interface ForgotPasswordProps {
  onNavigate: (page: Page) => void
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email address.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1400)
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

      <div className="w-full max-w-[420px]">
        {!sent ? (
          /* ── Request form ── */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

            <div className="p-8">
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Mail className="w-7 h-7 text-indigo-600" />
              </div>

              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password</h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {"Enter your email address and we'll send you a password reset link."}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput
                  id="reset-email" label="Email Address" type="email"
                  value={email} onChange={setEmail}
                  icon={<Mail className="w-4 h-4" />}
                />
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
                </button>
              </form>

              <button
                onClick={() => onNavigate('signin')}
                className="mt-5 w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* ── Success state ── */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />

            <div className="p-8 text-center">
              {/* Success icon with rings */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
                <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Sent!</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-2">
                Password reset email sent successfully.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                We sent a reset link to{' '}
                <span className="font-semibold text-slate-700">{email}</span>.
                Check your inbox and follow the instructions.
              </p>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <p className="text-xs text-amber-700 font-medium mb-1">{"Didn't receive it?"}</p>
                <p className="text-xs text-amber-600">Check your spam folder, or try again with a different email address.</p>
              </div>

              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-5 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Resend Email
              </button>

              <button
                onClick={() => onNavigate('signin')}
                className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          Remember your password?{' '}
          <button onClick={() => onNavigate('signin')} className="text-indigo-600 font-medium hover:underline">
            Sign In
          </button>
        </p>
      </div>

      <footer className="mt-12 text-xs text-slate-400">© 2026 Verix. All rights reserved.</footer>
    </div>
  )
}
