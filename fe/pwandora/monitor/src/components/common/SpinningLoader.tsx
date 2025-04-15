export interface ISpinningLoaderProps {
  size: number
}

export default function SpinningLoader({ size }: ISpinningLoaderProps) {
  return (
    <div
      className={`h-${size} w-${size} rounded-full p-1 bg-conic from-pwandora-green to-white animate-spin`}
    >
      <div className='w-full h-full bg-white rounded-full'></div>
    </div>
  )
}
