import { useState } from "react"
import "./star-rating.scss"
type Props = {
  value: number | null;
  onChange: (value: number) => void;
  id: string;
}

const StarRating = ({ value, onChange,id }: Props) => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="star-wrapper">
      <div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        
        <svg
          id={id}
          key={star}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={(hovered ?? value ?? 0) >= star ? "#CFA80B" : "var(--color-white-35)"} 
          className="size-6 icon-size-l star--item"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
      ))}
      </div>
      <p className="text-details text-color--75">{hovered ?? value ?? 0} / 10</p>
    </div>
  )
}

export default StarRating