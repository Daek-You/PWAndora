import { useState } from 'react'
import MaterialIcon from '../MaterialIcon'

export interface IOption {
  label: string
  value: string
}

export interface IDropdownProps {
  options: Array<IOption>
  onSelect: (option: { label: string; value: string }) => void
  title: string
}

function Dropdown({ options, onSelect, title }: IDropdownProps) {
  const [selected, setSelected] = useState<IOption>()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option: IOption) => {
    setSelected(option)
    onSelect(option)
    setIsOpen(false)
  }

  return (
    <div className='relative inline-block'>
      <button
        className='min-w-24 p-1.5 pl-4 flex flex-row items-center justify-center bg-primary text-white rounded-full font-bold'
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? selected.label : title}
        <MaterialIcon name='arrow_drop_down' size='1.4rem' />
      </button>
      {isOpen && (
        <ul className='absolute w-full mt-2 bg-white border rounded-xl shadow-lg z-10'>
          {options.map(option => (
            <li
              key={option.value}
              className='px-4 py-2'
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
