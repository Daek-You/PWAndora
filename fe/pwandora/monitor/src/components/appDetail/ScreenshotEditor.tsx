import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  restrictToParentElement,
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers'
import { rectSortingStrategy } from '@dnd-kit/sortable'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'

import { Screenshot } from '../../types/app'
import { SortableScreenshot } from './SortableScreenshot'

interface IScreenshotEditorProps {
  appId: number
  editingScreenshots: Screenshot[]
  setEditingScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>
}

export function ScreenshotEditor({
  editingScreenshots,
  setEditingScreenshots,
}: IScreenshotEditorProps) {
  // Dropzone
  const onDrop = (acceptedFiles: File[]) => {
    const newItems = acceptedFiles.map((file, idx) => ({
      imageUrl: URL.createObjectURL(file),
      screenshotOrder: editingScreenshots.length + idx + 1,
      file,
    }))
    setEditingScreenshots(prev => [...prev, ...newItems])
  }
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  // 삭제
  const handleDelete = (order: number) => {
    setEditingScreenshots(prev => prev.filter(s => s.screenshotOrder !== order))
  }

  // 드래그 순서 변경
  const sensors = useSensors(useSensor(PointerSensor))
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = editingScreenshots.findIndex(
      s => s.screenshotOrder === active.id,
    )
    const newIndex = editingScreenshots.findIndex(
      s => s.screenshotOrder === over.id,
    )
    const reordered = arrayMove(editingScreenshots, oldIndex, newIndex).map(
      (s, i) => ({
        ...s,
        screenshotOrder: i + 1,
      }),
    )
    setEditingScreenshots(reordered)
  }

  return (
    <div className='flex flex-row justify-start items-center'>
      {/* 정렬 가능한 스크린샷 리스트 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToHorizontalAxis]}
      >
        <SortableContext
          items={editingScreenshots.map(s => s.screenshotOrder)}
          strategy={rectSortingStrategy}
        >
          <div className='w-fit overflow-y-hidden'>
            <div className='flex gap-2 h-80 mt-4'>
              {editingScreenshots.map(s => (
                <SortableScreenshot
                  key={s.screenshotOrder}
                  screenshot={s}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
      {/* 업로드 영역 */}
      <div
        {...getRootProps()}
        className='ml-4 mt-4 cursor-pointer border border-dashed border-pwandora-gray p-4 h-80 w-36 rounded-lg text-center text-pwandora-gray'
      >
        <input {...getInputProps()} />
        <p>업로드</p>
      </div>
    </div>
  )
}
