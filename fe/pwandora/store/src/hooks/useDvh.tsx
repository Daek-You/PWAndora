import { useState, useEffect } from 'react'

const useDvh = () => {
  const [dvh, setDvh] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setDvh(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Initial calculation
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return dvh // Return the height of 100dvh in pixels
}

export default useDvh
