const KEY = 'people-app-env'

export function loadSavedEnv() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveEnv(env) {
  localStorage.setItem(KEY, JSON.stringify(env))
}
