import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearAuthStorage,
  hydrateSession,
  isAuthError,
  readStoredSession,
} from './authSession'
import {
  forgotPasswordRequest,
  loginRequest,
  pickToken,
} from './api'
import { STATIC_LOGIN, validateLoginForm } from './loginValidation'
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

      const organizationId = form.organizationId || import.meta.env.VITE_ORGANIZATION_ID || '1'
      const email = form.workEmail?.trim() || ''
      const password = form.password || ''
      const token = form.bearerToken?.trim() || ''
      const usingCredentials = Boolean(email || password)

      if (usingCredentials) {
        const fieldErrors = validateLoginForm(form)
        if (Object.keys(fieldErrors).length) {
          throw new Error(Object.values(fieldErrors)[0])
        }

        const result = await loginRequest({
          workEmail: STATIC_LOGIN.workEmail,
          password: STATIC_LOGIN.password,
          rememberMe: form.rememberMe,
        })
        if (!result.ok) {
          throw new Error(result.data?.message || result.data?.error || `Sign-in failed (${result.status})`)
        }

        const loginToken = pickToken(result.data)
        if (!loginToken) {
          throw new Error('Sign-in failed. No access token was returned.')
        }

        return bootstrapSession({
          token: loginToken,
          email: STATIC_LOGIN.workEmail,
          userId: '',
          organizationId,
        })
      }

      if (token) {
        return bootstrapSession({
          token,
          email: '',
          userId: '',
          organizationId,
        })
      }

      throw new Error('Enter work email and password, or paste a bearer token.')
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
