import { useTranslation } from 'react-i18next'
import { STATUS_ICON } from '../../../consts/STATUS_ICON'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { IConfirmStatus } from '../../../types/confirmation'
import MaterialIcon from '../../common/MaterialIcon'
import { SECTION_NAME } from '../../../consts/CONFIRMATION'

export interface ISectionStatusButtonProps {
  name: keyof typeof SECTION_NAME
  status: IConfirmStatus
}

export default function SectionStatusButton(props: ISectionStatusButtonProps) {
  const { t } = useTranslation()
  const { refs } = useConfirmation()
  const ref = refs[props.name as keyof typeof refs]
  return (
    <button
      className='px-4 py-2 rounded-lg flex flex-col gap-2 items-center justify-between
      hover:bg-pwandora-foreground-gray hover:cursor-pointer
      transition-all duration-200 ease-in-out'
      onClick={() => {
        if (ref.current) ref.current.scrollIntoView(true)
      }}
    >
      <p className='text-sm'>{t(SECTION_NAME[props.name])}</p>
      <div className='flex items-center gap-1'>
        <MaterialIcon
          name={STATUS_ICON[props.status].name}
          className={STATUS_ICON[props.status].className}
          filled
          size='20px'
        />
        <p className='text-sm'>{t(props.status)}</p>
      </div>
    </button>
  )
}
