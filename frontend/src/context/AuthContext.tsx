import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getSupabaseClient } from '../lib/supabase'

interface User {
  name: string
  email: string
}

interface ProfileRecord {
  id: string
  full_name: string | null
  email: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  role: string | null
  created_at?: string
  updated_at?: string
}

interface AuthContextValue {
  user: User | null
  profile: ProfileRecord | null
  login: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; requiresConfirmation?: boolean; error?: string }>
  logout: () => Promise<void>
  isLoggedIn: boolean
  loading: boolean
}

const DEMO_SESSION_KEY = 'verix-demo-session'

const AuthContext = createContext<AuthContextValue | null>(null)

function readDemoSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.name === 'string' && typeof parsed.email === 'string') {
      return { name: parsed.name, email: parsed.email }
    }
  } catch {
    // Ignore malformed session data and fall back to a clean state.
  }
  return null
}

function writeDemoSession(user: User | null) {
  if (typeof window === 'undefined') return
  if (!user) {
    window.localStorage.removeItem(DEMO_SESSION_KEY)
    return
  }
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
}

async function upsertProfile(
  name: string,
  email: string,
  role: string | null = null,
): Promise<ProfileRecord | null> {
  const client = getSupabaseClient()
  if (!client) return null

  const { data: sessionData, error: sessionError } = await client.auth.getSession()
  const userId = sessionData?.session?.user?.id

  if (sessionError || !userId) {
    return null
  }

  try {
    const { data, error } = await client
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: name,
          email,
          username: email.split('@')[0],
          role,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      )
      .select()
      .single()

    if (error) {
      return null
    }

    return data as ProfileRecord
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hydrate = async () => {
      const client = getSupabaseClient()

      if (client) {
        const { data: sessionData } = await client.auth.getSession()
        const sessionUser = sessionData.session?.user

        if (sessionUser) {
          const nextUser = {
            name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Verix User',
            email: sessionUser.email || '',
          }

          setUser(nextUser)
          setProfile({
            id: sessionUser.id,
            full_name: nextUser.name,
            email: nextUser.email,
            username: nextUser.email.split('@')[0],
            avatar_url: null,
            bio: null,
            role: sessionUser.user_metadata?.role || null,
          })
        } else {
          const storedUser = readDemoSession()
          if (storedUser) setUser(storedUser)
        }
      } else {
        const storedUser = readDemoSession()
        if (storedUser) setUser(storedUser)
      }

      setLoading(false)
    }

    void hydrate()
  }, [])

  const login = async (name: string, email: string, password?: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const displayName = name.trim() || normalizedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    const client = getSupabaseClient()

    if (client && password) {
      const { data, error } = await client.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      const nextUser = {
        name: data.user?.user_metadata?.full_name || displayName,
        email: normalizedEmail,
      }

      const nextProfile = await upsertProfile(nextUser.name, nextUser.email)
      setUser(nextUser)
      setProfile(nextProfile)
      writeDemoSession(null)
      return { success: true }
    }

    const nextUser = { name: displayName, email: normalizedEmail }
    setUser(nextUser)
    writeDemoSession(nextUser)
    return { success: true }
  }

  const signup = async (name: string, email: string, password: string, role?: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const client = getSupabaseClient()

    if (client) {
      const { data, error } = await client.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: name,
            role: role || 'Student',
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.session) {
        const nextUser = {
          name: data.user?.user_metadata?.full_name || name,
          email: normalizedEmail,
        }
        const nextProfile = await upsertProfile(nextUser.name, nextUser.email, role || 'Student')
        setUser(nextUser)
        setProfile(nextProfile)
        writeDemoSession(null)
        return { success: true }
      }

      return { success: true, requiresConfirmation: true }
    }

    const nextUser = { name, email: normalizedEmail }
    setUser(nextUser)
    writeDemoSession(nextUser)
    return { success: true }
  }

  const logout = async () => {
    const client = getSupabaseClient()
    if (client) {
      await client.auth.signOut()
    }
    setUser(null)
    setProfile(null)
    writeDemoSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, login, signup, logout, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
