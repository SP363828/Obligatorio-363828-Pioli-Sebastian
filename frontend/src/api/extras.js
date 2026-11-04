import { request } from './client'

export const recommendResourceApi = (description) =>
  request('/ai/recommend-resource', { method: 'POST', body: { description } })

export const translateApi = (text, target = 'en') =>
  request('/translate', { method: 'POST', body: { text, target } })
