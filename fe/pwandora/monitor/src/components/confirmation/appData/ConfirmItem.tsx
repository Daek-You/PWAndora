export interface IConfirmItemProps {
  name?: string
  children: React.ReactNode
  full?: boolean
}

export default function ConfirmItem(props: IConfirmItemProps) {
  return (
    <div className='grid grid-cols-4 gap-8'>
      {!props.full && <div>{props.name}</div>}
      <div className={props.full ? 'col-span-4' : 'col-span-3'}>
        {props.children}
      </div>
    </div>
  )
}
