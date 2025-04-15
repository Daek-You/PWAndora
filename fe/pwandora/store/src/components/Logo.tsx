import logo from '../assets/images/logo.png'

export default function Logo() {
  return (
    <div className='flex flex-col items-center gap-3 py-8'>
      <img src={logo} alt='' width={44} />
      <h1 className='text-xl font-bold'>PWAndora</h1>
    </div>
  )
}
