import { Dispatch, SetStateAction } from 'react'
import { IAppDetail } from '../../types/appDetail'
import Button from '../common/Button'
import { useTranslation } from 'react-i18next'
import MaterialIcon from '../common/MaterialIcon'

export interface IAppTitleProps {
  appDetail: IAppDetail
  isEditing: boolean
  onBlock: (blocked: boolean) => void
  onSave: () => void
  setIsEditing: Dispatch<SetStateAction<boolean>>
}

export default function AppTitle({
  appDetail,
  isEditing,
  onBlock,
  onSave,
  setIsEditing,
}: IAppTitleProps) {
  const { t } = useTranslation()

  const save = () => {
    onSave()
    setIsEditing(false)
  }

  return (
    <div className='flex justify-start items-center gap-8'>
      <img
        src={appDetail.iconImage}
        alt={appDetail.contents[0].name}
        className='rounded-xl size-24'
      />
      <div className='flex flex-col flex-1 gap-2'>
        <div className='flex flex-row item-center font-semibold text-xl gap-2'>
          {appDetail.contents[0].name}
          <a
            href={appDetail.websiteUrl}
            target='_blank'
            onClick={e => e.stopPropagation()}
          >
            <MaterialIcon name='link' size='2rem' />
          </a>
        </div>
        <div className='flex flex-row gap-2'>
          {isEditing ? (
            <Button value={t('Save')} onClick={save} className='text-sm' />
          ) : (
            <Button
              value={t('Edit')}
              onClick={() => setIsEditing(true)}
              className='text-sm'
            />
          )}
          {appDetail.blockedAt ? (
            <Button
              value={t('Unblock App')}
              onClick={() => onBlock(true)}
              className='text-sm'
            />
          ) : (
            <Button
              value={t('Block App')}
              onClick={() => onBlock(false)}
              className='text-sm'
            />
          )}
        </div>
      </div>
    </div>
  )
}
