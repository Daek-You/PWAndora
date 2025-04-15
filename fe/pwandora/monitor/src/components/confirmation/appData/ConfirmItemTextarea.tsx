export interface IConfirmItemTextareaProps {
  value: string
  setValue: (value: string) => void
  placeholder?: string
  rows?: number
  cols?: number
  disabled?: boolean
  maxLength?: number
  className?: string
}

export default function ConfirmItemTextarea(props: IConfirmItemTextareaProps) {
  return (
    <div className='flex flex-col gap-2'>
      <textarea
        value={props.value}
        onChange={e => props.setValue(e.target.value)}
        placeholder={props.placeholder}
        rows={props.rows || 1}
        cols={props.cols || 50}
        disabled={props.disabled}
        maxLength={props.maxLength}
        className={`rounded-lg p-2 bg-pwandora-foreground-gray ${props.className}`}
      />
    </div>
  )
}
