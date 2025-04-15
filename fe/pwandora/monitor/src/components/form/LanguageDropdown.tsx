import * as React from 'react'
import { useEffect, useState } from 'react'
import { ILanguageType } from '../../types/auth'
import { useTranslation } from 'react-i18next'
import { Ar, Es, Fr, Jp, Kr, Ru, Us } from 'react-flags-select'
import MaterialIcon from '../common/MaterialIcon'

export interface ILanguageDropdownProps {
  value: number
  languages: ILanguageType[]
  onChange: (value: number) => void
  hideLabel?: boolean
}

export default function LanguageDropdown(props: ILanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const flag = {
    ko: <Kr className='w-6 h-4' />,
    en: <Us className='w-6 h-4' />,
    es: <Es className='w-6 h-4' />,
    fr: <Fr className='w-6 h-4' />,
    ja: <Jp className='w-6 h-4' />,
    ar: <Ar className='w-6 h-4' />,
    ru: <Ru className='w-6 h-4' />,
  }

  const handleSelect = (languageId: number) => {
    props.onChange(languageId)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='relative block min-w-40' ref={dropdownRef}>
      {!props.hideLabel && (
        <label className='block text-md font-medium font-pwandora-gray mb-2'>
          {t('Language')}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full h-10 text-left bg-pwandora-foreground-gray pl-4 pr-2 py-2 rounded-xl flex justify-between items-center cursor-pointer'
      >
        <div className='flex items-center gap-2'>
          {
            flag[
              props.languages.find(language => language.id === props.value)
                ?.code as keyof typeof flag
            ]
          }
          <div>
            {
              props.languages.find(language => language.id === props.value)
                ?.name
            }
          </div>
        </div>
        <MaterialIcon name='Keyboard_arrow_down' size='28px' className='pt-1' />
      </button>

      {isOpen && (
        <ul className='absolute left-0 mt-1 w-full bg-white border border-pwandora-gray rounded-lg shadow-lg overflow-hidden'>
          {props.languages.map(language => (
            <div className='flex items-center gap-3 px-2 hover:bg-pwandora-foreground-gray cursor-pointer'>
              <div>{flag[language.code as keyof typeof flag]}</div>
              <li
                key={language.name}
                className='py-2'
                onClick={() => handleSelect(language.id)}
              >
                {language.name}
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  )
}
