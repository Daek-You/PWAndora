export default function AppDetailSkeleton() {
  return (
    <div className='flex flex-col gap-6 animate-pulse'>
      <div className='flex flex-col gap-1'>
        <div className='flex gap-2 p-2'>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className='h-8 w-16 border border-pwandora-foreground-gray rounded-md flex items-center justify-center'
              >
                <div className='h-4 w-10 bg-pwandora-foreground-gray rounded-md' />
              </div>
            ))}
        </div>
        <div className='w-240 h-12 border border-pwandora-foreground-gray rounded-lg flex items-center justify-between px-4'>
          <div className='h-4 w-16 bg-pwandora-foreground-gray rounded-md' />
          <div className='h-4 w-24 bg-pwandora-foreground-gray rounded-md' />
        </div>
        <div className='w-240 h-12 border border-pwandora-foreground-gray rounded-lg flex items-center justify-between px-4'>
          <div className='h-4 w-16 bg-pwandora-foreground-gray rounded-md' />
          <div className='h-4 w-24 bg-pwandora-foreground-gray rounded-md' />
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='w-240 h-12 border border-pwandora-foreground-gray rounded-lg flex items-center justify-between px-4'>
          <div className='h-4 w-16 bg-pwandora-foreground-gray rounded-md' />
          <div className='h-4 w-24 bg-pwandora-foreground-gray rounded-md' />
        </div>
        <div className='w-240 h-12 border border-pwandora-foreground-gray rounded-lg flex items-center justify-between px-4'>
          <div className='h-4 w-16 bg-pwandora-foreground-gray rounded-md' />
          <div className='h-4 w-24 bg-pwandora-foreground-gray rounded-md' />
        </div>
      </div>
      <div className='w-240 h-auto border border-pwandora-foreground-gray rounded-lg flex flex-col gap-2 px-4 py-3'>
        <div className='h-4 w-24 bg-pwandora-foreground-gray rounded-md' />
        <div className='flex gap-2 overflow-x-hidden pl-8'>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className='w-45 h-80 bg-pwandora-foreground-gray rounded-lg'
              />
            ))}
        </div>
      </div>
      <div className='grid grid-cols-2 w-240 gap-1'>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className='w-full h-12 border border-pwandora-foreground-gray rounded-lg flex items-center justify-between px-4'
            >
              <div className='h-4 w-16 bg-pwandora-foreground-gray rounded-md' />
              <div className='h-4 w-24 bg-pwandora-foreground-gray rounded-md' />
            </div>
          ))}
      </div>
    </div>
  )
}
