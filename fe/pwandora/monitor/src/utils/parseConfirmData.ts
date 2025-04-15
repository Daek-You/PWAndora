import {
  IAppData,
  IConfirmStatus,
  IConfirmStatusResponse,
} from '../types/confirmation'

export function parseConfirmStatus(data: IAppData): {
  crawledData: IConfirmStatus
  aiSuggestions: IConfirmStatus
  screenshots: IConfirmStatus
  displayCompatibility: IConfirmStatus
  aiCensor: IConfirmStatus
  packaging: IConfirmStatus
  lighthouseTest: IConfirmStatus
  security: IConfirmStatus
} {
  const newConfirms = {
    crawledData: data.crawledDataStepDto.status,
    aiSuggestions: data.aiSuggestionStepDto.status,
    screenshots: data.screenshotCensorStepDto.status,
    displayCompatibility: data.displayCompatibilityStepDto.status,
    aiCensor: data.aiCensorStepDto.status,
    packaging: data.packagingStepDto.status,
    lighthouseTest: 'NEED_CONFIRM' as IConfirmStatusResponse,
    security: data.securityStepDto.status,
  }

  // lowercase values
  const parsedStatus: {
    crawledData: IConfirmStatus
    aiSuggestions: IConfirmStatus
    screenshots: IConfirmStatus
    displayCompatibility: IConfirmStatus
    aiCensor: IConfirmStatus
    packaging: IConfirmStatus
    lighthouseTest: IConfirmStatus
    security: IConfirmStatus
  } = {
    crawledData: 'need confirm',
    aiSuggestions: 'need confirm',
    screenshots: 'need confirm',
    displayCompatibility: 'need confirm',
    aiCensor: 'need confirm',
    packaging: 'need confirm',
    lighthouseTest: 'need confirm',
    security: 'need confirm',
  }

  ;(Object.keys(newConfirms) as Array<keyof typeof newConfirms>).forEach(
    key => {
      if (!newConfirms[key]) return
      parsedStatus[key] = newConfirms[key]
        .toLowerCase()
        .replace('_', ' ') as IConfirmStatus
    },
  )
  return parsedStatus
}
