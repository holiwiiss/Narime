import "./errorComponent.scss"

type ErrorProp = {
  text: string;
};

const ErrorComponent = ({text}:ErrorProp) => {
    const reloadPage = () => {
        window.location.reload();
    };
    return(
        <>
        <div className="error-component__container">
            <h1 className="error-component__sad-face">(⁠╥⁠﹏⁠╥⁠)</h1>
            <h2 className="error-component__text">{text}</h2>
            <button className="btn" onClick={reloadPage}>Try again</button>
        </div>
        </>
    )
}

export default ErrorComponent