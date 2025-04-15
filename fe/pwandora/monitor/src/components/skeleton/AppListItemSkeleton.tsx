export default function AppItemSkeleton() {
  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-8 py-4 text-center items-center justify-center border-t border-pwandora-foreground-gray animate-pulse w-full'>
        <div className='flex items-center justify-center'>
          <div className='size-16 bg-pwandora-foreground-gray rounded-md' />
        </div>
        <div className='h-5 w-24 bg-pwandora-foreground-gray rounded-md' />
        <div className='h-5 w-8 bg-pwandora-foreground-gray rounded-md' />
        <div className='h-5 w-16 bg-pwandora-foreground-gray rounded-md' />
        <div className='h-5 w-12 bg-pwandora-foreground-gray rounded-md' />
        <div className='h-5 w-20 bg-pwandora-foreground-gray rounded-md' />
        <div className='h-5 w-20 bg-pwandora-foreground-gray rounded-md' />
        <div className='flex justify-center gap-2'>
          <div className='h-8 w-8 bg-pwandora-foreground-gray rounded-md' />
          <div className='h-8 w-8 bg-pwandora-foreground-gray rounded-md' />
        </div>
      </div>
    </div>
  )
}
