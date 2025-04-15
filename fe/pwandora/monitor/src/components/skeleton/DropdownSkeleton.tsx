export default function DropdownSkeleton({
  hideLabel = false,
}: {
  hideLabel?: boolean
}) {
  return (
    <div className='relative block animate-pulse'>
      {!hideLabel && (
        <label className='block text-md font-medium font-pwandora-gray'>
          언어
        </label>
      )}
      <div className='w-full h-11 bg-pwandora-foreground-gray mt-2 rounded-xl flex items-center px-4'>
        <div className='h-4 w-24 bg-gray-300 rounded-md' />
        <div className='ml-auto h-4 w-4 bg-gray-300 rounded-md' />
      </div>
    </div>
  )
}
