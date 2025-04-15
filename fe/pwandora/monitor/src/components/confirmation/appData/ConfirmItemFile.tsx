import MaterialIcon from '../../common/MaterialIcon'

export interface IConfirmItemFileProps {
  name: string
  url: string
  size: string
}

export default function ConfirmItemFile({
  name,
  url,
  size,
}: IConfirmItemFileProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      className='px-3 py-1.5 flex items-center justify-between bg-pwandora-foreground-gray rounded-lg gap-4
    hover:cursor-pointer '
      onClick={handleDownload}
    >
      <div className='flex gap-1'>
        <p>{name}</p> <p>({size})</p>
      </div>
      <MaterialIcon
        name='download'
        size='22px'
        className='text-pwandora-gray'
      />
    </button>
  )
}
