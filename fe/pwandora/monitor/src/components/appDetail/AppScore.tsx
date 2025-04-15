import { useTranslation } from 'react-i18next'
import SmallFieldBox from './SmallFieldBox'

export interface IAppScoreProps {
  performance: number
  accessibility: number
  bestPractice: number
  seo: number
}

export default function AppScore(props: IAppScoreProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-1'>
      <SmallFieldBox field={t('Performance')} data={props.performance} />
      <SmallFieldBox field={t('Accessibility')} data={props.accessibility} />
      <SmallFieldBox field={t('Best Practice')} data={props.bestPractice} />
      <SmallFieldBox field={t('SEO')} data={props.seo} />
    </div>
  )
}
