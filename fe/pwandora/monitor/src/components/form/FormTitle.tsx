export interface IFormTitleProps {
  title: string
}

export default function FormTitle(props: IFormTitleProps) {
  return <div className='text-2xl font-bold p-2'>{props.title}</div>
}
