export interface IAppListItem {
  id: number
  name: string
  description: string
  iconImage: string
  downloadCount: number
  categories: { name: string }[]
  installed: boolean
  files: { downloadUrl: string; fileType: string }[]
  appId: string
  summary?: string
}
