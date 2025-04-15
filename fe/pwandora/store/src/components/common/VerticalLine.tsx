export interface IVerticalLineProps {
  length?: number
}

export default function VerticalLine(props: IVerticalLineProps) {
  return (
    <div
      className={`mx-2 py-${props.length} border border-solid rounded-full`}
    ></div>
  )
}
