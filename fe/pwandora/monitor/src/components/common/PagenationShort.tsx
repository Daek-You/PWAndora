import MaterialIcon from './MaterialIcon'

export interface PagenationShortProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPage: number
}

const PagenationShort = ({
  currentPage,
  setCurrentPage,
  totalPage,
}: PagenationShortProps) => {
  return (
    <div className='py-4 flex items-center justify-between'>
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`flex rounded-xl p-2 transition-all duration-200 ease-in-out
           ${
             currentPage == 1
               ? 'text-pwandora-gray'
               : 'hover:bg-pwandora-foreground-gray hover:cursor-pointer'
           }`}
      >
        <MaterialIcon name='chevron_left' size='24px' />
      </button>
      <input
        value={currentPage}
        onChange={e => setCurrentPage(Number(e.target.value))}
        className='w-8 aspect-1/1 text-center border border-pwandora-gray rounded'
      />
      <span className='flex items-center'> / </span>
      <span className='flex items-center text-sm'>{totalPage}</span>
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPage))}
        disabled={currentPage === totalPage}
        className={`flex rounded-xl p-2 transition-all duration-200 ease-in-out ${
          currentPage == totalPage
            ? 'text-pwandora-gray'
            : 'hover:bg-pwandora-foreground-gray hover:cursor-pointer'
        }`}
      >
        <MaterialIcon name='chevron_right' size='24px' />
      </button>
    </div>
  )
}

export default PagenationShort
