import ConfirmSection from '../appData/ConfirmSection'
import ConfirmItem from '../appData/ConfirmItem'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { useTranslation } from 'react-i18next'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'

export default function CrawledData({
  confirm,
  status,
}: IConfirmSectionCommonProps) {
  const { appData } = useConfirmation()
  const { t } = useTranslation()
  const crawledData = appData.crawledDataStepDto

  return (
    <ConfirmSection name={'crawledData'} confirm={confirm} status={status}>
      <ConfirmItem name={t('Name')}>{crawledData.name}</ConfirmItem>
      <ConfirmItem name={t('Icon')}>
        <img
          src={crawledData.iconImageUrl}
          alt={crawledData.name}
          className='size-20 shadow-lg rounded-3xl'
        />
      </ConfirmItem>
      <ConfirmItem name={t('Url')}>{crawledData.startUrl}</ConfirmItem>
    </ConfirmSection>
  )
}
