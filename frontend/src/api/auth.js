import { request } from './client'

export const loginApi = (credentials) => request('/auth/login', { method: 'POST', body: credentials, auth: false })
export const registerApi = (data) => request('/auth/register', { method: 'POST', body: data, auth: false })
export const upgradePlanApi = () => request('/users/me/plan', { method: 'PATCH' })
