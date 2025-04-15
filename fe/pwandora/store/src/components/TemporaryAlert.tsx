import { useEffect, useState } from 'react'

export interface ITemporaryAlertProps {
  content: string
  duration: number
}

export default function TemporaryAlert(props: ITemporaryAlertProps) {
  const { content, duration } = props
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    setVisible(true) // Trigger fade-in effect

    const fadeOutTimeout = setTimeout(() => {
      setFading(true)
      console.log('fading out')
    }, duration - 200) // Start fade-out 1 second before disappearing

    return () => {
      clearTimeout(fadeOutTimeout)
    }
  }, [duration])

  return (
    <div
      className='fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50'
      style={{
        transition: 'opacity 0.2s ease-in-out',
        opacity: visible ? (fading ? '0' : '1') : '0',
      }}
    >
      <div className='bg-foreground-gray px-6 py-4 text-lg rounded-2xl shadow-lg'>
        {content}
      </div>
    </div>
  )
}
