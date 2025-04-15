import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

export default function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = [true, false, null]

  const acceptanceString = ['검수 완료', '검수 전', '검수: 전체']
  const blockedString = ['차단됨', '사용 가능', '차단: 전체']

  const getIndexFromValue = (value: string | null) => {
    if (value === 'true') return 0
    if (value === 'false') return 1
    return 2
  }

  const [acceptanceStatus, setAcceptanceStatus] = useState(() =>
    getIndexFromValue(searchParams.get('acceptanceStatus')),
  )
  const [isBlocked, setIsBlocked] = useState(() =>
    getIndexFromValue(searchParams.get('isBlocked')),
  )

  useEffect(() => {
    const category = searchParams.get('category')
    const newParams: Record<string, string> = {}

    if (!!category) {
      newParams.category = category
    }

    if (status[acceptanceStatus] !== null) {
      newParams.acceptanceStatus = String(status[acceptanceStatus])
    }

    if (status[isBlocked] !== null) {
      newParams.isBlocked = String(status[isBlocked])
    }

    setSearchParams(newParams)
  }, [acceptanceStatus, isBlocked])

  const handleConfirmStatus = () => {
    setAcceptanceStatus(prev => {
      if (prev === 0) {
        setIsBlocked(2)
      }
      return (prev + 1) % 3
    })
  }

  return (
    <div className='flex gap-4'>
      <div
        className={`py-1 w-21 text-center rounded-lg border transition-all cursor-pointer 
        ${
          acceptanceStatus === 0
            ? 'bg-pwandora-green/10 text-pwandora-green font-semibold'
            : ''
        }
        ${
          acceptanceStatus === 1
            ? 'bg-pwandora-red/10 text-pwandora-red font-semibold'
            : ''
        }
        ${
          acceptanceStatus === 2
            ? 'bg-pwandora-gray/10 text-pwandora-gray font-semibold'
            : ''
        }`}
        onClick={handleConfirmStatus}
      >
        {acceptanceString[acceptanceStatus]}
      </div>
      <div
        className={`py-1 w-21 text-center rounded-lg border transition-all cursor-pointer 
            ${
              isBlocked === 0
                ? 'bg-pwandora-red/10 text-pwandora-red font-semibold'
                : ''
            }
            ${
              isBlocked === 1
                ? 'bg-pwandora-green/10 text-pwandora-green font-semibold'
                : ''
            }
            ${
              isBlocked === 2
                ? 'bg-pwandora-gray/10 text-pwandora-gray font-semibold'
                : ''
            }
            hover:bg-blue-50`}
        onClick={() => setIsBlocked(prev => (prev + 1) % 3)}
      >
        {blockedString[isBlocked]}
      </div>
    </div>
  )
}
