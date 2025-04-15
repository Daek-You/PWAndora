import Card from '../common/Card'

export default function LineGraphCardSkeleton() {
  return (
    <Card className='h-104 flex-1 animate-pulse flex flex-col gap-4 p-4'>
      <div className='h-5 w-32 bg-pwandora-foreground-gray rounded-md' />
      <div className='h-70 w-full bg-pwandora-foreground-gray rounded-md' />
    </Card>
  )
}
