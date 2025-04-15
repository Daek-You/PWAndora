import MaterialIcon from '../../common/MaterialIcon'

export interface IConfirmItemChipProps {
  name: string
  remove: () => void
}

export default function ConfirmItemChip({
  name,
  remove,
}: IConfirmItemChipProps) {
  return (
    <div className='pl-4 py-1 flex items-center bg-pwandora-foreground-gray rounded-2xl'>
      <span>{name}</span>
      <button
        onClick={remove}
        className='flex items-center p-1 pr-2 hover:cursor-pointer'
      >
        <MaterialIcon name='close' size='22px' />
      </button>
    </div>
  )
}
