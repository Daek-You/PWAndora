import { useSignup } from '@/apis/user'
import Button from '@/components/common/Button'
import Dropdown from '@/components/common/DropDown'
import Logo from '@/components/Logo'
import TextInput from '@/components/common/TextInput'
import { ROUTES } from '@/consts/ROUTES'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import BuildDate from '@/components/common/BuildDate'

export default function SignUpPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const route = useNavigate()
  const { availableLanguages, setLanguage, language } = useLanguage()
  const { t, i18n } = useTranslation()

  const { mutate } = useSignup()

  const signup = () => {
    mutate(
      { loginId: id, password, languageId: language.id },
      {
        onSuccess: () => {
          route(ROUTES.SIGNIN)
        },
      },
    )
  }

  const selectLanguage = (language: { label: string; value: string }) => {
    const selectedLanguage = availableLanguages.find(
      lang => lang.code === language.value,
    )

    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage.code)
      setLanguage(selectedLanguage)
    }
  }

  return (
    <div className='py-8 max-w-lg w-full flex flex-col h-full justify-between'>
      <div>
        <Logo />
        <div className='p-2'>
          <Dropdown
            title='Language'
            options={availableLanguages.map(language => ({
              label: language.name,
              value: language.code,
            }))}
            onSelect={selectLanguage}
          />
        </div>
        <TextInput
          label={t('ID')}
          placeholder={t('ID')}
          value={id}
          onChange={setId}
        />
        <TextInput
          label={t('Password')}
          placeholder={t('Password')}
          type='password'
          value={password}
          onChange={setPassword}
        />
        <TextInput
          label={t('Password Confirm')}
          placeholder={t('Password Confirm')}
          type='password'
          value={passwordCheck}
          onChange={setPasswordCheck}
        />
        <BuildDate />
      </div>
      <div className='px-2'>
        <div className='flex flex-col gap-5'>
          <Button type='submit' style='submit' onClick={signup}>
            {t('Sign Up')}
          </Button>
          <Link to={ROUTES.SIGNIN} className='flex flex-col'>
            <Button type='button' style='cancel'>
              {t('Cancel')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
