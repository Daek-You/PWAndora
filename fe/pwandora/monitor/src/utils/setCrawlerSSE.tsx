import { QueryClient } from '@tanstack/react-query'
import {
  IDashboardOverview,
  ISiteProcess,
  ISiteProcessResponse,
  ISiteResult,
  ISiteResultResponse,
  TProgress,
} from '../types/crawlerData'

let eventSource: EventSource | null = null

function findEndProcess(data: ISiteProcess[]): number {
  for (let i = data.length - 1; i >= 0; i--) {
    if (
      data[i].checkPWA.status === 'FAILED' ||
      data[i].tizenPackaging.status === 'FAILED' ||
      data[i].androidPackaging.status === 'FAILED' ||
      data[i].takeScreenshots.status === 'FAILED' ||
      data[i].aiDataGeneration.status === 'FAILED' ||
      data[i].aiDataGeneration.status == 'SUCCESS'
    ) {
      return i
    }
  }
  return -1
}

function setProcessData(
  data: ISiteProcessResponse,
  oldData: ISiteProcess[],
): ISiteProcess[] {
  const {
    site: { id, url },
    timestamp,
    details: {
      checkPWA,
      tizenPackaging,
      androidPackaging,
      takeScreenshots,
      aiDataGeneration,
    },
  } = data

  const newData: ISiteProcess[] = [...oldData]
  const existIndex = newData.findIndex(item => item.id === id)

  if (existIndex !== -1) {
    newData[existIndex] = changeProgress({
      ...newData[existIndex],
      timestamp,
      checkPWA,
      tizenPackaging,
      androidPackaging,
      takeScreenshots,
      aiDataGeneration,
    })
    return newData
  }

  if (newData.length < 10) {
    return [
      changeProgress({
        id,
        url,
        timestamp,
        checkPWA,
        tizenPackaging,
        androidPackaging,
        takeScreenshots,
        aiDataGeneration,
      }),
      ...newData,
    ]
  }

  const endIndex = findEndProcess(newData)

  if (endIndex === -1) {
    return newData
  }

  newData.splice(endIndex, 1)

  return [
    changeProgress({
      id,
      url,
      timestamp,
      checkPWA,
      tizenPackaging,
      androidPackaging,
      takeScreenshots,
      aiDataGeneration,
    }),
    ...newData,
  ]
}

function changeProgress(data: ISiteProcess): ISiteProcess {
  const {
    checkPWA,
    tizenPackaging,
    androidPackaging,
    takeScreenshots,
    aiDataGeneration,
  } = data
  if (checkPWA.status === 'READY') {
    return { ...data, checkPWA: { status: 'INPROGRESS' } }
  }

  if (
    checkPWA.status === 'SUCCESS' &&
    (tizenPackaging.status === 'READY' ||
      androidPackaging.status === 'READY' ||
      takeScreenshots.status === 'READY')
  ) {
    const tmpTizenPackaging: TProgress =
      tizenPackaging.status === 'READY'
        ? { status: 'INPROGRESS' }
        : tizenPackaging
    const tmpAndroidPackaging: TProgress =
      androidPackaging.status === 'READY'
        ? { status: 'INPROGRESS' }
        : androidPackaging
    const tmpTakeScreenshots: TProgress =
      takeScreenshots.status === 'READY'
        ? { status: 'INPROGRESS' }
        : takeScreenshots
    return {
      ...data,
      tizenPackaging: tmpTizenPackaging,
      androidPackaging: tmpAndroidPackaging,
      takeScreenshots: tmpTakeScreenshots,
    }
  }

  if (
    tizenPackaging.status === 'SUCCESS' &&
    androidPackaging.status === 'SUCCESS' &&
    takeScreenshots.status === 'SUCCESS' &&
    aiDataGeneration.status === 'READY'
  ) {
    return { ...data, aiDataGeneration: { status: 'INPROGRESS' } }
  }

  return data
}

function setResultData(
  data: ISiteResultResponse,
  oldData: ISiteResult[],
): ISiteResult[] {
  const {
    site: { id, url },
    status,
    timestamp,
    details: { name, pwaId },
  } = data

  if (oldData.find(item => item.id === id)) {
    return oldData
  }
  const newData = [{ id, pwaId, status, timestamp, name, url }, ...oldData]

  return newData.slice(0, 9)
}

export function setCrawlerSSE(queryClient: QueryClient) {
  if (eventSource) return

  eventSource = new EventSource(
    `${import.meta.env.VITE_CRAWLER_URL}/api/monitoring/sse`,
  )

  eventSource.addEventListener('pwaCrawler', event => {
    const data = JSON.parse((event as MessageEvent).data)

    if (data.type === 'initialData') {
      const {
        pipelineStatus: { status, startedAt },
        dashboardOverview,
        siteProcess,
        siteResult,
      } = data

      queryClient.setQueryData(['pipelineStatus'], () => {
        return { status, startedAt }
      })

      queryClient.setQueryData(
        ['dashboardOverview'],
        (oldData: IDashboardOverview) => {
          if (oldData.processing.total === 0) return dashboardOverview
          return oldData
        },
      )

      queryClient.setQueryData(['siteProcess'], (oldData: ISiteProcess[]) => {
        return siteProcess.reduce(
          (acc: ISiteProcess[], cur: ISiteProcessResponse) => {
            return setProcessData(cur, acc)
          },
          oldData,
        )
      })

      queryClient.setQueryData(['siteResult'], (oldData: ISiteResult[]) => {
        console.log('siteResult: ', siteResult)
        return siteResult.reduce(
          (acc: ISiteResult[], cur: ISiteResultResponse) => {
            console.log(acc)
            return setResultData(cur, acc)
          },
          oldData,
        )
      })
    }

    if (data.type === 'pipelineStatus') {
      const { status, startedAt } = data
      queryClient.setQueryData(['pipelineStatus'], () => {
        return { status, startedAt }
      })
      return
    }

    if (data.type === 'dashboardOverview') {
      queryClient.setQueryData(['dashboardOverview'], () => {
        return data.summary
      })
      return
    }

    if (data.type === 'siteProcess') {
      queryClient.setQueryData(
        ['siteProcess'],
        (oldData: ISiteProcess[] = []) => {
          return setProcessData(data, oldData)
        },
      )
    }

    if (data.type === 'siteResult') {
      queryClient.setQueryData(
        ['siteResult'],
        (oldData: ISiteResult[] = []) => {
          return setResultData(data, oldData)
        },
      )
    }
  })

  eventSource.onerror = error => {
    console.error('❌ SSE 연결 오류:', error)
    eventSource?.close()
  }

  return () => {
    eventSource?.close()
  }
}
