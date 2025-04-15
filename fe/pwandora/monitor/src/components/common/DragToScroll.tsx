import { useEffect, useRef } from 'react'
import { dragToScroll } from '../../utils/dragToScroll'

export interface IDragToScrollProps {
  children: React.ReactNode
  className: string
}

export default function DragToScroll({
  children,
  className,
}: IDragToScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      dragToScroll(containerRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ overflowX: 'auto', cursor: 'grab' }}
      className={`no-select ${className}`}
    >
      {children}
    </div>
  )
}
