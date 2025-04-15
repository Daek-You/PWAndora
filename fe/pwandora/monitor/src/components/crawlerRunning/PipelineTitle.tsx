import { useTranslation } from 'react-i18next'
import StepIcon from './StepIcon'

export default function PipelineTitle() {
  const { t } = useTranslation()

  return (
    <div className='grid grid-cols-[200px_480px_1fr] gap-12 items-end pt-10 pb-2'>
      <div className='text-sm py-1'>{t('URL')}</div>
      <div className='flex relative justify-between'>
        <hr className='absolute border-t border-dashed border-pwandora-gray w-full left-0 top-7.5' />
        <StepIcon name='Order_approve' title={t('PWA Check')} />
        <StepIcon name='Tv' title={t('Tizen Packaging')} />
        <StepIcon name='Android' title={t('Android Packaging')} />
        <StepIcon name='Add_photo_alternate' title={t('Take Screenshots')} />
        <StepIcon name='Subtitles' title={t('AI Data Generation')} />
      </div>
      <div className='text-sm py-1'>{t('Started At')}</div>
    </div>
  )
}
