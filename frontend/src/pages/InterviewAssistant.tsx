import { useState, useRef, type ChangeEvent } from 'react'
import {
  Sparkles, FileText, GitBranch, ChevronDown, ChevronUp,
  Copy, RefreshCw, Eye, EyeOff, Play, ArrowLeft, ArrowRight,
  CheckCircle2, AlertCircle, XCircle, User, Loader2,
  MessageSquare, ClipboardList, BookOpen, Info,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type SkillStatus = 'verified' | 'partial' | 'not-verified'
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
type QuestionType = 'Conceptual' | 'Practical' | 'Project-Based' | 'Scenario-Based' | 'Mixed'
type ViewState = 'setup' | 'generating' | 'questions' | 'interview'

interface Skill {
  name: string
  status: SkillStatus
}

interface Question {
  id: number
  skill: string
  skillStatus: SkillStatus
  difficulty: Difficulty
  type: QuestionType
  question: string
  evaluationPoints: string[]
  followUp: string
  repo: string | null
}

// ─── Sample data ─────────────────────────────────────────────────────────────

const SAMPLE_SKILLS: Skill[] = [
  { name: 'Python', status: 'verified' },
  { name: 'React', status: 'verified' },
  { name: 'TypeScript', status: 'verified' },
  { name: 'FastAPI', status: 'partial' },
  { name: 'SQL', status: 'verified' },
  { name: 'Machine Learning', status: 'verified' },
  { name: 'Docker', status: 'not-verified' },
  { name: 'Node.js', status: 'partial' },
  { name: 'CI/CD', status: 'not-verified' },
]

const EXISTING_REPORTS = [
  { id: '1', label: 'Aria Nakamura — Verified 10/15 skills (82%)' },
  { id: '2', label: 'Dev Sharma — Verified 8/12 skills (74%)' },
  { id: '3', label: 'Priya Rao — Verified 12/14 skills (91%)' },
]

function generateQuestions(
  skills: string[],
  difficulty: Difficulty,
  type: QuestionType,
  count: number,
  _allSkills: Skill[]
): Question[] {
  const BANK: Omit<Question, 'id'>[] = [
    {
      skill: 'Python', skillStatus: 'verified', difficulty: 'Intermediate',
      type: 'Project-Based',
      question: 'Your ml-pipeline repository uses Python extensively. Walk me through how you structured the data preprocessing pipeline and why you made those design choices.',
      evaluationPoints: ['Data transformation logic', 'Code modularity', 'Error handling', 'Separation of concerns'],
      followUp: 'How would you refactor this pipeline to support streaming data instead of batch processing?',
      repo: 'ml-pipeline',
    },
    {
      skill: 'Python', skillStatus: 'verified', difficulty: 'Advanced',
      type: 'Conceptual',
      question: 'Explain the difference between Python\'s GIL and true parallelism. How did this influence any concurrency decisions in your projects?',
      evaluationPoints: ['GIL understanding', 'threading vs multiprocessing', 'asyncio awareness', 'Practical tradeoffs'],
      followUp: 'In what scenarios would you reach for asyncio over threading for I/O-bound work?',
      repo: null,
    },
    {
      skill: 'React', skillStatus: 'verified', difficulty: 'Intermediate',
      type: 'Project-Based',
      question: 'In your portfolio-v2 project, how did you structure component state and data flow? What patterns did you use to keep components reusable?',
      evaluationPoints: ['Component hierarchy', 'Props vs context', 'State co-location', 'Reusability patterns'],
      followUp: 'How would you optimize this application if it had to handle significantly more data or concurrent users?',
      repo: 'portfolio-v2',
    },
    {
      skill: 'React', skillStatus: 'verified', difficulty: 'Advanced',
      type: 'Practical',
      question: 'How would you implement a custom hook that fetches paginated data and handles loading, error, and cache invalidation states — without a third-party library?',
      evaluationPoints: ['useEffect cleanup', 'Abort controllers', 'Cache strategy', 'API design of the hook'],
      followUp: 'At what point would you introduce React Query or SWR instead of rolling your own?',
      repo: null,
    },
    {
      skill: 'TypeScript', skillStatus: 'verified', difficulty: 'Intermediate',
      type: 'Conceptual',
      question: 'Explain the difference between `interface` and `type` in TypeScript and describe when you would prefer one over the other based on your experience.',
      evaluationPoints: ['Declaration merging', 'Union types', 'Extending vs intersecting', 'Practical preference rationale'],
      followUp: 'How do you type discriminated unions and why are they useful in a state machine pattern?',
      repo: null,
    },
    {
      skill: 'FastAPI', skillStatus: 'partial', difficulty: 'Intermediate',
      type: 'Project-Based',
      question: 'You have one FastAPI project in your GitHub profile. Describe the API design choices you made — routing, dependency injection, and response models.',
      evaluationPoints: ['Pydantic model usage', 'Dependency injection', 'Route organization', 'Status code handling'],
      followUp: 'How would you add authentication and rate limiting to this service?',
      repo: 'fastapi-service',
    },
    {
      skill: 'FastAPI', skillStatus: 'partial', difficulty: 'Beginner',
      type: 'Conceptual',
      question: 'What is the role of Pydantic in FastAPI, and how does automatic validation differ from manual validation in traditional Flask applications?',
      evaluationPoints: ['Schema validation', 'Type coercion', 'Error responses', 'Developer ergonomics'],
      followUp: 'Have you encountered any limitations with Pydantic v2\'s stricter validation rules?',
      repo: null,
    },
    {
      skill: 'SQL', skillStatus: 'verified', difficulty: 'Intermediate',
      type: 'Practical',
      question: 'Write a query that finds the top 3 most active GitHub contributors per programming language from a hypothetical database with tables: users, repos, commits, and languages.',
      evaluationPoints: ['Window functions', 'GROUP BY logic', 'JOIN strategy', 'Query readability'],
      followUp: 'How would you index this query for a table with 10 million commit rows?',
      repo: null,
    },
    {
      skill: 'Machine Learning', skillStatus: 'verified', difficulty: 'Advanced',
      type: 'Project-Based',
      question: 'Your sentiment-bert repository fine-tunes BERT. Explain your training loop, loss function choice, and how you evaluated model performance on the validation set.',
      evaluationPoints: ['Fine-tuning strategy', 'Loss function rationale', 'Evaluation metrics (F1, accuracy)', 'Overfitting mitigation'],
      followUp: 'How would you serve this model in production with low-latency inference requirements?',
      repo: 'sentiment-bert',
    },
    {
      skill: 'Docker', skillStatus: 'not-verified', difficulty: 'Beginner',
      type: 'Conceptual',
      question: 'Explain the difference between a Docker image and a container. How would you containerize a FastAPI application — walk me through the Dockerfile you would write.',
      evaluationPoints: ['Image vs container distinction', 'Layer caching', 'Base image selection', 'Port exposure and env vars'],
      followUp: 'What are the security implications of running a container as root?',
      repo: null,
    },
    {
      skill: 'Node.js', skillStatus: 'partial', difficulty: 'Intermediate',
      type: 'Scenario-Based',
      question: 'A Node.js API endpoint begins blocking the event loop under load. How would you diagnose this and what changes would you make to the code?',
      evaluationPoints: ['Event loop understanding', 'CPU-bound vs I/O-bound', 'Worker threads or child_process', 'Profiling approach'],
      followUp: 'How does Node\'s cluster module help, and what are its limitations?',
      repo: null,
    },
    {
      skill: 'CI/CD', skillStatus: 'not-verified', difficulty: 'Beginner',
      type: 'Conceptual',
      question: 'Describe what a CI/CD pipeline does and the stages you would include for a Python web application deploying to a cloud platform.',
      evaluationPoints: ['Lint and test stages', 'Build artifact', 'Staging vs production deploy', 'Rollback strategy'],
      followUp: 'How would you handle database migrations safely as part of a deployment pipeline?',
      repo: null,
    },
    {
      skill: 'React', skillStatus: 'verified', difficulty: 'Beginner',
      type: 'Scenario-Based',
      question: 'A colleague reports that a React component re-renders far too often, causing performance issues. Walk me through how you would investigate and fix this.',
      evaluationPoints: ['React DevTools profiler', 'useMemo and useCallback', 'Referential equality', 'Component splitting'],
      followUp: 'When would you use `React.memo` and when might it actually make things worse?',
      repo: null,
    },
    {
      skill: 'Python', skillStatus: 'verified', difficulty: 'Beginner',
      type: 'Conceptual',
      question: 'Explain Python decorators with a practical example from your codebase or from common patterns you use day-to-day.',
      evaluationPoints: ['Function wrapping', 'Closure understanding', 'Stacking decorators', 'Real-world use (logging, auth, cache)'],
      followUp: 'How do class-based decorators differ from function-based ones?',
      repo: null,
    },
    {
      skill: 'SQL', skillStatus: 'verified', difficulty: 'Advanced',
      type: 'Scenario-Based',
      question: 'You notice a dashboard query is taking 8 seconds on a 5M-row table. Describe your full investigation and optimisation process.',
      evaluationPoints: ['EXPLAIN ANALYZE', 'Index strategy', 'Query rewrite', 'Materialized views / caching'],
      followUp: 'At what point would you consider moving aggregations to a data warehouse instead of the operational database?',
      repo: null,
    },
    {
      skill: 'Machine Learning', skillStatus: 'verified', difficulty: 'Intermediate',
      type: 'Conceptual',
      question: 'Compare precision and recall. In a resume screening model, which metric matters more and why?',
      evaluationPoints: ['Precision vs recall tradeoff', 'Threshold tuning', 'Business consequence of FP vs FN', 'F1 as a balance'],
      followUp: 'How would you handle a heavily imbalanced dataset where 98% of resumes are rejected?',
      repo: null,
    },
    {
      skill: 'TypeScript', skillStatus: 'verified', difficulty: 'Advanced',
      type: 'Practical',
      question: 'Implement a type-safe event emitter in TypeScript where the event payload types are inferred from an event map — without using `any`.',
      evaluationPoints: ['Generic constraints', 'Mapped types', 'Template literal types', 'Conditional types'],
      followUp: 'How would you extend this to support async event listeners with error boundaries?',
      repo: null,
    },
    {
      skill: 'Node.js', skillStatus: 'partial', difficulty: 'Beginner',
      type: 'Conceptual',
      question: 'Explain the Node.js event loop phases. What is the difference between `process.nextTick` and `setImmediate`?',
      evaluationPoints: ['Phase order', 'Microtask queue', 'nextTick priority', 'Practical use cases'],
      followUp: 'How does `Promise.then` fit into the event loop model relative to `nextTick`?',
      repo: null,
    },
    {
      skill: 'Docker', skillStatus: 'not-verified', difficulty: 'Intermediate',
      type: 'Scenario-Based',
      question: 'You need to set up a local development environment for a FastAPI + PostgreSQL + Redis stack. How would you structure a docker-compose file and what pitfalls would you watch for?',
      evaluationPoints: ['Service dependencies', 'Volume mounts for persistence', 'Network aliases', 'Environment variable management'],
      followUp: 'How does Docker Compose differ from Kubernetes and when would you choose one over the other?',
      repo: null,
    },
    {
      skill: 'CI/CD', skillStatus: 'not-verified', difficulty: 'Advanced',
      type: 'Scenario-Based',
      question: 'Design a zero-downtime blue-green deployment pipeline for a FastAPI service with PostgreSQL migrations. What are the risks and how do you mitigate them?',
      evaluationPoints: ['Traffic switching strategy', 'Migration backward compatibility', 'Health checks', 'Rollback automation'],
      followUp: 'How would you handle a migration that cannot be rolled back safely?',
      repo: null,
    },
  ]

  const filtered = BANK.filter((q) => {
    const skillMatch = skills.includes(q.skill)
    const diffMatch = difficulty === 'Intermediate'
      ? true
      : q.difficulty === difficulty
    const typeMatch = type === 'Mixed' ? true : q.type === type
    return skillMatch && diffMatch && typeMatch
  })

  const pool = filtered.length > 0 ? filtered : BANK.filter((q) => skills.includes(q.skill))
  const result = pool.slice(0, count)

  return result.map((q, i) => ({ ...q, id: i + 1 }))
}

// ─── Helper components ────────────────────────────────────────────────────────

function StatusDot({ status }: { status: SkillStatus }) {
  if (status === 'verified') return <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
  if (status === 'partial') return <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
  return <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
}

function StatusBadge({ status }: { status: SkillStatus }) {
  if (status === 'verified')
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-2.5 h-2.5" />Verified</span>
  if (status === 'partial')
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full"><AlertCircle className="w-2.5 h-2.5" />Partial</span>
  return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full"><XCircle className="w-2.5 h-2.5" />No Evidence</span>
}

function DiffBadge({ d }: { d: Difficulty }) {
  const cls = d === 'Advanced' ? 'bg-purple-50 text-purple-700 border-purple-200'
    : d === 'Intermediate' ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : 'bg-slate-100 text-slate-600 border-slate-200'
  return <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${cls}`}>{d}</span>
}

function TypeBadge({ t }: { t: QuestionType }) {
  return <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">{t}</span>
}

// ─── Setup view ───────────────────────────────────────────────────────────────

interface SetupProps {
  onGenerate: (cfg: GenerateConfig) => void
}

interface GenerateConfig {
  candidateName: string
  githubUsername: string
  difficulty: Difficulty
  questionType: QuestionType
  count: number
  selectedSkills: string[]
}

function SetupView({ onGenerate }: SetupProps) {
  const [candidateName, setCandidateName] = useState('Aria Nakamura')
  const [githubUsername, setGithubUsername] = useState('arianakamura')
  const [reportId, setReportId] = useState('1')
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate')
  const [questionType, setQuestionType] = useState<QuestionType>('Mixed')
  const [count, setCount] = useState(10)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    SAMPLE_SKILLS.filter((s) => s.status !== 'not-verified').map((s) => s.name)
  )
  const [fileUploaded, setFileUploaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleSkill = (name: string) =>
    setSelectedSkills((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name])

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFileUploaded(true)
  }

  const canGenerate = candidateName.trim() && githubUsername.trim() && selectedSkills.length > 0

  return (
    <div className="space-y-6">
      {/* Candidate info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          Candidate Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Candidate Name" value={candidateName} onChange={setCandidateName} placeholder="Full name" />
          <Field label="GitHub Username" value={githubUsername} onChange={setGithubUsername} placeholder="e.g. arianakamura"
            icon={<GitBranch className="w-4 h-4 text-slate-400" />} />
        </div>

        {/* Resume upload */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resume (PDF)</label>
          {!fileUploaded ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl py-5 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Click to upload PDF resume
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-800">resume.pdf uploaded</span>
              <button onClick={() => setFileUploaded(false)} className="ml-auto text-xs text-slate-500 hover:text-red-600 transition-colors">Remove</button>
            </div>
          )}
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
        </div>

        {/* Existing report */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Use Existing Verification Report</label>
          <div className="relative">
            <select
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none pr-8"
            >
              <option value="">— Select a report —</option>
              {EXISTING_REPORTS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-indigo-500" />
          Question Settings
        </h2>

        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Interview Level</label>
            <div className="flex flex-col gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setDifficulty(d)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${difficulty === d ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}
                  >
                    {difficulty === d && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm text-slate-700">{d}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Question Type</label>
            <div className="flex flex-col gap-2">
              {(['Conceptual', 'Practical', 'Project-Based', 'Scenario-Based', 'Mixed'] as QuestionType[]).map((t) => (
                <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setQuestionType(t)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${questionType === t ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}
                  >
                    {questionType === t && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm text-slate-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Number of Questions</label>
            <div className="flex flex-col gap-2">
              {[5, 10, 15, 20].map((n) => (
                <label key={n} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setCount(n)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${count === n ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}
                  >
                    {count === n && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm text-slate-700">{n} questions</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Skill selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">Select Skills to Cover</label>
            <div className="flex gap-2">
              <button onClick={() => setSelectedSkills(SAMPLE_SKILLS.map((s) => s.name))} className="text-xs text-indigo-600 hover:underline">All</button>
              <span className="text-xs text-slate-300">·</span>
              <button onClick={() => setSelectedSkills([])} className="text-xs text-slate-500 hover:underline">None</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SKILLS.map((skill) => {
              const selected = selectedSkills.includes(skill.name)
              return (
                <button
                  key={skill.name}
                  onClick={() => toggleSkill(skill.name)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    selected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                  }`}
                >
                  <StatusDot status={skill.status} />
                  {skill.name}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 mt-2.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified
            <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> Partial
            <span className="w-2 h-2 rounded-full bg-red-400 ml-2" /> No evidence
          </p>
        </div>
      </div>

      {/* Generate button */}
      <button
        disabled={!canGenerate}
        onClick={() => onGenerate({ candidateName, githubUsername, difficulty, questionType, count, selectedSkills })}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base transition-all ${
          canGenerate
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        Generate Interview Questions
      </button>

      {!canGenerate && (
        <p className="text-center text-xs text-slate-400">Select at least one skill to generate questions.</p>
      )}
    </div>
  )
}

// ─── Question card ────────────────────────────────────────────────────────────

function QuestionCard({
  q, showAnswers, onCopy,
}: {
  q: Question; showAnswers: boolean; onCopy: (text: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    onCopy(q.question)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div
        className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0 mt-0.5">
          {q.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-bold text-slate-900">{q.skill}</span>
            <StatusBadge status={q.skillStatus} />
            <DiffBadge d={q.difficulty} />
            <TypeBadge t={q.type} />
            {q.repo && (
              <span className="flex items-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
                <GitBranch className="w-2.5 h-2.5" />{q.repo}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">{q.question}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); copy() }}
            className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            title="Copy question"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-slate-100 pt-4 space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interview Question</p>
            <p className="text-sm text-slate-800 leading-relaxed bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              "{q.question}"
            </p>
          </div>

          {showAnswers && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evaluation Points</p>
              <ul className="space-y-1.5">
                {q.evaluationPoints.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Follow-up Question</p>
            <p className="text-sm text-slate-600 italic leading-relaxed">"{q.followUp}"</p>
          </div>

          {q.skillStatus === 'not-verified' && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                No GitHub evidence found for this skill. These questions assess foundational understanding directly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Questions view ───────────────────────────────────────────────────────────

interface QuestionsViewProps {
  cfg: GenerateConfig
  questions: Question[]
  onRegenerate: () => void
  onStartInterview: () => void
  onBack: () => void
}

function QuestionsView({ cfg, questions, onRegenerate, onStartInterview, onBack }: QuestionsViewProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const [copyAllDone, setCopyAllDone] = useState(false)

  const copyAll = () => {
    const text = questions.map((q, i) => `${i + 1}. [${q.skill}] ${q.question}\n   Follow-up: ${q.followUp}`).join('\n\n')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopyAllDone(true)
    setTimeout(() => setCopyAllDone(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Summary header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-slate-900">Interview Questions</h2>
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">{questions.length} questions</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{cfg.candidateName}</span>
              <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />@{cfg.githubUsername}</span>
              <DiffBadge d={cfg.difficulty} />
              <span>{cfg.questionType}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {cfg.selectedSkills.map((s) => (
                <span key={s} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />Back
            </button>
            <button onClick={onRegenerate} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Regenerate
            </button>
            <button onClick={() => setShowAnswers(!showAnswers)} className="flex items-center gap-1.5 text-xs font-medium text-slate-700 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
              {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
            <button onClick={copyAll} className="flex items-center gap-1.5 text-xs font-medium text-slate-700 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
              {copyAllDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All
            </button>
            <button
              onClick={onStartInterview}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-md hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              Start Interview
            </button>
          </div>
        </div>
      </div>

      {/* Evidence note */}
      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Note:</strong> GitHub evidence indicates project activity, not guaranteed proficiency. Use these questions to assess the candidate directly.
        </p>
      </div>

      {/* Question cards */}
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            q={q}
            showAnswers={showAnswers}
            onCopy={(text) => navigator.clipboard.writeText(text).catch(() => {})}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Interview mode ───────────────────────────────────────────────────────────

interface InterviewModeProps {
  cfg: GenerateConfig
  questions: Question[]
  onBack: () => void
}

function InterviewMode({ cfg, questions, onBack }: InterviewModeProps) {
  const [idx, setIdx] = useState(0)
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [finished, setFinished] = useState(false)
  const [showEval, setShowEval] = useState(false)

  const q = questions[idx]
  const progress = Math.round(((idx + 1) / questions.length) * 100)

  const setNote = (id: number, text: string) => setNotes((n) => ({ ...n, [id]: text }))

  if (finished) {
    return (
      <div className="space-y-5">
        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Interview Complete</h2>
          <p className="text-sm text-slate-500 mb-6">{questions.length} questions covered with {cfg.candidateName}</p>
          <div className="flex justify-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 border border-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />View Questions
            </button>
          </div>
        </div>

        {/* Notes summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Interviewer Notes Summary</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {questions.map((qu, i) => (
              <div key={qu.id} className="px-6 py-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                  <span className="text-xs font-bold text-slate-800">{qu.skill}</span>
                  <DiffBadge d={qu.difficulty} />
                </div>
                <p className="text-xs text-slate-600 mb-2 line-clamp-1">"{qu.question}"</p>
                {notes[qu.id]
                  ? <p className="text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">{notes[qu.id]}</p>
                  : <p className="text-xs text-slate-400 italic">No notes recorded</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Candidate + progress header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              {cfg.candidateName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{cfg.candidateName}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1"><GitBranch className="w-3 h-3" />@{cfg.githubUsername}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-0.5">Question {idx + 1} of {questions.length}</p>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Current question */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">{idx + 1}</div>
          <span className="text-sm font-bold text-slate-900">{q.skill}</span>
          <StatusBadge status={q.skillStatus} />
          <DiffBadge d={q.difficulty} />
          <TypeBadge t={q.type} />
          {q.repo && (
            <span className="flex items-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
              <GitBranch className="w-2.5 h-2.5" />{q.repo}
            </span>
          )}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
          <p className="text-base text-slate-800 leading-relaxed font-medium">"{q.question}"</p>
        </div>

        <button
          onClick={() => setShowEval(!showEval)}
          className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          {showEval ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showEval ? 'Hide evaluation points' : 'Show evaluation points'}
        </button>

        {showEval && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 space-y-1.5">
            {q.evaluationPoints.map((pt) => (
              <div key={pt} className="flex items-center gap-2 text-xs text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {pt}
              </div>
            ))}
          </div>
        )}

        {/* Follow-up */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Follow-up</p>
          <p className="text-sm text-slate-600 italic">"{q.followUp}"</p>
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            Interviewer Notes
          </p>
          <textarea
            value={notes[q.id] ?? ''}
            onChange={(e) => setNote(q.id, e.target.value)}
            placeholder="Record observations, candidate responses, or follow-up actions here..."
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none placeholder:text-slate-400 leading-relaxed"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          disabled={idx === 0}
          onClick={() => { setIdx(idx - 1); setShowEval(false) }}
          className="flex items-center gap-2 border border-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />Previous
        </button>

        <div className="flex items-center gap-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setShowEval(false) }}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-indigo-600 w-4' : i < idx ? 'bg-indigo-300' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        {idx < questions.length - 1 ? (
          <button
            onClick={() => { setIdx(idx + 1); setShowEval(false) }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-md hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
          >
            Next<ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setFinished(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
          >
            Finish<CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Generating loader ────────────────────────────────────────────────────────

function GeneratingLoader() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">Generating questions…</h3>
      <p className="text-sm text-slate-500">Analysing verified skills and project evidence</p>
    </div>
  )
}

// ─── Shared field ─────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder: string; icon?: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function InterviewAssistant() {
  const [view, setView] = useState<ViewState>('setup')
  const [cfg, setCfg] = useState<GenerateConfig | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  const handleGenerate = (config: GenerateConfig) => {
    setCfg(config)
    setView('generating')
    setTimeout(() => {
      const qs = generateQuestions(config.selectedSkills, config.difficulty, config.questionType, config.count, SAMPLE_SKILLS)
      setQuestions(qs)
      setView('questions')
    }, 1600)
  }

  const handleRegenerate = () => {
    if (!cfg) return
    setView('generating')
    setTimeout(() => {
      const qs = generateQuestions(cfg.selectedSkills, cfg.difficulty, cfg.questionType, cfg.count, SAMPLE_SKILLS)
      setQuestions(qs)
      setView('questions')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">

        {/* Page header */}
        <div className="pt-10 mb-8">
          {view !== 'setup' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
              <button
                onClick={() => setView('setup')}
                className="hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />Interview Assistant
              </button>
              <span>/</span>
              <span className="text-slate-900 font-medium capitalize">
                {view === 'generating' ? 'Generating…' : view === 'questions' ? 'Questions' : 'Interview Mode'}
              </span>
            </div>
          )}

          {view === 'setup' && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Interview Assistant</h1>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                Generate personalised technical interview questions using verified skills and real project evidence.
              </p>
            </>
          )}

          {view === 'questions' && (
            <h1 className="text-2xl font-bold text-slate-900">Generated Questions</h1>
          )}

          {view === 'interview' && (
            <h1 className="text-2xl font-bold text-slate-900">Interview Mode</h1>
          )}
        </div>

        {/* Views */}
        {view === 'setup' && <SetupView onGenerate={handleGenerate} />}
        {view === 'generating' && <GeneratingLoader />}
        {view === 'questions' && cfg && (
          <QuestionsView
            cfg={cfg}
            questions={questions}
            onRegenerate={handleRegenerate}
            onStartInterview={() => setView('interview')}
            onBack={() => setView('setup')}
          />
        )}
        {view === 'interview' && cfg && (
          <InterviewMode
            cfg={cfg}
            questions={questions}
            onBack={() => setView('questions')}
          />
        )}
      </div>
    </div>
  )
}
