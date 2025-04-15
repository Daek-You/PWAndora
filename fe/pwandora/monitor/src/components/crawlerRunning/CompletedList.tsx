import { Link } from 'react-router'
import { ROUTES } from '../../consts/ROUTES'
import MaterialIcon from '../common/MaterialIcon'
import { useSiteResult } from '../../apis/crawler'

export default function CompletedList() {
  const { data: datas } = useSiteResult()

  return (
    <div className='flex flex-col'>
      {datas.map(data => {
        if (data.status === 'SUCCESS') {
          return (
            <Link
              key={data.id}
              to={`${ROUTES.APP}/${data.pwaId}`}
              className='flex gap-2 items-center h-10.5 border-t border-pwandora-foreground-gray p-2 truncate'
            >
              <MaterialIcon
                name='Check_circle'
                size='20px'
                filled
                className='text-pwandora-green'
              />
              <div className='text-sm'>{data.name}</div>
              <div className='text-xs text-pwandora-gray truncate'>{`(${data.url})`}</div>
            </Link>
          )
        }
        return (
          <div
            key={data.id}
            className='flex gap-2 items-center h-10.5 border-t border-pwandora-foreground-gray p-2 truncate'
          >
            <MaterialIcon
              name='Cancel'
              size='20px'
              filled
              className='text-pwandora-gray'
            />
            <div className='text-sm'>{data.name}</div>
            <div className='text-xs text-pwandora-gray truncate'>{`(${data.url})`}</div>
          </div>
        )
      })}
    </div>
  )
}
