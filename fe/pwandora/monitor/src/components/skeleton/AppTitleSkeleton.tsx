export default function AppHeaderSkeleton() {
  return (
    <div className='flex justify-start items-center gap-8 animate-pulse'>
      <div className='size-24 bg-pwandora-foreground-gray rounded-md' />
      <div className='flex flex-col flex-1 gap-2'>
        <div className='h-6 w-48 bg-pwandora-foreground-gray rounded-md' />
        <div className='flex flex-row gap-2'>
          <div className='h-8 w-16 bg-pwandora-foreground-gray rounded-md' />
          <div className='h-8 w-24 bg-pwandora-foreground-gray rounded-md' />
        </div>
      </div>
    </div>
  )
}
