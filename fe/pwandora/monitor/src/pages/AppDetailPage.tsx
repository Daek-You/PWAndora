import { useParams } from 'react-router'
import Card from '../components/common/Card'
import FieldBox from '../components/appDetail/FieldBox'
import {
  useAppDetail,
  useAppScore,
  useBlock,
  useUnBlock,
  useUpdate,
  useUpdateContent,
  useUpdateScreenshots,
} from '../apis/app'
import AppScore from '../components/appDetail/AppScore'
import AppTitle from '../components/appDetail/AppTitle'
import AppScoreSkeleton from '../components/skeleton/AppScoreSkeleton'
import AppTitleSkeleton from '../components/skeleton/AppTitleSkeleton'
import AppTranslate from '../components/appDetail/AppTranslate'
import AppDetailSkeleton from '../components/skeleton/AppDetailSkeleton'
import { useEffect, useState } from 'react'
import { IContent, IFile, IScreenshot } from '../types/appDetail'
import { IUpdateParams, Screenshot } from '../types/app'
import EditFieldBox from '../components/appDetail/EditFieldBox'
import { ScreenshotEditor } from '../components/appDetail/ScreenshotEditor'
import { useTranslation } from 'react-i18next'

export default function AppDetailPage() {
  const { appId } = useParams()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editingContents, setEditingContents] = useState<Partial<IContent>[]>(
    [],
  )
  const [editingData, setEditingData] = useState<Partial<IUpdateParams> | null>(
    null,
  )
  const [editingScreenshots, setEditingScreenshots] = useState<Screenshot[]>([])

  const { mutate: block } = useBlock()
  const { mutate: unBlock } = useUnBlock()
  const { mutateAsync: update } = useUpdate()
  const { mutateAsync: updateContent } = useUpdateContent()
  const { mutateAsync: updateScreenshots } = useUpdateScreenshots()

  const { t } = useTranslation()

  const {
    data: appDetail,
    isPending: appDetailPending,
    isError: appDetailError,
    refetch,
  } = useAppDetail(Number(appId))

  const setEditings = () => {
    setEditingData(() => {
      const { id, iconIamge, websiteUrl, version, company, developerSite } =
        appDetail
      return { id, iconIamge, websiteUrl, version, company, developerSite }
    })
    setEditingContents(appDetail.contents)
    setEditingScreenshots(appDetail.screenshots)
  }

  useEffect(() => {
    if (!!appDetail) {
      setEditings()
    }
  }, [appDetail, isEditing])

  const WGTFile: IFile | null = appDetail?.files?.find(
    (file: IFile) => file.fileType === 'WGT',
  )

  const APKFile: IFile | null = appDetail?.files?.find(
    (file: IFile) => file.fileType === 'APK',
  )

  const {
    data: appScore,
    isPending: appScorePending,
    isError: appScoreError,
  } = useAppScore(appDetail?.websiteUrl, { enabled: !!appDetail })

  const categories = appScore?.lighthouseResult?.categories ?? null

  const performance = Math.round((categories?.performance?.score ?? 0) * 100)
  const accessibility = Math.round(
    (categories?.accessibility?.score ?? 0) * 100,
  )
  const bestPractice = Math.round(
    (categories?.['best-practices']?.score ?? 0) * 100,
  )
  const seo = Math.round((categories?.seo?.score ?? 0) * 100)

  const score = { performance, accessibility, bestPractice, seo }

  const save = async () => {
    const edited: Promise<any>[] = []
    appDetail.contents.forEach((content: IContent) => {
      const editedContent = editingContents?.find(
        edit => edit.languageCode === content.languageCode,
      )
      if (!editedContent) {
        return
      }

      const { name, summary, description } = editedContent as IContent
      ;(Object.keys(content) as (keyof IContent)[]).forEach(key => {
        if (content[key] !== editedContent[key]) {
          edited.push(
            updateContent({
              appId: appDetail.id,
              languageId: content.languageId,
              data: { name, summary, description },
            }),
          )
          return
        }
      })
    })

    if (editingData) {
      const changed: Partial<IUpdateParams> = {}
      ;(Object.keys(editingData) as (keyof IUpdateParams)[]).forEach(key => {
        if (appDetail[key] !== editingData[key]) {
          changed[key] = editingData[key] as any
        }
      })
      if (Object.keys(changed).length > 0) {
        edited.push(
          update({
            id: appDetail.id,
            data: changed,
          }),
        )
      }
    }

    if (
      appDetail.screenshots.length !== editingScreenshots.length ||
      editingScreenshots.some(screenshot => {
        return (
          !!screenshot.file ||
          !appDetail.screenshots.find((original: IScreenshot) => {
            return (
              original.imageUrl === screenshot.imageUrl &&
              original.screenshotOrder === screenshot.screenshotOrder
            )
          })
        )
      })
    ) {
      edited.push(
        updateScreenshots({
          appId: appDetail.id,
          screenshots: editingScreenshots,
        }),
      )
    }

    await Promise.allSettled(edited)
    await refetch()
  }

  const setData = (data: Partial<IUpdateParams>) => {
    setEditingData(prev => {
      return { ...prev, ...data }
    })
  }

  const onBlock = (blocked: boolean) => {
    if (blocked) {
      unBlock(appDetail.id, {
        onSuccess: refetch,
      })
      return
    }
    block(appDetail.id, {
      onSuccess: refetch,
    })
  }

  return (
    <Card className='flex flex-col items-center gap-6 w-280 mt-12'>
      <div className='flex justify-between items-center w-240'>
        {appDetailPending || appDetailError ? (
          <AppTitleSkeleton />
        ) : (
          <AppTitle
            appDetail={appDetail}
            isEditing={isEditing}
            onBlock={onBlock}
            onSave={save}
            setIsEditing={setIsEditing}
          />
        )}
        {appScorePending || appScoreError ? (
          <AppScoreSkeleton />
        ) : (
          <AppScore {...score} />
        )}
      </div>
      {appDetailPending ? (
        <AppDetailSkeleton />
      ) : (
        <>
          <AppTranslate
            contents={appDetail?.contents ?? {}}
            isEditing={isEditing}
            editingContents={editingContents}
            setEditingContents={setEditingContents}
          />
          {isEditing ? (
            <FieldBox
              field={t('screenshots')}
              className='flex-col border-pwandora-gray'
              data={
                <ScreenshotEditor
                  appId={appDetail?.id}
                  editingScreenshots={editingScreenshots}
                  setEditingScreenshots={setEditingScreenshots}
                />
              }
            />
          ) : (
            <FieldBox
              field={t('screenshots')}
              className='flex-col'
              data={
                <div className='flex justify-start gap-2 overflow-x-hidden pt-4'>
                  {appDetail?.screenshots?.map(
                    (screenshot: {
                      imageUrl: string
                      screenshotOrder: number
                    }) => (
                      <img
                        src={screenshot.imageUrl}
                        alt={`screenshot${screenshot.screenshotOrder}`}
                        className='w-36 h-80 rounded-lg object-cover'
                        key={screenshot.screenshotOrder}
                      />
                    ),
                  )}
                </div>
              }
              height='auto'
            />
          )}
          {isEditing && editingData != null ? (
            <div className='flex flex-col gap-1'>
              <EditFieldBox
                field={t('website URL')}
                value={editingData.websiteUrl || ''}
                onChange={websiteUrl => setData({ websiteUrl })}
              />
              <EditFieldBox
                field={t('Developer site URL')}
                value={editingData.developerSite || ''}
                onChange={developerSite => setData({ developerSite })}
              />
            </div>
          ) : (
            <div className='flex flex-col gap-1'>
              <FieldBox
                field={t('website URL')}
                data={appDetail?.websiteUrl || ''}
              />
              <FieldBox
                field={t('Developer site URL')}
                data={appDetail?.developerSite || ''}
              />
            </div>
          )}
          <div className='flex flex-col gap-1'>
            {WGTFile && (
              <>
                <FieldBox
                  field={t('WGT file URL')}
                  data={WGTFile.downloadUrl}
                />
                <FieldBox field={t('WGT file size')} data={WGTFile.fileSize} />
              </>
            )}
            {APKFile && (
              <>
                <FieldBox
                  field={t('APK file URL')}
                  data={APKFile.downloadUrl}
                />
                <FieldBox field={t('APK file size')} data={APKFile.fileSize} />
              </>
            )}
          </div>
          <div className='grid grid-cols-2 w-240 gap-1'>
            <FieldBox
              field={t('created at')}
              data={appDetail?.createdAt.split('T')[0] ?? ''}
              width='full'
            />
            <FieldBox
              field={t('updated at')}
              data={appDetail?.updatedAt.split('T')[0] ?? ''}
              width='full'
            />
            <FieldBox
              field={t('downloads')}
              data={appDetail?.downloadCount ?? 0}
              width='full'
            />
            <FieldBox
              field={t('category')}
              data={
                appDetail?.categories
                  ?.map(
                    (category: { name: string; categoryOrder: number }) =>
                      category.name,
                  )
                  .join(', ') ?? ''
              }
              width='full'
            />
          </div>
        </>
      )}
    </Card>
  )
}
