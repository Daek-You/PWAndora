import { Link } from 'react-router'
import { ROUTES } from '../../consts/ROUTES'

export interface IUncensoredAppItemProps {
  appName: string
  appId: number
  selected: boolean
}

export default function UncensoredAppItem({
  appName,
  appId,
  selected,
}: IUncensoredAppItemProps) {
  return (
    <Link
      to={ROUTES.CONFIRMATION_DETAIL.replace(':appId', appId.toString())}
      className={`px-2 rounded-lg hover:bg-gray-100 text-sm line-clamp-1 leading-8 ${
        selected ? 'bg-gray-200' : ''
      }`}
    >
      {appName}
    </Link>
  )
}
