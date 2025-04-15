import ConfirmSection from '../appData/ConfirmSection'
import ConfirmItem from '../appData/ConfirmItem'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { useTranslation } from 'react-i18next'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'

export default function DisplayCompatibility({
  confirm,
  status,
}: IConfirmSectionCommonProps) {
  const { appData } = useConfirmation()
  const { t } = useTranslation()
  const displayCompatibility =
    appData.displayCompatibilityStepDto.displayInfoDtos

  return (
    <ConfirmSection
      name='displayCompatibility'
      confirm={confirm}
      status={status}
    >
      {displayCompatibility.map((display, index) => (
        <ConfirmItem
          name={`${t(display.deviceName)} ${display.size}`}
          key={index}
        >
          <div className='overflow-y-scroll shadow-sm max-w-120'>
            <img
              src={display.screenshotUrl}
              alt={`${display.deviceName} ${display.size}`}
              className='w-full'
            />
          </div>
        </ConfirmItem>
      ))}
    </ConfirmSection>
  )
}
