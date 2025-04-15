import { useEffect, useState } from 'react'
import { IContent } from '../../types/appDetail'
import FieldBox from './FieldBox'
import LanguageBox from './LanguageBox'
import { Es, Kr, Us } from 'react-flags-select'
import EditFieldBox from './EditFieldBox'
import { useTranslation } from 'react-i18next'

export interface IAppTranslateProps {
  contents: IContent[]
  isEditing: boolean
  editingContents: Partial<IContent>[]
  setEditingContents: React.Dispatch<React.SetStateAction<Partial<IContent>[]>>
}

const flag = {
  ko: <Kr />,
  en: <Us />,
  es: <Es />,
}

export default function AppTranslate(props: IAppTranslateProps) {
  const [appLanguage, setAppLanguage] = useState(props.contents[0].languageCode)
  const [appName, setAppName] = useState(props.contents[0].name)
  const [appSummary, setAppSummary] = useState(props.contents[0].summary)
  const [appDesc, setAppDesc] = useState(props.contents[0].description)

  const { t } = useTranslation()

  useEffect(() => {
    setAppName(
      props.contents.find(content => content.languageCode === appLanguage)
        ?.name || '',
    )
    setAppSummary(
      props.contents.find(content => content.languageCode === appLanguage)
        ?.summary || '',
    )
    setAppDesc(
      props.contents.find(content => content.languageCode === appLanguage)
        ?.description || '',
    )
  }, props.contents)

  const languages = props.contents.map(content => {
    return {
      flag: flag[content.languageCode as keyof typeof flag] || flag['ko'],
      value: content.languageName,
      code: content.languageCode,
    }
  })

  const setData = (edited: Partial<IContent>) => {
    props.setEditingContents(prev => {
      if (!prev) return prev

      return prev?.map(content => {
        if (content.languageCode !== appLanguage) {
          return content
        }
        return { ...content, ...edited }
      })
    })
  }

  const onLanguageClick = (value: string) => {
    setAppLanguage(value)
    setAppName(
      props.contents.find(content => content.languageCode === appLanguage)
        ?.name || '',
    )
    setAppSummary(
      props.contents.find(content => content.languageCode === appLanguage)
        ?.summary || '',
    )
    setAppDesc(
      props.contents.find(content => content.languageCode === appLanguage)
        ?.description || '',
    )
  }

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex gap-2 p-2'>
        {languages.map(props => (
          <LanguageBox
            name='language'
            checked={appLanguage === props.code}
            {...props}
            onClick={onLanguageClick}
            key={props.code}
          />
        ))}
      </div>
      {props.isEditing ? (
        <>
          <EditFieldBox
            field={t('name')}
            value={
              props.editingContents?.find(
                content => content.languageCode === appLanguage,
              )?.name || ''
            }
            onChange={name => setData({ name })}
          />
          <EditFieldBox
            field={t('summary')}
            value={
              props.editingContents?.find(
                content => content.languageCode === appLanguage,
              )?.summary || ''
            }
            onChange={summary => setData({ summary })}
          />
          <EditFieldBox
            field={t('description')}
            value={
              props.editingContents?.find(
                content => content.languageCode === appLanguage,
              )?.description || ''
            }
            onChange={description => setData({ description })}
          />
        </>
      ) : (
        <>
          <FieldBox field={t('name')} data={appName} />
          <FieldBox field={t('summary')} data={appSummary} />
          <FieldBox field={t('description')} data={appDesc} />
        </>
      )}
    </div>
  )
}
