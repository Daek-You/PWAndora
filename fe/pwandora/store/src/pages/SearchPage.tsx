import { usePwaCategories } from '@/apis/app'
import Category from '../components/common/Category'
import { useTranslation } from 'react-i18next'
import SearchCard from '@/components/common/SearchCard'

export interface ICategory {
  id: number
  name: string
  categoryOrder: number
  categoryImage: string
}

export default function SearchPage() {
  const { data: categories, isPending, isError } = usePwaCategories()
  const { t } = useTranslation()

  if (isPending) return <div>{t('Loading')}</div>
  if (isError) return <div>{t('Error')}</div>
  return (
    <div>
      <div className='p-4 flex flex-row flex-wrap'>
        <SearchCard
          name={t('Popular App')}
          pathVariable='sortCriteria=downloadCount'
        />
        <SearchCard name={t('New App')} pathVariable='sortCriteria=createdAt' />
      </div>
      <h3 className='p-4 pb-1 font-bold text-xl'>{t('Categories')}</h3>
      <div className='p-4 flex flex-row flex-wrap'>
        {categories.map((category: ICategory) => (
          <Category
            name={category.name}
            image={category.categoryImage}
            key={category.id}
          />
        ))}
      </div>
    </div>
  )
}
