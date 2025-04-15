export interface IButtonProps {
  value: React.ReactNode
  onClick: (e: React.MouseEvent | null) => void
  rounded?: string
  className?: string
}

export default function Button({
  value,
  onClick,
  rounded = '2xl',
  className = '',
}: IButtonProps) {
  return (
    <button
      className={`flex items-center rounded-${rounded} bg-pwandora-foreground-gray font-semibold h-11 px-4 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {value}
    </button>
  )
}
