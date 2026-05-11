import "./loadingComponent.scss"

type LoadingProp = {
  text: string;
};

const LoadingComponent = ({text}:LoadingProp) => {
    return(
        <>
        <div className="loading-component__container">
            <div className="loading-component__spinner"></div>

            <h1 className="loading-component__face">༼ つ ◕_◕ ༽つ</h1>
            <h2 className="loading-component__text">{text}</h2>
        </div>
        </>
    )
}

export default LoadingComponent