import { Outlet } from 'react-router'
import Header from '../components/common/Header'

export default function DefaultLayout() {
  return (
    <div className='flex flex-col pt-24 min-h-screen w-full pb-4'>
      <Header />
      <Outlet />
    </div>
  )
}
