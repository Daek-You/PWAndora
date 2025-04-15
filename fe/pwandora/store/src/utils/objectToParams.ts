export const objectToParams = (obj: { [key: string]: any }) => {
  return Object.keys(obj)
    .map(key => {
      return obj[key] ? `${key}=${obj[key]}` : ''
    })
    .filter(Boolean)
    .join('&')
}
