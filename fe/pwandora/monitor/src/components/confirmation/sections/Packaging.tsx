import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'
import ConfirmItem from '../appData/ConfirmItem'
import ConfirmItemFile from '../appData/ConfirmItemFile'
import ConfirmSection from '../appData/ConfirmSection'

export default function Packaging({
  confirm,
  status,
}: IConfirmSectionCommonProps) {
  const { appData } = useConfirmation()
  const files = appData.packagingStepDto
  return (
    <ConfirmSection
      name='packaging'
      {...appData}
      confirm={confirm}
      status={status}
    >
      <ConfirmItem key={files.packagingData[1].fileType} name={'Tizen (.wgt)'}>
        <ConfirmItemFile
          url={files.packagingData[1].downloadUrl}
          size={files.packagingData[1].fileSize}
          name={
            files.packagingData[1].downloadUrl.split('/').pop() || 'no_name'
          }
        />
      </ConfirmItem>
      <ConfirmItem
        key={files.packagingData[0].fileType}
        name={'Android (.apk)'}
      >
        <ConfirmItemFile
          url={files.packagingData[0].downloadUrl}
          size={files.packagingData[0].fileSize}
          name={
            files.packagingData[0].downloadUrl.split('/').pop() || 'no_name'
          }
        />
      </ConfirmItem>
      {/* {files.packagingData.map(file => (
        <ConfirmItem key={file.fileType} name={file.fileType}>
          <ConfirmItemFile
            url={file.downloadUrl}
            size={file.fileSize}
            name={file.downloadUrl.split('/').pop() || 'no_name'}
          />
        </ConfirmItem>
      ))} */}
    </ConfirmSection>
  )
}
