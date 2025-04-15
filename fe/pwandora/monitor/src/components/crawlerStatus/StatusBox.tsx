import { ReactNode } from 'react'

export interface IStatusBoxProps {
  name: string
  value: string | ReactNode
}

export default function StatusBox({ name, value }: IStatusBoxProps) {
  return (
    <div className='flex flex-col items-center gap-2 py-6 border border-pwandora-gray rounded-xl'>
      <div className='text-md font-bold'>{name}</div>
      {typeof value === 'string' ? (
        <div className='text-md font-bold'>{value}</div>
      ) : (
        value
      )}
    </div>
  )
}
