import { useMutation, useQuery } from '@tanstack/react-query'
import _axios from './_axios'
import axios from 'axios'
import {
  IAppSearchParams,
  IUpdateContentParams,
  IUpdateParams,
  IUpdateScreenshotParams,
} from '../types/app'
import { urlToFile } from '../utils/urlToFile'

export function useAppScore(url: string, { enabled = true }) {
  return useQuery({
    queryKey: ['appScore', url],
    queryFn: () =>
      axios
        .get(
          `${import.meta.env.VITE_PAGESPEED_URL}?url=${url}&key=${
            import.meta.env.VITE_PAGESPEED_API_KEY
          }&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`,
        )
        .then(res => res.data),
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export function useAppSearch({
  name,
  category,
  page,
  acceptanceStatus,
  isBlocked,
}: IAppSearchParams) {
  return useQuery({
    queryKey: [
      'search',
      'query',
      name,
      category,
      page,
      acceptanceStatus,
      isBlocked,
    ],
    queryFn: () =>
      _axios
        .get(
          `/monitor/search?page=${page}${name ? `&name=${name}` : ''}${
            category ? `&category=${category}` : ''
          }${
            acceptanceStatus
              ? `&acceptanceStatus=${
                  acceptanceStatus == 'true' ? 'ACCEPTED' : 'NONE'
                }`
              : ''
          }${isBlocked ? `&isBlocked=${isBlocked}` : ''}`,
        )
        .then(res => res.data),
  })
}

export function useAppDetail(id: number) {
  return useQuery({
    queryKey: ['appDetail', id],
    queryFn: () => _axios.get(`/monitor/${id}`).then(res => res.data),
  })
}

export function useBlock() {
  return useMutation({
    mutationFn: (id: number) =>
      _axios.delete(`/monitor/block/${id}`).then(res => res.data),
  })
}

export function useUnBlock() {
  return useMutation({
    mutationFn: (id: number) =>
      _axios.post(`/monitor/block/${id}`).then(res => res.data),
  })
}

export function useUpdate() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IUpdateParams> }) =>
      _axios.patch(`/monitor/${id}`, data).then(res => res.data),
  })
}

export function useUpdateScreenshots() {
  return useMutation({
    mutationFn: async ({ appId, screenshots }: IUpdateScreenshotParams) => {
      const formData = new FormData()

      const screenshotOrders = screenshots.map((_, idx) => idx + 1)

      const imageFiles: File[] = await Promise.all(
        screenshots.map(async (s, idx) => {
          if (s.file) {
            return s.file
          } else {
            return await urlToFile(s.imageUrl, `screenshot${idx + 1}.png`)
          }
        }),
      )

      imageFiles.forEach(file => {
        formData.append('images', file)
      })

      const requestPayload = { screenshotOrders }

      formData.append(
        'request',
        new Blob([JSON.stringify(requestPayload)], {
          type: 'application/json',
        }),
      )

      await _axios.put(`/monitor/${appId}/screenshot`, formData)
    },
  })
}

export function useUpdateContent() {
  return useMutation({
    mutationFn: ({
      appId,
      languageId,
      data,
    }: {
      appId: number
      languageId: number
      data: IUpdateContentParams
    }) =>
      _axios
        .patch(`/monitor/${appId}/${languageId}`, data)
        .then(res => res.data),
  })
}

export function useCategoryList() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => _axios.get('/pwas/categories').then(res => res.data),
    // staleTime: 10 * 60 * 1000, // Cache는 디버깅 마치고 마지막에 추가
  })
}

export function useCategoryListByLanguage(languageCode: string) {
  return useQuery({
    queryKey: ['categories', languageCode],
    queryFn: () =>
      _axios.get(`/pwas/categories/${languageCode}`).then(res => res.data),
    // staleTime: 10 * 60 * 1000, // Cache는 디버깅 마치고 마지막에 추가
  })
}
