import { NavLink } from 'react-router'

export interface INavMenuProps {
  value: string
  to?: string
  onClick?: () => void
}

export default function INavMenu(props: INavMenuProps) {
  if (props.to) {
    return (
      <NavLink
        to={props.to}
        className={({ isActive }) =>
          `text-lg font-semibold cursor-pointer${
            isActive ? ' text-pwandora-active' : ''
          }`
        }
      >
        {props.value}
      </NavLink>
    )
  }

  return (
    <div
      className={'text-lg font-semibold cursor-pointer'}
      onClick={props.onClick}
    >
      {props.value}
    </div>
  )
}
