import Card from '../common/Card'
import AppListItem, { IAppListItemProps } from './AppListItem'
import AppListTitle from './AppListTitle'

export interface IAppListCardProps {
  titles: string[]
  apps: IAppListItemProps[]
}

export default function AppListCard(props: IAppListCardProps) {
  return (
    <Card className='flex flex-col w-320'>
      <AppListTitle titles={props.titles} />
      {props.apps.map(app => (
        <AppListItem {...app} key={app.id} />
      ))}
    </Card>
  )
}
