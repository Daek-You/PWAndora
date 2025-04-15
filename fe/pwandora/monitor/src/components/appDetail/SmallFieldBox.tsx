export interface ISmallFieldBoxProps {
  field: string
  data: string | number
  className?: string
}

export default function SmallFieldBox(props: ISmallFieldBoxProps) {
  return (
    <div
      className={`flex justify-between items-center border border-pwandora-foreground-gray rounded-md px-2 h-6 w-40 ${props.className} text-xs`}
    >
      <div className='font-semibold'>{props.field}</div>
      <div>{props.data}</div>
    </div>
  )
}
