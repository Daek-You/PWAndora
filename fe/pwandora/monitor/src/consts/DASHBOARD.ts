import { ChartData } from "chart.js";
import { IStatusCardProps } from "../components/dashboard/StatusCard";

export const statusCardProps: IStatusCardProps[] = [
    {
      title: 'Collected Apps',
      current: 40689,
      change: 97,
      iconName: 'Collections_bookmark',
      iconColor: 'text-pwandora-primary',
    },
    {
      title: 'Available Apps',
      current: 20689,
      change: -25,
      iconName: 'Check_circle_outline',
      iconColor: 'text-pwandora-green',
    },
    {
      title: 'Total Downloads',
      current: 120689,
      change: 3819,
      iconName: 'File_download',
      iconColor: 'text-black',
    },
    {
      title: 'Blocked Apps',
      current: 1289,
      change: 12,
      iconName: 'Block',
      iconColor: 'text-pwandora-red',
    },
] as const


export const doughnutData: ChartData<'doughnut'> = {
    labels: ['Shopping', 'Lifestyle', 'Productivity', 'Game'],
    datasets: [
      {
        data: [123, 451, 212, 546],
        backgroundColor: ['#8064F4', '#FF9E00', '#E95B31', '#6693ED'],
        borderRadius: 8,
      },
    ],
}

export const lineData: ChartData<'line'> = {
    labels: [
      '2025-02',
      '2025-03',
      '2025-04',
      '2025-05',
      '2025-06',
      '2025-07',
      '2025-08',
      '2025-09',
      '2025-10',
    ],
    datasets: [
      {
        label: 'Available apps',
        data: [420, 500, 580, 660, 750, 830, 910, 1000, 1080],
        backgroundColor: '#11B1F3',
        borderColor: '#11B1F3',
      },
      {
        label: 'Collected apps',
        data: [500, 600, 700, 800, 900, 980, 1060, 1150, 1200],
        backgroundColor: '#0091EA',
        borderColor: '#0091EA',
      },
    ],
}
