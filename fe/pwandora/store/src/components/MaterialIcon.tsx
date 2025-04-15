export interface IMaterialIconProps {
  name: string
  size: string
  filled?: boolean
  className?: string
  wght?: number
  style?: object
}

export default function MaterialIcon(props: IMaterialIconProps) {
  const iconStyle = {
    fontVariationSettings: `'FILL' ${props.filled ? 1 : 0},
    'wght' ${props.wght || 400},
    'GRAD' 0`,
    fontSize: props.size,
  }
  return (
    <span
      className={`material-symbols-rounded ${props.className}`}
      style={{ ...iconStyle, ...props.style }}
    >
      {props.name}
    </span>
  )
}
