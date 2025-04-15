import EventBanner from '@/components/event/EventBannerList'
import AppListSmall from '../components/app/AppListSmall'
import { useTranslation } from 'react-i18next'
import { usePwaCategories } from '@/apis/app'
import { ICategory } from './SearchPage'

export default function HomePage() {
  const { t } = useTranslation()
  const { data: categories } = usePwaCategories()
  return (
    <div className='flex flex-col gap-4'>
      <EventBanner />
      <AppListSmall title={t('Popular Apps')} sortCriteria='downloadCount' />
      <AppListSmall title={t('New Apps')} sortCriteria='createdAt' />
      {categories?.map((category: ICategory, index: number) => (
        <AppListSmall
          key={index}
          title={t(category.name)}
          category={category.name}
        />
      ))}
      <AppListSmall title={t('Shopping')} category={'Shopping'} />
      <AppListSmall title={t('Entertainment')} category={'Entertainment'} />
      <AppListSmall title={t('Games')} category={'Games'} />
      <AppListSmall title={t('Music and Audio')} category={'Music and Audio'} />
      <AppListSmall
        title={t('News and Magazines')}
        category={'News and Magazines'}
      />
      <AppListSmall title={t('Communication')} category={'Communication'} />
    </div>
  )
}
