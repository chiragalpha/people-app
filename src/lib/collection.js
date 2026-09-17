export function envDefaults() {
  return {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://hrms.nsegindia.com',
    organizationId: import.meta.env.VITE_ORGANIZATION_ID || '1',
    bearerToken: '',
    userId: '',
    workEmail: '',
    useProxy: import.meta.env.VITE_USE_PROXY !== 'false',
  }
}

export const secretKeys = new Set(['bearerToken', 'password'])
