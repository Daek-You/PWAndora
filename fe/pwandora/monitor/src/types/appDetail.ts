export interface IScreenshot {
  imageUrl: string
  screenshotOrder: number
}

export interface ICategory {
  name: string
  categoryOrder: number
  categoryImage: string
  id: number
}

export interface IHashtag {
  name: string
}

export interface ILanguage {
  name: string
  code: string
}

export interface IPermission {
  name: string
  isRequired: boolean
}

export interface IFile {
  downloadUrl: string
  fileSize: string
  fileType: string
}

export interface IContent {
  name: string
  summary: string
  description: string
  languageId: number
  languageName: string
  languageCode: string
}

export interface IAppDetail {
  id: number
  iconImage: string
  websiteUrl: string
  avgScore: number
  downloadCount: number
  version: string
  company: string
  developerSite: string
  blockedAt: string
  createdAt: string
  updatedAt: string
  acceptanceStatus: string
  display: {
    minWidth: number
    maxWidth: number
    minHeight: number
    maxHeight: number
  }
  screenshots: IScreenshot[]
  categories: ICategory[]
  hashtags: IHashtag[]
  languages: ILanguage[]
  permissions: IPermission[]
  files: IFile[]
  contents: IContent[]
}
