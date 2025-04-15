export interface IProgressProps {
  title: string
  value: number
  total: number
  show: 'ratio' | 'value'
  className: string
}

export default function Progress({
  title,
  value,
  total,
  show,
  className,
}: IProgressProps) {
  return (
    <div className='flex flex-col gap-2 items-center py-2'>
      <div className='text-md font-bold'>{title}</div>
      <div className='flex justify-center relative w-full'>
        <div className={`text-5xl w-auto font-bold ${className}`}>
          {show === 'ratio'
            ? total === 0
              ? 0
              : Math.round((value * 100) / total)
            : value}
        </div>
        {show === 'ratio' ? (
          <div className={`absolute text-sm bottom-0 font-bold right-0`}>%</div>
        ) : (
          ''
        )}
      </div>
      <div className='text-sm font-bold'>{`${
        show === 'ratio' ? value : ''
      }/${total}`}</div>
    </div>
  )
}
