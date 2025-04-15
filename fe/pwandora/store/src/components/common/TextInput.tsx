export interface ITextInputProps {
  onChange: (value: string) => void
  value: string
  label?: string
  placeholder?: string
  type?: string
}

export default function TextInput(props: ITextInputProps) {
  return (
    <div className='flex flex-col gap-1 px-2 py-3'>
      {/* <label className='px-3'>{props.label}</label> */}
      <input
        className='px-3 py-2.5 grow bg-foreground-gray rounded-full border-none outline-none'
        type={props.type ? props.type : 'text'}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      ></input>
    </div>
  )
}
