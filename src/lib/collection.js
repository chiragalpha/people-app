export function envDefaults() {
  return {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
    organizationId: import.meta.env.VITE_ORGANIZATION_ID || '1',
    bearerToken: '',
    userId: import.meta.env.VITE_USER_ID || '0',
    workEmail: import.meta.env.VITE_WORK_EMAIL || 'user@example.invalid',
    useProxy: import.meta.env.VITE_USE_PROXY !== 'false',
  }
}

export const secretKeys = new Set(['bearerToken', 'password'])
