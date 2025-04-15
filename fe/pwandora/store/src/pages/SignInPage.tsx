import { useLogin } from '@/apis/user'
import Button from '@/components/common/Button'
import Logo from '@/components/Logo'
import TextInput from '@/components/common/TextInput'
import { ROUTES } from '@/consts/ROUTES'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

export default function SignInPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { setUser } = useAuth()
  const route = useNavigate()
  const { t } = useTranslation()

  const { mutate } = useLogin()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signin()
  }

  const signin = () => {
    if (!id || !password) {
      setMessage(t('Please enter your ID and password'))
      return
    }
    mutate(
      { loginId: id, password },
      {
        onSuccess: data => {
          setUser(data)
          route(ROUTES.HOME)
        },
        onError: () => {
          setMessage(t('Invalid ID or password'))
        },
      },
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className='py-8 max-w-lg w-full flex flex-col h-full justify-between'
    >
      <div>
        <Logo />
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
        <p className='px-4 text-sm text-red'>{message}</p>
      </div>
      <div className='px-2'>
        <div className='flex flex-col gap-5'>
          <Button type='submit' style='submit' onClick={signin}>
            {t('Sign In')}
          </Button>

          <Link to={ROUTES.SIGNUP} className='flex flex-col'>
            <Button type='button' style='submit'>
              {t('Sign Up')}
            </Button>
          </Link>
        </div>
      </div>
    </form>
  )
}
