import { useMutation, useQuery } from '@tanstack/react-query'
import _axios from './_axios'

export function useUncensoredAppList(params: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['uncensoredAppList', params],
    queryFn: () =>
      _axios
        .get('/acceptance/uncensored', {
          params: {
            sortCriteria: 'updatedAt',
            ...params,
          },
        })
        .then(res => res.data),
  })
}

export function useUncensoredAppDetail(appId: number) {
  return useQuery({
    queryKey: ['uncensoredAppDetail', appId],
    queryFn: () =>
      _axios.get(`/acceptance/uncensored/${appId}`).then(res => res.data),
  })
}

export function useLighthouseTest({ url }: { url: string }) {
  return useQuery({
    queryKey: ['lighthouseTest', url],
    queryFn: () =>
      _axios
        .get(`/acceptance/lighthouse`, {
          params: {
            url,
          },
        })
        .then(res => res.data),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useApproveApp() {
  return useMutation({
    mutationFn: (params: { formData: FormData; appId: number }) => {
      const { formData, appId } = params
      return _axios.post(`/acceptance/register/${appId}`, formData)
    },
  })
}
