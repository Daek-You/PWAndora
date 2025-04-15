export interface IPipelineStatusDetail {
  savedPwaCount: number
  totalProcessed: number
  pwaCount: number
  errorCount: number
  executionTime: number
  noPwaCount: number
}

export type TLogLevel = 'TRACE' | 'INFO' | 'ERROR' | 'WARN'

export type TLogType = 'pipelineStatus' | 'siteProcess' | 'siteStep'

export type TLogStatus =
  | 'SUCCESS'
  | 'FAILED'
  | 'ERROR'
  | 'FINISHED'
  | 'INPROGRESS'

export interface ILogContent {
  pipelineId: string
  logLevel: 'INFO' | 'ERROR'
  type: string
  status: TLogStatus
  message: string
  timestamp: string
  siteId: number | null
  siteUrl: string | null
  details: IPipelineStatusDetail | null
}

export interface ILogsSearch {
  content: ILogContent[]
  page: number
  size: number
  isLast: boolean
  total: number
  totalPageCount: number
}
