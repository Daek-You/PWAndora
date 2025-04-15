import { ROUTES } from '@/consts/ROUTES'
import axios, { AxiosError, AxiosResponse } from 'axios'

const successHandler = (response: AxiosResponse) => {
  console.log(response.config.url, response)
  return response
}

const errorHandler = (error: AxiosError) => {
  console.log('error', error)
  if (error.status == 401) {
    localStorage.removeItem('user')
    window.location.href = import.meta.env.PROD
      ? import.meta.env.VITE_BASE_URL + ROUTES.SIGNIN
      : ROUTES.SIGNIN
  }
  return Promise.reject(error)
}

const instance = axios.create({
  // baseURL: import.meta.env.VITE_SERVER_URL,
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_DEV_SERVER_URL,
  maxBodyLength: Infinity,
  withCredentials: true,
})

instance.interceptors.response.use(successHandler, errorHandler)

export default instance
