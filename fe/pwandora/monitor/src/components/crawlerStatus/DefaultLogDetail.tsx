import { PWAndora, giftBox } from '../../consts/ASCII'

export default function DefaultLogDetail() {
  return (
    <div className='w-full flex flex-col gap-4 h-132 bg-black text-white p-4'>
      <div className='text-md font-bold'>로그를 선택해주세요</div>
      <div className='flex'>
        <div className='flex flex-col font-mono'>
          {Array.from({ length: 19 }, (_, index) => (
            <div key={index} className='text-pwandora-gray'>
              {index + 1}
            </div>
          ))}
        </div>
        <div className='flex flex-col items-center w-full'>
          <pre>{PWAndora}</pre>
          <pre>{giftBox}</pre>
        </div>
      </div>
    </div>
  )
}
