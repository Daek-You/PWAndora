import { ChartData, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import Card from '../common/Card'

export interface ILineGraphCardProps {
  title: string
  data: ChartData<'line'>
}

export default function LineGraphCard(props: ILineGraphCardProps) {
  const options: ChartOptions<'line'> = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      y: {
        suggestedMax: 1,
        ticks: {
          callback: val => {
            if (!Number.isInteger(val)) return ''
            return val
          },
        },
      },
    },
    aspectRatio: 1.9,
  }

  return (
    <Card className='h-full flex-1'>
      <div className='font-semibold'>{props.title}</div>
      <Line data={props.data} options={options} />
    </Card>
  )
}
