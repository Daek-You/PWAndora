import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import _axios from './_axios'
import { ILogsSearch } from '../types/logs'

export function useLogsDashboard() {
  return useQuery({
    queryKey: ['logsDashboard'],
    queryFn: () => _axios.get(`/logs/dashboard`).then(res => res.data),
  })
}

export function useLogsPipelines({
  startDate,
  endDate,
}: {
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['logsDashboard', startDate, endDate],
    queryFn: () =>
      _axios
        .get(
          `/logs/pipelines?timeStart=${startDate}T00:00:00&timeEnd=${endDate}T23:59:59`,
        )
        .then(res => res.data),
    enabled: !!startDate && !!endDate,
  })
}

export function useInfiniteLogs({ pipelineId }: { pipelineId: string }) {
  return useInfiniteQuery<ILogsSearch>({
    queryKey: ['logsSearch', pipelineId],
    queryFn: ({ pageParam }) =>
      _axios
        .get(
          `/logs/search?sortDirection=ASC&pipelineId=${pipelineId}&page=${pageParam}`,
        )
        .then(res => res.data),
    getNextPageParam: lastPage => {
      return lastPage.isLast ? undefined : lastPage.page + 1
    },
    initialPageParam: 0,
  })
}
