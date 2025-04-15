import { NavLink } from 'react-router'
import MaterialIcon from '../components/MaterialIcon'

export interface IFooterItemProps {
  icon: string
  name: string
  link: string
}

export default function FooterItem(props: IFooterItemProps) {
  const getClassName = ({ isActive }: { isActive: boolean }) =>
    `py-1 flex flex-col grow items-center justify-center rounded-3xl ${
      isActive ? 'text-black bg-foreground-gray' : 'text-gray'
    }`

  return (
    <NavLink to={props.link} className={getClassName} replace>
      <MaterialIcon name={props.icon} filled size='2em'></MaterialIcon>
      <span className={`font-bold text-[0.8rem]`}>{props.name}</span>
    </NavLink>
  )
}
