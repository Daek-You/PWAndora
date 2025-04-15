import SectionStatusButton from './SectionStatusButton'
import { IConfirmStatus } from '../../../types/confirmation'
import { SECTION_NAME } from '../../../consts/CONFIRMATION'

interface IAISupportModalProps {
  status: {
    [key in keyof typeof SECTION_NAME]: IConfirmStatus
  }
}

export default function AISupportModal(props: IAISupportModalProps) {
  return (
    <div className='w-full px-4'>
      <div className='px-2 py-3 flex justify-around bg-white shadow-lg shadow-gray-200 rounded-2xl'>
        {Object.entries(props.status).map(([key, value]) => (
          <SectionStatusButton
            key={key}
            name={key as keyof typeof SECTION_NAME}
            status={value}
          />
        ))}
      </div>
    </div>
  )
}
