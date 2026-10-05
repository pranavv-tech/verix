import { useState } from 'react'
import {
  GitFork,
  Star,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ArrowUpRight,
  Activity,
  Code2,
} from 'lucide-react'

const CANDIDATE = {
  name: 'Aria Nakamura',
  github: 'arianakamura',
  score: 82,
  verified: 10,
  partial: 3,
  notVerified: 2,
}

const SKILLS: Skill[] = [
  { name: 'Python', status: 'verified', evidence: '5 Python repositories', confidence: 98, repos: ['ml-pipeline', 'fastapi-service', 'data-viz'], language: 'Python', readme: 'Production-ready ML pipeline with 200+ stars.' },
  { name: 'React', status: 'verified', evidence: 'React project detected', confidence: 95, repos: ['portfolio-v2', 'dashboard-ui'], language: 'TypeScript', readme: 'Modern React dashboard with hooks and context.' },
  { name: 'TypeScript', status: 'verified', evidence: '3 TS repositories', confidence: 91, repos: ['ts-utils', 'dashboard-ui', 'api-client'], language: 'TypeScript', readme: 'Strongly typed utility library.' },
  { name: 'FastAPI', status: 'partial', evidence: 'One API project', confidence: 65, repos: ['fastapi-service'], language: 'Python', readme: 'REST API built with FastAPI and PostgreSQL.' },
  { name: 'SQL', status: 'verified', evidence: 'DB migrations found', confidence: 88, repos: ['fastapi-service'], language: 'SQL', readme: 'Schema with migrations and seed data.' },
  { name: 'Docker', status: 'not-verified', evidence: 'No evidence found', confidence: 12, repos: [], language: '—', readme: '—' },
  { name: 'Machine Learning', status: 'verified', evidence: '2 ML repositories', confidence: 87, repos: ['ml-pipeline', 'sentiment-bert'], language: 'Python', readme: 'Fine-tuned BERT model for sentiment analysis.' },
  { name: 'Git', status: 'verified', evidence: 'Active commit history', confidence: 99, repos: ['all'], language: '—', readme: '—' },
  { name: 'JavaScript', status: 'verified', evidence: '4 JS projects', confidence: 90, repos: ['portfolio-v2', 'node-scripts'], language: 'JavaScript', readme: 'Vanilla JS and Node.js utilities.' },
  { name: 'Node.js', status: 'partial', evidence: 'Limited server code', confidence: 55, repos: ['node-scripts'], language: 'JavaScript', readme: 'Small CLI tool using Node.' },
  { name: 'Kubernetes', status: 'not-verified', evidence: 'No evidence found', confidence: 8, repos: [], language: '—', readme: '—' },
  { name: 'CI/CD', status: 'partial', evidence: 'Single GitHub Action', confidence: 40, repos: ['ml-pipeline'], language: 'YAML', readme: 'Basic linting workflow.' },
  { name: 'Testing', status: 'verified', evidence: 'pytest suites found', confidence: 84, repos: ['ml-pipeline', 'fastapi-service'], language: 'Python', readme: 'Test coverage at 76%.' },
  { name: 'Redis', status: 'verified', evidence: 'Cache layer detected', confidence: 78, repos: ['fastapi-service'], language: 'Python', readme: 'Redis-backed caching for API endpoints.' },
  { name: 'GraphQL', status: 'verified', evidence: 'Schema file found', confidence: 72, repos: ['dashboard-ui'], language: 'GraphQL', readme: 'Apollo client integration.' },
]

const LANGUAGES = [
  { name: 'Python', pct: 42, color: '#4F46E5' },
  { name: 'TypeScript', pct: 28, color: '#7C3AED' },
  { name: 'JavaScript', pct: 18, color: '#F59E0B' },
  { name: 'SQL', pct: 8, color: '#22C55E' },
  { name: 'Other', pct: 4, color: '#94A3B8' },
]

type SkillStatus = 'verified' | 'partial' | 'not-verified'
interface Skill {
  name: string
  status: SkillStatus
  evidence: string
  confidence: number
  repos: string[]
  language: string
  readme: string
}

type SortKey = 'name' | 'status' | 'confidence'

export default function Dashboard() {
  const [selected, setSelected] = useState<Skill | null>(SKILLS[0])
  const [sortKey, setSortKey] = useState<SortKey>('confidence')
  const [sortAsc, setSortAsc] = useState(false)
  const [filterStatus, setFilterStatus] = useState<SkillStatus | 'all'>('all')

  const sorted = [...SKILLS]
    .filter((s) => filterStatus === 'all' || s.status === filterStatus)
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'status') {
        const o = { verified: 0, partial: 1, 'not-verified': 2 }
        cmp = o[a.status] - o[b.status]
      } else cmp = a.confidence - b.confidence
      return sortAsc ? cmp : -cmp
    })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Verification Report</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{CANDIDATE.name}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <GitFork className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-sm text-slate-600">@{CANDIDATE.github}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl hover:border-slate-300 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:shadow-md hover:shadow-indigo-200 transition-all">
              Share Report
            </button>
          </div>
        </div>

        {/* Score row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Circle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5 col-span-2 md:col-span-1">
            <div className="relative flex-shrink-0 w-20 h-20">
              <div
                className="w-20 h-20 rounded-full"
                style={{
                  background: `conic-gradient(#4F46E5 0% ${CANDIDATE.score}%, #E0E7FF ${CANDIDATE.score}% 100%)`,
                  padding: '7px',
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-lg font-black text-indigo-700">{CANDIDATE.score}%</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Overall Score</div>
              <div className="text-sm font-bold text-slate-900">Verified Skills</div>
            </div>
          </div>

          <StatCard label="Verified" value={CANDIDATE.verified} icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} color="emerald" />
          <StatCard label="Partially Verified" value={CANDIDATE.partial} icon={<AlertCircle className="w-5 h-5 text-amber-500" />} color="amber" />
          <StatCard label="Not Verified" value={CANDIDATE.notVerified} icon={<XCircle className="w-5 h-5 text-red-500" />} color="red" />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: table + evidence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Skills Verification</h2>
                <div className="flex gap-1">
                  {(['all', 'verified', 'partial', 'not-verified'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        filterStatus === f
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {f === 'all' ? 'All' : f === 'not-verified' ? 'Not Verified' : f === 'partial' ? 'Partial' : 'Verified'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <Th label="Skill" sk="name" current={sortKey} asc={sortAsc} onSort={toggleSort} />
                      <Th label="Status" sk="status" current={sortKey} asc={sortAsc} onSort={toggleSort} />
                      <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Evidence</th>
                      <Th label="Confidence" sk="confidence" current={sortKey} asc={sortAsc} onSort={toggleSort} />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((skill) => (
                      <tr
                        key={skill.name}
                        onClick={() => setSelected(skill)}
                        className={`border-b border-slate-50 cursor-pointer transition-colors ${
                          selected?.name === skill.name ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-slate-900">{skill.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={skill.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate">
                          {skill.evidence}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  skill.confidence >= 80
                                    ? 'bg-emerald-500'
                                    : skill.confidence >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-red-400'
                                }`}
                                style={{ width: `${skill.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 w-8 text-right">
                              {skill.confidence}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Evidence panel */}
            {selected && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-1">{selected.name}</h2>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-indigo-700">{selected.confidence}%</div>
                    <div className="text-xs text-slate-500">Confidence</div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">GitHub Evidence</h3>
                    {selected.repos.length > 0 && selected.repos[0] !== 'all' ? (
                      <div className="space-y-2">
                        {selected.repos.map((repo) => (
                          <div key={repo} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
                            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                            {repo}
                          </div>
                        ))}
                      </div>
                    ) : selected.repos[0] === 'all' ? (
                      <p className="text-sm text-slate-600">Present across all repositories</p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No repositories found</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-600">Language: <strong className="text-slate-900">{selected.language}</strong></span>
                      </div>
                      {selected.readme !== '—' && (
                        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 italic leading-relaxed mt-2">
                          "{selected.readme}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    <strong className="text-slate-700">Confidence explanation: </strong>
                    {selected.confidence >= 80
                      ? 'Strong evidence found across multiple repositories with consistent usage patterns.'
                      : selected.confidence >= 50
                      ? 'Limited evidence found. Skill is present but not prominently demonstrated.'
                      : 'No or minimal evidence found in GitHub profile.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* GitHub summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <GitFork className="w-4 h-4 text-slate-800" />
                <h2 className="text-sm font-bold text-slate-900">GitHub Summary</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Repos', value: '42', icon: <GitBranch className="w-4 h-4 text-indigo-500" /> },
                  { label: 'Stars', value: '318', icon: <Star className="w-4 h-4 text-amber-500" /> },
                  { label: 'Activity', value: 'High', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">{stat.icon}</div>
                    <div className="text-sm font-bold text-slate-900">{stat.value}</div>
                    <div className="text-[10px] text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Languages</div>
                <div className="space-y-2">
                  {LANGUAGES.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{lang.name}</span>
                        <span className="text-slate-500">{lang.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${lang.pct}%`, backgroundColor: lang.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Most Active</div>
                <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-2">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-sm font-semibold text-indigo-800">ml-pipeline</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                    <Star className="w-3 h-3 text-amber-400" /> 214
                  </span>
                </div>
              </div>
            </div>

            {/* Resume skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Resume Skills</h2>
              <div className="flex flex-wrap gap-2">
                {['Python', 'React', 'FastAPI', 'SQL', 'Git', 'Docker', 'JavaScript', 'Machine Learning', 'TypeScript', 'Node.js', 'Redis', 'Testing', 'GraphQL', 'CI/CD'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelected(SKILLS.find((sk) => sk.name === s) || null)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                      selected?.name === s
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-[9px] font-black text-white">AI</span>
                </div>
                <h2 className="text-sm font-bold text-slate-900">AI Insights</h2>
              </div>
              <div className="space-y-4">
                <InsightCard
                  type="strength"
                  title="Strengths"
                  items={['Strong Python portfolio', 'Multiple React projects', 'Consistent GitHub activity', 'Good test coverage']}
                />
                <InsightCard
                  type="improve"
                  title="Needs Improvement"
                  items={['No Docker projects', 'Limited testing evidence', 'No CI/CD workflows', 'Sparse README documentation']}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Recommendations</h2>
              </div>
              <div className="space-y-2">
                {[
                  'Build a Docker-based project',
                  'Add FastAPI backend examples',
                  'Pin best repositories',
                  'Improve README documentation',
                  'Add GitHub Actions CI/CD',
                ].map((rec) => (
                  <div key={rec} className="flex items-start gap-2 text-sm text-slate-700">
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const bg = { emerald: 'bg-emerald-50', amber: 'bg-amber-50', red: 'bg-red-50' }[color] || 'bg-slate-50'
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>{icon}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: SkillStatus }) {
  if (status === 'verified')
    return <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200"><CheckCircle2 className="w-3 h-3" />Verified</span>
  if (status === 'partial')
    return <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200"><AlertCircle className="w-3 h-3" />Partial</span>
  return <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200"><XCircle className="w-3 h-3" />Not Verified</span>
}

function Th({ label, sk, current, asc, onSort }: { label: string; sk: SortKey; current: SortKey; asc: boolean; onSort: (k: SortKey) => void }) {
  const active = current === sk
  return (
    <th
      className="text-left text-xs font-semibold text-slate-500 px-4 py-3 cursor-pointer select-none hover:text-slate-700"
      onClick={() => onSort(sk)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (asc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
      </div>
    </th>
  )
}

function InsightCard({ type, title, items }: { type: 'strength' | 'improve'; title: string; items: string[] }) {
  const isStrength = type === 'strength'
  return (
    <div className={`rounded-xl p-4 ${isStrength ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
      <div className="flex items-center gap-2 mb-2">
        {isStrength ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-amber-600" />}
        <span className={`text-xs font-bold ${isStrength ? 'text-emerald-800' : 'text-amber-800'}`}>{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className={`text-xs ${isStrength ? 'text-emerald-700' : 'text-amber-700'} flex items-center gap-1`}>
            <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
