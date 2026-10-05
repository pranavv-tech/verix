import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from 'react'
import {
  Upload as UploadIcon, FileText, GitBranch, X, ArrowRight,
  FileCheck, AlertCircle, CheckCircle2, Sparkles, Shield, Loader2,
  FileSearch, Code2, ShieldCheck,
} from 'lucide-react'
import type { Page } from '../App'

interface UploadProps {
  onNavigate: (page: Page) => void
}

type UploadState = 'idle' | 'analyzing' | 'success' | 'error'

const ANALYZE_STEPS = [
  'Upload Complete',
  'Extracting Resume Text',
  'Identifying Skills',
  'Connecting to GitHub',
  'Analyzing Repositories',
  'Comparing Skills',
  'Generating Report',
]

export default function Upload({ onNavigate }: UploadProps) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [github, setGithub] = useState('')
  const [githubFocused, setGithubFocused] = useState(false)
  const [uiState, setUiState] = useState<UploadState>('idle')
  const [fieldErrors, setFieldErrors] = useState({ file: '', github: '' })
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  /* ── file handling ── */
  const acceptFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      setFieldErrors((e) => ({ ...e, file: 'Only PDF files are supported.' }))
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setFieldErrors((e) => ({ ...e, file: 'File must be under 5 MB.' }))
      return
    }
    setFile(f)
    setFieldErrors((e) => ({ ...e, file: '' }))
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) acceptFile(f)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) acceptFile(f)
  }

  /* ── analyze ── */
  const handleAnalyze = () => {
    const errs = { file: '', github: '' }
    if (!file) errs.file = 'Please upload a PDF resume.'
    if (!github.trim()) errs.github = 'Please enter your GitHub username.'
    if (errs.file || errs.github) { setFieldErrors(errs); return }
    setFieldErrors({ file: '', github: '' })
    setUiState('analyzing')
    setStepIndex(0)
    setProgress(0)
  }

  /* ── analysis animation ── */
  useEffect(() => {
    if (uiState !== 'analyzing') return
    const total = ANALYZE_STEPS.length
    let step = 0
    const interval = setInterval(() => {
      step += 1
      setStepIndex(step)
      setProgress(Math.round((step / total) * 100))
      if (step >= total) {
        clearInterval(interval)
        setTimeout(() => { setUiState('success') }, 500)
        setTimeout(() => { onNavigate('dashboard') }, 2200)
      }
    }, 600)
    return () => clearInterval(interval)
  }, [uiState, onNavigate])

  const canAnalyze = !!file && github.trim().length > 0
  const isAnalyzing = uiState === 'analyzing'
  const isSuccess = uiState === 'success'

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-6">

        {/* Breadcrumb + Header */}
        <div className="pt-10 mb-8">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => onNavigate('dashboard')}>Dashboard</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Upload Resume</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Technical Skills</h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
            Upload your resume and provide your GitHub username. Verix will analyze your resume, compare it with your GitHub projects, and generate a Skill Verification Report.
          </p>
        </div>

        {/* ── Success banner ── */}
        {isSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">Resume analyzed successfully!</p>
              <p className="text-xs text-emerald-600">Redirecting to your verification report...</p>
            </div>
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin ml-auto" />
          </div>
        )}

        {/* ── Analyzing state ── */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Analyzing your profile...</p>
                <p className="text-xs text-slate-500">Estimated time: 2–5 seconds</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {ANALYZE_STEPS.map((step, i) => {
                const done = i < stepIndex
                const active = i === stepIndex
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {done ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        : active ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />}
                    </div>
                    <span className={`text-sm font-medium ${done ? 'text-slate-900' : active ? 'text-indigo-700' : 'text-slate-400'}`}>{step}</span>
                    {done && <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Done</span>}
                  </div>
                )
              })}
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Overall progress</span>
                <span className="font-semibold text-indigo-600">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Main form ── */}
        {!isAnalyzing && !isSuccess && (
          <>
            {/* Resume Upload Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5">
              <div className="px-6 pt-6 pb-1">
                <h2 className="text-sm font-bold text-slate-900 mb-4">Resume Upload</h2>
              </div>

              <div className="px-6 pb-6">
                {!file ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${
                      fieldErrors.file ? 'border-red-300 bg-red-50/30'
                      : dragging ? 'border-indigo-400 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} className="hidden" />
                    <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-indigo-50 flex items-center justify-center">
                      <FileText className="w-7 h-7 text-indigo-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">Upload Resume</p>
                    <p className="text-xs text-slate-400 mb-5">or drag and drop your PDF here</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                      className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <UploadIcon className="w-3.5 h-3.5" />
                      Choose PDF
                    </button>
                    <p className="text-xs text-slate-400 mt-4">PDF only · Maximum 5 MB</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(1)} MB · PDF</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => setFile(null)}
                        className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} className="hidden" />
                  </div>
                )}

                {fieldErrors.file && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2"><AlertCircle className="w-3.5 h-3.5" />{fieldErrors.file}</p>
                )}
              </div>

              {/* Privacy notice */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your resume is processed securely. We only analyze your uploaded resume and publicly available GitHub repositories. Your files are never shared.
                </p>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
              <h2 className="text-sm font-bold text-slate-900 mb-4">GitHub Profile</h2>
              <div className={`flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3 transition-all ${
                fieldErrors.github ? 'border-red-300 bg-red-50/30'
                : githubFocused ? 'border-indigo-400 ring-2 ring-indigo-100'
                : 'border-slate-200 hover:border-slate-300'
              }`}>
                <GitBranch className={`w-4 h-4 flex-shrink-0 transition-colors ${githubFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={github}
                  onChange={(e) => { setGithub(e.target.value); setFieldErrors((er) => ({ ...er, github: '' })) }}
                  onFocus={() => setGithubFocused(true)}
                  onBlur={() => setGithubFocused(false)}
                  placeholder="example: sahasra-dev"
                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              {fieldErrors.github && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2"><AlertCircle className="w-3.5 h-3.5" />{fieldErrors.github}</p>
              )}
              <p className="text-xs text-slate-500 mt-2 ml-1">{"We'll use your public repositories to verify your claimed technical skills."}</p>
            </div>

            {/* Verification Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Verification Summary</h2>
              <div className="grid grid-cols-3 gap-3">
                <SummaryItem
                  label="Resume"
                  status={file ? 'ready' : 'waiting'}
                  value={file ? 'Uploaded' : 'Not uploaded'}
                />
                <SummaryItem
                  label="GitHub Username"
                  status={github.trim() ? 'ready' : 'waiting'}
                  value={github.trim() || 'Not entered'}
                />
                <SummaryItem
                  label="Status"
                  status={canAnalyze ? 'go' : 'waiting'}
                  value={canAnalyze ? 'Ready for Analysis' : 'Waiting...'}
                />
              </div>
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base transition-all ${
                canAnalyze
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Analyze Resume
            </button>

            {/* Feature mini-cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: <FileSearch className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50', title: 'Resume Parsing', desc: 'Extracts technical skills from your PDF.' },
                { icon: <Code2 className="w-4 h-4 text-purple-600" />, bg: 'bg-purple-50', title: 'GitHub Verification', desc: 'Matches skills against repositories.' },
                { icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50', title: 'AI Skill Verification', desc: 'Generates Verified / Partial / Not Verified scores.' },
              ].map((card) => (
                <div key={card.title} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>{card.icon}</div>
                  <p className="text-xs font-bold text-slate-900 mb-1">{card.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Auth notice */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Authentication required.</strong> This page is protected. Please{' '}
                <button className="underline font-semibold hover:text-amber-900">sign in</button>{' '}
                to upload and verify your resume.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SummaryItem({ label, status, value }: { label: string; status: 'ready' | 'waiting' | 'go'; value: string }) {
  return (
    <div className={`rounded-xl border p-4 text-center transition-all ${
      status === 'go' ? 'bg-indigo-50 border-indigo-200'
      : status === 'ready' ? 'bg-emerald-50 border-emerald-200'
      : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex justify-center mb-2">
        {status === 'go'
          ? <ArrowRight className="w-4 h-4 text-indigo-600" />
          : status === 'ready'
          ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xs font-semibold ${
        status === 'go' ? 'text-indigo-700' : status === 'ready' ? 'text-emerald-700' : 'text-slate-500'
      }`}>{value}</p>
    </div>
  )
}
