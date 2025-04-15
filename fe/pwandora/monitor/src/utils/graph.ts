import { ChartData } from 'chart.js'
import { ICategoryCount, IStackCount } from '../types/dashboard'

export const toLineData = (
  label: string,
  datas: IStackCount[],
): ChartData<'line'> => {
  const labels = datas.map(data => data.date.slice(5))
  const pwaData = datas.map(data => data.pwaStackCount)

  return {
    labels,
    datasets: [
      {
        label,
        data: pwaData,
        backgroundColor: '#11B1F3',
        borderColor: '#11B1F3',
      },
    ],
  }
}

export const toDoughnutData = (
  datas: ICategoryCount[],
): ChartData<'doughnut'> => {
  const labels = datas.map(data => data.name)

  const total = datas.reduce((acc, cur) => acc + cur.count, 0)
  const minVal = total * 0.005
  const data = datas.map(data => (data.count < minVal ? minVal : data.count))
  const colors = [
    '#008999',
    '#0C967C',
    '#15B76D',
    '#18DC7F',
    '#9BBE04',
    '#FFC400',
    '#FF9E00',
    '#FF7B22',
    '#E95B31',
    '#E53D35',
    '#EE2172',
    '#8064F4',
    '#7882FF',
    '#6693ED',
    '#0091EA',
    '#11B1F3',
  ]
  const backgroundColor = Array.from(
    { length: labels.length },
    (_, i) => colors[Math.floor((colors.length * i) / labels.length)],
  )
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderRadius: 8,
      },
    ],
  }
}
