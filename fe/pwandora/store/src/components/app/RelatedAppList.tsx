import { Link } from 'react-router'
import AppItemSmall from './AppItemSmall'
import MaterialIcon from '../MaterialIcon'
import { ROUTES } from '../../consts/ROUTES'
import { useSearchPwas } from '@/apis/app'
import { IAppListItem } from '@/types/IAppListItem'
import { useTranslation } from 'react-i18next'
import { objectToParams } from '@/utils/objectToParams'
import { useMemo } from 'react'

export interface IRelatedAppListProps {
  title: string
  sortCriteria?: string
  name?: string
  category?: string
  currentAppId?: number
}

export default function RelatedAppList(props: IRelatedAppListProps) {
  const {
    data: apps,
    isPending,
    isError,
  } = useSearchPwas({ page: 0, sortDirection: 'DESC', ...props, size: 12 })
  const { t } = useTranslation()
  const filteredApps = useMemo(() => {
    if (!apps) return { pages: [] }
    return apps.pages[0].content.filter(
      (app: IAppListItem) => app.id !== props.currentAppId,
    )
  }, [apps, props.currentAppId])

  if (isPending) return <div>{t('Loading')}</div>
  if (isError) return <div>{t('Error')}</div>

  return (
    <section className='w-full py-1 px-2'>
      <Link
        to={`${ROUTES.APPS}?${objectToParams(props)}`}
        className='p-4 flex flex-row items-center justify-between'
      >
        <p className='text-lg font-bold'>{props.title}</p>
        <MaterialIcon name='arrow_forward' size='1.5rem' />
      </Link>
      <main className='p-2 flex flex-wrap gap-y-6'>
        {filteredApps.length === 0 && <div>{t('No results')}</div>}
        {filteredApps.map((app: IAppListItem, index: number) => (
          <AppItemSmall key={index} {...app} />
        ))}
      </main>
    </section>
  )
}
