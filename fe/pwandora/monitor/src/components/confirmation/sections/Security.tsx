import { useTranslation } from 'react-i18next'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'
import ConfirmItem from '../appData/ConfirmItem'
import ConfirmSection from '../appData/ConfirmSection'

export default function Security({
  confirm,
  status,
}: IConfirmSectionCommonProps) {
  const { appData } = useConfirmation()
  const security = appData.securityStepDto
  const { t } = useTranslation()

  return (
    <ConfirmSection
      name='security'
      {...appData}
      confirm={confirm}
      status={status}
    >
      <ConfirmItem name={'HTTPS'}>
        {security.isHttpsActive ? (
          <p>{t('Encrypted connection enabled')}</p>
        ) : (
          <p className='text-pwandora-red'>{t('Not encrypted connection')}</p>
        )}
      </ConfirmItem>
      <ConfirmItem name={'CSP'}>
        {security.isCspActive ? (
          <p>{t('CSP enabled. Safe from external script attacks')}</p>
        ) : (
          <p className='text-pwandora-red'>
            {t('CSP disabled. Vulnerable to external script attacks')}
          </p>
        )}
      </ConfirmItem>
    </ConfirmSection>
  )
}
