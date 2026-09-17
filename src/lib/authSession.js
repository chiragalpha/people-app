import { fetchAttendanceProfile, fetchUserDetails } from './api'
import { envDefaults } from './collection'
import { clearSession, loadSession, saveSession } from './session'
import { saveEnv } from './storage'

export function isValidStoredSession(value) {
  return Boolean(value && !value.preview && String(value.token || '').trim())
}

export function readStoredSession() {
  const saved = loadSession()
  return isValidStoredSession(saved) ? saved : null
}

export function clearAuthStorage() {
  clearSession()
  saveEnv(envDefaults())
}

export function isAuthError(error) {
  const message = String(error?.message || error).toLowerCase()
  return (
    message.includes('401')
    || message.includes('403')
    || message.includes('unauthorized')
    || message.includes('unauthenticated')
  )
}

export async function hydrateSession(seed) {
  const pendingEnv = {
    ...envDefaults(),
    bearerToken: seed.token,
    organizationId: seed.organizationId || import.meta.env.VITE_ORGANIZATION_ID || '1',
    userId: String(seed.userId || ''),
    workEmail: seed.email || '',
  }
  saveEnv(pendingEnv)

  let profile
  try {
    profile = await fetchAttendanceProfile()
  } catch (error) {
    clearAuthStorage()
    throw error
  }

  if (!profile || typeof profile !== 'object') {
    clearAuthStorage()
    throw new Error('Sign-in failed. Token is not valid.')
  }

  if (seed.email) {
    const expected = seed.email.trim().toLowerCase()
    const actual = String(profile.workEmail || profile.email || '').trim().toLowerCase()
    if (actual && expected && actual !== expected) {
      clearAuthStorage()
      throw new Error('Sign-in failed. Credentials do not match this account.')
    }
  }
  const resolvedUserId = (
    seed.userId
    || profile.userId
    || profile.user_id
    || profile.id
    || ''
  )

  let details = {}
  if (resolvedUserId) {
    try {
      details = await fetchUserDetails(resolvedUserId)
    } catch {
      details = {}
    }
  }

  const next = {
    ...seed,
    name: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.nickName || seed.name,
    email: profile.workEmail || seed.email,
    title: profile.jobTitle || '',
    department: profile.department || '',
    employeeId: profile.employeeCode || details.employeeId || '',
    nickname: profile.nickName || details.nickName || '',
    userId: details.id || resolvedUserId,
  }

  saveSession(next)
  saveEnv({
    ...pendingEnv,
    bearerToken: seed.token,
    userId: String(next.userId || ''),
    workEmail: next.email || seed.email || '',
  })

  return next
}
