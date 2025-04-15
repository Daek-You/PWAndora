import { useEffect, useRef, useState } from 'react'
import { ConfirmationProvider } from '../../../contexts/ConfirmationContext'
import CrawledData from '../sections/CrawledData'
import DisplayCompatibility from '../sections/DisplayCompatibility'
import Screenshots from '../sections/Screenshots'
import AISuggestion from '../sections/AISuggestion'
import AICensor from '../sections/AICensor'
import Packaging from '../sections/Packaging'
import LighthouseTest from '../sections/LighthouseTest'
import Security from '../sections/Security'
import Card from '../../common/Card'
import MaterialIcon from '../../common/MaterialIcon'
import { useNavigate, useParams } from 'react-router'
import { ROUTES } from '../../../consts/ROUTES'
import { useTranslation } from 'react-i18next'
import {
  useApproveApp,
  useUncensoredAppDetail,
} from '../../../apis/confirmation'
import { IAppData, IConfirmStatus } from '../../../types/confirmation'
import { urlsToFiles } from '../../../utils/urlToFile'
import { useQueryClient } from '@tanstack/react-query'
import { parseConfirmStatus } from '../../../utils/parseConfirmData'
import { useBlock } from '../../../apis/app'
import AISupportModal from '../AISupportModal/AISupportModal'
import { IConfirmationRefs } from '../../../types/confirmationRefs'

export interface IConfirmAppDetailProps {
  nextAppId?: number
  prevAppId?: number
}

export default function ConfirmAppDetail({
  nextAppId,
  prevAppId,
}: IConfirmAppDetailProps) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const route = useNavigate()

  const dataSectionRef = useRef<HTMLDivElement>(null)
  const refs: IConfirmationRefs = {
    crawledData: useRef<HTMLDivElement>(null),
    aiSuggestions: useRef<HTMLDivElement>(null),
    screenshots: useRef<HTMLDivElement>(null),
    displayCompatibility: useRef<HTMLDivElement>(null),
    aiCensor: useRef<HTMLDivElement>(null),
    packaging: useRef<HTMLDivElement>(null),
    lighthouseTest: useRef<HTMLDivElement>(null),
    security: useRef<HTMLDivElement>(null),
  }
  const { appId } = useParams()

  const { data, isPending, isError } = useUncensoredAppDetail(Number(appId))
  const { mutate: register } = useApproveApp()
  const { mutate: block } = useBlock()

  const [appData, setAppData] = useState<IAppData>()
  const [images, setImages] = useState<File[]>([])

  const [status, setStatus] = useState<{
    crawledData: IConfirmStatus
    aiSuggestions: IConfirmStatus
    screenshots: IConfirmStatus
    displayCompatibility: IConfirmStatus
    aiCensor: IConfirmStatus
    packaging: IConfirmStatus
    lighthouseTest: IConfirmStatus
    security: IConfirmStatus
  }>({
    crawledData: 'need confirm',
    aiSuggestions: 'need confirm',
    screenshots: 'need confirm',
    displayCompatibility: 'need confirm',
    aiCensor: 'need confirm',
    packaging: 'need confirm',
    lighthouseTest: 'need confirm',
    security: 'need confirm',
  })

  useEffect(() => {
    if (!dataSectionRef.current) return
    dataSectionRef.current.scrollTo(0, 0)
  }, [appId])

  useEffect(() => {
    if (!data) return
    setAppData(data)
    urlsToFiles(data.screenshotCensorStepDto.screenshotUrls).then(setImages)

    const newConfirms = parseConfirmStatus(data)
    setStatus(newConfirms)
  }, [data])

  if (!appData) return <div>Loading...</div>
  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error loading app data</div>

  const goNext = () => {
    if (!nextAppId) return
    route(ROUTES.CONFIRMATION_DETAIL.replace(':appId', nextAppId.toString()), {
      replace: true,
    })
  }

  const goPrev = () => {
    if (!prevAppId) return
    route(ROUTES.CONFIRMATION_DETAIL.replace(':appId', prevAppId.toString()), {
      replace: true,
    })
  }

  const onRegister = async () => {
    let isAllConfirmed = Object.values(status).every(s => s === 'done')
    if (!isAllConfirmed) {
      alert(t('Please confirm all sections before registering.'))
      return
    }
    if (!appData) return

    // Transform appData to match AcceptanceRegisterPostRequest DTO
    const transformedData = {
      crawledDataStatus: 'DONE',
      displayCompatibilityDto: {
        status: 'DONE',
        isLargeSizeCompatible:
          appData.displayCompatibilityStepDto.displayInfoDtos.some(d =>
            d.size.includes('1080x1920'),
          ),
        isMediumSizeCompatible:
          appData.displayCompatibilityStepDto.displayInfoDtos.some(d =>
            d.size.includes('1024x600'),
          ),
        isMediumSmallSizeCompatible:
          appData.displayCompatibilityStepDto.displayInfoDtos.some(d =>
            d.size.includes('1024x600'),
          ),
        isSmallSizeCompatible:
          appData.displayCompatibilityStepDto.displayInfoDtos.some(d =>
            d.size.includes('800x480'),
          ),
      },
      screenShotDto: {
        status: 'DONE',
        request: { screenshotOrders: images.map((_, i) => i + 1) },
        images: [], // Handled separately in FormData
      },
      aiSuggestionDto: {
        status: 'DONE',
        aiSuggestionDataMap: Object.fromEntries(
          Object.entries(appData.aiSuggestionStepDto.aiSuggestionDtoMap).map(
            ([lang, suggestion]) => [
              lang,
              {
                summary: suggestion.summary,
                description: suggestion.description,
              },
            ],
          ),
        ),
        categoryIds:
          appData.aiSuggestionStepDto.aiSuggestionDtoMap.ko.categories.map(
            c => c.id,
          ),
        ageRating: appData.aiSuggestionStepDto.aiSuggestionDtoMap.ko.ageRating,
      },
      aiCensorStatus: 'DONE',
      packagingStatus: 'DONE',
      securityStatus: 'DONE',
      lightHouseStatus: 'DONE',
    }

    const formData = new FormData()
    formData.append('request', JSON.stringify(transformedData))
    console.log(transformedData)

    // Append images
    images.forEach(image => formData.append('images', image))

    if (confirm(t('Are you sure to register?'))) {
      register(
        { formData, appId: Number(appId) },
        {
          onSuccess: () => {
            alert(t('App registered successfully!'))
            queryClient.invalidateQueries({ queryKey: ['uncensoredAppList'] })
            goNext()
          },
          onError: () => {
            alert(t('Failed to register app.'))
          },
        },
      )
    }
  }

  const onBlock = () => {
    if (confirm(t('Are you sure to block?'))) {
      block(Number(appId), {
        onSuccess: () => {
          alert(t('App blocked successfully!'))
          queryClient.invalidateQueries({ queryKey: ['uncensoredAppList'] })
          goNext()
        },
        onError: () => {
          alert(t('Failed to block app.'))
        },
      })
    }
  }

  return (
    <ConfirmationProvider value={{ appData, setAppData, refs, dataSectionRef }}>
      <div className='w-full h-full pt-8 flex flex-col gap-4'>
        <AISupportModal status={status} />
        <div
          className='h-full flex flex-col overflow-y-scroll no-scrollbar'
          ref={dataSectionRef}
        >
          <CrawledData
            confirm={() => setStatus({ ...status, crawledData: 'done' })}
            status={status.crawledData}
          />
          <AISuggestion
            confirm={() => setStatus({ ...status, aiSuggestions: 'done' })}
            status={status.aiSuggestions}
          />
          <Screenshots
            confirm={() => setStatus({ ...status, screenshots: 'done' })}
            status={status.screenshots}
            images={images}
            setImages={setImages}
          />
          <DisplayCompatibility
            confirm={() =>
              setStatus({ ...status, displayCompatibility: 'done' })
            }
            status={status.displayCompatibility}
          />
          <AICensor
            confirm={() => setStatus({ ...status, aiCensor: 'done' })}
            status={status.aiCensor}
          />
          <Packaging
            confirm={() => setStatus({ ...status, packaging: 'done' })}
            status={status.packaging}
          />
          <LighthouseTest
            confirm={() => setStatus({ ...status, lighthouseTest: 'done' })}
            status={status.lighthouseTest}
          />
          <Security
            confirm={() => setStatus({ ...status, security: 'done' })}
            status={status.security}
          />
          <div className='px-4 py-6'>
            <Card className='flex px-7 py-6 flex items-center justify-between'>
              <button
                className='flex items-center justify-center
            rounded-full p-2 min-w-24 text-pwandora-gray
            hover:cursor-pointer hover:text-pwandora-black hover:bg-pwandora-foreground-gray
            transition-all duration-200 ease-in-out'
                onClick={goPrev}
              >
                <MaterialIcon name='arrow_back' size='32px' />
              </button>

              <div className='flex items-center gap-4'>
                <button
                  className='py-3 px-4 min-w-24 bg-pwandora-primary text-pwandora-white rounded-3xl hover:cursor-pointer'
                  onClick={onRegister}
                >
                  {t('Register')}
                </button>
                <button
                  className='py-3 px-4 min-w-24 bg-pwandora-red text-pwandora-white rounded-3xl hover:cursor-pointer'
                  onClick={onBlock}
                >
                  {t('Block')}
                </button>
              </div>

              <button
                className='flex items-center justify-center rounded-full p-2 min-w-24 text-pwandora-gray hover:cursor-pointer hover:text-pwandora-black hover:bg-pwandora-foreground-gray transition-all duration-200 ease-in-out'
                onClick={goNext}
              >
                <MaterialIcon name='arrow_forward' size='32px' />
              </button>
            </Card>
          </div>
        </div>
      </div>
    </ConfirmationProvider>
  )
}
