import { IContent } from './appDetail'

export interface IAppSearchParams {
  page?: number
  size?: number
  sortCriteria?: string
  sortDirection?: string
  name?: string
  category?: string
  hashtag?: string
  language?: string
  isBlocked?: string
  acceptanceStatus?: string
}

export interface Screenshot {
  imageUrl: string
  screenshotOrder: number
  file?: File
}

export interface IUpdateScreenshotParams {
  appId: number
  screenshots: Screenshot[]
}

export interface Category {
  name: string
  categoryOrder: number
}

export interface FileInfo {
  downloadUrl: string
  fileSize: string
  fileType: string
}

export interface AppItem {
  id: number
  iconImage: string
  name: string
  downloadCount: number
  createdAt: string
  updatedAt: string
  acceptanceStatus: 'ACCEPTED' | 'PENDING' | 'REJECTED'
  categories: Category[]
  files: FileInfo[]
}

export interface IUpdateParams {
  id: number
  iconIamge: string
  websiteUrl: string
  version: string
  company: string
  developerSite: string
  blockedAt: string | null
}

export type IUpdateContentParams = Pick<
  IContent,
  'name' | 'summary' | 'description'
>
