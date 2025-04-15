// 로그인
import { useMutation } from '@tanstack/react-query'
import _axios from './_axios'

export function useLogin() {
  return useMutation({
    mutationFn: ({
      loginId,
      password,
    }: {
      loginId: string
      password: string
    }) =>
      _axios
        .post('/api/users/login', { loginId, password })
        .then(res => res.data),
  })
}

// 회원가입
export function useSignup() {
  return useMutation({
    mutationFn: ({
      loginId,
      password,
      languageId,
    }: {
      loginId: string
      password: string
      languageId: number
    }) =>
      _axios
        .post('/api/users/signup', { loginId, password, languageId })
        .then(res => res.data),
  })
}

// 언어 변경
export function useChangeLanguage() {
  return useMutation({
    mutationFn: (languageId: number) =>
      _axios
        .patch(`/api/users/language`, {}, { params: { languageId } })
        .then(res => res.data),
  })
}
