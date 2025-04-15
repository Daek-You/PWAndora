import { useState } from 'react'
import { createPortal } from 'react-dom'
import MaterialIcon from './MaterialIcon'
import { useTranslation } from 'react-i18next'

// useSelectModal: 모달 열림/닫힘 상태 관리하는 Hook
export function useSelectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const selectItem = (item: string) => {
    setSelectedItem(item)
    closeModal()
  }

  return { isOpen, openModal, closeModal, selectedItem, selectItem }
}

export interface ISelectModalProps {
  isOpen: boolean
  onClose: () => void
  items: any[]
  names: string[]
  onSelect: (item: any) => void
}

// SelectModal: 문자열 목록을 표시하는 모달 컴포넌트
export function SelectModal({
  isOpen,
  onClose,
  items,
  names,
  onSelect,
}: ISelectModalProps) {
  const { t } = useTranslation()
  if (!isOpen) return null

  return createPortal(
    <div
      className='fixed inset-0 flex items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className='bg-white p-6 rounded-lg shadow-lg w-80 relative'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-600 hover:text-gray-900 hover:cursor-pointer'
        >
          <MaterialIcon name='close' size='24px' />
        </button>
        <h2 className='text-lg font-bold mb-4'>{t('Select item')}</h2>
        <ul>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => onSelect(item)}
              className='p-2 cursor-pointer hover:bg-gray-200 rounded'
            >
              {names[index]}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  )
}
