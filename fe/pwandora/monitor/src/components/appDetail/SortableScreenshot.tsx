import { useSortable } from '@dnd-kit/sortable'
import { Screenshot } from '../../types/app'
import { CSS } from '@dnd-kit/utilities'
import { defaultAnimateLayoutChanges } from '@dnd-kit/sortable'

import { AnimateLayoutChanges } from '@dnd-kit/sortable'

export function SortableScreenshot({
  screenshot,
  onDelete,
}: {
  screenshot: Screenshot
  onDelete: (order: number) => void
}) {
  const animateLayoutChanges: AnimateLayoutChanges = args => {
    // 드래그 중인 아이템이면 애니메이션 하지 않음
    if (args.isSorting || args.wasDragging) {
      return false
    }
    return defaultAnimateLayoutChanges(args)
  }
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: screenshot.screenshotOrder,
      animateLayoutChanges,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className='relative w-fit'>
      <img
        src={screenshot.imageUrl}
        alt={`screenshot${screenshot.screenshotOrder}`}
        className='h-80 w-36 rounded-lg object-cover'
        {...attributes}
        {...listeners}
      />
      <button
        className='absolute top-1 right-1 bg-black bg-opacity-50 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center cursor-pointer'
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          onDelete(screenshot.screenshotOrder)
        }}
      >
        ×
      </button>
    </div>
  )
}
