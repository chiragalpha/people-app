const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Fixed sign-in credentials — must match exactly. */
export const STATIC_LOGIN = {
  workEmail: 'user@example.invalid',
  password: 'dummy-password',
}

export function isPlausibleAccessToken(value) {
  const token = String(value || '').trim()
  if (token.length < 10) return false
  // HRMS tokens look like: 2520|hash...
  return /^\d+\|[A-Za-z0-9]+$/.test(token) || token.includes('.')
}

export function validateLoginForm({ workEmail, password, bearerToken }) {
  const errors = {}
  const email = workEmail?.trim() ?? ''
  const token = bearerToken?.trim() ?? ''

  if (!token) {
    errors.bearerToken = 'Bearer token is required.'
  } else if (!isPlausibleAccessToken(token)) {
    errors.bearerToken = 'Enter a valid bearer token.'
  }

  if (!email) {
    errors.workEmail = 'Work email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.workEmail = 'Enter a valid email address.'
  } else if (email !== STATIC_LOGIN.workEmail) {
    errors.workEmail = 'Invalid email or password.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password !== STATIC_LOGIN.password) {
    errors.password = 'Invalid email or password.'
  }

  return errors
}

export function isFailureResponse(data, httpStatus) {
  if (httpStatus >= 400) return true
  if (!data || typeof data !== 'object') return false
  if (data.status === 'failure' || data.status === 'error') return true
  if (typeof data.code === 'number' && data.code >= 400) return true
  return false
}

export function isHtmlResponse(text) {
  const sample = String(text || '').trim().slice(0, 64).toLowerCase()
  return sample.startsWith('<!doctype') || sample.startsWith('<html')
}
