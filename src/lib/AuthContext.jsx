import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearAuthStorage,
  hydrateSession,
  isAuthError,
  readStoredSession,
} from './authSession'
import { forgotPasswordRequest } from './api'
import { validateLoginForm } from './loginValidation'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const saved = readStoredSession()
      if (!saved) {
        clearAuthStorage()
        if (!cancelled) {
          setSession(null)
          setAuthReady(true)
        }
        return
      }

      try {
        const next = await hydrateSession(saved)
        if (!cancelled) setSession(next)
      } catch (error) {
        clearAuthStorage()
        if (!cancelled) setSession(null)
      } finally {
        if (!cancelled) setAuthReady(true)
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [])

  async function bootstrapSession({ token, email, userId, organizationId }) {
    const seed = {
      token,
      preview: false,
      name: 'Loading…',
      email: email || '',
      userId: userId || '',
      organizationId: organizationId || import.meta.env.VITE_ORGANIZATION_ID || '1',
      title: '',
      employeeId: '',
      department: '',
      live: true,
    }

    try {
      const next = await hydrateSession(seed)
      setSession(next)
      return next
    } catch (error) {
      clearAuthStorage()
      setSession(null)
      if (isAuthError(error)) {
        throw new Error('Sign-in failed. Check your bearer token or credentials.')
      }
      throw error
    }
  }

  const value = useMemo(() => ({
    session,
    authReady,
    isAuthenticated: Boolean(session?.token),
    user: session || { name: 'Guest', email: '', preview: true },
    async login(form) {
      clearAuthStorage()
      setSession(null)

      const fieldErrors = validateLoginForm(form)
      if (Object.keys(fieldErrors).length) {
        throw new Error(Object.values(fieldErrors)[0])
      }

      // Static email/password are a client gate only; bearer token drives the live API session.
      return bootstrapSession({
        token: form.bearerToken.trim(),
        email: '',
        userId: '',
        organizationId: form.organizationId || import.meta.env.VITE_ORGANIZATION_ID || '1',
      })
    },
    async forgotPassword(workEmail) {
      const result = await forgotPasswordRequest({ workEmail })
      if (!result.ok) {
        throw new Error(result.data?.message || result.data?.error || `Request failed (${result.status})`)
      }
      return result.data
    },
    logout() {
      clearAuthStorage()
      setSession(null)
    },
  }), [session, authReady])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
