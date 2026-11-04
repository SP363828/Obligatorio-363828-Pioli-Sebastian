import { request } from './client'

export const getCategoriesApi = (query) => request('/category', { query })
export const createCategoryApi = (data) => request('/category', { method: 'POST', body: data })
export const updateCategoryApi = (id, data) => request(`/category/${id}`, { method: 'PUT', body: data })
export const deleteCategoryApi = (id) => request(`/category/${id}`, { method: 'DELETE' })
