import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import Card from '../common/Card'
import { ROUTES } from '../../consts/ROUTES'

export interface IDoughnutGraphCardProps {
  title: string
  data: ChartData<'doughnut'>
}

export default function DoughnutGraphCard(props: IDoughnutGraphCardProps) {
  ChartJS.register(ArcElement, Tooltip, Legend)

  const options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        position: 'left',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    onHover: (event, chartElement) => {
      const target = event?.native?.target as HTMLCanvasElement | null

      if (target) {
        target.style.cursor = chartElement.length ? 'pointer' : 'default'
      }
    },
    onClick: (_, elements) => {
      console.log(elements)
      if (elements.length > 0) {
        const clickedIndex = elements[0].index
        const labels = props.data.labels
        if (labels) {
          const category = labels[clickedIndex]
          if (category) {
            window.location.href = `/monitor${ROUTES.APP}?category=${category}`
          }
        }
      }
    },
    aspectRatio: 1.2,
    cutout: 90,
  }

  return (
    <Card className='h-full w-120'>
      <div className='font-semibold pb-4'>{props.title}</div>
      <Doughnut data={props.data} options={options} />
    </Card>
  )
}
