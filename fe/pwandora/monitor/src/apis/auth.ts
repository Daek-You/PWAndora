import { useMutation, useQuery } from '@tanstack/react-query'
import _axios from './_axios'
import { ILanguageType } from '../types/auth'

export function useLogin() {
  return useMutation({
    mutationFn: (user: { loginId: string; password: string }) =>
      _axios.post('/users/login', user).then(res => res.data),
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: (user: {
      loginId: string
      password: string
      languageId: number
      email: string
    }) => _axios.post('/users/signup', user).then(res => res.data),
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => _axios.get('/users/me').then(res => res.data),
    enabled: false,
  })
}

export function useLanguage() {
  return useQuery<ILanguageType[]>({
    queryKey: ['language'],
    queryFn: () => _axios.get('/languages').then(res => res.data),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export function usePatchLanguage() {
  return useMutation({
    mutationFn: (languageId: number) => {
      console.log(languageId)
      return _axios
        .patch(`/users/language?languageId=${languageId}`)
        .then(res => res.data)
    },
  })
}
