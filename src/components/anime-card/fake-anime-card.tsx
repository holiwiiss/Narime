import IconStar from "../ui/icons/icon-star"
import "./anime-card.scss";

type Props = {
  image: string
  title: string
  score: number
  year: number
  type: string
}

const FakeAnimeCard = ({ image, title, score, year, type }: Props) => {
  return (
    <li className="anime-card-wrapper">
      <article className="anime-card anime-card-fake">
        <img src={image} alt={title} className="anime-card-img"/>
        <header className="anime-card__header">
          <div className="action-item anime-card__score">
            <IconStar fill="#CFA80B" className="size-6 action-item__icon" />
            <p className="text-details">{score}</p>
          </div>
        </header>
        <footer className="anime-card__footer">
          <div className="anime-card__options">
            <div className="anime-card__info">
              <p className="text-details">{type} · {year}</p>
              <h2 className="text-card anime-card__title">{title}</h2>
            </div>
          </div>
        </footer>
      </article>
    </li>
  )
}

export default FakeAnimeCard