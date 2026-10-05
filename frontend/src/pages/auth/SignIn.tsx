import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Zap, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { Page } from '../../App'

interface SignInProps {
  onNavigate: (page: Page) => void
}

export default function SignIn({ onNavigate }: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError('')
    setLoading(true)

    const result = await login(
      email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      password,
    )

    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Unable to sign in. Please try again.')
      return
    }

    onNavigate('dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 overflow-hidden">
        {/* Mesh backdrop */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #a78bfa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #818cf8 0%, transparent 40%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Verix</span>
        </div>

        {/* Center illustration */}
        <div className="relative flex-1 flex items-center justify-center py-12">
          <AuthIllustration />
        </div>

        {/* Bottom copy */}
        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">Welcome Back</h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-sm">
            Sign in to verify resumes, analyze GitHub profiles, and generate Skill Verification Scores.
          </p>
          <div className="flex items-center gap-6 mt-6">
            {[
              { value: '12k+', label: 'Resumes verified' },
              { value: '98%', label: 'Accuracy' },
              { value: '2.4s', label: 'Avg. time' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-white font-bold">{s.value}</div>
                <div className="text-indigo-300 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-between bg-[#F8FAFC]">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 p-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900">Verix</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h1>
              <p className="text-sm text-slate-500">Enter your credentials to access your dashboard.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput
                id="email" label="Email Address" type="email"
                value={email} onChange={setEmail}
                icon={<Mail className="w-4 h-4" />}
              />
              <div className="relative">
                <FloatingInput
                  id="password" label="Password"
                  type={showPass ? 'text' : 'password'}
                  value={password} onChange={setPassword}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${remember ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}
                  >
                    {remember && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <Divider />

            <div className="space-y-3">
              <SocialButton provider="google" label="Continue with Google" />
              <SocialButton provider="github" label="Continue with GitHub" />
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              {"Don't have an account? "}
              <button onClick={() => onNavigate('signup')} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Create Account
              </button>
            </p>
          </div>
        </div>

        <footer className="px-6 py-4 text-center text-xs text-slate-400">
          © 2026 Verix. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

/* ── Shared sub-components ── */

export function FloatingInput({
  id, label, type, value, onChange, icon,
}: {
  id: string; label: string; type: string; value: string
  onChange: (v: string) => void; icon?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const raised = focused || value.length > 0
  return (
    <div className="relative">
      <div className={`flex items-center bg-white border rounded-xl px-3 transition-all ${focused ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
        {icon && <span className={`mr-2 flex-shrink-0 transition-colors ${focused ? 'text-indigo-500' : 'text-slate-400'}`}>{icon}</span>}
        <div className="relative flex-1 py-3">
          <label
            htmlFor={id}
            className={`absolute left-0 transition-all pointer-events-none ${raised ? 'text-[10px] top-1 text-indigo-500 font-medium' : 'text-sm top-1/2 -translate-y-1/2 text-slate-400'}`}
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-transparent outline-none text-sm text-slate-900 ${raised ? 'pt-3' : 'pt-0'}`}
            autoComplete={type === 'password' ? 'current-password' : 'email'}
          />
        </div>
      </div>
    </div>
  )
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs font-medium text-slate-400">OR</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

export function SocialButton({ provider, label }: { provider: 'google' | 'github'; label: string }) {
  return (
    <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium text-sm py-2.5 rounded-xl hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all">
      {provider === 'google' ? <GoogleIcon /> : <GitHubIcon />}
      {label}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function AuthIllustration() {
  return (
    <div className="relative w-72 h-72">
      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg z-10">
        <Zap className="w-7 h-7 text-white" />
      </div>

      {/* Orbit ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-white/15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-white/10" />

      {/* Skill bubbles */}
      {[
        { label: 'Python', color: '#3B82F6', top: '2%', left: '50%', tx: '-50%' },
        { label: 'React', color: '#06B6D4', top: '30%', left: '90%', tx: '-100%' },
        { label: 'FastAPI', color: '#10B981', top: '70%', left: '88%', tx: '-100%' },
        { label: 'SQL', color: '#F59E0B', top: '85%', left: '50%', tx: '-50%' },
        { label: 'Java', color: '#EF4444', top: '65%', left: '5%', tx: '0' },
        { label: 'Docker', color: '#8B5CF6', top: '25%', left: '5%', tx: '0' },
      ].map((bubble) => (
        <div
          key={bubble.label}
          className="absolute flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5 shadow-md"
          style={{ top: bubble.top, left: bubble.left, transform: `translateX(${bubble.tx})` }}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: bubble.color }} />
          <span className="text-xs font-semibold text-white whitespace-nowrap">{bubble.label}</span>
        </div>
      ))}

      {/* Connector lines (subtle) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288" fill="none">
        {[
          [144, 10, 144, 118],
          [260, 92, 180, 134],
          [252, 198, 192, 154],
          [144, 250, 144, 170],
          [36, 190, 104, 154],
          [36, 86, 104, 130],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
        ))}
      </svg>

      {/* Verified badge */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-emerald-500 rounded-full px-3 py-1.5 shadow-lg">
        <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
        <span className="text-xs font-bold text-white">Verified</span>
      </div>
    </div>
  )
}
