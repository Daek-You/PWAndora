export interface IButtonProps {
  children: React.ReactNode
  type: 'submit' | 'reset' | 'button' | undefined
  style: 'submit' | 'cancel'
  onClick?: () => void
}

export default function Button(props: IButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={props.type}
      className={`flex items-center justify-center rounded-full p-2.5 ${
        props.style === 'submit'
          ? 'bg-primary text-white font-bold'
          : 'bg-foreground-gray'
      }`}
    >
      {props.children}
    </button>
  )
}
