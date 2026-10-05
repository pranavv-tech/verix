import { useState } from 'react'
import { GitBranch, Star, Search, Loader2, CheckCircle2, AlertCircle, XCircle, BookOpen, ChevronRight } from 'lucide-react'

interface Repo {
  name: string; language: string; skills: string[]; readme: boolean; status: 'Verified' | 'Partial' | 'Not Verified'
}
interface Profile {
  username: string; repos: number; stars: number; languages: string[]
}
interface Evidence {
  skill: string; repo: string | null; confidence: number
}

const MOCK: { profile: Profile; repos: Repo[]; evidence: Evidence[] } = {
  profile: { username: 'sahasra-dev', repos: 34, stars: 127, languages: ['Python', 'TypeScript', 'JavaScript', 'SQL'] },
  repos: [
    { name: 'resume-analyzer', language: 'Python', skills: ['Python', 'FastAPI'], readme: true, status: 'Verified' },
    { name: 'portfolio-website', language: 'React', skills: ['React', 'TypeScript'], readme: true, status: 'Verified' },
    { name: 'todo-app', language: 'JavaScript', skills: ['JavaScript'], readme: false, status: 'Verified' },
    { name: 'ml-experiments', language: 'Python', skills: ['Python', 'ML'], readme: true, status: 'Verified' },
    { name: 'api-service', language: 'FastAPI', skills: ['FastAPI', 'SQLite'], readme: false, status: 'Partial' },
  ],
  evidence: [
    { skill: 'React', repo: 'portfolio-website', confidence: 95 },
    { skill: 'Python', repo: 'resume-analyzer', confidence: 99 },
    { skill: 'FastAPI', repo: 'api-service', confidence: 68 },
    { skill: 'Docker', repo: null, confidence: 5 },
    { skill: 'TypeScript', repo: 'portfolio-website', confidence: 87 },
  ],
}

function StatusBadge({ s }: { s: 'Verified' | 'Partial' | 'Not Verified' }) {
  if (s === 'Verified') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" />Verified
    </span>
  )
  if (s === 'Partial') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
      <AlertCircle className="w-3 h-3" />Partial
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
      <XCircle className="w-3 h-3" />Not Verified
    </span>
  )
}

export default function GitHubVerify() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<typeof MOCK | null>(null)
  const [error, setError] = useState('')

  const analyze = () => {
    if (!username.trim()) { setError('Please enter a GitHub username.'); return }
    setError('')
    setData(null)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setData({ ...MOCK, profile: { ...MOCK.profile, username: username.trim() } })
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="pt-10 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <GitBranch className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">GitHub Skill Verification</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">GitHub Skill Verification</h1>
          <p className="text-slate-500 text-sm">Enter a GitHub username to analyze repositories and detect verified skills.</p>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex gap-3">
            <div className={`flex-1 flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3 transition-all ${error ? 'border-red-300 bg-red-50/30' : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
              <GitBranch className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && analyze()}
                placeholder="e.g. sahasra-dev"
                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={analyze}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</> : <><Search className="w-4 h-4" />Analyze GitHub</>}
            </button>
          </div>
          {error && <p className="text-xs text-red-600 mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">Analyzing GitHub profile...</p>
            <p className="text-xs text-slate-500">Scanning repositories for skill evidence</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-md">
                  {data.profile.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">@{data.profile.username}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <GitBranch className="w-3.5 h-3.5" />{data.profile.repos} repos
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Star className="w-3.5 h-3.5 text-amber-400" />{data.profile.stars} stars
                    </span>
                  </div>
                </div>
                <div className="ml-auto flex flex-wrap gap-2 justify-end">
                  {data.profile.languages.map((lang) => (
                    <span key={lang} className="text-xs font-medium bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full">{lang}</span>
                  ))}
                </div>
              </div>

              {/* Contribution graph placeholder */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-3">Contribution Activity (past 12 weeks)</p>
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: 84 }).map((_, i) => {
                    const intensity = Math.random()
                    const bg = intensity > 0.8 ? 'bg-indigo-600' : intensity > 0.6 ? 'bg-indigo-400' : intensity > 0.4 ? 'bg-indigo-200' : intensity > 0.2 ? 'bg-indigo-100' : 'bg-slate-100'
                    return <div key={i} className={`w-3 h-3 rounded-sm ${bg}`} />
                  })}
                </div>
              </div>
            </div>

            {/* Repository table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Repository Analysis</h2>
                <span className="text-xs text-slate-500">{data.repos.length} repositories scanned</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {['Repository', 'Language', 'Verified Skills', 'README', 'Status'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.repos.map((repo) => (
                      <tr key={repo.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-900">{repo.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{repo.language}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1.5 flex-wrap">
                            {repo.skills.map((s) => (
                              <span key={s} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {repo.readme
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : <XCircle className="w-4 h-4 text-slate-300" />}
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge s={repo.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Skill evidence panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Skill Evidence</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {data.evidence.map((ev) => (
                  <div key={ev.skill} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-black text-indigo-700">{ev.skill.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{ev.skill}</span>
                        {ev.repo && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <ChevronRight className="w-3 h-3" />{ev.repo}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[160px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ev.confidence >= 80 ? 'bg-emerald-500' : ev.confidence >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${ev.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{ev.confidence}% confidence</span>
                      </div>
                    </div>
                    <div>
                      {ev.repo
                        ? <StatusBadge s={ev.confidence >= 80 ? 'Verified' : 'Partial'} />
                        : <StatusBadge s="Not Verified" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">No profile analyzed yet</p>
            <p className="text-xs text-slate-400">Enter a GitHub username above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
