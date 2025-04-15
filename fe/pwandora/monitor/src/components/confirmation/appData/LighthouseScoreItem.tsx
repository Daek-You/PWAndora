import ConfirmItem from './ConfirmItem'

export interface ILighthouseScoreItemProps {
  name: string
  value: number
}

export default function LighthouseScoreItem({
  name,
  value,
}: ILighthouseScoreItemProps) {
  const getColor = (value: number) => {
    if (value >= 90) return 'bg-pwandora-green'
    if (value >= 60) return 'bg-pwandora-primary'
    return 'bg-pwandora-red'
  }
  return (
    <ConfirmItem name={name}>
      <div className='flex items-center gap-4'>
        <p className='text-center'>{value}</p>
        <div className='w-full h-2 bg-gray-200 rounded-full'>
          <div
            className={`h-2 ${getColor(value)} rounded-full`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    </ConfirmItem>
  )
}
