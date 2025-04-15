export interface IContainerBottomProps {
  children: React.ReactNode
}

export default function ContainerBottom(props: IContainerBottomProps) {
  return (
    <div className='fixed bottom-0 w-full max-w-lg p-4 flex flex-col bg-white'>
      {props.children}
    </div>
  )
}
