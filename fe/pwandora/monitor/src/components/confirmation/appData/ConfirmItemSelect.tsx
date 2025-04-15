import MaterialIcon from '../../common/MaterialIcon'

export interface IConfirmItemSelectProps {
  value: string
  onChange: any
}

export default function ConfirmItemSelect({
  value,
  onChange,
}: IConfirmItemSelectProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      <button
        onClick={onChange}
        className='flex item-center rounded-full pl-4 pr-2 p-2 bg-pwandora-foreground-gray hover:cursor-pointer'
      >
        {value}
        <MaterialIcon name='arrow_drop_down' size='24px' />
      </button>
    </div>
  )
}
