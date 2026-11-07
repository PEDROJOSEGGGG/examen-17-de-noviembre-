  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { recipeService } from '../services/recipeService'
import type { ListFilters } from '../types'
import { getErrorMessage } from '../utils/errorHandler'

export function useRecipes(filters: ListFilters) {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => recipeService.list(filters),
    placeholderData: (previousData) => previousData,
  })
}

export function useRecipe(id: number) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.getById(id),
    enabled: Number.isFinite(id) && id > 0,
    retry: false,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: FormData) => recipeService.create(body),
    onSuccess: (_, __, context) => {
      toast.success('Receta creada con éxito')
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      context?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => recipeService.remove(id),
    onSuccess: () => {
      toast.success('Receta eliminada')
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
