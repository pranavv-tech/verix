import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthGate from './components/AuthGate'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Loading from './pages/Loading'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import GitHubVerify from './pages/GitHubVerify'
import InterviewAssistant from './pages/InterviewAssistant'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import EmailVerification from './pages/auth/EmailVerification'

export type Page =
  | 'landing' | 'upload' | 'loading' | 'dashboard'
  | 'about' | 'github-verify' | 'interview'
  | 'signin' | 'signup' | 'forgot-password' | 'email-verify'

/** Pages that require authentication */
const PROTECTED: Page[] = ['upload', 'loading', 'dashboard', 'interview']
const AUTH_PAGES: Page[] = ['signin', 'signup', 'forgot-password', 'email-verify']

function AppInner() {
  const [page, setPage] = useState<Page>('landing')
  const [gateOpen, setGateOpen] = useState(false)
  const { isLoggedIn } = useAuth()

  const navigate = (next: Page) => {
    // Guard protected pages for logged-out users
    if (PROTECTED.includes(next) && !isLoggedIn) {
      setGateOpen(true)
      return
    }
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isAuthPage = AUTH_PAGES.includes(page)

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar currentPage={page} onNavigate={navigate} />}

      {/* Auth gate modal */}
      {gateOpen && (
        <AuthGate
          onNavigate={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          onClose={() => setGateOpen(false)}
        />
      )}

      <main className="flex-1">
        {page === 'landing'         && <Landing onNavigate={navigate} />}
        {page === 'upload'          && <Upload onNavigate={navigate} />}
        {page === 'loading'         && <Loading onNavigate={navigate} />}
        {page === 'dashboard'       && <Dashboard />}
        {page === 'about'           && <About />}
        {page === 'github-verify'   && <GitHubVerify />}
        {page === 'interview'       && <InterviewAssistant />}
        {page === 'signin'          && <SignIn onNavigate={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
        {page === 'signup'          && <SignUp onNavigate={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
        {page === 'forgot-password' && <ForgotPassword onNavigate={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
        {page === 'email-verify'    && <EmailVerification onNavigate={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
      </main>

      {!isAuthPage && page !== 'loading' && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
