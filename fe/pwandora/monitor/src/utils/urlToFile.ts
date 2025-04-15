export async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  const ext = url.split('.').pop()?.split('?')[0] || 'png'
  const mimeType = blob.type || `image/${ext}`
  return new File([blob], filename, { type: mimeType })
}

export async function urlsToFiles(urls: string[]): Promise<File[]> {
  const files = await Promise.all(
    urls.map((url, index) => urlToFile(url, `image-${index}.png`)),
  )
  return files
}
