import Card from '../common/Card'
import logoMimic from '../../assets/images/logos/logo-mimic.png'

export default function EmptyListCard() {
  return (
    <Card className='flex flex-col items-center justify-center gap-12 h-140 w-320'>
      <div className='text-3xl font-bold text-pwandora-gray'>
        검색된 앱이 없습니다 :b
      </div>
      <img src={logoMimic} alt='Pwandora logo' className='size-80' />
    </Card>
  )
}
