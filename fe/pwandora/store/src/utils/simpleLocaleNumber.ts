export function simpleLocaleNumber(number: number): string {
  const locale = 'en-US'
  // const locale = navigator.languages[0] || 'en-US'
  const formatter = new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  })

  const formatted = formatter.format(number)

  // Ensure the formatted number has a '+' sign if it's more than 1000
  if (formatted.includes('K'))
    return formatted.replace(/\d+/, match => match) + '+'
  return formatted.replace(/\d+/, match => match)
}
