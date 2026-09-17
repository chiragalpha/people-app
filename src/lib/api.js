import { envDefaults } from './collection'
import { isFailureResponse } from './loginValidation'
import { loadSavedEnv } from './storage'

export function currentEnv() {
  return { ...envDefaults(), ...loadSavedEnv() }
}

function apiUrl(path) {
  const settings = currentEnv()
  if (settings.useProxy) return path
  return `${settings.baseUrl}${path}`
}

function headers({ json = true, auth = true, bearerToken } = {}) {
  const settings = currentEnv()
  const token = bearerToken ?? (auth ? settings.bearerToken : '')
  const result = {
    Accept: 'application/json, text/plain, */*',
    OrganizationId: String(settings.organizationId || '1'),
  }
  if (json) result['Content-Type'] = 'application/json'
  if (token) result.Authorization = `Bearer ${token}`
  return result
}

async function parseResponse(response) {
  const text = await response.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: text, status: 'failure' }
  }
  return { data, text }
}

export async function apiRequest(path, { method = 'GET', body, auth = true, bearerToken } = {}) {
  const response = await fetch(apiUrl(path), {
    method,
    headers: headers({ json: body !== undefined, auth, bearerToken }),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const { data } = await parseResponse(response)
  if (!response.ok || isFailureResponse(data, response.status)) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`)
  }
  return data
}

export function unwrap(payload) {
  return payload?.data ?? payload?.result ?? payload
}

export function plainText(value) {
  return String(value ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function asList(value) {
  const data = unwrap(value)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.gridData)) return data.gridData
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.records)) return data.records
  if (Array.isArray(data?.data)) return data.data
  return []
}

export async function loginRequest({ workEmail, password, rememberMe }) {
  try {
    const response = await fetch(apiUrl('/backend/api/login'), {
      method: 'POST',
      headers: headers({ json: true, auth: false }),
      body: JSON.stringify({ workEmail, password, rememberMe: !!rememberMe }),
    })
    const { data } = await parseResponse(response)

    if (!response.ok || isFailureResponse(data, response.status)) {
      return {
        ok: false,
        status: response.status,
        data: { message: data.message || data.error || `Sign-in failed (${response.status})` },
      }
    }

    const token = pickToken(data)
    if (!token) {
      return {
        ok: false,
        status: response.status,
        data: { message: 'Sign-in failed. No access token was returned.' },
      }
    }

    return { ok: true, status: response.status, data }
  } catch (error) {
    return { ok: false, status: 0, data: { message: error.message || 'Sign-in failed.' } }
  }
}

export async function forgotPasswordRequest({ workEmail }) {
  try {
    const data = await apiRequest('/backend/api/login/forgotPass', {
      method: 'POST',
      auth: false,
      body: { workEmail },
    })
    return { ok: true, status: 200, data }
  } catch (error) {
    return { ok: false, status: 400, data: { message: error.message } }
  }
}

export function pickToken(data) {
  return (
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.result?.token ||
    ''
  )
}

export function pickName(data, fallbackEmail) {
  return (
    data?.user?.name ||
    data?.data?.user?.name ||
    data?.data?.fullName ||
    data?.data?.nickName ||
    [data?.data?.firstName, data?.data?.lastName].filter(Boolean).join(' ') ||
    [data?.user?.firstName, data?.user?.lastName].filter(Boolean).join(' ') ||
    fallbackEmail
  )
}

export async function fetchAttendanceProfile() {
  return unwrap(await apiRequest('/backend/api/me/attendance/profile'))
}

export async function fetchDashboard() {
  return unwrap(await apiRequest('/backend/api/home/dashboard'))
}

export async function fetchHolidays(year = new Date().getFullYear()) {
  return asList(await apiRequest(`/backend/api/home/dashboard/holiday?year=${year}`))
}

export async function fetchServerTime() {
  return unwrap(await apiRequest('/backend/api/server-time'))
}

export async function fetchUserDetails(userId) {
  return unwrap(await apiRequest(`/backend/api/organizations/users/${userId}/details`))
}

export async function fetchLeaveBalance(kind, userId) {
  return unwrap(await apiRequest(`/backend/api/me/leave/balances/${kind}/${userId}/details`))
}

export async function fetchPeople() {
  return asList(await apiRequest('/backend/api/organizations/users/find/by/org?is_get_all=true'))
}

export async function fetchGrid(id, body) {
  return asList(await apiRequest(`/backend/api/commonGrid/grid/get?id=${id}`, {
    method: 'POST',
    body,
  }))
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function monthStartIso() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

export async function fetchBreaks() {
  const day = todayIso()
  return fetchGrid('BREAKINOUT', {
    forDashboard: false,
    getCountFlag: true,
    globalFilter: '',
    isSearch: true,
    max: 20,
    moduleData: [['date_format(b.log_time, \'%Y-%m-%d\')', 'BETWEEN', [day, day]]],
    moduleId: 'ME',
    orData: '',
    orderCol: 'b.id',
    orderDir: 'desc',
    placeHolderReplacer: '',
    start: 0,
    subModuleId: 'BREAKINOUT',
  })
}

export async function fetchLeaveRows(userId) {
  const now = new Date()
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-28`
  return fetchGrid('ME_LEAVE', {
    forDashboard: false,
    getCountFlag: true,
    globalFilter: '',
    isSearch: true,
    max: 20,
    moduleData: [
      ['la.employee_id', 'EQ', Number(userId)],
      ['date_format(la.start_date, \'%Y-%m-%d\')', 'LE', end],
      ['date_format(la.end_date, \'%Y-%m-%d\')', 'GE', start],
    ],
    moduleId: 'ME',
    orData: [[['la.is_auto_penalty', 'EQ', 0]], [['la.status', 'NOT_IN', ['REVERSED']]]],
    orderCol: 'la.id',
    orderDir: 'desc',
    placeHolderReplacer: '',
    start: 0,
    subModuleId: 'ME_LEAVE',
  })
}

export async function fetchAttendanceSummary(userId, month) {
  return asList(await apiRequest('/backend/api/me/attendance/summary', {
    method: 'POST',
    body: { month, user_id: Number(userId) },
  }))
}

export async function fetchMaster(path) {
  return asList(await apiRequest(path))
}

export async function fetchMasterRecord(path) {
  return unwrap(await apiRequest(path))
}

export async function createMaster(path, body) {
  return unwrap(await apiRequest(path, { method: 'POST', body }))
}

export async function updateMaster(path, body, method = 'PUT') {
  return unwrap(await apiRequest(path, { method, body }))
}

export async function deleteMaster(path) {
  return unwrap(await apiRequest(path, { method: 'DELETE' }))
}
