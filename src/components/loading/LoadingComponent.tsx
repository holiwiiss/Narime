
type LoadingProp = {
  text: string;
};

const LoadingComponent = ({text}:LoadingProp) => {
    return(
        <>
        <div>
            <img src="#"></img>
            <div>
                <h1>{text}</h1>
            </div>
        </div>
        </>
    )
}

export default LoadingComponent