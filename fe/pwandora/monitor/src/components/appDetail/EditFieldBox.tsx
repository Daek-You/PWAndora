import * as React from 'react'

export interface IEditFieldBoxProps {
  field: string
  value: string
  onChange: (value: string) => void
  width?: string
  className?: string
}

export default function EditFieldBox({
  field,
  value,
  onChange,
  width = '240',
  className = '',
}: IEditFieldBoxProps) {
  return (
    <div
      className={`flex gap-8 justify-between items-start border border-pwandora-gray rounded-lg py-3 px-4 w-${width} text-sm ${className}`}
    >
      <div className='font-bold whitespace-nowrap'>{field}</div>
      <textarea
        className='bg-transparent outline-none resize-none field-sizing-content whitespace-normal break-words'
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      />
    </div>
  )
}
