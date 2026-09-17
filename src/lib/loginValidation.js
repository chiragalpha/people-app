const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm({ workEmail, password, bearerToken }) {
  const token = bearerToken?.trim()
  if (token) return {}

  const errors = {}
  const email = workEmail?.trim() ?? ''

  if (!email) {
    errors.workEmail = 'Work email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.workEmail = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 5) {
    errors.password = 'Password must be at least 5 characters.'
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
