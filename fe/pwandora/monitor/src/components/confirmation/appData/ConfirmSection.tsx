import { useTranslation } from 'react-i18next'
import Card from '../../common/Card'
import MaterialIcon from '../../common/MaterialIcon'
import LanguageBox, { ILanguageBoxProps } from '../../appDetail/LanguageBox'
import { STATUS_ICON } from '../../../consts/STATUS_ICON'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { SECTION_NAME } from '../../../consts/CONFIRMATION'

export interface IConfirmSectionProps {
  name: keyof typeof SECTION_NAME
  status: 'done' | 'need confirm' | 'warning'
  children: React.ReactNode
  languages?: ILanguageBoxProps[]
  confirm: () => void
}

export default function ConfirmSection(props: IConfirmSectionProps) {
  const { t } = useTranslation()
  const { refs } = useConfirmation()

  return (
    <div className='px-4 py-6' ref={refs[props.name]}>
      <Card className='flex px-7 py-6'>
        <div className='flex flex-col w-64 grow justify-between gap-12'>
          <div className='flex flex-col gap-4'>
            <h1 className='font-bold'>{t(SECTION_NAME[props.name])}</h1>
            <div className='flex items-center gap-1'>
              <MaterialIcon
                name={STATUS_ICON[props.status].name}
                size='30px'
                className={STATUS_ICON[props.status].className}
                filled
              />
              <h1>{t(props.status)}</h1>
            </div>
            {props.languages && (
              <div className='mt-2 flex flex-col w-fit gap-2'>
                {props.languages.map((languageProps, index) => (
                  <LanguageBox {...languageProps} key={index} />
                ))}
              </div>
            )}
          </div>

          {props.status !== 'done' && (
            <button
              className='py-2 px-4 w-fit bg-pwandora-green text-pwandora-white rounded-3xl hover:cursor-pointer'
              onClick={props.confirm}
            >
              {t('confirm')}
            </button>
          )}
        </div>
        <div className='w-full flex flex-col gap-6'>{props.children}</div>
      </Card>
    </div>
  )
}
