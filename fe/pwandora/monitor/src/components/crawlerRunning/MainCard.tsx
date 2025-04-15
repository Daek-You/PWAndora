import Card from '../common/Card'
import MainTitle from './MainTitle'
import PipelineList from './PipelineList'
import PipelineTitle from './PipelineTitle'

export default function MainCard() {
  return (
    <Card className='flex-1 flex flex-col overflow-hidden'>
      <MainTitle />
      <PipelineTitle />
      <PipelineList />
    </Card>
  )
}
