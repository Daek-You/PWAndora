import MaterialIcon from '../common/MaterialIcon'

export interface ISearchInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
}

export default function SearchInput(props: ISearchInputProps) {
  return (
    <div className='flex flex-row items-center w-72 h-11 p-4 gap-2 border border-pwandora-gray rounded-2xl bg-white'>
      <MaterialIcon name='search' size='1.2rem' />
      <input
        type='text'
        value={props.value}
        placeholder={props.placeholder}
        onKeyDown={e => props.onKeyDown(e)}
        onChange={e => props.onChange(e.target.value)}
        className='focus:outline-0 placeholder:font-semibold placeholder:text-pwandora-gray'
      />
    </div>
  )
}
