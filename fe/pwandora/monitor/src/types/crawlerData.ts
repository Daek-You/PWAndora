export interface IPipelineStatus {
  status: 'READY' | 'INPROGRESS' | 'ERROR'
  startedAt: string
  endedAt?: string
}

export type TProgress = {
  status: 'READY' | 'INPROGRESS' | 'SUCCESS' | 'FAILED'
  timestamp?: string
}

export interface IDashboardOverview {
  processing: { value: number; total: number }
  pwas: { value: number; total: number }
  success: { value: number; total: number }
}

export interface ISiteProcess {
  id: number
  url: string
  timestamp: string
  checkPWA: TProgress
  tizenPackaging: TProgress
  androidPackaging: TProgress
  takeScreenshots: TProgress
  aiDataGeneration: TProgress
}

export interface ISiteResult {
  id: number
  timestamp: string
  status: 'SUCCESS' | 'FAILED'
  name: string
  url: string
  pwaId?: number
}

export interface ISiteProcessResponse {
  site: {
    id: number
    url: string
  }
  timestamp: string
  details: {
    timestamp: string
    checkPWA: TProgress
    tizenPackaging: TProgress
    androidPackaging: TProgress
    takeScreenshots: TProgress
    aiDataGeneration: TProgress
  }
}

export interface ISiteResultResponse {
  site: {
    id: number
    url: string
  }
  status: 'SUCCESS' | 'FAILED'
  timestamp: string
  details: {
    name: string
    pwaId?: number
  }
}
