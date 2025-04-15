interface ICrawledDataStep {
  status: IConfirmStatusResponse
  name: string
  iconImageUrl: string
  startUrl: string
}

interface IDisplayInfo {
  deviceName: string
  size: string
  screenshotUrl: string
}

interface IDisplayCompatibilityStep {
  status: IConfirmStatusResponse
  displayInfoDtos: IDisplayInfo[]
}

interface IScreenshotCensorStep {
  status: IConfirmStatusResponse
  screenshotUrls: string[]
}

interface IAiSuggestion {
  summary: string
  description: string
  categories: {
    id: number
    name: string
  }[]
  ageRating: string
}

interface IAiSuggestionStep {
  status: IConfirmStatusResponse
  aiSuggestionDtoMap: {
    [language: string]: IAiSuggestion
  }
}

export interface IAiCensorStep {
  status: IConfirmStatusResponse
  childEndangermentPercent: number
  inappropriateContentPercent: number
  financialServicePercent: number
  realMoneyGamblingPercent: number
  illegalActivityPercent: number
  healthContentServicePercent: number
  blockchainBasedContentPercent: number
  aiGeneratedContentPercent: number
}

interface IPackagingStep {
  status: IConfirmStatusResponse
  packagingData: IPackage[]
}

interface IPackage {
  fileSize: string
  fileType: string
  downloadUrl: string
}

interface ISecurityStep {
  status: IConfirmStatusResponse
  isHttpsActive: boolean
  isCspActive: boolean
}

export interface IAppData {
  crawledDataStepDto: ICrawledDataStep
  aiSuggestionStepDto: IAiSuggestionStep
  screenshotCensorStepDto: IScreenshotCensorStep
  displayCompatibilityStepDto: IDisplayCompatibilityStep
  aiCensorStepDto: IAiCensorStep
  packagingStepDto: IPackagingStep
  securityStepDto: ISecurityStep
}
export type IConfirmStatus = 'done' | 'need confirm' | 'warning'
export type IConfirmStatusResponse = 'DONE' | 'NEED_CONFIRM' | 'WARNING'
