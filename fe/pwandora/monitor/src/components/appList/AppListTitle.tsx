import { useTranslation } from 'react-i18next'

export interface IAppListTitleProps {
  titles: string[]
}

export default function AppListTitle(props: IAppListTitleProps) {
  const { t } = useTranslation()

  return (
    <div className='grid grid-cols-8 items-center py-4'>
      {props.titles.map((title, index) => (
        <div key={index} className='text-center font-semibold'>
          {t(title)}
        </div>
      ))}
    </div>
  )
}
