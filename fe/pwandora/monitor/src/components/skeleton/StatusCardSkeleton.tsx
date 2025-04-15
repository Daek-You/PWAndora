import Card from '../common/Card'

const SkeletonStatusCard = () => {
  return (
    <Card className='flex flex-col gap-2 w-72 animate-pulse'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='h-7 w-24 mb-2 bg-pwandora-foreground-gray rounded-md' />
          <div className='h-10 w-32 bg-pwandora-foreground-gray rounded-md' />
        </div>
        <div className='h-8 w-8 bg-pwandora-foreground-gray rounded-full' />
      </div>
      <div className='flex flex-row items-center gap-2'>
        <div className='h-6 w-20 bg-pwandora-foreground-gray rounded-md' />
        <div className='h-6 w-24 bg-pwandora-foreground-gray rounded-md' />
      </div>
    </Card>
  )
}

export default SkeletonStatusCard
