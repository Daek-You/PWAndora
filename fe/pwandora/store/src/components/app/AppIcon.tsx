import no_icon from '@/assets/images/no_image.png'

export interface IAppIconProps {
  iconImage?: string
  name: string
  size?: number
}

export default function AppIcon(props: IAppIconProps) {
  const sizeClass = props.size ? `w-${props.size} h-${props.size}` : 'w-20 h-20'
  return (
    <div>
      <div
        className={`flex items-center justify-center ${sizeClass} rounded-3xl overflow-hidden drop-shadow-md shrink-0 bg-foreground-gray`}
      >
        <img
          src={props.iconImage ? props.iconImage : no_icon}
          alt={props.name}
          className='w-full bg-gray-100'
          onError={e => {
            e.currentTarget.src = no_icon
          }}
        />
      </div>
    </div>
  )
}
