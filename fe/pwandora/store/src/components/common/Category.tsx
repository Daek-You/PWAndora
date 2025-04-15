import no_image from '@/assets/images/no_image.png'
import SearchCard from './SearchCard'

export interface ICategoryProps {
  name: string
  image: string
}

export default function Category(props: ICategoryProps) {
  return (
    <SearchCard name={props.name} pathVariable={`category=${props.name}`}>
      <div className='size-24 rounded-xl overflow-hidden shrink-0'>
        <img
          src={props.image ? props.image : no_image}
          alt={props.name}
          className='w-full h-full'
        />
      </div>
    </SearchCard>
  )
}
