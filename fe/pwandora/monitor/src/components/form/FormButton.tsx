import { Link } from 'react-router'

export interface IFormButtonProps {
  value: string
  onClick?: () => void
  to?: string
}

export default function FormButton(props: IFormButtonProps) {
  if (props.to) {
    return (
      <Link
        className='block grid place-items-center rounded-xl bg-pwandora-foreground-gray h-11 px-4 font-semibold'
        to={props.to}
      >
        {props.value}
      </Link>
    )
  }
  return (
    <button
      className='block rounded-xl bg-pwandora-foreground-gray h-11 px-4 font-semibold cursor-pointer'
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}
