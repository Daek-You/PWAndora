import TemporaryAlert from '@/components/TemporaryAlert'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface IAlert {
  content: string
  duration: number
}

export default function useTemporaryPortal() {
  const [currentAlert, setCurrentAlert] = useState<IAlert | null>(null)
  const queue = useRef<IAlert[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const showNextAlert = () => {
    if (queue.current.length === 0) {
      setCurrentAlert(null)
      return
    }

    const alert: IAlert | undefined = queue.current.shift()
    setCurrentAlert(alert || null)
    if (!alert) return

    startTimeRef.current = Date.now()

    timeoutRef.current = setTimeout(() => {
      showNextAlert()
    }, alert.duration)
  }

  const showTemporaryElement = (content: string, duration = 3000) => {
    if (currentAlert && startTimeRef.current && timeoutRef.current) {
      const elapsedTime = Date.now() - startTimeRef.current
      const remainingTime = currentAlert.duration - elapsedTime
      const newDuration = Math.min(remainingTime, 1000)

      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        showNextAlert()
      }, newDuration)

      currentAlert.duration = newDuration
      queue.current.push({ content, duration })
    } else {
      queue.current.push({ content, duration })
      showNextAlert()
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    showTemporaryElement,
    TemporaryPortal: () =>
      createPortal(
        <div>
          {currentAlert && (
            <TemporaryAlert
              content={currentAlert.content}
              duration={currentAlert.duration}
            />
          )}
        </div>,
        document.body,
      ),
  }
}
