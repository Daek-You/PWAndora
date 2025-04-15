import { useMutation, useQuery } from '@tanstack/react-query'
import {
  IDashboardOverview,
  IPipelineStatus,
  ISiteProcess,
  ISiteResult,
} from '../types/crawlerData'
import axios from 'axios'

export function useCrawlerStatus() {
  return useQuery({
    queryKey: ['crawlerStatus'],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_CRAWLER_URL}/api/monitoring/status`)
        .then(res => res.data),
    refetchInterval: 3000,
  })
}

export function useRegisterSite() {
  return useMutation({
    mutationFn: (url: string) =>
      axios
        .post(`${import.meta.env.VITE_CRAWLER_URL}/api/site`, { url })
        .then(res => res.data),
  })
}

export function usePipelineStatus() {
  return useQuery<IPipelineStatus>({
    queryKey: ['pipelineStatus'],
    staleTime: Infinity,
    initialData: { status: 'READY', startedAt: '' },
    queryFn: () => Promise.reject(''),
  })
}

export function useDashboardOverview() {
  return useQuery<IDashboardOverview>({
    queryKey: ['dashboardOverview'],
    staleTime: Infinity,
    initialData: {
      processing: {
        value: 0,
        total: 0,
      },
      pwas: {
        value: 0,
        total: 0,
      },
      success: {
        value: 0,
        total: 0,
      },
    },
    enabled: false,
    queryFn: () => Promise.reject(''),
  })
}

export function useSiteProcess() {
  return useQuery<ISiteProcess[]>({
    queryKey: ['siteProcess'],
    staleTime: Infinity,
    initialData: [],
    enabled: false,
    queryFn: () => Promise.reject(''),
  })
}

export function useSiteResult() {
  return useQuery<ISiteResult[]>({
    queryKey: ['siteResult'],
    staleTime: Infinity,
    initialData: [],
    enabled: false,
    queryFn: () => Promise.reject(''),
  })
}
