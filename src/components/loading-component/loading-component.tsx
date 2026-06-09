import "./loading-component.scss"

type LoadingProp = {
  size?: "small" 
};

const LoadingComponent = ({size}:LoadingProp) => {
  return(     
    <div className="loading-component__container">
      <div className="loading-component__spinner"></div>
      <h2 className={`loading-component__face ${size ? `loading-component__face--${size}` : ""}`}>༼ つ ◕_◕ ༽つ</h2>
    </div>
  )
}

export default LoadingComponent