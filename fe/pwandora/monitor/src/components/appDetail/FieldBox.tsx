import { ReactNode } from 'react'

export interface IFieldBoxProps {
  field: string
  data: ReactNode
  width?: string
  height?: string
  className?: string
}

export default function FieldBox({
  field,
  data,
  width = '240',
  className = '',
}: IFieldBoxProps) {
  return (
    <div
      className={`flex gap-8 justify-between border border-pwandora-foreground-gray rounded-lg py-3 px-4 w-${width} text-sm ${className}`}
    >
      <div className='font-bold whitespace-nowrap'>{field}</div>
      <div className='whitespace-normal break-words'>{data}</div>
    </div>
  )
}
