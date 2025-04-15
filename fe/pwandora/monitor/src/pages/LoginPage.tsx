import { useState } from 'react'
import Card from '../components/common/Card'
import FormButton from '../components/form/FormButton'
import FormInput from '../components/form/FormInput'
import FormTitle from '../components/form/FormTitle'
import { ROUTES } from '../consts/ROUTES'
import { useNavigate } from 'react-router'
import { useLogin, useMe } from '../apis/auth'
import { useAuth } from '../contexts/AuthContext'
import { useUserLanguage } from '../contexts/LanguageContext'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
  const [id, setId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const route = useNavigate()
  const { mutate } = useLogin()
  const { refetch } = useMe()
  const { setUser } = useAuth()
  const { setLanguage } = useUserLanguage()
  const { t } = useTranslation()

  const login = () => {
    mutate(
      { loginId: id, password },
      {
        onSuccess: async data => {
          setUser(data)
          const { data: meData } = await refetch()
          setLanguage(meData.languageCode)
          route(ROUTES.DASHBOARD)
        },
        onError: () => {
          alert(t('Login failed'))
        },
      },
    )
  }
  return (
    <div className='h-[calc(100vh-5rem)] flex items-center justify-center'>
      <div className='flex flex-col items-start justify-center pb-20'>
        <FormTitle title='Login' />
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
          <FormButton value={t('Login')} onClick={login} />
          <FormButton value={t('Sign Up')} to={ROUTES.SIGNUP} />
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
