import { useState } from 'react'
import Card from '../components/common/Card'
import FormButton from '../components/form/FormButton'
import FormInput from '../components/form/FormInput'
import FormTitle from '../components/form/FormTitle'
import LanguageDropdown from '../components/form/LanguageDropdown'
import { useLanguage, useSignUp } from '../apis/auth'
import { useNavigate } from 'react-router'
import { ROUTES } from '../consts/ROUTES'
import DropdownSkeleton from '../components/skeleton/DropdownSkeleton'
import { useTranslation } from 'react-i18next'

export default function SignUpPage() {
  const [id, setId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [languageId, setLanguageId] = useState<number>(2)
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const route = useNavigate()
  const { t } = useTranslation()

  const { mutate } = useSignUp()
  const { data: languages, isPending, isError } = useLanguage()

  const signUp = () => {
    mutate(
      {
        loginId: id,
        password,
        languageId,
        email,
      },
      {
        onSuccess: () => {
          alert(t('Sign-up completed'))
          route(ROUTES.LOGIN)
        },
        onError: error => {
          alert(t('Sign-up failed'))
          console.error('회원가입 실패:', error)
        },
      },
    )
  }

  return (
    <div className='h-[calc(100vh-4rem)] flex items-center justify-center'>
      <div className='flex flex-col items-start justify-center pb-20'>
        <FormTitle title='SignUp' />
        <Card className='flex flex-col gap-6 w-92 p-6'>
          <FormInput
            label={t('ID')}
            id='id'
            value={id}
            placeholder={t('Please enter your ID')}
            onChange={setId}
          />
          <FormInput
            label={t('Password')}
            id='password'
            value={password}
            placeholder={t('Please enter your password')}
            type='password'
            onChange={setPassword}
          />
          <FormInput
            label={t('Password Confirm')}
            id='password-confirm'
            value={passwordConfirm}
            placeholder={t('Please confirm your password')}
            type='password'
            onChange={setPasswordConfirm}
          />
          <FormInput
            label={t('Email')}
            id='email'
            value={email}
            placeholder={t('Please enter your email')}
            type='email'
            onChange={setEmail}
          />
          {isPending || isError ? (
            <DropdownSkeleton />
          ) : (
            <LanguageDropdown
              value={languageId}
              onChange={setLanguageId}
              languages={languages}
            />
          )}
          <FormButton value={t('Sign Up')} onClick={signUp} />
        </Card>
      </div>
    </div>
  )
}
