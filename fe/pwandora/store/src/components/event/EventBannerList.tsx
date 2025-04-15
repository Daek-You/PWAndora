import { useGetEvents } from '@/apis/app'
import { IEvent } from '@/types/IEvent'
import EventBannerItem from './EventBannerItem'

export interface IEventBannerProps {}

export default function EventBanner() {
  const { data: events, isLoading, isError } = useGetEvents()

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error...</p>
  return (
    <div className='px-[4%] pt-6 pb-3 flex flex-row shrink-0 gap-4 overflow-x-scroll snap-x snap-mandatory no-scrollbar '>
      {events.map((event: IEvent) => (
        <EventBannerItem {...event} key={event.pwaId} />
      ))}
    </div>
  )
}
