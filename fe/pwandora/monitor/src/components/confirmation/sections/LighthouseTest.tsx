import { useTranslation } from 'react-i18next'
import { useLighthouseTest } from '../../../apis/confirmation'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'
import ConfirmSection from '../appData/ConfirmSection'
import LighthouseScoreItem from '../appData/LighthouseScoreItem'

export default function LighthouseTest({
  confirm,
  status,
}: IConfirmSectionCommonProps) {
  const { appData } = useConfirmation()
  const { data, isLoading, isError } = useLighthouseTest({
    url: encodeURI(appData.crawledDataStepDto.startUrl),
  })
  const { t } = useTranslation()

  if (!data) return <div>loading...</div>
  if (isLoading) return <div>loading...</div>
  if (isError) return <div>error...</div>

  const lighthouseTest: {
    performanceScore: number
    accessibilityScore: number
    bestPracticeScore: number
    seoScore: number
  } = data
  return (
    <ConfirmSection
      name='lighthouseTest'
      {...appData}
      confirm={confirm}
      status={status}
    >
      <LighthouseScoreItem
        name={t('Performance')}
        value={lighthouseTest.performanceScore}
      />
      <LighthouseScoreItem
        name={t('Accessibility')}
        value={lighthouseTest.accessibilityScore}
      />
      <LighthouseScoreItem
        name={t('Best Practice')}
        value={lighthouseTest.bestPracticeScore}
      />
      <LighthouseScoreItem name={t('SEO')} value={lighthouseTest.seoScore} />
    </ConfirmSection>
  )
}
