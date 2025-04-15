import AppListTitle from '../appList/AppListTitle'
import Card from '../common/Card'
import AppItemSkeleton from './AppListItemSkeleton'

export default function AppListCardSkeleton(props: { titles: string[] }) {
  return (
    <Card className='flex flex-col w-320'>
      <AppListTitle titles={props.titles} />
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <AppItemSkeleton key={index} />
        ))}
    </Card>
  )
}
