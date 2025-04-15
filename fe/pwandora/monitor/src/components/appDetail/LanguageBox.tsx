import * as React from 'react'

export interface ILanguageBoxProps {
  code: string
  flag: React.ReactNode
  value: string
  name: string
  checked: boolean
  onClick: (value: string) => void
}

export default function LanguageBox(props: ILanguageBoxProps) {
  const handleClick = () => {
    props.onClick(props.code)
  }
  return (
    <label
      htmlFor={props.code}
      onClick={handleClick}
      className={`flex justify-center gap-1 items-center border border-pwandora-foreground-gray px-2 py-1 rounded-md text-sm font-semibold cursor-pointer ${
        props.checked ? 'bg-pwandora-active text-white' : ''
      }`}
    >
      <input
        id={props.code}
        type='radio'
        name={props.name}
        className='hidden'
      />
      {props.flag} {props.value}
    </label>
  )
}
