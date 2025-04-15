import { useNavigate, useSearchParams } from 'react-router'
import Button from '../common/Button'
import MaterialIcon from '../common/MaterialIcon'
import { Category } from '../../types/app'
import { useAppSearch, useBlock, useUnBlock } from '../../apis/app'
import { ROUTES } from '../../consts/ROUTES'
import { useTranslation } from 'react-i18next'

export interface IAppListItemProps {
  id: number
  name: string
  iconImage: string
  categories: Category[]
  downloadCount: number
  websiteUrl: string
  blockedAt: string
  createdAt: string
  updatedAt: string
}

export default function AppItem(props: IAppListItemProps) {
  const [searchParams] = useSearchParams()
  const route = useNavigate()
  const { t } = useTranslation()
  const { refetch } = useAppSearch({
    name: searchParams.get('name') || '',
    page: Number(searchParams.get('page') || 1) - 1,
    category: searchParams.get('category') || '',
    isBlocked: searchParams.get('isBlocked') || '',
    acceptanceStatus: searchParams.get('acceptanceStatus') || '',
  })
  const { mutate: block } = useBlock()
  const { mutate: unBlock } = useUnBlock()

  const toggleBlock = (e: React.MouseEvent | null) => {
    e?.stopPropagation()
    const { blockedAt, id } = props
    if (blockedAt) {
      unBlock(id, {
        onSuccess: () => refetch(),
      })
      return
    }
    block(id, {
      onSuccess: () => refetch(),
    })
  }

  return (
    <div
      className='grid grid-cols-8 py-4 text-center items-center justify-center border-t border-pwandora-foreground-gray cursor-pointer'
      onClick={() => route(`${ROUTES.APP}/${props.id}`)}
    >
      <div className='flex items-center justify-center'>
        <img
          src={props.iconImage}
          alt={props.name}
          className='rounded-lg size-16'
        />
      </div>
      <div>{props.name ?? 'Error'}</div>
      <a
        href={props.websiteUrl}
        target='_blank'
        onClick={e => e.stopPropagation()}
      >
        <MaterialIcon name='link' size='2rem' />
      </a>
      <div>
        {props.categories?.length
          ? props.categories.map(c => c.name).join(', ')
          : 'No Category'}
      </div>
      <div>{props.downloadCount ?? 0}</div>
      <div>{props.createdAt?.split('T')[0] ?? '-'}</div>
      <div>{props.updatedAt?.split('T')[0] ?? '-'}</div>
      <div className='flex justify-center'>
        <Button
          value={props.blockedAt ? t('UnBlock') : t('Block')}
          onClick={toggleBlock}
        />
      </div>
    </div>
  )
}
