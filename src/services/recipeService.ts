import { api } from './api'
import type { Recipe, ListFilters, RecipesResponse } from '../types'

export const PAGE_SIZE = 8

export const recipeService = {
  list: async ({ page, q }: ListFilters): Promise<RecipesResponse> => {
    const trimmedQuery = q.trim()
    const params = {
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }

    if (trimmedQuery) {
      const { data } = await api.get('/auth/recipes/search', { params: { q: trimmedQuery, ...params } })
      return data
    }

    const { data } = await api.get('/auth/recipes', { params })
    return data
  },

  getById: async (id: number): Promise<Recipe> => {
    const { data } = await api.get(`/auth/recipes/${id}`)
    return data
  },

  create: async (body: FormData): Promise<Recipe> => {
    const { data } = await api.post('/recipes/add', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  remove: async (id: number): Promise<Recipe> => {
    const { data } = await api.delete(`/recipes/${id}`)
    return data
  },
}
