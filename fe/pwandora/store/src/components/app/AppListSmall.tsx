import { Link } from 'react-router'
import AppItemSmall from './AppItemSmall'
import MaterialIcon from '../MaterialIcon'
import { ROUTES } from '../../consts/ROUTES'
import { useSearchPwas } from '@/apis/app'
import { IAppListItem } from '@/types/IAppListItem'
import { useTranslation } from 'react-i18next'
import { objectToParams } from '@/utils/objectToParams'

export interface IAppListSmallProps {
  title: string
  sortCriteria?: string
  name?: string
  category?: string
}

export default function AppListSmall(props: IAppListSmallProps) {
  const {
    data: apps,
    isPending,
    isError,
  } = useSearchPwas({ page: 0, sortDirection: 'DESC', ...props, size: 8 })
  const { t } = useTranslation()

  if (isPending) return <div>{t('Loading')}</div>
  if (isError) return <div>{t('Error')}</div>

  return (
    <section className='w-full py-1 px-[4%]'>
      <Link
        to={`${ROUTES.APPS}?${objectToParams(props)}`}
        className='p-3 flex flex-row items-center justify-between'
      >
        <p className='text-lg font-bold'>{props.title}</p>
        <MaterialIcon name='arrow_forward' size='1.5rem' />
      </Link>
      <main className='p-2 flex flex-wrap gap-y-6'>
        {apps.pages[0].content.length === 0 && <div>{t('No results')}</div>}
        {apps.pages[0].content.map((app: IAppListItem, index: number) => (
          <AppItemSmall key={index} {...app} />
        ))}
      </main>
    </section>
  )
}
