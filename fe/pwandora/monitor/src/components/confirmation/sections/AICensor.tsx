import { useTranslation } from 'react-i18next'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'
import ConfirmItem from '../appData/ConfirmItem'
import ConfirmSection from '../appData/ConfirmSection'

export default function AICensor({
  confirm,
  status,
}: IConfirmSectionCommonProps) {
  const { t } = useTranslation()
  const { appData } = useConfirmation()
  const aiCensor = appData.aiCensorStepDto
  const getLevel = (value: number) => {
    if (value < 10) return 0
    if (value < 30) return 1
    return 2
  }

  const colorsByLevel = [
    'bg-pwandora-green',
    'bg-pwandora-gray',
    'bg-pwandora-red',
  ]

  const textByLevel = [t('Safe'), t('Warning'), t('Danger')]

  return (
    <ConfirmSection
      name='aiCensor'
      {...appData}
      confirm={confirm}
      status={status}
    >
      <ConfirmItem name={t('Child Endangerment')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.childEndangermentPercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.childEndangermentPercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
      <ConfirmItem name={t('Inappropriate Content')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.inappropriateContentPercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.inappropriateContentPercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
      <ConfirmItem name={t('Financial Services')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.financialServicePercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.financialServicePercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
      <ConfirmItem name={t('Real-Money Gambling, Games, and Contests')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.realMoneyGamblingPercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.realMoneyGamblingPercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
      <ConfirmItem name={t('Illegal Activities')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.illegalActivityPercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.illegalActivityPercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
      <ConfirmItem name={t('Health Content and Services')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.healthContentServicePercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.healthContentServicePercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
      <ConfirmItem name={t('Blockchain-based Content')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.blockchainBasedContentPercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.blockchainBasedContentPercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
      <ConfirmItem name={t('AI-Generated Content')}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className={`size-3 rounded-full ${
                colorsByLevel[getLevel(aiCensor.aiGeneratedContentPercent)]
              }`}
            />
            <span>
              {textByLevel[getLevel(aiCensor.aiGeneratedContentPercent)]}
            </span>
          </div>
        </div>
      </ConfirmItem>
    </ConfirmSection>
  )
}
