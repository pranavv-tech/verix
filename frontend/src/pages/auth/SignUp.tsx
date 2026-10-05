import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader2, User, AlertCircle, CheckCircle2, Zap, ChevronDown, Shield } from 'lucide-react'
import { FloatingInput, Divider, SocialButton } from './SignIn'
import { useAuth } from '../../context/AuthContext'
import type { Page } from '../../App'

interface SignUpProps {
  onNavigate: (page: Page) => void
}

const ROLES = ['Student', 'Recruiter', 'Hiring Manager', 'Developer']

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Symbol', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score] : 'bg-slate-100'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {checks.map((c) => (
            <div key={c.label} className={`flex items-center gap-1 text-[10px] font-medium ${c.pass ? 'text-emerald-600' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-2.5 h-2.5" />
              {c.label}
            </div>
          ))}
        </div>
        <span className={`text-[10px] font-bold ${colors[score].replace('bg-', 'text-')}`}>{labels[score]}</span>
      </div>
    </div>
  )
}

export default function SignUp({ onNavigate }: SignUpProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirm || !role) { setError('Please fill in all fields.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!agreed) { setError('Please accept the Terms & Conditions.'); return }
    setError('')
    setLoading(true)

    const result = await signup(name, email, password, role)
    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Unable to create your account. Please try again.')
      return
    }

    if (result.requiresConfirmation) {
      onNavigate('email-verify')
      return
    }

    onNavigate('dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] relative bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-600 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 70% 30%, #c4b5fd 0%, transparent 50%), radial-gradient(circle at 20% 80%, #818cf8 0%, transparent 40%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Verix</span>
        </div>

        <div className="relative flex-1 flex items-center justify-center py-10">
          <SignUpIllustration />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">Join Verix</h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
            Create your account and start verifying technical skills with real project evidence.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {['Resume Parsing', 'GitHub Analysis', 'Skill Scoring', 'AI Insights'].map((tag) => (
              <span key={tag} className="text-xs font-medium bg-white/15 border border-white/20 text-white rounded-full px-3 py-1">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-between bg-[#F8FAFC] overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2 p-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900">Verix</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Your Account</h1>
              <p className="text-sm text-slate-500">Start verifying skills in minutes.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput id="name" label="Full Name" type="text" value={name} onChange={setName}
                icon={<User className="w-4 h-4" />} />

              <FloatingInput id="email-su" label="Email Address" type="email" value={email} onChange={setEmail}
                icon={<Mail className="w-4 h-4" />} />

              <div>
                <div className="relative">
                  <FloatingInput id="password-su" label="Password" type={showPass ? 'text' : 'password'}
                    value={password} onChange={setPassword} icon={<Lock className="w-4 h-4" />} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="relative">
                <FloatingInput id="confirm" label="Confirm Password" type={showConfirm ? 'text' : 'password'}
                  value={confirm} onChange={setConfirm} icon={<Lock className="w-4 h-4" />} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {confirm && password !== confirm && (
                  <p className="text-xs text-red-500 mt-1 ml-1">Passwords do not match</p>
                )}
              </div>

              {/* Role select */}
              <div className="relative">
                <div className={`flex items-center bg-white border rounded-xl px-3 transition-all ${role ? 'border-indigo-300' : 'border-slate-200 hover:border-slate-300'}`}>
                  <Shield className={`w-4 h-4 mr-2 flex-shrink-0 ${role ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <div className="relative flex-1 py-3">
                    {!role && <span className="text-sm text-slate-400 absolute top-1/2 -translate-y-1/2">Role</span>}
                    {role && <span className="text-[10px] absolute top-1 text-indigo-500 font-medium">Role</span>}
                    <select
                      value={role} onChange={(e) => setRole(e.target.value)}
                      className={`w-full bg-transparent outline-none text-sm text-slate-900 appearance-none ${role ? 'pt-3' : 'pt-0 opacity-0'}`}
                    >
                      <option value="" disabled />
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {!role && (
                      <select
                        value={role} onChange={(e) => setRole(e.target.value)}
                        className="absolute inset-0 w-full bg-transparent outline-none text-sm text-slate-900 appearance-none opacity-0 cursor-pointer"
                      >
                        <option value="" disabled />
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}
                >
                  {agreed && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="font-semibold text-indigo-600 hover:underline">Terms & Conditions</button>
                  {' '}and{' '}
                  <button type="button" className="font-semibold text-indigo-600 hover:underline">Privacy Policy</button>
                </span>
              </label>

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
              </button>
            </form>

            <Divider />

            <div className="space-y-3">
              <SocialButton provider="google" label="Sign up with Google" />
              <SocialButton provider="github" label="Sign up with GitHub" />
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <button onClick={() => onNavigate('signin')} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign In
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

function SignUpIllustration() {
  return (
    <div className="relative w-64 h-64">
      {/* Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-24 bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-lg z-10">
        <div className="w-8 h-1 rounded-full bg-white/60" />
        <div className="w-10 h-1 rounded-full bg-white/40" />
        <div className="w-8 h-1 rounded-full bg-white/40" />
        <div className="w-6 h-1 rounded-full bg-white/30" />
        <div className="w-10 h-1 rounded-full bg-white/40" />
        <div className="w-8 h-1 rounded-full bg-white/30" />
        <span className="text-[9px] font-bold text-white/70 mt-1 uppercase tracking-wide">Resume</span>
      </div>

      {/* Orbit */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/15" />

      {/* Floating cards */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/15 border border-white/25 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
        <div className="text-[10px] font-bold text-white">Upload</div>
        <div className="text-[9px] text-indigo-200">PDF Resume</div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 bg-white/15 border border-white/25 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
        <div className="text-[10px] font-bold text-white">GitHub</div>
        <div className="text-[9px] text-indigo-200">Analysis</div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500/80 border border-emerald-400/50 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
        <div className="text-[10px] font-bold text-white">✓ Verified</div>
        <div className="text-[9px] text-emerald-100">Skills</div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-2 bg-white/15 border border-white/25 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
        <div className="text-[10px] font-bold text-white">AI</div>
        <div className="text-[9px] text-indigo-200">Insights</div>
      </div>
    </div>
  )
}
