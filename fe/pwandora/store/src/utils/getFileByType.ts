export interface IFile {
  downloadUrl: string
  fileSize: string
  fileType: string
}

export function getFileByType(files: Array<IFile>, type: string) {
  return files.find(file => file.fileType == type)
}
