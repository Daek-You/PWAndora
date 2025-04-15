import { useState } from 'react'
import SearchInput from '../components/appList/SearchInput'
import Button from '../components/common/Button'
import AppListCard from '../components/appList/AppListCard'
import { titles } from '../consts/APPS'
import { useAppSearch } from '../apis/app'
import AppListCardSkeleton from '../components/skeleton/AppListCardSkeleton'
import PaginationSkeleton from '../components/skeleton/PaginationSkeleton'
import Pagination from '../components/common/Pagination'
import { useSearchParams } from 'react-router'
import EmptyListCard from '../components/appList/EmptyListCard'
import { useTranslation } from 'react-i18next'
import StatusFilter from '../components/appList/StatusFilter'

const AppListPage = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()

  const { data, isPending, isError } = useAppSearch({
    name: searchParams.get('name') || '',
    page: Number(searchParams.get('page') || 1) - 1,
    category: searchParams.get('category') || '',
    isBlocked: searchParams.get('isBlocked') || '',
    acceptanceStatus: searchParams.get('acceptanceStatus') || '',
  })

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchParams({ name: searchValue })
    }
  }

  return (
    <div className='flex flex-col gap-4 items-center'>
      <div className='flex justify-between w-320 pt-6 items-end px-4'>
        <div className='flex gap-2'>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onKeyDown={handleEnter}
            placeholder={t('Search App Name')}
          />
          <Button
            value={t('Search')}
            onClick={() => setSearchParams({ name: searchValue })}
          />
        </div>
        <StatusFilter />
      </div>
      {isPending || isError ? (
        <AppListCardSkeleton titles={titles} />
      ) : data.totalPageCount > 0 ? (
        <AppListCard titles={titles} apps={data.content} />
      ) : (
        <EmptyListCard />
      )}
      {isPending ? (
        <PaginationSkeleton />
      ) : (
        <Pagination totalPageCount={data.totalPageCount ?? 0} />
      )}
    </div>
  )
}

export default AppListPage
