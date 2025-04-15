import { Link, Outlet } from 'react-router'
import Card from '../components/common/Card'
import { ROUTES } from '../consts/ROUTES'
import MaterialIcon from '../components/common/MaterialIcon'
import StatusBox from '../components/crawlerStatus/StatusBox'
import LogList from '../components/crawlerStatus/LogList'
import SpinningLoader from '../components/common/SpinningLoader'
import { useTranslation } from 'react-i18next'
import { useLogsDashboard } from '../apis/logs'
import { parseSecondsToHMS } from '../utils/formatTime'
import StatusBoxSkeleton from '../components/skeleton/StatusBoxSkeleton'
import { useCrawlerStatus, useRegisterSite } from '../apis/crawler'
import { useState } from 'react'

export default function CrawlerStatusPage() {
  const [url, setUrl] = useState('')

  const { data: logsDashboard, isSuccess: logsDashboardSuccess } =
    useLogsDashboard()
  const { data: crawlerStatus, isSuccess: crawlerStatusSuccess } =
    useCrawlerStatus()
  const { mutate } = useRegisterSite()
  const { t } = useTranslation()

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <Card className='flex flex-col gap-8 w-340 mt-6'>
        <div className='flex gap-6'>
          <div className='flex flex-col gap-8 px-4 w-1/2'>
            <div className='flex justify-between'>
              <div className='text-lg font-bold'>
                {t('App Register Crawler')}
              </div>
              <div className='flex gap-2 w-96'>
                <div className='flex flex-row items-center flex-1 h-8 p-4 gap-2 border border-pwandora-gray rounded-xl bg-white text-sm'>
                  <input
                    type='text'
                    value={url}
                    placeholder={t('Register site by URL')}
                    onChange={e => setUrl(e.target.value)}
                    className='w-full focus:outline-0 placeholder:font-semibold placeholder:text-pwandora-gray'
                  />
                </div>
                <button
                  className={`flex items-center rounded-xl bg-pwandora-foreground-gray font-semibold h-9 px-4 cursor-pointer`}
                  onClick={() => {
                    mutate(url)
                    setUrl('')
                  }}
                >
                  {t('Register')}
                </button>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 mt-[-10px]'>
              {logsDashboardSuccess ? (
                <>
                  <StatusBox
                    name={t('Total Runs')}
                    value={`${logsDashboard.totalRuns} ${t('Times')}`}
                  />
                  <StatusBox
                    name={t('Average Time')}
                    value={parseSecondsToHMS(
                      logsDashboard.averageTime,
                      t('hours'),
                      t('min'),
                      t('sec'),
                    )}
                  />
                </>
              ) : (
                <>
                  <StatusBoxSkeleton />
                  <StatusBoxSkeleton />
                </>
              )}
              {crawlerStatusSuccess ? (
                <StatusBox
                  name={t('Current Status')}
                  value={
                    crawlerStatus.currentStatus.status === 'INPROGRESS' ? (
                      <div className='flex items-center gap-2'>
                        <SpinningLoader size={6} />
                        <Link
                          className='flex items-center gap-4 font-bold'
                          to={ROUTES.CRAWLER_RUNNING}
                        >
                          {t('Running')}
                          <MaterialIcon name='Arrow_right_alt' size='22px' />
                        </Link>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <MaterialIcon
                          name='do_not_disturb_on'
                          size='22px'
                          className='text-pwandora-red'
                        />
                        <div className='font-bold'>{t('Not Running')}</div>
                      </div>
                    )
                  }
                />
              ) : (
                <StatusBoxSkeleton />
              )}
            </div>
            <LogList />
          </div>
          <div className='flex flex-col flex-1 gap-6 items-end'>
            <div className='flex items-center gap-2'>
              <MaterialIcon name='Timer' size='20px' />
              <div>
                {t('Scheduled At')} : {t('every')} 4:00 AM
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </Card>
    </div>
  )
}
