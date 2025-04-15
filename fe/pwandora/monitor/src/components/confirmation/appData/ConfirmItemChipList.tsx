import MaterialIcon from '../../common/MaterialIcon'
import ConfirmItemChip from './ConfirmItemChip'

export interface IConfirmItemChipListProps {
  items: {
    id: number
    name: string
  }[]
  onAdd: () => void
  onRemove: (id: number) => void
}

export default function ConfirmItemChipList({
  items,
  onAdd,
  onRemove,
}: IConfirmItemChipListProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      <button onClick={onAdd}>
        <MaterialIcon
          name='add'
          size='24px'
          className='rounded-full p-2 bg-pwandora-foreground-gray hover:cursor-pointer'
        />
      </button>
      {items.map((item, index) => (
        <ConfirmItemChip
          name={item.name}
          key={index}
          remove={() => onRemove(item.id)}
        />
      ))}
    </div>
  )
}
