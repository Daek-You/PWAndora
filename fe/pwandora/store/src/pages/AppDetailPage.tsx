import { useSearchParams } from 'react-router'
import { simpleLocaleNumber } from '../utils/simpleLocaleNumber'
import MaterialIcon from '../components/MaterialIcon'
import VerticalLine from '../components/common/VerticalLine'
import { usePwaDetail } from '@/apis/app'
import { useTranslation } from 'react-i18next'
import no_icon from '@/assets/images/no_image.png'
import AppInstallOpen from '@/components/app/AppInstallOpen'
import RelatedAppList from '@/components/app/RelatedAppList'
import { getFileByType } from '@/utils/getFileByType'
import { useNativeFeature } from '@/contexts/NativeFeatureContext'

interface IAppInfoProps {
  children: React.ReactNode
}

function AppInfoInline({ children }: IAppInfoProps) {
  return <div className='w-xs flex flex-col items-center gap-2'>{children}</div>
}

function AppInfoBlock({ children }: IAppInfoProps) {
  return <div className='flex flex-col gap-2 px-[3%] py-2'>{children}</div>
}

export default function AppDetailPage() {
  const { t } = useTranslation()
  const { getPlatform } = useNativeFeature()

  const [searchParams] = useSearchParams()
  const appId = searchParams.get('pwaId')
  const {
    data: appDetail,
    isPending,
    isError,
  } = usePwaDetail(Number(appId) || 0)

  if (isPending) return <div>{t('Loading')}</div>
  if (isError) return <div>{t('Error')}</div>

  return (
    <div className='pb-4 flex flex-col gap-8'>
      <div className='px-[4%] flex flex-row grow items-center gap-[4%]'>
        <div className='w-[24%] max-w-40 shrink-0 aspect-square rounded-3xl overflow-hidden'>
          <img
            src={appDetail.iconImage}
            alt={appDetail.name}
            className='w-full h-full drop-shadow-md'
            onError={e => {
              e.currentTarget.src = no_icon
            }}
          />
        </div>
        <div className='max-w-1/2 flex flex-col gap-2'>
          <h1 className='font-bold text-2xl'>{appDetail.name}</h1>
          <div className='pb-2 flex flex-row items-center'>
            <div className='flex flex-row items-center py-1 '>
              <span className='font-bold'>
                {simpleLocaleNumber(appDetail.downloadCount)}
              </span>
              <MaterialIcon name='download' filled size='1.2rem' />
            </div>
            <VerticalLine length={1.5} />
            <span>{appDetail.company}</span>
            <VerticalLine length={1.5} />
            <span>
              {
                getFileByType(
                  appDetail.files,
                  getPlatform() == 'tizen' ? 'WGT' : 'APK',
                )?.fileSize
              }
            </span>
          </div>
          <p className='w-full line-clamp-2'>{appDetail.summary}</p>
        </div>
        <AppInstallOpen appDetail={appDetail} />
      </div>
      <div className='w-full px-4 py-2 flex flex-row justify-center'>
        <AppInfoInline>
          <h3 className='font-bold'>{t('Category')}</h3>
          <div className='flex items-center'>
            {appDetail.categories.map(
              (category: { name: string }, index: number) => (
                <>
                  <p className='text-lg'>{category.name}</p>
                  {index < appDetail.categories.length - 1 && <p>, &nbsp;</p>}
                </>
              ),
            )}
          </div>
        </AppInfoInline>
        <VerticalLine />
        <AppInfoInline>
          <h3 className='font-bold'>{t('Age Rating')}</h3>
          <p className='text-xl'>{appDetail.ageLimit}</p>
        </AppInfoInline>
      </div>
      <div className='p-[4%] flex flex-row flex-nowrap gap-8 overflow-x-scroll snap-x snap-mandatory max-h-[52vh]'>
        {appDetail.screenshots.map(
          (screenshot: { imageUrl: string }, index: number) => (
            <div
              key={index}
              className='rounded-xl my-2 flex-shrink-0 snap-center overflow-hidden shadow-lg min-w-[40%]'
            >
              <img
                src={screenshot.imageUrl}
                alt={appDetail.name}
                className='w-full h-full object-cover bg-gray align-top'
              />
            </div>
          ),
        )}
      </div>
      <AppInfoBlock>
        <h3 className='font-bold'>{t('Description')}</h3>
        <p>{appDetail.description}</p>
      </AppInfoBlock>
      {!!appDetail.languages.length && (
        <AppInfoBlock>
          <h3 className='font-bold'>{t('Languages')}</h3>
          <p>{appDetail.languages}</p>
        </AppInfoBlock>
      )}
      {!!appDetail.permissions.length && (
        <AppInfoBlock>
          <h3 className='font-bold'>{t('Permissions')}</h3>
          <p>{appDetail.permissions}</p>
        </AppInfoBlock>
      )}
      {!!appDetail.categories.length && (
        <RelatedAppList
          title={t(`${appDetail.name} 관련 앱`)}
          category={appDetail.categories[0].name}
          sortCriteria='downloadCount'
          currentAppId={appDetail.id}
        />
      )}
    </div>
  )
}
