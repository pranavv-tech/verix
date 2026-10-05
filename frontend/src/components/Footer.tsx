import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">Verix</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Skills You Can Verify</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
        </div>

        <p className="text-xs text-slate-400">© 2026 Verix. All rights reserved.</p>
      </div>
    </footer>
  )
}
