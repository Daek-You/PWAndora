import { Outlet } from 'react-router'
import Footer from './Footer'
import Header, { IHeaderProps } from './Header'
import useDvh from '@/hooks/useDvh'

export interface IDefaultLayoutProps {
  header?: IHeaderProps
  footer?: boolean
}

export default function DefaultLayout(props: IDefaultLayoutProps) {
  const dvh = useDvh()
  return (
    <div
      className='flex flex-col w-full overflow-hidden '
      style={{ height: dvh }}
    >
      {props.header && <Header {...props.header} />}
      <main className='flex flex-col grow overflow-y-scroll overflow-x-hidden no-scrollbar'>
        <Outlet />
      </main>
      {props.footer && <Footer />}
    </div>
  )
}
