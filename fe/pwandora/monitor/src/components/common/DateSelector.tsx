import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, parse, subDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useSearchParams } from 'react-router'

import 'react-datepicker/dist/react-datepicker.css'
import MaterialIcon from './MaterialIcon'

export default function DateSelector() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const [startDate, endDate] = dateRange
  const today = new Date()

  const getRangeFromParams = (): [Date, Date] => {
    const startStr = searchParams.get('startDate')
    const endStr = searchParams.get('endDate')

    try {
      const parsedStart = startStr
        ? parse(startStr, 'yyyy-MM-dd', new Date())
        : subDays(today, 6)
      const parsedEnd = endStr ? parse(endStr, 'yyyy-MM-dd', new Date()) : today

      return [parsedStart, parsedEnd]
    } catch (e) {
      console.warn('날짜 파싱 실패:', e)
      const fallbackStart = subDays(today, 6)
      return [fallbackStart, today]
    }
  }

  useEffect(() => {
    const [start, end] = getRangeFromParams()
    setDateRange([start, end])

    if (!searchParams.get('startDate') || !searchParams.get('endDate')) {
      searchParams.set('startDate', format(start, 'yyyy-MM-dd'))
      searchParams.set('endDate', format(end, 'yyyy-MM-dd'))
      setSearchParams(searchParams)
    }
  }, [searchParams])

  const handleConfirm = () => {
    if (startDate) {
      const end = endDate ?? startDate
      searchParams.set('startDate', format(startDate, 'yyyy-MM-dd'))
      searchParams.set('endDate', format(end, 'yyyy-MM-dd'))
      setSearchParams(searchParams)
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    const [start, end] = getRangeFromParams()
    setDateRange([start, end])
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <div
        className='flex gap-1 border border-pwandora-gray rounded-sm text-pwandora-gray text-sm py-1 px-2 cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <div>{startDate ? format(startDate, 'yyyy-MM-dd') : '시작일'}</div>
        <MaterialIcon name='Calendar_month' size='20px' />
        <div>~</div>
        <div>
          {endDate
            ? format(endDate, 'yyyy-MM-dd')
            : startDate
            ? format(startDate, 'yyyy-MM-dd')
            : ''}
        </div>
        <MaterialIcon name='Calendar_month' size='20px' />
      </div>

      {isOpen && (
        <div className='absolute z-50 top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4'>
          <DatePicker
            selected={startDate}
            onChange={(update: [Date | null, Date | null]) =>
              setDateRange(update)
            }
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            locale={ko}
            maxDate={today}
          />
          <div className='flex justify-end gap-2 mt-2'>
            <button
              className='text-sm px-3 py-1 rounded border border-pwandora-gray hover:bg-gray-100 cursor-pointer'
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              className='text-sm px-3 py-1 rounded bg-pwandora-active text-white hover:bg-pwandora-primary cursor-pointer'
              onClick={handleConfirm}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
