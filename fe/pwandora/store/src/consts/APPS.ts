import king from '@/assets/images/apps/K-ing.png'
import ddangx3 from '@/assets/images/apps/Ddangx3.png'
import starbucks from '@/assets/images/apps/Starbucks.png'
import x from '@/assets/images/apps/X.png'
import reddit from '@/assets/images/apps/Reddit.png'
import youtube from '@/assets/images/apps/Youtube.png'
import facebook from '@/assets/images/apps/Facebook.png'
import spotify from '@/assets/images/apps/Spotify.png'
import tiktok from '@/assets/images/apps/TikTok.png'
import instagram from '@/assets/images/apps/Instagram.png'

export const apps = [
  {
    id: 1,
    name: 'K-ing',
    icon: king,
    category: 'Food & Drink',
    installed: false,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 2,
    name: 'Ddangx3',
    icon: ddangx3,
    category: 'Games',
    installed: false,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 3,
    name: 'Starbucks',
    icon: starbucks,
    category: 'Food & Drink',
    installed: true,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 4,
    name: 'X',
    icon: x,
    category: 'Social Media',
    installed: false,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 5,
    name: 'Reddit',
    icon: reddit,
    category: 'Social Media',
    installed: true,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 6,
    name: 'YouTube',
    icon: youtube,
    category: 'Video',
    installed: false,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 7,
    name: 'Facebook',
    icon: facebook,
    category: 'Social Media',
    installed: true,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 8,
    name: 'Spotify',
    icon: spotify,
    category: 'Music',
    installed: true,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 9,
    name: 'TikTok',
    icon: tiktok,
    category: 'Video',
    installed: true,
    downloads: Math.floor(Math.random() * 100000000),
  },
  {
    id: 10,
    name: 'Instagram',
    icon: instagram,
    category: 'Social Media',
    installed: false,
    downloads: Math.floor(Math.random() * 100000000),
  },
] as const
