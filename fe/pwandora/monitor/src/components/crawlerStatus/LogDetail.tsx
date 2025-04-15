import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { formatDistanceToNow, Locale } from 'date-fns'
import { useInfiniteLogs } from '../../apis/logs'
import { ILogContent, TLogStatus } from '../../types/logs'
import { useEffect, useRef } from 'react'
import React from 'react'
import { ar, enUS, es, fr, ja, ko, ru } from 'date-fns/locale'
import { useUserLanguage } from '../../contexts/LanguageContext'

export default function LogDetail() {
  const { runId } = useParams()
  const { language } = useUserLanguage()
  const { t } = useTranslation()
  const { data, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteLogs({
      pipelineId: runId || '',
    })

  const bottomRef = useRef<HTMLDivElement>(null)

  const logColor: Record<TLogStatus, string> = {
    SUCCESS: 'text-pwandora-green',
    FAILED: 'text-pwandora-red',
    ERROR: 'text-pwandora-red',
    FINISHED: '',
    INPROGRESS: '',
  }

  const localeMap: Record<string, Locale> = {
    ko: ko,
    en: enUS,
    fr: fr,
    es: es,
    ar: ar,
    ja: ja,
    ru: ru,
  }

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        rootMargin: '100px',
      },
    )

    observer.observe(bottomRef.current)

    return () => observer.disconnect()
  }, [bottomRef, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className='w-full flex flex-col gap-4 h-132 bg-black text-white p-4'>
      <div>
        <div className='text-md font-bold'>{t('App Register')}</div>
        <div className='text-sm text-pwandora-gray'>
          {data?.pages[0]?.content[0]?.timestamp &&
            formatDistanceToNow(
              new Date(data?.pages[0]?.content[0]?.timestamp),
              {
                addSuffix: true,
                locale: localeMap[language || 'ko'],
              },
            )}
        </div>
      </div>
      {isSuccess ? (
        <div className='grid grid-cols-[auto_1fr] gap-2 text-sm overflow-y-scroll font-mono'>
          {data?.pages
            .flatMap(page => page.content)
            .map((log: ILogContent, index: number) => (
              <React.Fragment key={index}>
                <div className='text-pwandora-gray'>{index + 1}</div>
                <div
                  className={`${logColor[log.status]}`}
                >{`[${log.logLevel}] ${log.message}`}</div>
              </React.Fragment>
            ))}
          <div ref={bottomRef} className='h-1' />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
