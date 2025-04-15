import Card from '../common/Card'

export default function DoughnutGraphCardSkeleton() {
  return (
    <Card className='h-104 w-120 animate-pulse flex flex-col gap-4 p-4'>
      <div className='h-5 w-32 bg-pwandora-foreground-gray rounded-md' />
      <div className='h-70 w-70 bg-pwandora-foreground-gray rounded-full self-center' />
    </Card>
  )
}
