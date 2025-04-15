import axios, { AxiosError, AxiosResponse } from 'axios'
import { ROUTES } from '../consts/ROUTES'

const successHandler = (response: AxiosResponse) => {
  console.log(response.config.url, response)
  return response
}

const errorHandler = (error: AxiosError) => {
  console.log('error', error)
  if (error.status == 401) {
    localStorage.removeItem('user')
    window.location.href = `/monitor${ROUTES.LOGIN}`
  }
  return Promise.reject(error)
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + '/api',
  //   baseURL: import.meta.env.PROD
  //     ? import.meta.env.VITE_SERVER_URL + '/api'
  //     : '/dev',
  // : import.meta.env.VITE_DEV_SERVER_URL + '/dev',
  maxBodyLength: Infinity,
  withCredentials: true,
})

instance.interceptors.response.use(successHandler, errorHandler)

export default instance
