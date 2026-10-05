import { ArrowRight, ChevronRight, FileText, GitBranch, ShieldCheck, CheckCircle2, FileCheck, Lock } from 'lucide-react'
import type { Page } from '../App'
import { useAuth } from '../context/AuthContext'

interface LandingProps {
  onNavigate: (page: Page) => void
}

export default function Landing({ onNavigate }: LandingProps) {
  const { isLoggedIn } = useAuth()
  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 px-6">
        {/* Soft blob backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-indigo-100/60 via-purple-100/40 to-transparent blur-3xl" />
          <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-purple-100/50 blur-3xl" />
          <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-indigo-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide">AI-Powered Skill Verification</span>
            </div>

            <h1 className="text-[2.8rem] lg:text-[3.4rem] font-extrabold text-slate-900 leading-[1.07] tracking-tight mb-6">
              Skills{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                You Can Verify
              </span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-[500px]">
              Go beyond keyword matching. Verify technical skills using real GitHub evidence and AI-powered resume analysis.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('upload')}
                className="relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
              >
                Verify Resume
                {!isLoggedIn
                  ? <Lock className="w-3.5 h-3.5 opacity-80" />
                  : <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 hover:border-indigo-200 hover:text-indigo-700 transition-all"
              >
                View Dashboard
                {!isLoggedIn
                  ? <Lock className="w-3.5 h-3.5 text-slate-400" />
                  : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {!isLoggedIn && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Lock className="w-3 h-3" />
                Sign in required to access verification features
              </p>
            )}
          </div>

          {/* Right — two clean floating cards */}
          <div className="relative hidden lg:flex items-center justify-center h-[360px]">
            {/* Blur blob behind cards */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-3xl blur-2xl" />

            {/* Card 1 — Resume Upload */}
            <div className="absolute top-6 left-0 w-[220px] bg-white rounded-2xl border border-slate-200 shadow-xl p-5 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Resume Uploaded</p>
                  <p className="text-[10px] text-slate-400">aria_resume.pdf</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Python', 'React', 'FastAPI', 'SQL'].map((sk, i) => (
                  <div key={sk} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{sk}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      i < 2 ? 'bg-emerald-50 text-emerald-700' : i === 2 ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {i < 2 ? 'Verified' : i === 2 ? 'Partial' : 'Detected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 — Skill Score */}
            <div className="absolute bottom-6 right-0 w-[200px] bg-white rounded-2xl border border-slate-200 shadow-xl p-5 rotate-[2deg] hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs font-bold text-slate-900">Verification Score</p>
              </div>
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'conic-gradient(#4F46E5 0% 82%, #E0E7FF 82% 100%)',
                  padding: '6px',
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-xl font-black text-indigo-700">82%</span>
                </div>
              </div>
              <div className="flex justify-around text-center">
                <div><div className="text-sm font-bold text-emerald-600">10</div><div className="text-[10px] text-slate-500">Verified</div></div>
                <div><div className="text-sm font-bold text-amber-500">3</div><div className="text-[10px] text-slate-500">Partial</div></div>
                <div><div className="text-sm font-bold text-red-500">2</div><div className="text-[10px] text-slate-500">None</div></div>
              </div>
            </div>

            {/* Center connector */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg z-10">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 px-6 border-y border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: '📄', value: '12K+', label: 'Resumes Analyzed' },
            { emoji: '⚡', value: '2.4s', label: 'Average Analysis' },
            { emoji: '✔', value: '98%', label: 'Verification Accuracy' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
              <span className="text-2xl mb-3">{s.emoji}</span>
              <span className="text-3xl font-extrabold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{s.value}</span>
              <span className="text-sm text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need to verify skills</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">Three core capabilities that turn resume claims into verified evidence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileText className="w-5 h-5 text-indigo-600" />}
              bg="bg-indigo-50"
              title="Resume Analysis"
              description="Upload PDF resumes and automatically extract technical skills, tools, and experience with high precision."
              step="01"
            />
            <FeatureCard
              icon={<GitBranch className="w-5 h-5 text-purple-600" />}
              bg="bg-purple-50"
              title="GitHub Verification"
              description="Analyze repositories to verify claimed skills against real project activity, commit history, and languages used."
              step="02"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
              bg="bg-emerald-50"
              title="Skill Verification"
              description="Receive clear Verified, Partially Verified, and Not Verified scores backed by real evidence."
              step="03"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 text-sm">From resume upload to verified skill report in under 5 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              { n: '1', title: 'Upload Resume', desc: 'Drag and drop your PDF resume into Verix.', icon: '📄' },
              { n: '2', title: 'Extract Skills', desc: 'AI reads and identifies all claimed technical skills.', icon: '🧠' },
              { n: '3', title: 'Analyze GitHub', desc: 'We scan repositories for real project evidence.', icon: '🔍' },
              { n: '4', title: 'Generate Report', desc: 'Receive a full Skill Verification Score report.', icon: '✅' },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 relative">
                {/* Connector line */}
                {i < arr.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-gradient-to-r from-indigo-200 to-purple-200 z-0" />
                )}
                {/* Circle */}
                <div className="relative z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center mb-0 md:mb-5 shadow-md shadow-indigo-200 text-2xl">
                  {step.icon}
                </div>
                <div className="md:text-center px-0 md:px-4 pb-8 md:pb-0">
                  <div className="flex items-center gap-1.5 mb-1 md:justify-center">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Step {step.n}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-15" />
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-xl">
              <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-white/20 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Start verifying skills today</h2>
              <p className="text-indigo-200 text-sm mb-7">No credit card required. Analyze your first resume free.</p>
              <button
                onClick={() => isLoggedIn ? onNavigate('upload') : onNavigate('signup')}
                className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 transition-all"
              >
                {isLoggedIn ? 'Go to Upload' : 'Get Started Free'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, bg, title, description, step }: {
  icon: React.ReactNode; bg: string; title: string; description: string; step: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/80 transition-all group">
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
        <span className="text-3xl font-black text-slate-100 group-hover:text-indigo-100 transition-colors">{step}</span>
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}
