import MaterialIcon from '../common/MaterialIcon'

export interface IStepIconProps {
  name: string
  title: string
}

export default function StepIcon({ name, title }: IStepIconProps) {
  return (
    <div className='flex flex-col items-center w-15 gap-1 z-1'>
      <div className='flex justify-center items-center h-15 w-15 text-pwandora-gray border-5 rounded-full bg-white'>
        <MaterialIcon name={name} size='32px' />
      </div>
      <div className='text-center text-xs/4 break-keep'>{title}</div>
    </div>
  )
}
