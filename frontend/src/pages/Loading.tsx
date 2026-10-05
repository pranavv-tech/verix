import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import type { Page } from '../App'

interface LoadingProps {
  onNavigate: (page: Page) => void
}

const STEPS = [
  { label: 'Reading Resume', duration: 1000 },
  { label: 'Extracting Skills', duration: 1400 },
  { label: 'Connecting to GitHub', duration: 1800 },
  { label: 'Comparing Skills', duration: 1600 },
  { label: 'Generating Verification Report', duration: 1200 },
]

export default function Loading({ onNavigate }: LoadingProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const total = STEPS.reduce((s, st) => s + st.duration, 0)
    let elapsed = 0
    let currentStep = 0

    const tick = setInterval(() => {
      elapsed += 80
      setProgress(Math.min(Math.round((elapsed / total) * 100), 99))

      let acc = 0
      for (let i = 0; i < STEPS.length; i++) {
        acc += STEPS[i].duration
        if (elapsed < acc) {
          if (i !== currentStep) {
            currentStep = i
            setStepIndex(i)
          }
          break
        }
      }

      if (elapsed >= total) {
        clearInterval(tick)
        setProgress(100)
        setStepIndex(STEPS.length)
        setTimeout(() => onNavigate('dashboard'), 600)
      }
    }, 80)

    return () => clearInterval(tick)
  }, [onNavigate])

  const totalDone = Math.min(stepIndex, STEPS.length)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        {/* Animated icon */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Analyzing Profile</h2>
          <p className="text-sm text-slate-500">
            {stepIndex < STEPS.length
              ? STEPS[stepIndex].label + '...'
              : 'Complete! Redirecting...'}
          </p>
        </div>

        {/* Steps list */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const done = i < totalDone
              const active = i === totalDone && stepIndex < STEPS.length
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : active ? (
                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      done ? 'text-slate-900' : active ? 'text-indigo-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {done && (
                    <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Done</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Overall progress</span>
            <span className="font-semibold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
