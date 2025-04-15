import { ROUTES } from '@/consts/ROUTES'
import { Link } from 'react-router'

export interface ISearchCardProps {
  name: string
  pathVariable: string
  children?: React.ReactNode
}

export default function SearchCard(props: ISearchCardProps) {
  return (
    <div className='w-full md:w-1/2 lg:w-1/2 p-3'>
      <Link
        to={`${ROUTES.APPS}?${props.pathVariable}`}
        className='p-5 flex flex-row min-h-24 justify-between rounded-3xl bg-foreground-bright'
      >
        <p className='font-bold text-lg'>{props.name}</p>
        {props.children}
      </Link>
    </div>
  )
}
