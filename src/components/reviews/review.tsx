import "./reviews.scss";

type Props = {
    username:string,
    avatar: string,
    review: string,
    status: string,
    score: number,
}

const Review = ({username, avatar, review, status, score}:Props) => {
  return(
    <div className="review-card">
      
      <div className="review-card-header">
        <div className="review-card-user">
          <img src={avatar} alt="user-avatar" className="icon-size-xl review-card-user-img"/>
          <p className="text-p">{username}</p>
        </div>

        <div className="review-card-user-valoration">
          <p className="text-details"> {score} / 10</p>
          
        </div>
      </div>
      <div>
        <span className="text-details badge" data-status={status}>{status}</span>
      </div>
      <p className="text-p text-color--75">{review}</p>
    </div>
  )
}

export default Review