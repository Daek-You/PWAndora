export function dragToScroll(element: HTMLElement) {
  let isDown = false
  let startX: number
  let scrollLeft: number

  element.addEventListener('mousedown', e => {
    isDown = true
    element.classList.add('active')
    startX = e.pageX - element.offsetLeft
    scrollLeft = element.scrollLeft
  })

  element.addEventListener('mouseleave', () => {
    isDown = false
    element.classList.remove('active')
  })

  element.addEventListener('mouseup', () => {
    isDown = false
    element.classList.remove('active')
  })

  element.addEventListener('mousemove', e => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - element.offsetLeft
    const walk = x - startX // Adjust speed
    element.scrollLeft = scrollLeft - walk
  })
}
