export interface IFormInputProps {
  label: string
  id: string
  value: string
  placeholder: string
  type?: string
  onChange: (value: string) => void
}

export default function FormInput({
  type = 'text',
  id,
  value,
  label,
  placeholder,
  onChange,
}: IFormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-md font-medium font-pwandora-gray'
      >
        {label}
      </label>
      <div className='flex flex-row items-center block h-10 p-3 mt-2 border border-pwandora-gray rounded-xl bg-white has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-pwandora-active'>
        <input
          type={type}
          id={id}
          value={value}
          className='block grow focus:outline-0 placeholder:text-pwandora-gray'
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
