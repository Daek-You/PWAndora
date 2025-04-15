export default function PaginationSkeleton() {
  return (
    <div className='flex gap-2 animate-pulse'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='h-8 w-8 bg-pwandora-foreground-gray rounded-md flex items-center justify-center'
          ></div>
        ))}
    </div>
  )
}
