import { Zap, CheckCircle2, AlertCircle, XCircle, FileText, GitBranch, ShieldCheck, Code2 } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20">

      {/* ── Hero ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-br from-indigo-100/70 via-purple-100/50 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700">About Verix</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
            Verify Skills.{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Not Just Keywords.
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Verix is an AI-powered resume verification platform that goes beyond keyword matching by validating technical skills using real GitHub project evidence.
          </p>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-2xl font-bold text-slate-900 mb-5 leading-snug">Traditional hiring is broken</h2>
            <div className="space-y-4">
              {[
                'Traditional ATS systems only compare resume keywords with job descriptions.',
                'Candidates can claim skills without any proof or project evidence.',
                'Recruiters spend significant time manually verifying technical expertise.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle className="w-3 h-3 text-red-500" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="space-y-3">
              {[
                { label: 'Resume keyword match', pct: 75, color: 'bg-slate-400' },
                { label: 'Actual skill evidence', pct: 12, color: 'bg-red-400' },
                { label: 'Recruiter confidence', pct: 34, color: 'bg-amber-400' },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">{bar.label}</span>
                    <span className="text-slate-500">{bar.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.pct}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-400 mt-4 italic">Traditional ATS system metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Solution ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Our Solution</p>
            <h2 className="text-2xl font-bold text-slate-900">Verix bridges the gap</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">We analyze multiple sources of evidence and produce a transparent, evidence-backed verification report.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { icon: <FileText className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50', label: 'Resume Skills', desc: 'Extracted from PDF with NLP' },
              { icon: <GitBranch className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', label: 'GitHub Repositories', desc: 'Real project history' },
              { icon: <Code2 className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', label: 'Programming Languages', desc: 'Detected per repo' },
              { icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', label: 'Project Evidence', desc: 'READMEs and commit data' },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>{card.icon}</div>
                <p className="text-sm font-bold text-slate-900 mb-1">{card.label}</p>
                <p className="text-xs text-slate-500">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Status legend */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <p className="text-sm font-bold text-slate-900 mb-5">Every skill receives one of three verification statuses:</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, status: 'Verified', desc: 'Strong evidence found across multiple repositories.', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
                { icon: <AlertCircle className="w-5 h-5 text-amber-500" />, status: 'Partially Verified', desc: 'Limited evidence — skill present but not prominent.', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
                { icon: <XCircle className="w-5 h-5 text-red-500" />, status: 'Not Verified', desc: 'No GitHub evidence found for this claimed skill.', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
              ].map((s) => (
                <div key={s.status} className={`${s.bg} border rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">{s.icon}<span className={`text-sm font-bold ${s.text}`}>{s.status}</span></div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Tech Stack</p>
            <h2 className="text-2xl font-bold text-slate-900">Built with modern tools</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'React', color: 'bg-blue-50 border-blue-200 text-blue-700', dot: '#3B82F6' },
              { name: 'FastAPI', color: 'bg-teal-50 border-teal-200 text-teal-700', dot: '#14B8A6' },
              { name: 'Python', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', dot: '#EAB308' },
              { name: 'GitHub API', color: 'bg-slate-50 border-slate-300 text-slate-700', dot: '#1E293B' },
              { name: 'SQLite', color: 'bg-orange-50 border-orange-200 text-orange-700', dot: '#F97316' },
              { name: 'pdfplumber', color: 'bg-pink-50 border-pink-200 text-pink-700', dot: '#EC4899' },
            ].map((tech) => (
              <div key={tech.name} className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold ${tech.color}`}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tech.dot }} />
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Meet the Team</p>
            <h2 className="text-2xl font-bold text-slate-900">Built by students, for recruiters</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Sahasra', role: 'Frontend Developer', initials: 'SA', from: '#4F46E5', to: '#7C3AED' },
              { name: 'Saathvik', role: 'Resume Parser', initials: 'SV', from: '#7C3AED', to: '#A855F7' },
              { name: 'Purvaa', role: 'GitHub Integration', initials: 'PU', from: '#0EA5E9', to: '#4F46E5' },
              { name: 'Pranav', role: 'Backend & Deployment', initials: 'PR', from: '#10B981', to: '#0EA5E9' },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all group">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md"
                  style={{ background: `linear-gradient(135deg, ${member.from}, ${member.to})` }}
                >
                  {member.initials}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
