import { useNavigate, useSearchParams } from 'react-router'
import MaterialIcon from '../components/MaterialIcon'
import { useEffect, useState } from 'react'
import { ROUTES } from '../consts/ROUTES'
import { useTranslation } from 'react-i18next'
import { objectToParams } from '@/utils/objectToParams'

export interface IHeaderProps {
  searchBar?: boolean
  searchedString?: string
  backButton?: boolean
  searchButton?: boolean
}

export default function Header(props: IHeaderProps) {
  const route = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [searchedString, setSearchedString] = useState(
    props.searchedString || '',
  )

  const [isSearching, setIsSearching] = useState(props.searchBar)

  const goBack = () => {
    if (isSearching) setIsSearching(false)
    else route(-1)
  }
  const search = (e: React.FormEvent) => {
    e.preventDefault()
    route(
      `${ROUTES.APPS}?${objectToParams({
        name: searchedString,
      })}`,
    )
  }

  useEffect(() => {
    setSearchedString(searchParams.get('name') || '')
  }, [searchParams])

  useEffect(() => {
    if (!props.searchBar) setIsSearching(false)
    else setIsSearching(true)
  }, [props.searchBar])

  return (
    <div className='w-full p-4 flex justify-between items-center gap-4'>
      {props.backButton && (
        <button onClick={goBack} className='flex items-center'>
          <MaterialIcon name='arrow_back' size='2em'></MaterialIcon>{' '}
        </button>
      )}
      {isSearching ? (
        <form onSubmit={search} className='flex grow'>
          <input
            className='px-4 py-2 grow bg-foreground-gray rounded-full border-none outline-none text-lg'
            type='text'
            value={searchedString}
            onChange={e => setSearchedString(e.target.value)}
            placeholder={t('Search')}
          ></input>
        </form>
      ) : (
        searchedString && <p className='grow text-lg'>{searchedString}</p>
      )}

      {props.searchButton && !isSearching && (
        <button
          onClick={() => {
            setIsSearching(true)
          }}
          className='flex items-center'
        >
          <MaterialIcon name='search' size='2em'></MaterialIcon>
        </button>
      )}
    </div>
  )
}
