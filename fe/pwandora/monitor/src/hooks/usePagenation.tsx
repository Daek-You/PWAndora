import { useState } from 'react'

const usePagination = (initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const nextPage = (totalPage: number) =>
    setCurrentPage(prev => Math.min(prev + 1, totalPage))

  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  const goToPage = (page: number, totalPage: number) => {
    if (page >= 1 && page <= totalPage) setCurrentPage(page)
  }

  return { currentPage, setCurrentPage, nextPage, prevPage, goToPage }
}

export default usePagination
