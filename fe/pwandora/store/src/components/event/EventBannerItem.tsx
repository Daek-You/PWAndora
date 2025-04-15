import { Link } from 'react-router'
import AppIcon from '../app/AppIcon'
import { ROUTES } from '@/consts/ROUTES'

export interface IEventBannerItemProps {
  name: string
  title: string
  description: string
  iconUrl: string
  startAt: string
  endAt: string
  color: string
  pwaId: number
}

export default function EventBannerItem(props: IEventBannerItemProps) {
  // if props.color > f0f0f0, make it eeeeee
  const color = props.color.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  let newColor = props.color
  if (r > 136 && g > 136 && b > 136) newColor = '#888888'
  return (
    <div className='snap-center w-full md:w-1/2 lg:w-1/3 grow flex-shrink-0'>
      <Link
        className={`p-2 flex items-center rounded-2xl bg-[${newColor}] gap-4 bg-opacity-15`}
        to={`${ROUTES.APP_DETAIL}?pwaId=${props.pwaId}`}
      >
        <AppIcon iconImage={props.iconUrl} name={props.name} />
        <div className='flex flex-col gap-2'>
          <p className='text-sm'>{props.name}</p>
          <div className='flex flex-col'>
            <p className='font-bold text-lg line-clamp-1'>{props.title}</p>
            <p className='line-clamp-1'>{props.description}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
