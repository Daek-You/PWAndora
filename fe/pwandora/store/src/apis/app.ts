import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import _axios from './_axios'

// PWA 다운로드
export function downloadPwa(pwaId: number, fileType: string) {
  _axios.get(`/api/users/pwa/${pwaId}?fileType=${fileType}`)
}

// PWA 제거
export function useDeletePwa() {
  return useMutation({
    mutationFn: ({ pwaId }: { pwaId: number }) =>
      _axios.delete(`/api/users/pwa/${pwaId}`),
  })
}

// 사용자의 앱 목록 조회
export function useMyApps() {
  return useQuery({
    queryKey: ['myApps'],
    queryFn: () => _axios.get('/api/users/my-apps').then(res => res.data),
  })
}

// 언어 목록 조회
export function useLanguages() {
  return useQuery({
    queryKey: ['languages'],
    queryFn: () => _axios.get('/api/languages').then(res => res.data),
  })
}

// PWA 상세 조회
export function usePwaDetail(id: number) {
  return useQuery({
    queryKey: ['pwaDetail', id],
    queryFn: () => _axios.get(`/api/pwas/${id}`).then(res => res.data),
    staleTime: 1000 * 60 * 60,
  })
}

// PWA 카테고리 목록 조회
export function usePwaCategories() {
  return useQuery({
    queryKey: ['pwaCategories'],
    queryFn: () => _axios.get('/api/pwas/categories').then(res => res.data),
    staleTime: 1000 * 60 * 60,
  })
}

// PWA 검색

export function useSearchPwas(params: {
  page?: number
  size?: number
  sortCriteria?: string
  sortDirection?: string
  name?: string
  category?: string
  hashtag?: string
  language?: string
}) {
  return useInfiniteQuery({
    queryKey: ['searchPwas', params],
    queryFn: ({ pageParam }) =>
      _axios
        .get('/api/pwas/search', { params: { ...params, page: pageParam } })
        .then(res => res.data),
    getNextPageParam: (lastPage, _allPages) => {
      return lastPage.page < lastPage.totalPageCount ? lastPage.page + 1 : null
    },
    initialPageParam: 0,
  })
}

// events 조회
export function useGetEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => _axios.get('/api/events').then(res => res.data),
  })
}
