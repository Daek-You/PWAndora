import ConfirmSection from '../appData/ConfirmSection'
import ConfirmItem from '../appData/ConfirmItem'
import MaterialIcon from '../../common/MaterialIcon'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { useTranslation } from 'react-i18next'
import DragToScroll from '../../common/DragToScroll'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'

export interface IScreenshotsProps extends IConfirmSectionCommonProps {
  images: File[]
  setImages: React.Dispatch<React.SetStateAction<File[]>>
}

export default function Screenshots({
  confirm,
  status,
  images,
  setImages,
}: IScreenshotsProps) {
  const { t } = useTranslation()
  const { appData } = useConfirmation()
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    const selectedFiles = Array.from(files)
    const newImages = [...images, ...selectedFiles]
    if (newImages.length > 5) alert(t('You can only upload up to 5 images.'))
    setImages(newImages.slice(0, 5))
  }
  const handleImageRemove = (index: number) => {
    if (window.confirm(t('Are you sure you want to remove this image?'))) {
      setImages(prev => prev.filter((_, i) => i !== index))
    }
  }
  return (
    <ConfirmSection
      name='screenshots'
      {...appData}
      confirm={confirm}
      status={status}
    >
      <ConfirmItem full>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageChange}
          className='hidden'
        />
        <DragToScroll className='flex gap-2 h-80 overflow-x-scroll p-1 overflow-y-hidden'>
          <button
            className='aspect-9/16 bg-pwandora-foreground-gray 
                flex items-center justify-center
                group hover:cursor-pointer '
            onClick={() => {
              const input: HTMLElement | null =
                document.querySelector('input[type="file"]')
              if (input) input.click()
            }}
          >
            <MaterialIcon
              name='add'
              size='32px'
              className='p-2 rounded-full text-pwandora-gray border-pwandora-gray border-1 group-hover:bg-pwandora-white transition-all duration-200 ease-in-out'
            />
          </button>
          {images.map((image: File, index: number) => (
            <div
              key={index}
              className='relative aspect-9/16 shadow-sm
                  group cursor-grab'
            >
              <img
                src={URL.createObjectURL(image)}
                className='w-full h-full object-cover group-hover:opacity-50 transition-all duration-200 ease-in-out pointer-events-none'
              />
              <button
                onClick={() => handleImageRemove(index)}
                className='cursor-pointer'
              >
                <MaterialIcon
                  name='close'
                  size='32px'
                  className='absolute p-2 rounded-full text-pwandora-red border-pwandora-red bg-pwandora-white border-1 opacity-0
                group-hover:opacity-100 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all duration-200 ease-in-out'
                />
              </button>
            </div>
          ))}
        </DragToScroll>
      </ConfirmItem>
    </ConfirmSection>
  )
}
