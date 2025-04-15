export default function StatusBoxSkeleton() {
  return (
    <div className='flex flex-col items-center gap-2 py-6 border border-pwandora-gray rounded-xl animate-pulse'>
      <div className='h-6 w-20 bg-pwandora-foreground-gray rounded-md' />
      <div className='h-6 w-32 bg-pwandora-foreground-gray rounded-md' />
    </div>
  )
}
