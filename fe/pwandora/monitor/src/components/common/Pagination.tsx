import { useSearchParams } from 'react-router'

interface IPaginationProps {
  totalPageCount: number
}

export default function Pagination({ totalPageCount }: IPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPageCount) {
      setSearchParams(currentParams => {
        const paramsObj: Record<string, string> = {}
        currentParams.forEach((value, key) => {
          paramsObj[key] = value
        })

        return {
          ...paramsObj,
          page: page.toString(),
        }
      })
    }
  }
  let startPage = Math.max(1, currentPage - 10)
  let endPage = Math.min(totalPageCount, currentPage + 9)

  if (endPage - startPage < 19) {
    if (startPage === 1) {
      endPage = Math.min(totalPageCount, startPage + 19)
    } else if (endPage === totalPageCount) {
      startPage = Math.max(1, endPage - 19)
    }
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  )

  return (
    <div className='flex gap-2'>
      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`h-8 w-8 rounded-md flex items-center justify-center text-sm bg-pwandora-foreground-gray text-pwandora-gray cursor-pointer ${
            page === currentPage ? 'font-bold' : ''
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}
