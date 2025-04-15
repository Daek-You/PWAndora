import * as React from 'react'

export interface ICardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: ICardProps) {
  return (
    <div
      className={`bg-white shadow-lg shadow-gray-200 rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  )
}
