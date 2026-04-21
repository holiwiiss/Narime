
type ErrorProp = {
  text: string;
};

const ErrorComponent = ({text}:ErrorProp) => {
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

export default ErrorComponent